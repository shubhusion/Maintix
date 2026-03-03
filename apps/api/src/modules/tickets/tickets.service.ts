import { Injectable, HttpStatus } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { PrismaService } from '@/common/database/prisma.service';
import { BusinessException } from '@/common/exceptions/business.exception';
import {
  ErrorCode,
  Role,
  TicketStatus,
  Priority,
  ActivityAction,
} from '@maintix/shared-types';
import { TicketStateMachine } from './ticket-state-machine';
import { TicketActivityService } from './ticket-activity.service';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { TicketQueryDto } from './dto/ticket-query.dto';

@Injectable()
export class TicketsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly stateMachine: TicketStateMachine,
    private readonly activityService: TicketActivityService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  // === CREATE ===

  async create(propertyId: string, dto: CreateTicketDto, userId: string) {
    // Verify user is a member of the property
    const membership = await this.prisma.propertyMember.findUnique({
      where: { propertyId_userId: { propertyId, userId } },
    });
    if (!membership) {
      throw new BusinessException(
        'You are not a member of this property',
        ErrorCode.PROPERTY_ACCESS_DENIED,
        HttpStatus.FORBIDDEN,
      );
    }

    // Verify category belongs to property
    const category = await this.prisma.category.findFirst({
      where: { id: dto.categoryId, propertyId, deletedAt: null },
    });
    if (!category) {
      throw new BusinessException(
        'Category not found in this property',
        ErrorCode.CATEGORY_NOT_FOUND,
        HttpStatus.NOT_FOUND,
      );
    }

    const ticket = await this.prisma.ticket.create({
      data: {
        title: dto.title,
        description: dto.description,
        categoryId: dto.categoryId,
        propertyId,
        createdById: userId,
        status: TicketStatus.OPEN,
        priority: Priority.LOW,
      },
      include: this.ticketIncludes(),
    });

    // Log activity
    await this.activityService.log({
      ticketId: ticket.id,
      actorId: userId,
      action: ActivityAction.TICKET_CREATED,
      newValue: { title: ticket.title, status: TicketStatus.OPEN },
    });

    this.eventEmitter.emit('ticket.created', { ticket, actorId: userId });

    return ticket;
  }

  // === READ ===

  async findAllByProperty(propertyId: string, query: TicketQueryDto) {
    const where: Record<string, unknown> = {
      propertyId,
      deletedAt: null,
    };

    if (query.status) where.status = query.status;
    if (query.priority) where.priority = query.priority;
    if (query.categoryId) where.categoryId = query.categoryId;
    if (query.assignedToId) where.assignedToId = query.assignedToId;
    if (query.createdById) where.createdById = query.createdById;

    if (query.cursor) {
      where.createdAt = { lt: new Date(query.cursor) };
    }

    const limit = query.limit || 20;
    const orderBy: Record<string, string> = {};
    orderBy[query.sortBy || 'createdAt'] = query.sortDir || 'desc';

    const tickets = await this.prisma.ticket.findMany({
      where,
      include: this.ticketIncludes(),
      orderBy,
      take: limit + 1,
    });

    const hasMore = tickets.length > limit;
    const data = hasMore ? tickets.slice(0, limit) : tickets;

    return {
      data,
      meta: {
        hasMore,
        nextCursor: hasMore
          ? data[data.length - 1].createdAt.toISOString()
          : null,
      },
    };
  }

  async findOne(id: string) {
    const ticket = await this.prisma.ticket.findUnique({
      where: { id, deletedAt: null },
      include: {
        ...this.ticketIncludes(),
        attachments: {
          orderBy: { createdAt: 'asc' },
        },
      },
    });

    if (!ticket) {
      throw new BusinessException(
        'Ticket not found',
        ErrorCode.TICKET_NOT_FOUND,
        HttpStatus.NOT_FOUND,
      );
    }

    return ticket;
  }

  // === WORKFLOW TRANSITIONS ===

  async assign(ticketId: string, technicianId: string, managerId: string, expectedVersion: number) {
    const ticket = await this.getTicketForTransition(ticketId, expectedVersion);

    this.validateTransition(ticket.status as TicketStatus, TicketStatus.ASSIGNED);

    // Verify technician is a member of the property and is a technician
    await this.validateTechnician(technicianId, ticket.propertyId);

    const updated = await this.prisma.ticket.update({
      where: { id: ticketId, version: expectedVersion },
      data: {
        status: TicketStatus.ASSIGNED,
        assignedToId: technicianId,
        version: { increment: 1 },
      },
      include: this.ticketIncludes(),
    });

    await this.activityService.log({
      ticketId,
      actorId: managerId,
      action: ActivityAction.TECHNICIAN_ASSIGNED,
      previousValue: { status: ticket.status, assignedToId: ticket.assignedToId },
      newValue: { status: TicketStatus.ASSIGNED, assignedToId: technicianId },
    });

    this.eventEmitter.emit('ticket.assigned', {
      ticket: updated,
      actorId: managerId,
      technicianId,
    });

    return updated;
  }

  async startWork(ticketId: string, technicianId: string, expectedVersion: number) {
    const ticket = await this.getTicketForTransition(ticketId, expectedVersion);

    this.validateTransition(ticket.status as TicketStatus, TicketStatus.IN_PROGRESS);
    this.validateAssignee(ticket.assignedToId, technicianId);

    const updated = await this.prisma.ticket.update({
      where: { id: ticketId, version: expectedVersion },
      data: {
        status: TicketStatus.IN_PROGRESS,
        version: { increment: 1 },
      },
      include: this.ticketIncludes(),
    });

    await this.activityService.log({
      ticketId,
      actorId: technicianId,
      action: ActivityAction.WORK_STARTED,
      previousValue: { status: ticket.status },
      newValue: { status: TicketStatus.IN_PROGRESS },
    });

    this.eventEmitter.emit('ticket.started', { ticket: updated, actorId: technicianId });

    return updated;
  }

  async submitCompletion(ticketId: string, technicianId: string, expectedVersion: number) {
    const ticket = await this.getTicketForTransition(ticketId, expectedVersion);

    this.validateTransition(ticket.status as TicketStatus, TicketStatus.AWAITING_APPROVAL);
    this.validateAssignee(ticket.assignedToId, technicianId);

    const updated = await this.prisma.ticket.update({
      where: { id: ticketId, version: expectedVersion },
      data: {
        status: TicketStatus.AWAITING_APPROVAL,
        version: { increment: 1 },
      },
      include: this.ticketIncludes(),
    });

    await this.activityService.log({
      ticketId,
      actorId: technicianId,
      action: ActivityAction.COMPLETION_SUBMITTED,
      previousValue: { status: ticket.status },
      newValue: { status: TicketStatus.AWAITING_APPROVAL },
    });

    this.eventEmitter.emit('ticket.submitted', { ticket: updated, actorId: technicianId });

    return updated;
  }

  async approve(ticketId: string, managerId: string, expectedVersion: number) {
    const ticket = await this.getTicketForTransition(ticketId, expectedVersion);

    this.validateTransition(ticket.status as TicketStatus, TicketStatus.DONE);

    const updated = await this.prisma.ticket.update({
      where: { id: ticketId, version: expectedVersion },
      data: {
        status: TicketStatus.DONE,
        version: { increment: 1 },
      },
      include: this.ticketIncludes(),
    });

    await this.activityService.log({
      ticketId,
      actorId: managerId,
      action: ActivityAction.TICKET_APPROVED,
      previousValue: { status: ticket.status },
      newValue: { status: TicketStatus.DONE },
    });

    this.eventEmitter.emit('ticket.completed', { ticket: updated, actorId: managerId });

    return updated;
  }

  async cancel(ticketId: string, userId: string, reason: string, expectedVersion: number) {
    const ticket = await this.getTicketForTransition(ticketId, expectedVersion);

    // Only ticket creator can cancel
    if (ticket.createdById !== userId) {
      throw new BusinessException(
        'Only the ticket creator can cancel this ticket',
        ErrorCode.TICKET_NOT_CANCELLABLE,
        HttpStatus.FORBIDDEN,
      );
    }

    // Can only cancel from OPEN or ASSIGNED
    if (
      ticket.status !== TicketStatus.OPEN &&
      ticket.status !== TicketStatus.ASSIGNED
    ) {
      throw new BusinessException(
        'Ticket can only be cancelled when OPEN or ASSIGNED',
        ErrorCode.TICKET_NOT_CANCELLABLE,
        HttpStatus.BAD_REQUEST,
      );
    }

    const updated = await this.prisma.ticket.update({
      where: { id: ticketId, version: expectedVersion },
      data: {
        status: TicketStatus.CANCELLED,
        cancellationReason: reason,
        version: { increment: 1 },
      },
      include: this.ticketIncludes(),
    });

    await this.activityService.log({
      ticketId,
      actorId: userId,
      action: ActivityAction.TICKET_CANCELLED,
      previousValue: { status: ticket.status },
      newValue: { status: TicketStatus.CANCELLED, reason },
    });

    this.eventEmitter.emit('ticket.cancelled', { ticket: updated, actorId: userId });

    return updated;
  }

  async updatePriority(
    ticketId: string,
    priority: Priority,
    managerId: string,
    expectedVersion: number,
  ) {
    const ticket = await this.getTicketForTransition(ticketId, expectedVersion);

    const updated = await this.prisma.ticket.update({
      where: { id: ticketId, version: expectedVersion },
      data: {
        priority,
        version: { increment: 1 },
      },
      include: this.ticketIncludes(),
    });

    await this.activityService.log({
      ticketId,
      actorId: managerId,
      action: ActivityAction.PRIORITY_CHANGED,
      previousValue: { priority: ticket.priority },
      newValue: { priority },
    });

    this.eventEmitter.emit('ticket.priorityChanged', {
      ticket: updated,
      actorId: managerId,
      previousPriority: ticket.priority,
    });

    return updated;
  }

  async reassign(
    ticketId: string,
    newTechnicianId: string,
    managerId: string,
    expectedVersion: number,
  ) {
    const ticket = await this.getTicketForTransition(ticketId, expectedVersion);

    // Can only reassign when ASSIGNED or IN_PROGRESS
    if (
      ticket.status !== TicketStatus.ASSIGNED &&
      ticket.status !== TicketStatus.IN_PROGRESS
    ) {
      throw new BusinessException(
        'Can only reassign when ticket is ASSIGNED or IN_PROGRESS',
        ErrorCode.TICKET_INVALID_TRANSITION,
        HttpStatus.BAD_REQUEST,
      );
    }

    await this.validateTechnician(newTechnicianId, ticket.propertyId);

    const updated = await this.prisma.ticket.update({
      where: { id: ticketId, version: expectedVersion },
      data: {
        assignedToId: newTechnicianId,
        status: TicketStatus.ASSIGNED,
        version: { increment: 1 },
      },
      include: this.ticketIncludes(),
    });

    await this.activityService.log({
      ticketId,
      actorId: managerId,
      action: ActivityAction.TECHNICIAN_REASSIGNED,
      previousValue: { assignedToId: ticket.assignedToId, status: ticket.status },
      newValue: { assignedToId: newTechnicianId, status: TicketStatus.ASSIGNED },
    });

    this.eventEmitter.emit('ticket.reassigned', {
      ticket: updated,
      actorId: managerId,
      previousTechnicianId: ticket.assignedToId,
      newTechnicianId,
    });

    return updated;
  }

  // === HELPERS ===

  private async getTicketForTransition(ticketId: string, expectedVersion: number) {
    const ticket = await this.prisma.ticket.findUnique({
      where: { id: ticketId, deletedAt: null },
    });

    if (!ticket) {
      throw new BusinessException(
        'Ticket not found',
        ErrorCode.TICKET_NOT_FOUND,
        HttpStatus.NOT_FOUND,
      );
    }

    if (ticket.version !== expectedVersion) {
      throw new BusinessException(
        'Ticket was modified by another user. Please refresh and try again.',
        ErrorCode.TICKET_VERSION_CONFLICT,
        HttpStatus.CONFLICT,
      );
    }

    return ticket;
  }

  private validateTransition(from: TicketStatus, to: TicketStatus) {
    if (!this.stateMachine.canTransition(from, to)) {
      throw new BusinessException(
        `Cannot transition from ${from} to ${to}`,
        ErrorCode.TICKET_INVALID_TRANSITION,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  private validateAssignee(assignedToId: string | null, technicianId: string) {
    if (assignedToId !== technicianId) {
      throw new BusinessException(
        'You are not assigned to this ticket',
        ErrorCode.TECHNICIAN_NOT_ASSIGNEE,
        HttpStatus.FORBIDDEN,
      );
    }
  }

  private async validateTechnician(technicianId: string, propertyId: string) {
    const technician = await this.prisma.user.findUnique({
      where: { id: technicianId, deletedAt: null },
      select: { role: true },
    });

    if (!technician || technician.role !== Role.TECHNICIAN) {
      throw new BusinessException(
        'User is not a technician',
        ErrorCode.ASSIGNEE_NOT_TECHNICIAN,
        HttpStatus.BAD_REQUEST,
      );
    }

    const membership = await this.prisma.propertyMember.findUnique({
      where: { propertyId_userId: { propertyId, userId: technicianId } },
    });

    if (!membership) {
      throw new BusinessException(
        'Technician is not a member of this property',
        ErrorCode.ASSIGNEE_NOT_PROPERTY_MEMBER,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  private ticketIncludes() {
    return {
      createdBy: {
        select: { id: true, firstName: true, lastName: true, role: true },
      },
      assignedTo: {
        select: { id: true, firstName: true, lastName: true, role: true },
      },
      category: {
        select: { id: true, name: true },
      },
      property: {
        select: { id: true, name: true },
      },
    };
  }
}

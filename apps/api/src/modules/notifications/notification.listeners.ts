import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { PrismaService } from '@/common/database/prisma.service';
import { NotificationsService } from './notifications.service';
import { NotificationType, Role } from '@maintix/shared-types';

@Injectable()
export class NotificationListeners {
  constructor(
    private readonly notificationsService: NotificationsService,
    private readonly prisma: PrismaService,
  ) {}

  @OnEvent('ticket.created')
  async handleTicketCreated(payload: { ticket: any; actorId: string }) {
    const { ticket, actorId } = payload;

    // Notify all managers of the property
    const managers = await this.getPropertyManagers(ticket.propertyId, actorId);
    for (const manager of managers) {
      await this.notificationsService.create({
        userId: manager.userId,
        type: NotificationType.TICKET_CREATED,
        title: 'New Ticket Created',
        message: `A new ticket "${ticket.title}" has been created in ${ticket.property?.name || 'your property'}.`,
        ticketId: ticket.id,
      });
    }
  }

  @OnEvent('ticket.assigned')
  async handleTicketAssigned(payload: { ticket: any; actorId: string; technicianId: string }) {
    const { ticket, technicianId } = payload;

    // Notify the assigned technician
    await this.notificationsService.create({
      userId: technicianId,
      type: NotificationType.TICKET_ASSIGNED,
      title: 'Ticket Assigned to You',
      message: `You have been assigned to ticket "${ticket.title}".`,
      ticketId: ticket.id,
    });

    // Notify the ticket creator
    if (ticket.createdById !== payload.actorId) {
      await this.notificationsService.create({
        userId: ticket.createdById,
        type: NotificationType.TICKET_ASSIGNED,
        title: 'Your Ticket Has Been Assigned',
        message: `Your ticket "${ticket.title}" has been assigned to a technician.`,
        ticketId: ticket.id,
      });
    }
  }

  @OnEvent('ticket.started')
  async handleTicketStarted(payload: { ticket: any; actorId: string }) {
    const { ticket, actorId } = payload;

    // Notify the ticket creator
    if (ticket.createdById !== actorId) {
      await this.notificationsService.create({
        userId: ticket.createdById,
        type: NotificationType.WORK_STARTED,
        title: 'Work Started on Your Ticket',
        message: `A technician has started working on "${ticket.title}".`,
        ticketId: ticket.id,
      });
    }

    // Notify managers
    const managers = await this.getPropertyManagers(ticket.propertyId, actorId);
    for (const manager of managers) {
      await this.notificationsService.create({
        userId: manager.userId,
        type: NotificationType.WORK_STARTED,
        title: 'Ticket Work Started',
        message: `Work has started on ticket "${ticket.title}".`,
        ticketId: ticket.id,
      });
    }
  }

  @OnEvent('ticket.submitted')
  async handleTicketSubmitted(payload: { ticket: any; actorId: string }) {
    const { ticket, actorId } = payload;

    // Notify managers to approve
    const managers = await this.getPropertyManagers(ticket.propertyId, actorId);
    for (const manager of managers) {
      await this.notificationsService.create({
        userId: manager.userId,
        type: NotificationType.COMPLETION_SUBMITTED,
        title: 'Ticket Awaiting Approval',
        message: `Ticket "${ticket.title}" has been completed and awaits your approval.`,
        ticketId: ticket.id,
      });
    }
  }

  @OnEvent('ticket.completed')
  async handleTicketCompleted(payload: { ticket: any; actorId: string }) {
    const { ticket, actorId } = payload;

    // Notify the ticket creator
    if (ticket.createdById !== actorId) {
      await this.notificationsService.create({
        userId: ticket.createdById,
        type: NotificationType.TICKET_APPROVED,
        title: 'Your Ticket Has Been Completed',
        message: `Your ticket "${ticket.title}" has been approved and marked as done.`,
        ticketId: ticket.id,
      });
    }

    // Notify the technician
    if (ticket.assignedToId && ticket.assignedToId !== actorId) {
      await this.notificationsService.create({
        userId: ticket.assignedToId,
        type: NotificationType.TICKET_APPROVED,
        title: 'Ticket Approved',
        message: `Ticket "${ticket.title}" has been approved.`,
        ticketId: ticket.id,
      });
    }
  }

  @OnEvent('ticket.cancelled')
  async handleTicketCancelled(payload: { ticket: any; actorId: string }) {
    const { ticket, actorId } = payload;

    // Notify managers
    const managers = await this.getPropertyManagers(ticket.propertyId, actorId);
    for (const manager of managers) {
      await this.notificationsService.create({
        userId: manager.userId,
        type: NotificationType.TICKET_CANCELLED,
        title: 'Ticket Cancelled',
        message: `Ticket "${ticket.title}" has been cancelled.`,
        ticketId: ticket.id,
      });
    }

    // Notify assigned technician
    if (ticket.assignedToId && ticket.assignedToId !== actorId) {
      await this.notificationsService.create({
        userId: ticket.assignedToId,
        type: NotificationType.TICKET_CANCELLED,
        title: 'Assigned Ticket Cancelled',
        message: `Ticket "${ticket.title}" that was assigned to you has been cancelled.`,
        ticketId: ticket.id,
      });
    }
  }

  @OnEvent('ticket.reassigned')
  async handleTicketReassigned(payload: {
    ticket: any;
    actorId: string;
    previousTechnicianId: string | null;
    newTechnicianId: string;
  }) {
    const { ticket, previousTechnicianId, newTechnicianId } = payload;

    // Notify new technician
    await this.notificationsService.create({
      userId: newTechnicianId,
      type: NotificationType.TECHNICIAN_REASSIGNED,
      title: 'Ticket Assigned to You',
      message: `You have been assigned to ticket "${ticket.title}".`,
      ticketId: ticket.id,
    });

    // Notify previous technician
    if (previousTechnicianId && previousTechnicianId !== newTechnicianId) {
      await this.notificationsService.create({
        userId: previousTechnicianId,
        type: NotificationType.TECHNICIAN_REASSIGNED,
        title: 'Ticket Reassigned',
        message: `Ticket "${ticket.title}" has been reassigned to another technician.`,
        ticketId: ticket.id,
      });
    }
  }

  @OnEvent('ticket.priorityChanged')
  async handlePriorityChanged(payload: { ticket: any; actorId: string; previousPriority: string }) {
    const { ticket, actorId } = payload;

    // Notify assigned technician
    if (ticket.assignedToId && ticket.assignedToId !== actorId) {
      await this.notificationsService.create({
        userId: ticket.assignedToId,
        type: NotificationType.PRIORITY_CHANGED,
        title: 'Ticket Priority Changed',
        message: `Priority of ticket "${ticket.title}" has been changed to ${ticket.priority}.`,
        ticketId: ticket.id,
      });
    }
  }

  // === Helpers ===

  private async getPropertyManagers(propertyId: string, excludeUserId?: string) {
    const members = await this.prisma.propertyMember.findMany({
      where: { propertyId },
      include: { user: { select: { id: true, role: true } } },
    });

    return members.filter(
      (m) => m.user.role === Role.MANAGER && (!excludeUserId || m.userId !== excludeUserId),
    );
  }
}

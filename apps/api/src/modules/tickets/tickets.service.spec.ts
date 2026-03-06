import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { TicketsService } from './tickets.service';
import { TicketStateMachine } from './ticket-state-machine';
import { TicketActivityService } from './ticket-activity.service';
import { PrismaService } from '@/common/database/prisma.service';
import { BusinessException } from '@/common/exceptions/business.exception';
import { ErrorCode, TicketStatus, Priority, Role } from '@maintix/shared-types';

describe('TicketsService', () => {
  let service: TicketsService;
  let prisma: Record<string, Record<string, jest.Mock>>;
  let stateMachine: { canTransition: jest.Mock };
  let activityService: { log: jest.Mock };
  let eventEmitter: { emit: jest.Mock };

  const mockTicket = {
    id: 'ticket-1',
    title: 'Fix leaky faucet',
    description: 'Kitchen sink is dripping',
    status: TicketStatus.OPEN,
    priority: Priority.LOW,
    propertyId: 'prop-1',
    categoryId: 'cat-1',
    createdById: 'user-1',
    assignedToId: null,
    version: 1,
    deletedAt: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    cancellationReason: null,
  };

  const mockTicketWithIncludes = {
    ...mockTicket,
    createdBy: { id: 'user-1', firstName: 'John', lastName: 'Doe', role: Role.MANAGER },
    assignedTo: null,
    category: { id: 'cat-1', name: 'Plumbing' },
    property: { id: 'prop-1', name: 'Main Building' },
  };

  beforeEach(async () => {
    prisma = {
      ticket: {
        create: jest.fn(),
        findUnique: jest.fn(),
        findMany: jest.fn(),
        update: jest.fn(),
      },
      propertyMember: { findUnique: jest.fn() },
      category: { findFirst: jest.fn() },
      user: { findUnique: jest.fn() },
      ticketAttachment: { count: jest.fn() },
    };

    stateMachine = { canTransition: jest.fn() };
    activityService = { log: jest.fn().mockResolvedValue(undefined) };
    eventEmitter = { emit: jest.fn() };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TicketsService,
        { provide: PrismaService, useValue: prisma },
        { provide: TicketStateMachine, useValue: stateMachine },
        { provide: TicketActivityService, useValue: activityService },
        { provide: EventEmitter2, useValue: eventEmitter },
      ],
    }).compile();

    service = module.get<TicketsService>(TicketsService);
  });

  // Helper to extract errorCode from BusinessException
  function getErrorCode(e: unknown): string {
    return ((e as BusinessException).getResponse() as Record<string, unknown>).errorCode as string;
  }

  describe('create', () => {
    const dto = {
      title: 'Fix leaky faucet',
      description: 'Kitchen sink is dripping',
      categoryId: 'cat-1',
    };

    it('should create a ticket and emit event', async () => {
      prisma.propertyMember.findUnique.mockResolvedValue({
        propertyId: 'prop-1',
        userId: 'user-1',
      });
      prisma.category.findFirst.mockResolvedValue({ id: 'cat-1', propertyId: 'prop-1' });
      prisma.ticket.create.mockResolvedValue(mockTicketWithIncludes);

      const result = await service.create('prop-1', dto, 'user-1');

      expect(result).toEqual(mockTicketWithIncludes);
      expect(prisma.ticket.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            title: dto.title,
            status: TicketStatus.OPEN,
            priority: Priority.LOW,
            propertyId: 'prop-1',
            createdById: 'user-1',
          }),
        }),
      );
      expect(activityService.log).toHaveBeenCalled();
      expect(eventEmitter.emit).toHaveBeenCalledWith('ticket.created', expect.any(Object));
    });

    it('should throw PROPERTY_ACCESS_DENIED if user is not a member', async () => {
      prisma.propertyMember.findUnique.mockResolvedValue(null);

      try {
        await service.create('prop-1', dto, 'user-1');
        fail('Expected BusinessException');
      } catch (e) {
        expect(e).toBeInstanceOf(BusinessException);
        expect(getErrorCode(e)).toBe(ErrorCode.PROPERTY_ACCESS_DENIED);
      }
    });

    it('should throw CATEGORY_NOT_FOUND if category does not belong to property', async () => {
      prisma.propertyMember.findUnique.mockResolvedValue({
        propertyId: 'prop-1',
        userId: 'user-1',
      });
      prisma.category.findFirst.mockResolvedValue(null);

      try {
        await service.create('prop-1', dto, 'user-1');
        fail('Expected BusinessException');
      } catch (e) {
        expect(e).toBeInstanceOf(BusinessException);
        expect(getErrorCode(e)).toBe(ErrorCode.CATEGORY_NOT_FOUND);
      }
    });
  });

  describe('findOne', () => {
    it('should return ticket when found', async () => {
      prisma.ticket.findUnique.mockResolvedValue({ ...mockTicketWithIncludes, attachments: [] });

      const result = await service.findOne('ticket-1');

      expect(result.id).toBe('ticket-1');
    });

    it('should throw TICKET_NOT_FOUND when ticket does not exist', async () => {
      prisma.ticket.findUnique.mockResolvedValue(null);

      try {
        await service.findOne('nonexistent');
        fail('Expected BusinessException');
      } catch (e) {
        expect(e).toBeInstanceOf(BusinessException);
        expect(getErrorCode(e)).toBe(ErrorCode.TICKET_NOT_FOUND);
      }
    });

    it('should throw PROPERTY_ACCESS_DENIED when userId passed but not a member', async () => {
      prisma.ticket.findUnique.mockResolvedValue({ ...mockTicketWithIncludes, attachments: [] });
      prisma.propertyMember.findUnique.mockResolvedValue(null);

      try {
        await service.findOne('ticket-1', 'outsider-user');
        fail('Expected BusinessException');
      } catch (e) {
        expect(e).toBeInstanceOf(BusinessException);
        expect(getErrorCode(e)).toBe(ErrorCode.PROPERTY_ACCESS_DENIED);
      }
    });

    it('should return ticket when userId passed and is a member', async () => {
      prisma.ticket.findUnique.mockResolvedValue({ ...mockTicketWithIncludes, attachments: [] });
      prisma.propertyMember.findUnique.mockResolvedValue({
        propertyId: 'prop-1',
        userId: 'user-1',
      });

      const result = await service.findOne('ticket-1', 'user-1');
      expect(result.id).toBe('ticket-1');
    });
  });

  describe('assign', () => {
    it('should assign a technician and emit event', async () => {
      prisma.ticket.findUnique.mockResolvedValue(mockTicket);
      stateMachine.canTransition.mockReturnValue(true);
      prisma.user.findUnique.mockResolvedValue({ role: Role.TECHNICIAN });
      prisma.propertyMember.findUnique.mockResolvedValue({
        propertyId: 'prop-1',
        userId: 'tech-1',
      });
      prisma.ticket.update.mockResolvedValue({
        ...mockTicketWithIncludes,
        status: TicketStatus.ASSIGNED,
        assignedToId: 'tech-1',
      });

      const result = await service.assign('ticket-1', 'tech-1', 'manager-1', 1);

      expect(result.status).toBe(TicketStatus.ASSIGNED);
      expect(result.assignedToId).toBe('tech-1');
      expect(eventEmitter.emit).toHaveBeenCalledWith('ticket.assigned', expect.any(Object));
    });

    it('should throw TICKET_NOT_FOUND when ticket missing', async () => {
      prisma.ticket.findUnique.mockResolvedValue(null);

      try {
        await service.assign('missing', 'tech-1', 'manager-1', 1);
        fail('Expected BusinessException');
      } catch (e) {
        expect(e).toBeInstanceOf(BusinessException);
        expect(getErrorCode(e)).toBe(ErrorCode.TICKET_NOT_FOUND);
      }
    });

    it('should throw TICKET_VERSION_CONFLICT on stale version', async () => {
      prisma.ticket.findUnique.mockResolvedValue({ ...mockTicket, version: 2 });

      try {
        await service.assign('ticket-1', 'tech-1', 'manager-1', 1);
        fail('Expected BusinessException');
      } catch (e) {
        expect(e).toBeInstanceOf(BusinessException);
        expect(getErrorCode(e)).toBe(ErrorCode.TICKET_VERSION_CONFLICT);
        expect((e as BusinessException).getStatus()).toBe(HttpStatus.CONFLICT);
      }
    });

    it('should throw TICKET_INVALID_TRANSITION on bad state transition', async () => {
      prisma.ticket.findUnique.mockResolvedValue(mockTicket);
      stateMachine.canTransition.mockReturnValue(false);

      try {
        await service.assign('ticket-1', 'tech-1', 'manager-1', 1);
        fail('Expected BusinessException');
      } catch (e) {
        expect(e).toBeInstanceOf(BusinessException);
        expect(getErrorCode(e)).toBe(ErrorCode.TICKET_INVALID_TRANSITION);
      }
    });

    it('should throw ASSIGNEE_NOT_TECHNICIAN if user is not a technician', async () => {
      prisma.ticket.findUnique.mockResolvedValue(mockTicket);
      stateMachine.canTransition.mockReturnValue(true);
      prisma.user.findUnique.mockResolvedValue({ role: Role.MANAGER });

      try {
        await service.assign('ticket-1', 'manager-2', 'manager-1', 1);
        fail('Expected BusinessException');
      } catch (e) {
        expect(e).toBeInstanceOf(BusinessException);
        expect(getErrorCode(e)).toBe(ErrorCode.ASSIGNEE_NOT_TECHNICIAN);
      }
    });
  });

  describe('cancel', () => {
    it('should cancel an OPEN ticket by its creator', async () => {
      prisma.ticket.findUnique.mockResolvedValue({
        ...mockTicket,
        createdById: 'user-1',
        status: TicketStatus.OPEN,
      });
      prisma.ticket.update.mockResolvedValue({
        ...mockTicketWithIncludes,
        status: TicketStatus.CANCELLED,
      });

      const result = await service.cancel('ticket-1', 'user-1', 'No longer needed', 1);

      expect(result.status).toBe(TicketStatus.CANCELLED);
      expect(prisma.ticket.update).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            status: TicketStatus.CANCELLED,
            cancellationReason: 'No longer needed',
          }),
        }),
      );
    });

    it('should throw TICKET_NOT_CANCELLABLE when user is not the creator', async () => {
      prisma.ticket.findUnique.mockResolvedValue({
        ...mockTicket,
        createdById: 'user-1',
        status: TicketStatus.OPEN,
      });

      try {
        await service.cancel('ticket-1', 'other-user', 'reason', 1);
        fail('Expected BusinessException');
      } catch (e) {
        expect(e).toBeInstanceOf(BusinessException);
        expect(getErrorCode(e)).toBe(ErrorCode.TICKET_NOT_CANCELLABLE);
      }
    });

    it('should throw TICKET_NOT_CANCELLABLE when ticket is IN_PROGRESS', async () => {
      prisma.ticket.findUnique.mockResolvedValue({
        ...mockTicket,
        createdById: 'user-1',
        status: TicketStatus.IN_PROGRESS,
      });

      try {
        await service.cancel('ticket-1', 'user-1', 'reason', 1);
        fail('Expected BusinessException');
      } catch (e) {
        expect(e).toBeInstanceOf(BusinessException);
        expect(getErrorCode(e)).toBe(ErrorCode.TICKET_NOT_CANCELLABLE);
      }
    });
  });

  describe('startWork', () => {
    it('should throw TECHNICIAN_NOT_ASSIGNEE when wrong technician', async () => {
      const assignedTicket = {
        ...mockTicket,
        status: TicketStatus.ASSIGNED,
        assignedToId: 'tech-1',
      };
      prisma.ticket.findUnique.mockResolvedValue(assignedTicket);
      stateMachine.canTransition.mockReturnValue(true);

      try {
        await service.startWork('ticket-1', 'tech-other', 1);
        fail('Expected BusinessException');
      } catch (e) {
        expect(e).toBeInstanceOf(BusinessException);
        expect(getErrorCode(e)).toBe(ErrorCode.TECHNICIAN_NOT_ASSIGNEE);
      }
    });

    it('should start work when called by assigned technician', async () => {
      const assignedTicket = {
        ...mockTicket,
        status: TicketStatus.ASSIGNED,
        assignedToId: 'tech-1',
      };
      prisma.ticket.findUnique.mockResolvedValue(assignedTicket);
      stateMachine.canTransition.mockReturnValue(true);
      prisma.ticket.update.mockResolvedValue({
        ...mockTicketWithIncludes,
        status: TicketStatus.IN_PROGRESS,
      });

      const result = await service.startWork('ticket-1', 'tech-1', 1);

      expect(result.status).toBe(TicketStatus.IN_PROGRESS);
      expect(eventEmitter.emit).toHaveBeenCalledWith('ticket.started', expect.any(Object));
    });
  });

  describe('reassign', () => {
    it('should throw when ticket is not ASSIGNED or IN_PROGRESS', async () => {
      prisma.ticket.findUnique.mockResolvedValue({ ...mockTicket, status: TicketStatus.OPEN });

      try {
        await service.reassign('ticket-1', 'tech-2', 'manager-1', 1);
        fail('Expected BusinessException');
      } catch (e) {
        expect(e).toBeInstanceOf(BusinessException);
        expect(getErrorCode(e)).toBe(ErrorCode.TICKET_INVALID_TRANSITION);
      }
    });

    it('should reassign when ticket is ASSIGNED', async () => {
      const assignedTicket = {
        ...mockTicket,
        status: TicketStatus.ASSIGNED,
        assignedToId: 'tech-1',
      };
      prisma.ticket.findUnique.mockResolvedValue(assignedTicket);
      prisma.user.findUnique.mockResolvedValue({ role: Role.TECHNICIAN });
      prisma.propertyMember.findUnique.mockResolvedValue({
        propertyId: 'prop-1',
        userId: 'tech-2',
      });
      prisma.ticket.update.mockResolvedValue({
        ...mockTicketWithIncludes,
        status: TicketStatus.ASSIGNED,
        assignedToId: 'tech-2',
      });

      const result = await service.reassign('ticket-1', 'tech-2', 'manager-1', 1);

      expect(result.assignedToId).toBe('tech-2');
      expect(eventEmitter.emit).toHaveBeenCalledWith('ticket.reassigned', expect.any(Object));
    });
  });

  describe('updatePriority', () => {
    it('should update priority and emit event', async () => {
      prisma.ticket.findUnique.mockResolvedValue(mockTicket);
      prisma.ticket.update.mockResolvedValue({
        ...mockTicketWithIncludes,
        priority: Priority.HIGH,
      });

      const result = await service.updatePriority('ticket-1', Priority.HIGH, 'manager-1', 1);

      expect(result.priority).toBe(Priority.HIGH);
      expect(eventEmitter.emit).toHaveBeenCalledWith('ticket.priorityChanged', expect.any(Object));
    });
  });
});

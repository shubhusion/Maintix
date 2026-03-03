import { Injectable } from '@nestjs/common';
import { TicketStatus } from '@maintix/shared-types';

type TransitionMap = Record<TicketStatus, TicketStatus[]>;

@Injectable()
export class TicketStateMachine {
  private readonly transitions: TransitionMap = {
    [TicketStatus.OPEN]: [TicketStatus.ASSIGNED, TicketStatus.CANCELLED],
    [TicketStatus.ASSIGNED]: [
      TicketStatus.IN_PROGRESS,
      TicketStatus.CANCELLED,
      TicketStatus.ASSIGNED, // reassignment
    ],
    [TicketStatus.IN_PROGRESS]: [
      TicketStatus.AWAITING_APPROVAL,
      TicketStatus.ASSIGNED, // reassignment resets to ASSIGNED
    ],
    [TicketStatus.AWAITING_APPROVAL]: [TicketStatus.DONE],
    [TicketStatus.DONE]: [],
    [TicketStatus.CANCELLED]: [],
  };

  canTransition(from: TicketStatus, to: TicketStatus): boolean {
    const allowedTargets = this.transitions[from];
    return allowedTargets?.includes(to) ?? false;
  }

  getValidTransitions(from: TicketStatus): TicketStatus[] {
    return this.transitions[from] ?? [];
  }
}

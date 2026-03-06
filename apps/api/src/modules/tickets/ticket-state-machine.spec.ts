import { TicketStateMachine } from './ticket-state-machine';
import { TicketStatus } from '@maintix/shared-types';

describe('TicketStateMachine', () => {
  let machine: TicketStateMachine;

  beforeEach(() => {
    machine = new TicketStateMachine();
  });

  describe('canTransition', () => {
    // === Valid transitions ===
    const validTransitions: [TicketStatus, TicketStatus][] = [
      [TicketStatus.OPEN, TicketStatus.ASSIGNED],
      [TicketStatus.OPEN, TicketStatus.CANCELLED],
      [TicketStatus.ASSIGNED, TicketStatus.IN_PROGRESS],
      [TicketStatus.ASSIGNED, TicketStatus.CANCELLED],
      [TicketStatus.ASSIGNED, TicketStatus.ASSIGNED], // reassignment
      [TicketStatus.IN_PROGRESS, TicketStatus.AWAITING_APPROVAL],
      [TicketStatus.IN_PROGRESS, TicketStatus.ASSIGNED], // reassignment resets
      [TicketStatus.AWAITING_APPROVAL, TicketStatus.DONE],
    ];

    it.each(validTransitions)('should allow %s → %s', (from, to) => {
      expect(machine.canTransition(from, to)).toBe(true);
    });

    // === Invalid transitions ===
    const invalidTransitions: [TicketStatus, TicketStatus][] = [
      // OPEN cannot go directly to these
      [TicketStatus.OPEN, TicketStatus.IN_PROGRESS],
      [TicketStatus.OPEN, TicketStatus.AWAITING_APPROVAL],
      [TicketStatus.OPEN, TicketStatus.DONE],
      // ASSIGNED cannot skip to these
      [TicketStatus.ASSIGNED, TicketStatus.AWAITING_APPROVAL],
      [TicketStatus.ASSIGNED, TicketStatus.DONE],
      // IN_PROGRESS cannot go to these
      [TicketStatus.IN_PROGRESS, TicketStatus.OPEN],
      [TicketStatus.IN_PROGRESS, TicketStatus.DONE],
      [TicketStatus.IN_PROGRESS, TicketStatus.CANCELLED],
      // AWAITING_APPROVAL cannot go to these
      [TicketStatus.AWAITING_APPROVAL, TicketStatus.OPEN],
      [TicketStatus.AWAITING_APPROVAL, TicketStatus.ASSIGNED],
      [TicketStatus.AWAITING_APPROVAL, TicketStatus.IN_PROGRESS],
      [TicketStatus.AWAITING_APPROVAL, TicketStatus.CANCELLED],
      // Terminal states cannot go anywhere
      [TicketStatus.DONE, TicketStatus.OPEN],
      [TicketStatus.DONE, TicketStatus.ASSIGNED],
      [TicketStatus.DONE, TicketStatus.IN_PROGRESS],
      [TicketStatus.DONE, TicketStatus.AWAITING_APPROVAL],
      [TicketStatus.DONE, TicketStatus.CANCELLED],
      [TicketStatus.CANCELLED, TicketStatus.OPEN],
      [TicketStatus.CANCELLED, TicketStatus.ASSIGNED],
      [TicketStatus.CANCELLED, TicketStatus.IN_PROGRESS],
      [TicketStatus.CANCELLED, TicketStatus.AWAITING_APPROVAL],
      [TicketStatus.CANCELLED, TicketStatus.DONE],
    ];

    it.each(invalidTransitions)('should reject %s → %s', (from, to) => {
      expect(machine.canTransition(from, to)).toBe(false);
    });
  });

  describe('getValidTransitions', () => {
    it('should return [ASSIGNED, CANCELLED] for OPEN', () => {
      expect(machine.getValidTransitions(TicketStatus.OPEN)).toEqual(
        expect.arrayContaining([TicketStatus.ASSIGNED, TicketStatus.CANCELLED]),
      );
      expect(machine.getValidTransitions(TicketStatus.OPEN)).toHaveLength(2);
    });

    it('should return [IN_PROGRESS, CANCELLED, ASSIGNED] for ASSIGNED', () => {
      const transitions = machine.getValidTransitions(TicketStatus.ASSIGNED);
      expect(transitions).toHaveLength(3);
      expect(transitions).toEqual(
        expect.arrayContaining([
          TicketStatus.IN_PROGRESS,
          TicketStatus.CANCELLED,
          TicketStatus.ASSIGNED,
        ]),
      );
    });

    it('should return [AWAITING_APPROVAL, ASSIGNED] for IN_PROGRESS', () => {
      const transitions = machine.getValidTransitions(TicketStatus.IN_PROGRESS);
      expect(transitions).toHaveLength(2);
      expect(transitions).toEqual(
        expect.arrayContaining([TicketStatus.AWAITING_APPROVAL, TicketStatus.ASSIGNED]),
      );
    });

    it('should return [DONE] for AWAITING_APPROVAL', () => {
      expect(machine.getValidTransitions(TicketStatus.AWAITING_APPROVAL)).toEqual([
        TicketStatus.DONE,
      ]);
    });

    it('should return [] for DONE (terminal state)', () => {
      expect(machine.getValidTransitions(TicketStatus.DONE)).toEqual([]);
    });

    it('should return [] for CANCELLED (terminal state)', () => {
      expect(machine.getValidTransitions(TicketStatus.CANCELLED)).toEqual([]);
    });
  });
});

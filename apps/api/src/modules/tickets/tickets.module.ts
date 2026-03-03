import { Module } from '@nestjs/common';
import { TicketsService } from './tickets.service';
import { TicketsController } from './tickets.controller';
import { TicketActivityService } from './ticket-activity.service';
import { TicketStateMachine } from './ticket-state-machine';

@Module({
  controllers: [TicketsController],
  providers: [TicketsService, TicketActivityService, TicketStateMachine],
  exports: [TicketsService],
})
export class TicketsModule {}

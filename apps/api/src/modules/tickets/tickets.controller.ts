import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Body,
  Query,
  UseGuards,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Role } from '@maintix/shared-types';
import { Roles } from '@/common/decorators/roles.decorator';
import { CurrentUser, JwtPayload } from '@/common/decorators/current-user.decorator';
import { PropertyGuard } from '@/common/guards/property.guard';
import { TicketsService } from './tickets.service';
import { TicketActivityService } from './ticket-activity.service';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { AssignTicketDto } from './dto/assign-ticket.dto';
import { CancelTicketDto } from './dto/cancel-ticket.dto';
import { UpdatePriorityDto } from './dto/update-priority.dto';
import { ReassignTicketDto } from './dto/reassign-ticket.dto';
import { TransitionVersionDto } from './dto/transition-version.dto';
import { TicketQueryDto } from './dto/ticket-query.dto';

@ApiTags('Tickets')
@ApiBearerAuth()
@Controller()
export class TicketsController {
  constructor(
    private readonly ticketsService: TicketsService,
    private readonly activityService: TicketActivityService,
  ) {}

  // === Property-scoped routes (require PropertyGuard) ===

  @Post('properties/:propertyId/tickets')
  @UseGuards(PropertyGuard)
  @ApiOperation({ summary: 'Create a ticket' })
  @ApiResponse({ status: 201, description: 'Ticket created' })
  @ApiResponse({ status: 400, description: 'Validation error' })
  @ApiResponse({ status: 403, description: 'Not a member of this property' })
  create(
    @Param('propertyId', ParseUUIDPipe) propertyId: string,
    @Body() dto: CreateTicketDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.ticketsService.create(propertyId, dto, user.sub);
  }

  @Get('properties/:propertyId/tickets')
  @UseGuards(PropertyGuard)
  @ApiOperation({ summary: 'List tickets for a property' })
  @ApiResponse({ status: 200, description: 'Paginated list of tickets' })
  @ApiResponse({ status: 403, description: 'Not a member of this property' })
  findAll(@Param('propertyId', ParseUUIDPipe) propertyId: string, @Query() query: TicketQueryDto) {
    return this.ticketsService.findAllByProperty(propertyId, query);
  }

  // === Ticket-scoped routes ===

  @Get('tickets/:id')
  @ApiOperation({ summary: 'Get ticket details' })
  @ApiResponse({ status: 200, description: 'Ticket details with relations' })
  @ApiResponse({ status: 403, description: 'Not a member of the ticket property' })
  @ApiResponse({ status: 404, description: 'Ticket not found' })
  findOne(@Param('id', ParseUUIDPipe) id: string, @CurrentUser() user: JwtPayload) {
    return this.ticketsService.findOne(id, user.sub);
  }

  @Patch('tickets/:id/assign')
  @Roles(Role.MANAGER)
  @ApiOperation({ summary: 'Assign a technician to a ticket' })
  @ApiResponse({ status: 200, description: 'Ticket assigned to technician' })
  @ApiResponse({ status: 400, description: 'Invalid state transition' })
  @ApiResponse({ status: 403, description: 'Forbidden — only managers can assign' })
  @ApiResponse({ status: 404, description: 'Ticket not found' })
  @ApiResponse({ status: 409, description: 'Version conflict — ticket was modified concurrently' })
  assign(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: AssignTicketDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.ticketsService.assign(id, dto.technicianId, user.sub, dto.version);
  }

  @Patch('tickets/:id/start')
  @Roles(Role.TECHNICIAN)
  @ApiOperation({ summary: 'Start work on a ticket' })
  @ApiResponse({ status: 200, description: 'Ticket moved to IN_PROGRESS' })
  @ApiResponse({ status: 400, description: 'Invalid state transition' })
  @ApiResponse({ status: 403, description: 'Forbidden — only assigned technician can start' })
  @ApiResponse({ status: 409, description: 'Version conflict' })
  startWork(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: TransitionVersionDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.ticketsService.startWork(id, user.sub, dto.version);
  }

  @Patch('tickets/:id/complete')
  @Roles(Role.TECHNICIAN)
  @ApiOperation({ summary: 'Submit ticket for approval' })
  @ApiResponse({ status: 200, description: 'Ticket moved to AWAITING_APPROVAL' })
  @ApiResponse({ status: 400, description: 'Invalid state transition' })
  @ApiResponse({ status: 403, description: 'Forbidden — only assigned technician can complete' })
  @ApiResponse({ status: 409, description: 'Version conflict' })
  submitCompletion(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: TransitionVersionDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.ticketsService.submitCompletion(id, user.sub, dto.version);
  }

  @Patch('tickets/:id/approve')
  @Roles(Role.MANAGER)
  @ApiOperation({ summary: 'Approve a completed ticket' })
  @ApiResponse({ status: 200, description: 'Ticket approved and moved to DONE' })
  @ApiResponse({ status: 400, description: 'Invalid state transition' })
  @ApiResponse({ status: 403, description: 'Forbidden — only managers can approve' })
  @ApiResponse({ status: 409, description: 'Version conflict' })
  approve(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: TransitionVersionDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.ticketsService.approve(id, user.sub, dto.version);
  }

  @Patch('tickets/:id/cancel')
  @ApiOperation({ summary: 'Cancel a ticket' })
  @ApiResponse({ status: 200, description: 'Ticket cancelled' })
  @ApiResponse({ status: 400, description: 'Invalid state transition — can only cancel from OPEN or ASSIGNED' })
  @ApiResponse({ status: 403, description: 'Forbidden — only ticket creator can cancel' })
  @ApiResponse({ status: 409, description: 'Version conflict' })
  cancel(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: CancelTicketDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.ticketsService.cancel(id, user.sub, dto.reason, dto.version);
  }

  @Patch('tickets/:id/priority')
  @Roles(Role.MANAGER)
  @ApiOperation({ summary: 'Update ticket priority' })
  @ApiResponse({ status: 200, description: 'Ticket priority updated' })
  @ApiResponse({ status: 400, description: 'Invalid priority value' })
  @ApiResponse({ status: 403, description: 'Forbidden — only managers can update priority' })
  @ApiResponse({ status: 409, description: 'Version conflict' })
  updatePriority(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdatePriorityDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.ticketsService.updatePriority(id, dto.priority, user.sub, dto.version);
  }

  @Patch('tickets/:id/reassign')
  @Roles(Role.MANAGER)
  @ApiOperation({ summary: 'Reassign ticket to a different technician' })
  @ApiResponse({ status: 200, description: 'Ticket reassigned — status reset to ASSIGNED' })
  @ApiResponse({ status: 400, description: 'Invalid state transition' })
  @ApiResponse({ status: 403, description: 'Forbidden — only managers can reassign' })
  @ApiResponse({ status: 409, description: 'Version conflict' })
  reassign(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: ReassignTicketDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.ticketsService.reassign(id, dto.technicianId, user.sub, dto.version);
  }

  // === Activity sub-route ===

  @Get('tickets/:id/activity')
  @ApiOperation({ summary: 'Get ticket activity log' })
  @ApiResponse({ status: 200, description: 'Paginated activity log for the ticket' })
  @ApiResponse({ status: 404, description: 'Ticket not found' })
  async activity(
    @Param('id', ParseUUIDPipe) id: string,
    @Query('cursor') cursor?: string,
    @Query('limit') limit?: number,
  ): Promise<any> {
    return this.activityService.findByTicket(id, cursor, limit ? +limit : undefined);
  }
}

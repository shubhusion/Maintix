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
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
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
  findAll(@Param('propertyId', ParseUUIDPipe) propertyId: string, @Query() query: TicketQueryDto) {
    return this.ticketsService.findAllByProperty(propertyId, query);
  }

  // === Ticket-scoped routes ===

  @Get('tickets/:id')
  @ApiOperation({ summary: 'Get ticket details' })
  findOne(@Param('id', ParseUUIDPipe) id: string, @CurrentUser() user: JwtPayload) {
    return this.ticketsService.findOne(id, user.sub);
  }

  @Patch('tickets/:id/assign')
  @Roles(Role.MANAGER)
  @ApiOperation({ summary: 'Assign a technician to a ticket' })
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
  approve(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: TransitionVersionDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.ticketsService.approve(id, user.sub, dto.version);
  }

  @Patch('tickets/:id/cancel')
  @ApiOperation({ summary: 'Cancel a ticket' })
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
  async activity(
    @Param('id', ParseUUIDPipe) id: string,
    @Query('cursor') cursor?: string,
    @Query('limit') limit?: number,
  ): Promise<any> {
    return this.activityService.findByTicket(id, cursor, limit ? +limit : undefined);
  }
}

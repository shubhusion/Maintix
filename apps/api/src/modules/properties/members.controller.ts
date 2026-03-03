import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  ParseUUIDPipe,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { Role } from '@maintix/shared-types';
import { Roles } from '@/common/decorators';
import { PropertyGuard } from '@/common/guards/property.guard';
import { PropertiesService } from './properties.service';
import { AddMemberDto } from './dto/add-member.dto';

@ApiTags('Property Members')
@ApiBearerAuth()
@Controller('properties/:propertyId/members')
@UseGuards(PropertyGuard)
export class MembersController {
  constructor(private readonly propertiesService: PropertiesService) {}

  @Post()
  @Roles(Role.MANAGER)
  @ApiOperation({ summary: 'Add a member to property (manager only)' })
  addMember(
    @Param('propertyId', ParseUUIDPipe) propertyId: string,
    @Body() dto: AddMemberDto,
  ) {
    return this.propertiesService.addMember(propertyId, dto);
  }

  @Get()
  @ApiOperation({ summary: 'List property members' })
  getMembers(@Param('propertyId', ParseUUIDPipe) propertyId: string) {
    return this.propertiesService.getMembers(propertyId);
  }

  @Delete(':userId')
  @Roles(Role.MANAGER)
  @ApiOperation({ summary: 'Remove a member from property (manager only)' })
  removeMember(
    @Param('propertyId', ParseUUIDPipe) propertyId: string,
    @Param('userId', ParseUUIDPipe) userId: string,
  ) {
    return this.propertiesService.removeMember(propertyId, userId);
  }
}

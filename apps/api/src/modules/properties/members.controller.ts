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
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
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
  @ApiResponse({ status: 201, description: 'Member added to property' })
  @ApiResponse({ status: 400, description: 'Validation error or user already a member' })
  @ApiResponse({ status: 403, description: 'Forbidden — only managers can add members' })
  @ApiResponse({ status: 404, description: 'User not found' })
  addMember(@Param('propertyId', ParseUUIDPipe) propertyId: string, @Body() dto: AddMemberDto) {
    return this.propertiesService.addMember(propertyId, dto);
  }

  @Get()
  @ApiOperation({ summary: 'List property members' })
  @ApiResponse({ status: 200, description: 'List of property members with user details' })
  @ApiResponse({ status: 403, description: 'Not a member of this property' })
  getMembers(@Param('propertyId', ParseUUIDPipe) propertyId: string) {
    return this.propertiesService.getMembers(propertyId);
  }

  @Delete(':userId')
  @Roles(Role.MANAGER)
  @ApiOperation({ summary: 'Remove a member from property (manager only)' })
  @ApiResponse({ status: 200, description: 'Member removed from property' })
  @ApiResponse({ status: 403, description: 'Forbidden — only managers can remove members' })
  @ApiResponse({ status: 404, description: 'Member not found in property' })
  removeMember(
    @Param('propertyId', ParseUUIDPipe) propertyId: string,
    @Param('userId', ParseUUIDPipe) userId: string,
  ) {
    return this.propertiesService.removeMember(propertyId, userId);
  }
}

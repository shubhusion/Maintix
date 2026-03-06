import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  ParseUUIDPipe,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { Role } from '@maintix/shared-types';
import { Roles, CurrentUser, JwtPayload } from '@/common/decorators';
import { PropertyGuard } from '@/common/guards/property.guard';
import { PropertiesService } from './properties.service';
import { CreatePropertyDto } from './dto/create-property.dto';
import { UpdatePropertyDto } from './dto/update-property.dto';

@ApiTags('Properties')
@ApiBearerAuth()
@Controller('properties')
export class PropertiesController {
  constructor(private readonly propertiesService: PropertiesService) {}

  @Post()
  @Roles(Role.MANAGER)
  @ApiOperation({ summary: 'Create a property (manager only)' })
  @ApiResponse({ status: 201, description: 'Property created — creator automatically added as member' })
  @ApiResponse({ status: 400, description: 'Validation error' })
  @ApiResponse({ status: 403, description: 'Forbidden — only managers can create properties' })
  create(@Body() dto: CreatePropertyDto, @CurrentUser() user: JwtPayload) {
    return this.propertiesService.create(dto, user.sub);
  }

  @Get()
  @ApiOperation({ summary: 'List properties for current user' })
  @ApiResponse({ status: 200, description: 'List of properties the current user is a member of' })
  findAll(@CurrentUser() user: JwtPayload) {
    return this.propertiesService.findAllForUser(user.sub);
  }

  @Get(':id')
  @UseGuards(PropertyGuard)
  @ApiOperation({ summary: 'Get property details' })
  @ApiResponse({ status: 200, description: 'Property details with member count' })
  @ApiResponse({ status: 403, description: 'Not a member of this property' })
  @ApiResponse({ status: 404, description: 'Property not found' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.propertiesService.findOne(id);
  }

  @Patch(':id')
  @Roles(Role.MANAGER)
  @UseGuards(PropertyGuard)
  @ApiOperation({ summary: 'Update property (manager only)' })
  @ApiResponse({ status: 200, description: 'Property updated' })
  @ApiResponse({ status: 400, description: 'Validation error' })
  @ApiResponse({ status: 403, description: 'Forbidden — not a manager or not a member' })
  @ApiResponse({ status: 404, description: 'Property not found' })
  update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdatePropertyDto) {
    return this.propertiesService.update(id, dto);
  }

  @Delete(':id')
  @Roles(Role.MANAGER)
  @UseGuards(PropertyGuard)
  @ApiOperation({ summary: 'Delete property (manager only)' })
  @ApiResponse({ status: 200, description: 'Property soft-deleted' })
  @ApiResponse({ status: 403, description: 'Forbidden — not a manager or not a member' })
  @ApiResponse({ status: 404, description: 'Property not found' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.propertiesService.softDelete(id);
  }
}

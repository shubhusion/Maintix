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
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
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
  create(
    @Body() dto: CreatePropertyDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.propertiesService.create(dto, user.sub);
  }

  @Get()
  @ApiOperation({ summary: 'List properties for current user' })
  findAll(@CurrentUser() user: JwtPayload) {
    return this.propertiesService.findAllForUser(user.sub);
  }

  @Get(':id')
  @UseGuards(PropertyGuard)
  @ApiOperation({ summary: 'Get property details' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.propertiesService.findOne(id);
  }

  @Patch(':id')
  @Roles(Role.MANAGER)
  @UseGuards(PropertyGuard)
  @ApiOperation({ summary: 'Update property (manager only)' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdatePropertyDto,
  ) {
    return this.propertiesService.update(id, dto);
  }

  @Delete(':id')
  @Roles(Role.MANAGER)
  @UseGuards(PropertyGuard)
  @ApiOperation({ summary: 'Delete property (manager only)' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.propertiesService.softDelete(id);
  }
}

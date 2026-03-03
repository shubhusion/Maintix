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
import { Roles } from '@/common/decorators';
import { PropertyGuard } from '@/common/guards/property.guard';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@ApiTags('Categories')
@ApiBearerAuth()
@Controller()
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post('properties/:propertyId/categories')
  @Roles(Role.MANAGER)
  @UseGuards(PropertyGuard)
  @ApiOperation({ summary: 'Create category (manager only)' })
  create(
    @Param('propertyId', ParseUUIDPipe) propertyId: string,
    @Body() dto: CreateCategoryDto,
  ) {
    return this.categoriesService.create(propertyId, dto);
  }

  @Get('properties/:propertyId/categories')
  @UseGuards(PropertyGuard)
  @ApiOperation({ summary: 'List categories for a property' })
  findAll(@Param('propertyId', ParseUUIDPipe) propertyId: string) {
    return this.categoriesService.findAllByProperty(propertyId);
  }

  @Patch('categories/:id')
  @Roles(Role.MANAGER)
  @ApiOperation({ summary: 'Update category (manager only)' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateCategoryDto,
  ) {
    return this.categoriesService.update(id, dto);
  }

  @Delete('categories/:id')
  @Roles(Role.MANAGER)
  @ApiOperation({ summary: 'Delete category (manager only)' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.categoriesService.softDelete(id);
  }
}

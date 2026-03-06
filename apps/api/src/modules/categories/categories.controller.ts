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
import { Roles } from '@/common/decorators';
import { CurrentUser, JwtPayload } from '@/common/decorators/current-user.decorator';
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
  @ApiResponse({ status: 201, description: 'Category created' })
  @ApiResponse({ status: 400, description: 'Validation error or duplicate category name' })
  @ApiResponse({ status: 403, description: 'Forbidden — only managers can create categories' })
  create(@Param('propertyId', ParseUUIDPipe) propertyId: string, @Body() dto: CreateCategoryDto) {
    return this.categoriesService.create(propertyId, dto);
  }

  @Get('properties/:propertyId/categories')
  @UseGuards(PropertyGuard)
  @ApiOperation({ summary: 'List categories for a property' })
  @ApiResponse({ status: 200, description: 'List of categories for the property' })
  @ApiResponse({ status: 403, description: 'Not a member of this property' })
  findAll(@Param('propertyId', ParseUUIDPipe) propertyId: string) {
    return this.categoriesService.findAllByProperty(propertyId);
  }

  @Patch('categories/:id')
  @Roles(Role.MANAGER)
  @ApiOperation({ summary: 'Update category (manager only)' })
  @ApiResponse({ status: 200, description: 'Category updated' })
  @ApiResponse({ status: 400, description: 'Validation error or duplicate category name' })
  @ApiResponse({ status: 403, description: 'Forbidden — not a manager or not a property member' })
  @ApiResponse({ status: 404, description: 'Category not found' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateCategoryDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.categoriesService.update(id, dto, user.sub);
  }

  @Delete('categories/:id')
  @Roles(Role.MANAGER)
  @ApiOperation({ summary: 'Delete category (manager only)' })
  @ApiResponse({ status: 200, description: 'Category soft-deleted' })
  @ApiResponse({ status: 403, description: 'Forbidden — not a manager or not a property member' })
  @ApiResponse({ status: 404, description: 'Category not found' })
  remove(@Param('id', ParseUUIDPipe) id: string, @CurrentUser() user: JwtPayload) {
    return this.categoriesService.softDelete(id, user.sub);
  }
}

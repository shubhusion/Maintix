import { Injectable, HttpStatus } from '@nestjs/common';
import { PrismaService } from '@/common/database/prisma.service';
import { BusinessException } from '@/common/exceptions/business.exception';
import { ErrorCode } from '@maintix/shared-types';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(propertyId: string, dto: CreateCategoryDto) {
    // Check name uniqueness within property
    const existing = await this.prisma.category.findFirst({
      where: {
        propertyId,
        name: dto.name,
        deletedAt: null,
      },
    });

    if (existing) {
      throw new BusinessException(
        'Category name already exists in this property',
        ErrorCode.CATEGORY_NAME_EXISTS,
        HttpStatus.CONFLICT,
      );
    }

    return this.prisma.category.create({
      data: {
        name: dto.name,
        propertyId,
      },
    });
  }

  async findAllByProperty(propertyId: string) {
    return this.prisma.category.findMany({
      where: { propertyId, deletedAt: null },
      orderBy: { name: 'asc' },
    });
  }

  async findOne(id: string) {
    const category = await this.prisma.category.findUnique({
      where: { id, deletedAt: null },
    });

    if (!category) {
      throw new BusinessException(
        'Category not found',
        ErrorCode.CATEGORY_NOT_FOUND,
        HttpStatus.NOT_FOUND,
      );
    }

    return category;
  }

  async update(id: string, dto: UpdateCategoryDto, userId: string) {
    const category = await this.findOne(id);

    // Validate user is a member of the category's property
    await this.validatePropertyMembership(category.propertyId, userId);

    // Check name uniqueness if name is being updated
    if (dto.name) {
      const existing = await this.prisma.category.findFirst({
        where: {
          propertyId: category.propertyId,
          name: dto.name,
          deletedAt: null,
          NOT: { id },
        },
      });

      if (existing) {
        throw new BusinessException(
          'Category name already exists in this property',
          ErrorCode.CATEGORY_NAME_EXISTS,
          HttpStatus.CONFLICT,
        );
      }
    }

    return this.prisma.category.update({
      where: { id },
      data: {
        ...(dto.name && { name: dto.name }),
      },
    });
  }

  async softDelete(id: string, userId: string) {
    const category = await this.findOne(id);

    // Validate user is a member of the category's property
    await this.validatePropertyMembership(category.propertyId, userId);

    await this.prisma.category.update({
      where: { id },
      data: { deletedAt: new Date() },
    });

    return { message: 'Category deleted successfully' };
  }

  private async validatePropertyMembership(propertyId: string, userId: string) {
    const membership = await this.prisma.propertyMember.findUnique({
      where: { propertyId_userId: { propertyId, userId } },
    });

    if (!membership) {
      throw new BusinessException(
        'You are not a member of this property',
        ErrorCode.PROPERTY_ACCESS_DENIED,
        HttpStatus.FORBIDDEN,
      );
    }
  }
}

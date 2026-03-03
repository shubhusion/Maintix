import { Injectable, HttpStatus } from '@nestjs/common';
import { PrismaService } from '@/common/database/prisma.service';
import { BusinessException } from '@/common/exceptions/business.exception';
import { ErrorCode, Role } from '@maintix/shared-types';
import { CreatePropertyDto } from './dto/create-property.dto';
import { UpdatePropertyDto } from './dto/update-property.dto';
import { AddMemberDto } from './dto/add-member.dto';

@Injectable()
export class PropertiesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreatePropertyDto, managerId: string) {
    const property = await this.prisma.property.create({
      data: {
        name: dto.name,
        address: dto.address,
        description: dto.description,
        members: {
          create: {
            userId: managerId,
          },
        },
      },
      include: {
        members: {
          include: {
            user: {
              select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                role: true,
              },
            },
          },
        },
      },
    });

    return property;
  }

  async findAllForUser(userId: string) {
    const memberships = await this.prisma.propertyMember.findMany({
      where: { userId },
      include: {
        property: {
          include: {
            _count: {
              select: {
                members: true,
                tickets: { where: { deletedAt: null } },
              },
            },
          },
        },
      },
    });

    return memberships
      .filter((m) => m.property.deletedAt === null)
      .map((m) => ({
        ...m.property,
        memberCount: m.property._count.members,
        ticketCount: m.property._count.tickets,
      }));
  }

  async findOne(id: string) {
    const property = await this.prisma.property.findUnique({
      where: { id, deletedAt: null },
      include: {
        _count: {
          select: {
            members: true,
            tickets: { where: { deletedAt: null } },
            categories: { where: { deletedAt: null } },
          },
        },
      },
    });

    if (!property) {
      throw new BusinessException(
        'Property not found',
        ErrorCode.PROPERTY_NOT_FOUND,
        HttpStatus.NOT_FOUND,
      );
    }

    return property;
  }

  async update(id: string, dto: UpdatePropertyDto) {
    await this.findOne(id);

    return this.prisma.property.update({
      where: { id },
      data: {
        ...(dto.name && { name: dto.name }),
        ...(dto.address && { address: dto.address }),
        ...(dto.description !== undefined && { description: dto.description }),
      },
    });
  }

  async softDelete(id: string) {
    await this.findOne(id);

    await this.prisma.property.update({
      where: { id },
      data: { deletedAt: new Date() },
    });

    return { message: 'Property deleted successfully' };
  }

  // === Members ===

  async addMember(propertyId: string, dto: AddMemberDto) {
    // Check user exists
    const user = await this.prisma.user.findUnique({
      where: { id: dto.userId, deletedAt: null },
    });
    if (!user) {
      throw new BusinessException(
        'User not found',
        ErrorCode.USER_NOT_FOUND,
        HttpStatus.NOT_FOUND,
      );
    }

    // Check not already a member
    const existing = await this.prisma.propertyMember.findUnique({
      where: {
        propertyId_userId: { propertyId, userId: dto.userId },
      },
    });
    if (existing) {
      throw new BusinessException(
        'User is already a member of this property',
        ErrorCode.ALREADY_PROPERTY_MEMBER,
        HttpStatus.CONFLICT,
      );
    }

    const member = await this.prisma.propertyMember.create({
      data: {
        propertyId,
        userId: dto.userId,
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            role: true,
          },
        },
      },
    });

    return member;
  }

  async getMembers(propertyId: string) {
    return this.prisma.propertyMember.findMany({
      where: { propertyId },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            role: true,
            isActive: true,
          },
        },
      },
      orderBy: { joinedAt: 'asc' },
    });
  }

  async removeMember(propertyId: string, userId: string) {
    const membership = await this.prisma.propertyMember.findUnique({
      where: {
        propertyId_userId: { propertyId, userId },
      },
    });

    if (!membership) {
      throw new BusinessException(
        'User is not a member of this property',
        ErrorCode.NOT_PROPERTY_MEMBER,
        HttpStatus.NOT_FOUND,
      );
    }

    await this.prisma.propertyMember.delete({
      where: { id: membership.id },
    });

    return { message: 'Member removed successfully' };
  }

  async isManagerOfProperty(userId: string, propertyId: string): Promise<boolean> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId, deletedAt: null },
      select: { role: true },
    });

    if (!user || user.role !== Role.MANAGER) {
      return false;
    }

    const membership = await this.prisma.propertyMember.findUnique({
      where: {
        propertyId_userId: { propertyId, userId },
      },
    });

    return !!membership;
  }
}

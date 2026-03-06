import { Injectable, CanActivate, ExecutionContext, HttpStatus } from '@nestjs/common';
import { PrismaService } from '@/common/database/prisma.service';
import { BusinessException } from '@/common/exceptions/business.exception';
import { ErrorCode } from '@maintix/shared-types';

@Injectable()
export class PropertyGuard implements CanActivate {
  constructor(private readonly prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      return false;
    }

    // Extract propertyId from route params
    const propertyId = request.params.propertyId || request.params.id;
    if (!propertyId) {
      return true; // No property context, skip
    }

    // Check property exists
    const property = await this.prisma.property.findUnique({
      where: { id: propertyId, deletedAt: null },
    });

    if (!property) {
      throw new BusinessException(
        'Property not found',
        ErrorCode.PROPERTY_NOT_FOUND,
        HttpStatus.NOT_FOUND,
      );
    }

    // Check user is a member of this property
    const membership = await this.prisma.propertyMember.findUnique({
      where: {
        propertyId_userId: {
          propertyId,
          userId: user.sub,
        },
      },
    });

    if (!membership) {
      throw new BusinessException(
        'You do not have access to this property',
        ErrorCode.PROPERTY_ACCESS_DENIED,
        HttpStatus.FORBIDDEN,
      );
    }

    // Attach property to request for downstream use
    request.property = property;

    return true;
  }
}

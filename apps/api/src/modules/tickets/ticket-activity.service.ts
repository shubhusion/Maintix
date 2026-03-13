import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/database/prisma.service';
import { ActivityAction } from '@maintix/shared-types';

interface ActivityData {
  ticketId: string;
  actorId: string;
  action: ActivityAction;
  previousValue?: any;
  newValue?: any;
}

@Injectable()
export class TicketActivityService {
  constructor(private prisma: PrismaService) {}

  async logActivity(data: ActivityData) {
    return this.prisma.ticketActivity.create({
      data,
    });
  }

  async getTicketHistory(ticketId: string) {
    const activities = await this.prisma.ticketActivity.findMany({
      where: { ticketId },
      include: {
        actor: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            role: true,
          },
        },
      },
      orderBy: { createdAt: 'asc' },
    });

    return activities;
  }

  async log(data: ActivityData) {
    return this.logActivity(data);
  }

  async findByTicket(ticketId: string, cursor?: string, limit?: number) {
    const activities = await this.prisma.ticketActivity.findMany({
      where: { ticketId },
      cursor: cursor ? { id: cursor } : undefined,
      take: limit,
      include: {
        actor: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            role: true,
          },
        },
      },
      orderBy: { createdAt: 'asc' },
    });

    return activities;
  }
}

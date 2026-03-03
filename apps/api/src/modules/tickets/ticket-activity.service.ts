import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/common/database/prisma.service';
import { ActivityAction } from '@maintix/shared-types';
import type { Prisma } from '@maintix/database';

@Injectable()
export class TicketActivityService {
  constructor(private readonly prisma: PrismaService) {}

  async log(params: {
    ticketId: string;
    actorId: string;
    action: ActivityAction;
    previousValue?: Record<string, unknown>;
    newValue?: Record<string, unknown>;
  }) {
    return this.prisma.ticketActivity.create({
      data: {
        ticketId: params.ticketId,
        actorId: params.actorId,
        action: params.action,
        previousValue: (params.previousValue as Prisma.InputJsonValue) ?? undefined,
        newValue: (params.newValue as Prisma.InputJsonValue) ?? undefined,
      },
    });
  }

  async findByTicket(ticketId: string, cursor?: string, limit = 20) {
    const where: Record<string, unknown> = { ticketId };

    if (cursor) {
      where.createdAt = { lt: new Date(cursor) };
    }

    const activities = await this.prisma.ticketActivity.findMany({
      where,
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
      orderBy: { createdAt: 'desc' },
      take: limit + 1,
    });

    const hasMore = activities.length > limit;
    const data = hasMore ? activities.slice(0, limit) : activities;

    return {
      data,
      meta: {
        hasMore,
        nextCursor: hasMore
          ? data[data.length - 1].createdAt.toISOString()
          : null,
      },
    };
  }
}

import { Injectable } from '@nestjs/common';
import { uuidv7 } from 'uuidv7';

import { PrismaService } from '@common/prisma/prisma.service';

export interface CreateLogInput {
  level: string;
  eventType: string;
  message: string;
  ip?: string | null;
  method?: string | null;
  path?: string | null;
  userAgent?: string | null;
}

@Injectable()
export class LogRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(data: CreateLogInput) {
    return this.prisma.appLog.create({
      data: {
        id: uuidv7(),
        level: data.level,
        eventType: data.eventType,
        message: data.message,
        ip: data.ip ?? null,
        method: data.method ?? null,
        path: data.path ?? null,
        userAgent: data.userAgent ?? null,
      },
    });
  }

  async findMany(page: number, limit: number) {
    const [items, total] = await Promise.all([
      this.prisma.appLog.findMany({
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.appLog.count(),
    ]);
    return { items, total };
  }
}

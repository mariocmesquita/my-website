import { Injectable } from '@nestjs/common';
import { uuidv7 } from 'uuidv7';

import { type Career } from '@generated/prisma';
import { PrismaService } from '@common/prisma/prisma.service';
import { type CreateCareerInput, type UpdateCareerInput } from './career.schema';

@Injectable()
export class CareerRepository {
  constructor(private readonly prisma: PrismaService) {}

  findAll(): Promise<Career[]> {
    return this.prisma.career.findMany({ orderBy: { startDate: 'desc' } });
  }

  create(data: CreateCareerInput): Promise<Career> {
    return this.prisma.career.create({
      data: {
        id: uuidv7(),
        company: data.company,
        role: data.role,
        startDate: new Date(data.startDate),
        endDate: data.endDate ? new Date(data.endDate) : null,
        content: data.content,
      },
    });
  }

  update(id: string, data: UpdateCareerInput): Promise<Career> {
    return this.prisma.career.update({
      where: { id },
      data: {
        company: data.company,
        role: data.role,
        startDate: new Date(data.startDate),
        endDate: data.endDate ? new Date(data.endDate) : null,
        content: data.content,
      },
    });
  }

  delete(id: string): Promise<Career> {
    return this.prisma.career.delete({ where: { id } });
  }
}

import { Injectable } from '@nestjs/common';
import { type Career, type CareerTranslation } from '@generated/prisma';
import { uuidv7 } from 'uuidv7';

import { PrismaService } from '@common/prisma/prisma.service';
import {
  type CareerRow,
  type CareerTranslationRow,
  type CreateCareerInput,
  type UpdateCareerInput,
  type UpsertCareerTranslationInput,
} from './career.schema';

@Injectable()
export class CareerRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(locale = 'en'): Promise<CareerRow[]> {
    const careers = await this.prisma.career.findMany({
      orderBy: { startDate: 'desc' },
      include: { translations: { where: { locale } } },
    });
    return careers.map(({ translations, ...base }) => {
      const translation = translations[0];
      if (locale === 'en' || !translation) {
        return { ...base, translated: locale === 'en' };
      }
      return { ...base, role: translation.role, content: translation.content, translated: true };
    });
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

  async findAllAdmin(): Promise<CareerRow[]> {
    const careers = await this.prisma.career.findMany({
      orderBy: { startDate: 'desc' },
      include: { translations: { where: { locale: 'pt' } } },
    });
    return careers.map(({ translations, ...base }) => ({
      ...base,
      translated: translations.length > 0,
    }));
  }

  delete(id: string): Promise<Career> {
    return this.prisma.career.delete({ where: { id } });
  }

  async findTranslation(id: string, locale: string): Promise<CareerTranslationRow> {
    const translation = await this.prisma.careerTranslation.findUnique({
      where: { careerId_locale: { careerId: id, locale } },
    });
    if (!translation) return null;
    return { locale: translation.locale, role: translation.role, content: translation.content };
  }

  async upsertTranslation(
    id: string,
    locale: string,
    data: UpsertCareerTranslationInput,
  ): Promise<CareerTranslation> {
    return this.prisma.careerTranslation.upsert({
      where: { careerId_locale: { careerId: id, locale } },
      create: { id: uuidv7(), careerId: id, locale, ...data },
      update: data,
    });
  }
}

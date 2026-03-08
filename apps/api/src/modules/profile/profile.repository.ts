import { Injectable } from '@nestjs/common';
import { uuidv7 } from 'uuidv7';

import { PrismaService } from '@common/prisma/prisma.service';
import { type UpsertProfileTranslationInput, type UpdateProfileInput } from './profile.schema';

const PROFILE_SINGLETON_ID = '018e1234-0000-7000-8000-000000000001';

@Injectable()
export class ProfileRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findProfile(locale = 'en') {
    const profile = await this.prisma.profile.findUnique({
      where: { id: PROFILE_SINGLETON_ID },
      include: {
        translations: { where: { locale } },
      },
    });
    if (!profile) return null;
    const { translations, ...base } = profile;
    const translation = translations[0];
    if (locale === 'en' || !translation) {
      return { ...base, translated: !!translation || locale === 'en' };
    }
    return {
      ...base,
      position: translation.position,
      description: translation.description,
      bio: translation.bio,
      translated: true,
    };
  }

  upsertProfile(data: UpdateProfileInput) {
    return this.prisma.profile.upsert({
      where: { id: PROFILE_SINGLETON_ID },
      create: { id: PROFILE_SINGLETON_ID, ...data },
      update: data,
    });
  }

  async findTranslation(locale: string) {
    const translation = await this.prisma.profileTranslation.findUnique({
      where: { profileId_locale: { profileId: PROFILE_SINGLETON_ID, locale } },
    });
    if (!translation) return null;
    return {
      locale: translation.locale,
      position: translation.position,
      description: translation.description,
      bio: translation.bio,
    };
  }

  async upsertTranslation(locale: string, data: UpsertProfileTranslationInput) {
    return this.prisma.profileTranslation.upsert({
      where: { profileId_locale: { profileId: PROFILE_SINGLETON_ID, locale } },
      create: { id: uuidv7(), profileId: PROFILE_SINGLETON_ID, locale, ...data },
      update: data,
    });
  }
}

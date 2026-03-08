import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { type Profile, type ProfileTranslation } from '@generated/prisma';

import {
  type ProfileRow,
  type ProfileTranslationRow,
  type UpdateProfileInput,
  type UpsertProfileTranslationInput,
} from './profile.schema';
import { ProfileRepository } from './profile.repository';

@Injectable()
export class ProfileService {
  private readonly logger = new Logger(ProfileService.name);

  constructor(private readonly profileRepository: ProfileRepository) {}

  async getProfile(locale = 'en'): Promise<ProfileRow> {
    const profile = await this.profileRepository.findProfile(locale);
    if (!profile) throw new NotFoundException('Perfil não encontrado.');
    return profile;
  }

  async updateProfile(data: UpdateProfileInput): Promise<Profile> {
    this.logger.log('Atualizando perfil.');
    return this.profileRepository.upsertProfile(data);
  }

  async getTranslation(locale: string): Promise<ProfileTranslationRow> {
    return this.profileRepository.findTranslation(locale);
  }

  async upsertTranslation(
    locale: string,
    data: UpsertProfileTranslationInput,
  ): Promise<ProfileTranslation> {
    this.logger.log(`Salvando tradução do perfil: ${locale}`);
    return this.profileRepository.upsertTranslation(locale, data);
  }
}

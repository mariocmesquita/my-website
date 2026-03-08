import { Injectable, Logger, NotFoundException } from '@nestjs/common';

import { type UpsertProfileTranslationInput, type UpdateProfileInput } from './profile.schema';
import { ProfileRepository } from './profile.repository';

@Injectable()
export class ProfileService {
  private readonly logger = new Logger(ProfileService.name);

  constructor(private readonly profileRepository: ProfileRepository) {}

  async getProfile(locale = 'en') {
    const profile = await this.profileRepository.findProfile(locale);
    if (!profile) throw new NotFoundException('Perfil não encontrado.');
    return profile;
  }

  async updateProfile(data: UpdateProfileInput) {
    this.logger.log('Atualizando perfil.');
    return this.profileRepository.upsertProfile(data);
  }

  async getTranslation(locale: string) {
    return this.profileRepository.findTranslation(locale);
  }

  async upsertTranslation(locale: string, data: UpsertProfileTranslationInput) {
    this.logger.log(`Salvando tradução do perfil: ${locale}`);
    return this.profileRepository.upsertTranslation(locale, data);
  }
}

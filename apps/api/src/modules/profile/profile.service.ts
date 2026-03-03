import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { type Profile } from '@generated/prisma';
import { type UpdateProfileInput } from './profile.schema';
import { ProfileRepository } from './profile.repository';

@Injectable()
export class ProfileService {
  private readonly logger = new Logger(ProfileService.name);

  constructor(private readonly profileRepository: ProfileRepository) {}

  async getProfile(): Promise<Profile> {
    const profile = await this.profileRepository.findProfile();
    if (!profile) {
      throw new NotFoundException('Perfil não encontrado.');
    }
    return profile;
  }

  async updateProfile(data: UpdateProfileInput): Promise<Profile> {
    this.logger.log('Atualizando perfil.');
    return this.profileRepository.upsertProfile(data);
  }
}

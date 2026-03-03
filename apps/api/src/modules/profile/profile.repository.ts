import { Injectable } from '@nestjs/common';
import { PrismaService } from '@common/prisma/prisma.service';
import { type Profile } from '@generated/prisma';
import { type UpdateProfileInput } from './profile.schema';

const PROFILE_SINGLETON_ID = '018e1234-0000-7000-8000-000000000001';

@Injectable()
export class ProfileRepository {
  constructor(private readonly prisma: PrismaService) {}

  findProfile(): Promise<Profile | null> {
    return this.prisma.profile.findUnique({ where: { id: PROFILE_SINGLETON_ID } });
  }

  upsertProfile(data: UpdateProfileInput): Promise<Profile> {
    return this.prisma.profile.upsert({
      where: { id: PROFILE_SINGLETON_ID },
      create: {
        id: PROFILE_SINGLETON_ID,
        ...data,
      },
      update: data,
    });
  }
}

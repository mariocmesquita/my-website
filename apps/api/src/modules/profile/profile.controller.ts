import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { FirebaseAuthGuard } from '@common/guards/firebase-auth.guard';
import { UpdateProfileSchema } from './profile.schema';
import { ProfileService } from './profile.service';

@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async getProfile() {
    const profile = await this.profileService.getProfile();
    return { data: profile, message: 'Perfil obtido com sucesso.' };
  }

  @Patch()
  @HttpCode(HttpStatus.OK)
  @UseGuards(FirebaseAuthGuard)
  async updateProfile(@Body() body: unknown) {
    const result = UpdateProfileSchema.safeParse(body);
    if (!result.success) {
      const message = result.error.issues.map((e) => e.message).join(', ');
      throw new BadRequestException(message);
    }
    const profile = await this.profileService.updateProfile(result.data);
    return { data: profile, message: 'Perfil atualizado com sucesso.' };
  }
}

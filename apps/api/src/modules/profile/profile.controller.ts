import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { type Profile, type ProfileTranslation } from '@generated/prisma';

import { ApiResponse } from '@common/api-response';
import { FirebaseAuthGuard } from '@common/guards/firebase-auth.guard';
import { isValidLocale, resolveLocale } from '@common/locales';
import { ZodValidationPipe } from '@common/pipes/zod-validation.pipe';
import {
  UpdateProfileSchema,
  UpsertProfileTranslationSchema,
  type ProfileRow,
  type ProfileTranslationRow,
  type UpdateProfileInput,
  type UpsertProfileTranslationInput,
} from './profile.schema';
import { ProfileService } from './profile.service';

@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async getProfile(@Query('locale') locale?: string): Promise<ApiResponse<ProfileRow>> {
    const resolvedLocale = resolveLocale(locale);
    const profile = await this.profileService.getProfile(resolvedLocale);
    return { data: profile, message: 'Perfil obtido com sucesso.' };
  }

  @Patch()
  @HttpCode(HttpStatus.OK)
  @UseGuards(FirebaseAuthGuard)
  async updateProfile(
    @Body(new ZodValidationPipe(UpdateProfileSchema)) body: UpdateProfileInput,
  ): Promise<ApiResponse<Profile>> {
    const profile = await this.profileService.updateProfile(body);
    return { data: profile, message: 'Perfil atualizado com sucesso.' };
  }

  @Get('translations/:locale')
  @HttpCode(HttpStatus.OK)
  @UseGuards(FirebaseAuthGuard)
  async getTranslation(
    @Param('locale') locale: string,
  ): Promise<ApiResponse<ProfileTranslationRow>> {
    const translation = await this.profileService.getTranslation(locale);
    return { data: translation, message: 'Tradução obtida com sucesso.' };
  }

  @Put('translations/:locale')
  @HttpCode(HttpStatus.OK)
  @UseGuards(FirebaseAuthGuard)
  async upsertTranslation(
    @Param('locale') locale: string,
    @Body(new ZodValidationPipe(UpsertProfileTranslationSchema))
    body: UpsertProfileTranslationInput,
  ): Promise<ApiResponse<ProfileTranslation>> {
    if (!isValidLocale(locale)) throw new BadRequestException('Locale inválido.');
    const translation = await this.profileService.upsertTranslation(locale, body);
    return { data: translation, message: 'Tradução salva com sucesso.' };
  }
}

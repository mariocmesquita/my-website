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

import { FirebaseAuthGuard } from '@common/guards/firebase-auth.guard';
import { UpdateProfileSchema, UpsertProfileTranslationSchema } from './profile.schema';
import { ProfileService } from './profile.service';

const SUPPORTED_LOCALES = ['en', 'pt'];

@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async getProfile(@Query('locale') locale?: string) {
    const resolvedLocale = SUPPORTED_LOCALES.includes(locale ?? '') ? locale! : 'en';
    const profile = await this.profileService.getProfile(resolvedLocale);
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

  @Get('translations/:locale')
  @HttpCode(HttpStatus.OK)
  @UseGuards(FirebaseAuthGuard)
  async getTranslation(@Param('locale') locale: string) {
    const translation = await this.profileService.getTranslation(locale);
    return { data: translation, message: 'Tradução obtida com sucesso.' };
  }

  @Put('translations/:locale')
  @HttpCode(HttpStatus.OK)
  @UseGuards(FirebaseAuthGuard)
  async upsertTranslation(@Param('locale') locale: string, @Body() body: unknown) {
    if (!SUPPORTED_LOCALES.includes(locale)) throw new BadRequestException('Locale inválido.');
    const result = UpsertProfileTranslationSchema.safeParse(body);
    if (!result.success) {
      const message = result.error.issues.map((e) => e.message).join(', ');
      throw new BadRequestException(message);
    }
    const translation = await this.profileService.upsertTranslation(locale, result.data);
    return { data: translation, message: 'Tradução salva com sucesso.' };
  }
}

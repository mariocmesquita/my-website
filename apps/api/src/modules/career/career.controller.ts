import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';

import { FirebaseAuthGuard } from '@common/guards/firebase-auth.guard';
import {
  CreateCareerSchema,
  UpdateCareerSchema,
  UpsertCareerTranslationSchema,
} from './career.schema';
import { CareerService } from './career.service';

const SUPPORTED_LOCALES = ['en', 'pt'];

@Controller('career')
export class CareerController {
  constructor(private readonly careerService: CareerService) {}

  @Get('admin')
  @HttpCode(HttpStatus.OK)
  @UseGuards(FirebaseAuthGuard)
  async getCareersAdmin() {
    const careers = await this.careerService.getCareersAdmin();
    return { data: careers, message: 'Carreiras obtidas com sucesso.' };
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async getCareers(@Query('locale') locale?: string) {
    const resolvedLocale = SUPPORTED_LOCALES.includes(locale ?? '') ? locale! : 'en';
    const careers = await this.careerService.getCareers(resolvedLocale);
    return { data: careers, message: 'Carreiras obtidas com sucesso.' };
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(FirebaseAuthGuard)
  async createCareer(@Body() body: unknown) {
    const result = CreateCareerSchema.safeParse(body);
    if (!result.success) {
      const message = result.error.issues.map((e) => e.message).join(', ');
      throw new BadRequestException(message);
    }
    const career = await this.careerService.createCareer(result.data);
    return { data: career, message: 'Carreira criada com sucesso.' };
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @UseGuards(FirebaseAuthGuard)
  async updateCareer(@Param('id') id: string, @Body() body: unknown) {
    const result = UpdateCareerSchema.safeParse(body);
    if (!result.success) {
      const message = result.error.issues.map((e) => e.message).join(', ');
      throw new BadRequestException(message);
    }
    const career = await this.careerService.updateCareer(id, result.data);
    return { data: career, message: 'Carreira atualizada com sucesso.' };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(FirebaseAuthGuard)
  async deleteCareer(@Param('id') id: string) {
    await this.careerService.deleteCareer(id);
  }

  @Get(':id/translations/:locale')
  @HttpCode(HttpStatus.OK)
  @UseGuards(FirebaseAuthGuard)
  async getTranslation(@Param('id') id: string, @Param('locale') locale: string) {
    const translation = await this.careerService.getTranslation(id, locale);
    return { data: translation, message: 'Tradução obtida com sucesso.' };
  }

  @Put(':id/translations/:locale')
  @HttpCode(HttpStatus.OK)
  @UseGuards(FirebaseAuthGuard)
  async upsertTranslation(
    @Param('id') id: string,
    @Param('locale') locale: string,
    @Body() body: unknown,
  ) {
    if (!SUPPORTED_LOCALES.includes(locale)) throw new BadRequestException('Locale inválido.');
    const result = UpsertCareerTranslationSchema.safeParse(body);
    if (!result.success) {
      const message = result.error.issues.map((e) => e.message).join(', ');
      throw new BadRequestException(message);
    }
    const translation = await this.careerService.upsertTranslation(id, locale, result.data);
    return { data: translation, message: 'Tradução salva com sucesso.' };
  }
}

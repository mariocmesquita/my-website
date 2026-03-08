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
import { type Career, type CareerTranslation } from '@generated/prisma';

import { ApiResponse } from '@common/api-response';
import { FirebaseAuthGuard } from '@common/guards/firebase-auth.guard';
import { isValidLocale, resolveLocale } from '@common/locales';
import { ZodValidationPipe } from '@common/pipes/zod-validation.pipe';
import {
  CreateCareerSchema,
  UpdateCareerSchema,
  UpsertCareerTranslationSchema,
  type CareerRow,
  type CareerTranslationRow,
  type CreateCareerInput,
  type UpdateCareerInput,
  type UpsertCareerTranslationInput,
} from './career.schema';
import { CareerService } from './career.service';

@Controller('career')
export class CareerController {
  constructor(private readonly careerService: CareerService) {}

  @Get('admin')
  @HttpCode(HttpStatus.OK)
  @UseGuards(FirebaseAuthGuard)
  async getCareersAdmin(): Promise<ApiResponse<CareerRow[]>> {
    const careers = await this.careerService.getCareersAdmin();
    return { data: careers, message: 'Carreiras obtidas com sucesso.' };
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async getCareers(@Query('locale') locale?: string): Promise<ApiResponse<CareerRow[]>> {
    const resolvedLocale = resolveLocale(locale);
    const careers = await this.careerService.getCareers(resolvedLocale);
    return { data: careers, message: 'Carreiras obtidas com sucesso.' };
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(FirebaseAuthGuard)
  async createCareer(
    @Body(new ZodValidationPipe(CreateCareerSchema)) body: CreateCareerInput,
  ): Promise<ApiResponse<Career>> {
    const career = await this.careerService.createCareer(body);
    return { data: career, message: 'Carreira criada com sucesso.' };
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @UseGuards(FirebaseAuthGuard)
  async updateCareer(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(UpdateCareerSchema)) body: UpdateCareerInput,
  ): Promise<ApiResponse<Career>> {
    const career = await this.careerService.updateCareer(id, body);
    return { data: career, message: 'Carreira atualizada com sucesso.' };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(FirebaseAuthGuard)
  async deleteCareer(@Param('id') id: string): Promise<void> {
    await this.careerService.deleteCareer(id);
  }

  @Get(':id/translations/:locale')
  @HttpCode(HttpStatus.OK)
  @UseGuards(FirebaseAuthGuard)
  async getTranslation(
    @Param('id') id: string,
    @Param('locale') locale: string,
  ): Promise<ApiResponse<CareerTranslationRow>> {
    const translation = await this.careerService.getTranslation(id, locale);
    return { data: translation, message: 'Tradução obtida com sucesso.' };
  }

  @Put(':id/translations/:locale')
  @HttpCode(HttpStatus.OK)
  @UseGuards(FirebaseAuthGuard)
  async upsertTranslation(
    @Param('id') id: string,
    @Param('locale') locale: string,
    @Body(new ZodValidationPipe(UpsertCareerTranslationSchema)) body: UpsertCareerTranslationInput,
  ): Promise<ApiResponse<CareerTranslation>> {
    if (!isValidLocale(locale)) throw new BadRequestException('Locale inválido.');
    const translation = await this.careerService.upsertTranslation(id, locale, body);
    return { data: translation, message: 'Tradução salva com sucesso.' };
  }
}

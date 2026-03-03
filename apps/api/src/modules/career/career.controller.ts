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
  UseGuards,
} from '@nestjs/common';

import { FirebaseAuthGuard } from '@common/guards/firebase-auth.guard';
import { CreateCareerSchema, UpdateCareerSchema } from './career.schema';
import { CareerService } from './career.service';

@Controller('career')
export class CareerController {
  constructor(private readonly careerService: CareerService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async getCareers() {
    const careers = await this.careerService.getCareers();
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
}

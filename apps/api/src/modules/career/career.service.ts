import { Injectable, Logger, NotFoundException } from '@nestjs/common';

import {
  type CreateCareerInput,
  type UpdateCareerInput,
  type UpsertCareerTranslationInput,
} from './career.schema';
import { CareerRepository } from './career.repository';

@Injectable()
export class CareerService {
  private readonly logger = new Logger(CareerService.name);

  constructor(private readonly careerRepository: CareerRepository) {}

  getCareers(locale = 'en') {
    return this.careerRepository.findAll(locale);
  }

  getCareersAdmin() {
    return this.careerRepository.findAllAdmin();
  }

  async createCareer(data: CreateCareerInput) {
    this.logger.log('Criando entrada de carreira.');
    return this.careerRepository.create(data);
  }

  async updateCareer(id: string, data: UpdateCareerInput) {
    this.logger.log(`Atualizando carreira: ${id}`);
    try {
      return await this.careerRepository.update(id, data);
    } catch {
      throw new NotFoundException('Entrada de carreira não encontrada.');
    }
  }

  async deleteCareer(id: string): Promise<void> {
    this.logger.log(`Removendo carreira: ${id}`);
    try {
      await this.careerRepository.delete(id);
    } catch {
      throw new NotFoundException('Entrada de carreira não encontrada.');
    }
  }

  async getTranslation(id: string, locale: string) {
    return this.careerRepository.findTranslation(id, locale);
  }

  async upsertTranslation(id: string, locale: string, data: UpsertCareerTranslationInput) {
    this.logger.log(`Salvando tradução de carreira ${id}: ${locale}`);
    return this.careerRepository.upsertTranslation(id, locale, data);
  }
}

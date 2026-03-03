import { Injectable, Logger, NotFoundException } from '@nestjs/common';

import { type Career } from '@generated/prisma';
import { type CreateCareerInput, type UpdateCareerInput } from './career.schema';
import { CareerRepository } from './career.repository';

@Injectable()
export class CareerService {
  private readonly logger = new Logger(CareerService.name);

  constructor(private readonly careerRepository: CareerRepository) {}

  getCareers(): Promise<Career[]> {
    return this.careerRepository.findAll();
  }

  async createCareer(data: CreateCareerInput): Promise<Career> {
    this.logger.log('Criando entrada de carreira.');
    return this.careerRepository.create(data);
  }

  async updateCareer(id: string, data: UpdateCareerInput): Promise<Career> {
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
}

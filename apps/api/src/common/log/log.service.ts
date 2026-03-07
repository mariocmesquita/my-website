import { Injectable, Logger } from '@nestjs/common';

import { type CreateLogInput, LogRepository } from './log.repository';

@Injectable()
export class LogService {
  private readonly logger = new Logger(LogService.name);

  constructor(private readonly logRepository: LogRepository) {}

  async create(input: CreateLogInput): Promise<void> {
    if (input.level === 'error') {
      this.logger.error(`[${input.eventType}] ${input.message}`);
    } else {
      this.logger.warn(`[${input.eventType}] ${input.message}`);
    }
    await this.logRepository.create(input);
  }

  getLogs(page: number, limit: number) {
    return this.logRepository.findMany(page, limit);
  }
}

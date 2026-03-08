import { Controller, Get, HttpCode, HttpStatus, Query, UseGuards } from '@nestjs/common';
import { type AppLog } from '@generated/prisma';

import { ApiResponse } from '@common/api-response';
import { FirebaseAuthGuard } from '@common/guards/firebase-auth.guard';
import { LogService } from './log.service';

@Controller('logs')
export class LogController {
  constructor(private readonly logService: LogService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @UseGuards(FirebaseAuthGuard)
  async getLogs(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ): Promise<ApiResponse<{ items: AppLog[]; total: number; page: number; limit: number }>> {
    const pageNum = Math.max(1, parseInt(page ?? '1', 10) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(limit ?? '50', 10) || 50));
    const result = await this.logService.getLogs(pageNum, limitNum);
    return {
      data: { items: result.items, total: result.total, page: pageNum, limit: limitNum },
      message: 'Logs obtidos com sucesso.',
    };
  }
}

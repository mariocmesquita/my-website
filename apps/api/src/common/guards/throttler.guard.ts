import { ExecutionContext, Inject, Injectable } from '@nestjs/common';
import { ThrottlerException, ThrottlerGuard } from '@nestjs/throttler';
import { Request } from 'express';

import { LogService } from '@common/log/log.service';

@Injectable()
export class AppThrottlerGuard extends ThrottlerGuard {
  @Inject(LogService)
  private readonly logService!: LogService;

  protected async throwThrottlingException(context: ExecutionContext): Promise<void> {
    const request = context.switchToHttp().getRequest<Request>();
    void this.logService.create({
      level: 'security',
      eventType: 'RATE_LIMIT',
      message: 'Limite de requisições excedido.',
      ip: request.ip ?? (request.headers['x-forwarded-for'] as string),
      method: request.method,
      path: request.path,
      userAgent: request.headers['user-agent'],
    });
    throw new ThrottlerException('Muitas requisições. Tente novamente em breve.');
  }
}

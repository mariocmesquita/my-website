import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

import { LogService } from '@common/log/log.service';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  constructor(private readonly logService: LogService) {}

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status: number;
    let body: object;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const res = exception.getResponse();
      body = typeof res === 'string' ? { statusCode: status, message: res } : (res as object);
    } else {
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      body = { statusCode: 500, message: 'Erro interno do servidor.' };
      this.logger.error(
        exception instanceof Error ? exception.message : 'Exceção desconhecida',
        exception instanceof Error ? exception.stack : undefined,
      );
    }

    if (status >= 500) {
      const message = exception instanceof Error ? exception.message : 'Erro interno do servidor.';
      void this.logService.create({
        level: 'error',
        eventType: 'INTERNAL_ERROR',
        message,
        ip: request.ip ?? (request.headers['x-forwarded-for'] as string),
        method: request.method,
        path: request.path,
        userAgent: request.headers['user-agent'],
      });
    }

    response.status(status).json(body);
  }
}

import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import * as admin from 'firebase-admin';

import { LogService } from '@common/log/log.service';

@Injectable()
export class FirebaseAuthGuard implements CanActivate {
  constructor(private readonly logService: LogService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      void this.logService.create({
        level: 'security',
        eventType: 'AUTH_FAILURE',
        message: 'Token de autenticação não fornecido.',
        ip: request.ip ?? (request.headers['x-forwarded-for'] as string),
        method: request.method,
        path: request.path,
        userAgent: request.headers['user-agent'],
      });
      throw new UnauthorizedException('Token de autenticação não fornecido.');
    }

    try {
      const decodedToken = await admin.auth().verifyIdToken(token);
      request['user'] = decodedToken;
      return true;
    } catch {
      void this.logService.create({
        level: 'security',
        eventType: 'AUTH_FAILURE',
        message: 'Token de autenticação inválido ou expirado.',
        ip: request.ip ?? (request.headers['x-forwarded-for'] as string),
        method: request.method,
        path: request.path,
        userAgent: request.headers['user-agent'],
      });
      throw new UnauthorizedException('Token de autenticação inválido ou expirado.');
    }
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}

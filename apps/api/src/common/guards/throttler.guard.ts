import { ExecutionContext, Injectable } from '@nestjs/common';
import { ThrottlerException, ThrottlerGuard } from '@nestjs/throttler';

@Injectable()
export class AppThrottlerGuard extends ThrottlerGuard {
  protected throwThrottlingException(_context: ExecutionContext): Promise<void> {
    throw new ThrottlerException('Muitas requisições. Tente novamente em breve.');
  }
}

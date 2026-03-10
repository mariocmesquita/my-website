import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  constructor() {}

  @Get('health')
  health(): object {
    return { status: 'ok' };
  }
}

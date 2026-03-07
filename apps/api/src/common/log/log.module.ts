import { Global, Module } from '@nestjs/common';

import { FirebaseModule } from '@common/firebase/firebase.module';
import { LogController } from './log.controller';
import { LogRepository } from './log.repository';
import { LogService } from './log.service';

@Global()
@Module({
  imports: [FirebaseModule],
  controllers: [LogController],
  providers: [LogService, LogRepository],
  exports: [LogService],
})
export class LogModule {}

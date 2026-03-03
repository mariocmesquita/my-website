import { Module } from '@nestjs/common';

import { FirebaseModule } from '@common/firebase/firebase.module';
import { CareerController } from './career.controller';
import { CareerRepository } from './career.repository';
import { CareerService } from './career.service';

@Module({
  imports: [FirebaseModule],
  controllers: [CareerController],
  providers: [CareerService, CareerRepository],
})
export class CareerModule {}

import { Module } from '@nestjs/common';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { ThrottlerModule } from '@nestjs/throttler';

import { AllExceptionsFilter } from '@common/filters/all-exceptions.filter';
import { AppThrottlerGuard } from '@common/guards/throttler.guard';
import { FirebaseModule } from '@common/firebase/firebase.module';
import { LogModule } from '@common/log/log.module';
import { PrismaModule } from '@common/prisma/prisma.module';
import { CareerModule } from '@/modules/career/career.module';
import { PostModule } from '@/modules/post/post.module';
import { ProfileModule } from '@/modules/profile/profile.module';
import { ProjectModule } from '@/modules/project/project.module';
import { AppController } from './app.controller';

@Module({
  imports: [
    ThrottlerModule.forRoot([{ ttl: 60000, limit: 60 }]),
    PrismaModule,
    LogModule,
    FirebaseModule,
    ProfileModule,
    CareerModule,
    ProjectModule,
    PostModule,
  ],
  controllers: [AppController],
  providers: [
    { provide: APP_GUARD, useClass: AppThrottlerGuard },
    { provide: APP_FILTER, useClass: AllExceptionsFilter },
  ],
})
export class AppModule {}

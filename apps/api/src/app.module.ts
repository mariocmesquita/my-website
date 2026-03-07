import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerModule } from '@nestjs/throttler';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AppThrottlerGuard } from '@common/guards/throttler.guard';
import { PrismaModule } from '@common/prisma/prisma.module';
import { FirebaseModule } from '@common/firebase/firebase.module';
import { CareerModule } from '@/modules/career/career.module';
import { PostModule } from '@/modules/post/post.module';
import { ProfileModule } from '@/modules/profile/profile.module';
import { ProjectModule } from '@/modules/project/project.module';

@Module({
  imports: [
    ThrottlerModule.forRoot([{ ttl: 60000, limit: 60 }]),
    PrismaModule,
    FirebaseModule,
    ProfileModule,
    CareerModule,
    ProjectModule,
    PostModule,
  ],
  controllers: [AppController],
  providers: [AppService, { provide: APP_GUARD, useClass: AppThrottlerGuard }],
})
export class AppModule {}

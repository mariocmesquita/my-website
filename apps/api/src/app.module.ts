import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from '@common/prisma/prisma.module';
import { FirebaseModule } from '@common/firebase/firebase.module';
import { CareerModule } from '@/modules/career/career.module';
import { PostModule } from '@/modules/post/post.module';
import { ProfileModule } from '@/modules/profile/profile.module';
import { ProjectModule } from '@/modules/project/project.module';

@Module({
  imports: [PrismaModule, FirebaseModule, ProfileModule, CareerModule, ProjectModule, PostModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from '@common/prisma/prisma.module';
import { FirebaseModule } from '@common/firebase/firebase.module';
import { ProfileModule } from '@/modules/profile/profile.module';

@Module({
  imports: [PrismaModule, FirebaseModule, ProfileModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

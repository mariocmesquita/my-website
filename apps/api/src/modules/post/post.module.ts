import { Module } from '@nestjs/common';

import { FirebaseModule } from '@common/firebase/firebase.module';
import { PostController } from './post.controller';
import { PostRepository } from './post.repository';
import { PostService } from './post.service';

@Module({
  imports: [FirebaseModule],
  controllers: [PostController],
  providers: [PostService, PostRepository],
})
export class PostModule {}

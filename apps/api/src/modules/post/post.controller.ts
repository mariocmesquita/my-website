import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import { FirebaseAuthGuard } from '@common/guards/firebase-auth.guard';
import { CreatePostSchema, LikePostSchema, UpdatePostSchema } from './post.schema';
import { PostService } from './post.service';

@Controller('posts')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async getPublishedList() {
    const posts = await this.postService.getPublishedList();
    return { data: posts, message: 'Posts obtidos com sucesso.' };
  }

  @Get('admin')
  @HttpCode(HttpStatus.OK)
  @UseGuards(FirebaseAuthGuard)
  async getAllPosts() {
    const posts = await this.postService.getAll();
    return { data: posts, message: 'Posts obtidos com sucesso.' };
  }

  @Get('admin/:id')
  @HttpCode(HttpStatus.OK)
  @UseGuards(FirebaseAuthGuard)
  async getPostById(@Param('id') id: string) {
    const post = await this.postService.getById(id);
    return { data: post, message: 'Post obtido com sucesso.' };
  }

  @Get(':slug')
  @HttpCode(HttpStatus.OK)
  async getPostDetail(@Param('slug') slug: string, @Headers('x-visitor-id') visitorId?: string) {
    const post = await this.postService.getPublishedDetail(slug, visitorId);
    return { data: post, message: 'Post obtido com sucesso.' };
  }

  @Post(':slug/like')
  @HttpCode(HttpStatus.OK)
  async likePost(@Param('slug') slug: string, @Body() body: unknown) {
    const result = LikePostSchema.safeParse(body);
    if (!result.success) {
      const message = result.error.issues.map((e) => e.message).join(', ');
      throw new BadRequestException(message);
    }
    const { likesCount } = await this.postService.likePost(slug, result.data.visitorId);
    return { data: { likesCount, liked: true }, message: 'Post curtido com sucesso.' };
  }

  @Post('upload')
  @HttpCode(HttpStatus.OK)
  @UseGuards(FirebaseAuthGuard)
  @UseInterceptors(FileInterceptor('file', { limits: { fileSize: 5 * 1024 * 1024 } }))
  async uploadFile(@UploadedFile() file: Express.Multer.File, @Query('type') _type: string) {
    if (!file) throw new BadRequestException('Arquivo não enviado.');

    const ALLOWED_MIMETYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!ALLOWED_MIMETYPES.includes(file.mimetype)) {
      throw new BadRequestException('Formato inválido. Use JPG, PNG, WebP ou GIF.');
    }

    const url = await this.postService.uploadFile(file.buffer, file.mimetype, file.originalname);
    return { data: { url }, message: 'Arquivo enviado com sucesso.' };
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(FirebaseAuthGuard)
  async createPost(@Body() body: unknown) {
    const result = CreatePostSchema.safeParse(body);
    if (!result.success) {
      const message = result.error.issues.map((e) => e.message).join(', ');
      throw new BadRequestException(message);
    }
    const post = await this.postService.createPost(result.data);
    return { data: post, message: 'Post criado com sucesso.' };
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @UseGuards(FirebaseAuthGuard)
  async updatePost(@Param('id') id: string, @Body() body: unknown) {
    const result = UpdatePostSchema.safeParse(body);
    if (!result.success) {
      const message = result.error.issues.map((e) => e.message).join(', ');
      throw new BadRequestException(message);
    }
    const post = await this.postService.updatePost(id, result.data);
    return { data: post, message: 'Post atualizado com sucesso.' };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(FirebaseAuthGuard)
  async deletePost(@Param('id') id: string) {
    await this.postService.deletePost(id);
  }
}

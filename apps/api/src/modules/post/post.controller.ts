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
  Put,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { type PostTranslation } from '@generated/prisma';
import { FileInterceptor } from '@nestjs/platform-express';
import { Throttle } from '@nestjs/throttler';

import { ApiResponse } from '@common/api-response';
import { FirebaseAuthGuard } from '@common/guards/firebase-auth.guard';
import { isValidLocale, resolveLocale } from '@common/locales';
import { ZodValidationPipe } from '@common/pipes/zod-validation.pipe';
import {
  CreatePostSchema,
  LikePostSchema,
  UpdatePostSchema,
  UpsertPostTranslationSchema,
  type CreatePostInput,
  type LikePostInput,
  type PostAdminRow,
  type PostDetailRow,
  type PostListRow,
  type PostTranslationRow,
  type PostWithRelations,
  type UpdatePostInput,
  type UpsertPostTranslationInput,
} from './post.schema';
import { PostService } from './post.service';

@Controller('posts')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async getPublishedList(@Query('locale') locale?: string): Promise<ApiResponse<PostListRow[]>> {
    const resolvedLocale = resolveLocale(locale);
    const posts = await this.postService.getPublishedList(resolvedLocale);
    return { data: posts, message: 'Posts obtidos com sucesso.' };
  }

  @Get('admin')
  @HttpCode(HttpStatus.OK)
  @UseGuards(FirebaseAuthGuard)
  async getAllPosts(): Promise<ApiResponse<PostAdminRow[]>> {
    const posts = await this.postService.getAll();
    return { data: posts, message: 'Posts obtidos com sucesso.' };
  }

  @Get('admin/:id')
  @HttpCode(HttpStatus.OK)
  @UseGuards(FirebaseAuthGuard)
  async getPostById(@Param('id') id: string): Promise<ApiResponse<PostWithRelations>> {
    const post = await this.postService.getById(id);
    return { data: post, message: 'Post obtido com sucesso.' };
  }

  @Get(':slug')
  @HttpCode(HttpStatus.OK)
  async getPostDetail(
    @Param('slug') slug: string,
    @Query('locale') locale?: string,
    @Headers('x-visitor-id') visitorId?: string,
  ): Promise<ApiResponse<PostDetailRow>> {
    const resolvedLocale = resolveLocale(locale);
    const post = await this.postService.getPublishedDetail(slug, resolvedLocale, visitorId);
    return { data: post, message: 'Post obtido com sucesso.' };
  }

  @Post(':slug/like')
  @HttpCode(HttpStatus.OK)
  @Throttle({ default: { ttl: 60000, limit: 5 } })
  async likePost(
    @Param('slug') slug: string,
    @Body(new ZodValidationPipe(LikePostSchema)) body: LikePostInput,
  ): Promise<ApiResponse<{ likesCount: number; liked: boolean }>> {
    const { likesCount } = await this.postService.likePost(slug, body.visitorId);
    return { data: { likesCount, liked: true }, message: 'Post curtido com sucesso.' };
  }

  @Post('upload')
  @HttpCode(HttpStatus.OK)
  @UseGuards(FirebaseAuthGuard)
  @UseInterceptors(FileInterceptor('file', { limits: { fileSize: 5 * 1024 * 1024 } }))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Query('type') _type: string,
  ): Promise<ApiResponse<{ url: string }>> {
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
  async createPost(
    @Body(new ZodValidationPipe(CreatePostSchema)) body: CreatePostInput,
  ): Promise<ApiResponse<PostWithRelations>> {
    const post = await this.postService.createPost(body);
    return { data: post, message: 'Post criado com sucesso.' };
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @UseGuards(FirebaseAuthGuard)
  async updatePost(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(UpdatePostSchema)) body: UpdatePostInput,
  ): Promise<ApiResponse<PostWithRelations>> {
    const post = await this.postService.updatePost(id, body);
    return { data: post, message: 'Post atualizado com sucesso.' };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(FirebaseAuthGuard)
  async deletePost(@Param('id') id: string): Promise<void> {
    await this.postService.deletePost(id);
  }

  @Get(':id/translations/:locale')
  @HttpCode(HttpStatus.OK)
  @UseGuards(FirebaseAuthGuard)
  async getTranslation(
    @Param('id') id: string,
    @Param('locale') locale: string,
  ): Promise<ApiResponse<PostTranslationRow>> {
    const translation = await this.postService.getTranslation(id, locale);
    return { data: translation, message: 'Tradução obtida com sucesso.' };
  }

  @Put(':id/translations/:locale')
  @HttpCode(HttpStatus.OK)
  @UseGuards(FirebaseAuthGuard)
  async upsertTranslation(
    @Param('id') id: string,
    @Param('locale') locale: string,
    @Body(new ZodValidationPipe(UpsertPostTranslationSchema)) body: UpsertPostTranslationInput,
  ): Promise<ApiResponse<PostTranslation>> {
    if (!isValidLocale(locale)) throw new BadRequestException('Locale inválido.');
    const translation = await this.postService.upsertTranslation(id, locale, body);
    return { data: translation, message: 'Tradução salva com sucesso.' };
  }
}

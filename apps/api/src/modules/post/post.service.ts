import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { type PostTranslation } from '@generated/prisma';
import { getStorage } from 'firebase-admin/storage';
import * as path from 'path';
import { uuidv7 } from 'uuidv7';

import { env } from '@my-website/env';
import {
  type CreatePostInput,
  type PostAdminRow,
  type PostDetailRow,
  type PostListRow,
  type PostTranslationRow,
  type PostWithRelations,
  type UpdatePostInput,
  type UpsertPostTranslationInput,
} from './post.schema';
import { PostRepository } from './post.repository';

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

@Injectable()
export class PostService {
  private readonly logger = new Logger(PostService.name);

  constructor(private readonly postRepository: PostRepository) {}

  getPublishedList(locale = 'en'): Promise<PostListRow[]> {
    return this.postRepository.findPublishedList(locale);
  }

  async getPublishedDetail(
    slug: string,
    locale = 'en',
    visitorId?: string,
  ): Promise<PostDetailRow> {
    const post = await this.postRepository.findPublishedDetail(slug, locale, visitorId);
    if (!post) throw new NotFoundException('Post não encontrado.');
    return post;
  }

  async likePost(slug: string, visitorId: string): Promise<{ likesCount: number }> {
    const post = await this.postRepository.findPublishedId(slug);
    if (!post) throw new NotFoundException('Post não encontrado.');
    return this.postRepository.likePost(post.id, visitorId);
  }

  getAll(): Promise<PostAdminRow[]> {
    return this.postRepository.findAll();
  }

  async getById(id: string): Promise<PostWithRelations> {
    const post = await this.postRepository.findById(id);
    if (!post) throw new NotFoundException('Post não encontrado.');
    return post;
  }

  async uploadFile(buffer: Buffer, mimetype: string, originalName: string): Promise<string> {
    this.logger.log(`Fazendo upload de banner de post.`);
    const ext = path.extname(originalName) || '.jpg';
    const fileName = `posts/banners/${uuidv7()}${ext}`;
    const bucket = getStorage().bucket(env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET);
    const file = bucket.file(fileName);
    await file.save(buffer, { metadata: { contentType: mimetype } });
    const encodedPath = encodeURIComponent(fileName);
    return `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodedPath}?alt=media`;
  }

  async createPost(data: CreatePostInput): Promise<PostWithRelations> {
    this.logger.log(`Criando post: ${data.title}`);
    const baseSlug = slugify(data.title);
    const slug = await this.ensureUniqueSlug(baseSlug);
    return this.postRepository.create(data, slug);
  }

  async updatePost(id: string, data: UpdatePostInput): Promise<PostWithRelations> {
    this.logger.log(`Atualizando post: ${id}`);
    try {
      return await this.postRepository.update(id, data);
    } catch {
      throw new NotFoundException('Post não encontrado.');
    }
  }

  async deletePost(id: string): Promise<void> {
    this.logger.log(`Removendo post: ${id}`);
    try {
      await this.postRepository.delete(id);
    } catch {
      throw new NotFoundException('Post não encontrado.');
    }
  }

  async getTranslation(id: string, locale: string): Promise<PostTranslationRow> {
    return this.postRepository.findTranslation(id, locale);
  }

  async upsertTranslation(
    id: string,
    locale: string,
    data: UpsertPostTranslationInput,
  ): Promise<PostTranslation> {
    this.logger.log(`Salvando tradução de post ${id}: ${locale}`);
    return this.postRepository.upsertTranslation(id, locale, data);
  }

  private async ensureUniqueSlug(base: string): Promise<string> {
    let slug = base;
    let counter = 2;
    while (await this.postRepository.findBySlug(slug)) {
      slug = `${base}-${counter}`;
      counter++;
    }
    return slug;
  }
}

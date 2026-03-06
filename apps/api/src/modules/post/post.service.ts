import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { getStorage } from 'firebase-admin/storage';
import * as path from 'path';
import { uuidv7 } from 'uuidv7';

import { env } from '@my-website/env';
import { type CreatePostInput, type UpdatePostInput } from './post.schema';
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

  getPublishedList() {
    return this.postRepository.findPublishedList();
  }

  async getPublishedDetail(slug: string) {
    const post = await this.postRepository.findPublishedDetail(slug);
    if (!post) throw new NotFoundException('Post não encontrado.');
    return post;
  }

  getAll() {
    return this.postRepository.findAll();
  }

  async getById(id: string) {
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

  async createPost(data: CreatePostInput) {
    this.logger.log(`Criando post: ${data.title}`);
    const baseSlug = slugify(data.title);
    const slug = await this.ensureUniqueSlug(baseSlug);
    return this.postRepository.create(data, slug);
  }

  async updatePost(id: string, data: UpdatePostInput) {
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

import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { type ProjectTranslation } from '@generated/prisma';
import { getStorage } from 'firebase-admin/storage';
import * as path from 'path';
import { uuidv7 } from 'uuidv7';

import { env } from '@my-website/env';
import {
  type CreateProjectInput,
  type ProjectAdminRow,
  type ProjectDetailRow,
  type ProjectListRow,
  type ProjectTranslationRow,
  type ProjectWithRelations,
  type UpdateProjectInput,
  type UpsertProjectTranslationInput,
} from './project.schema';
import { ProjectRepository } from './project.repository';

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
export class ProjectService {
  private readonly logger = new Logger(ProjectService.name);

  constructor(private readonly projectRepository: ProjectRepository) {}

  getPublishedList(locale = 'en'): Promise<ProjectListRow[]> {
    return this.projectRepository.findPublishedList(locale);
  }

  async getPublishedDetail(slug: string, locale = 'en'): Promise<ProjectDetailRow> {
    const project = await this.projectRepository.findPublishedDetail(slug, locale);
    if (!project) throw new NotFoundException('Projeto não encontrado.');
    return project;
  }

  getAll(): Promise<ProjectAdminRow[]> {
    return this.projectRepository.findAll();
  }

  async getById(id: string): Promise<ProjectWithRelations> {
    const project = await this.projectRepository.findById(id);
    if (!project) throw new NotFoundException('Projeto não encontrado.');
    return project;
  }

  async uploadFile(
    buffer: Buffer,
    mimetype: string,
    originalName: string,
    folder: 'banners' | 'screenshots',
  ): Promise<string> {
    this.logger.log(`Fazendo upload de arquivo para projects/${folder}.`);
    const ext = path.extname(originalName) || '.jpg';
    const fileName = `projects/${folder}/${uuidv7()}${ext}`;
    const bucket = getStorage().bucket(env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET);
    const file = bucket.file(fileName);
    await file.save(buffer, { metadata: { contentType: mimetype } });
    const encodedPath = encodeURIComponent(fileName);
    return `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodedPath}?alt=media`;
  }

  async createProject(data: CreateProjectInput): Promise<ProjectWithRelations> {
    this.logger.log(`Criando projeto: ${data.title}`);
    const baseSlug = slugify(data.title);
    const slug = await this.ensureUniqueSlug(baseSlug);
    return this.projectRepository.create(data, slug);
  }

  async updateProject(id: string, data: UpdateProjectInput): Promise<ProjectWithRelations> {
    this.logger.log(`Atualizando projeto: ${id}`);
    try {
      return await this.projectRepository.update(id, data);
    } catch {
      throw new NotFoundException('Projeto não encontrado.');
    }
  }

  async deleteProject(id: string): Promise<void> {
    this.logger.log(`Removendo projeto: ${id}`);
    try {
      await this.projectRepository.delete(id);
    } catch {
      throw new NotFoundException('Projeto não encontrado.');
    }
  }

  async getTranslation(id: string, locale: string): Promise<ProjectTranslationRow> {
    return this.projectRepository.findTranslation(id, locale);
  }

  async upsertTranslation(
    id: string,
    locale: string,
    data: UpsertProjectTranslationInput,
  ): Promise<ProjectTranslation> {
    this.logger.log(`Salvando tradução de projeto ${id}: ${locale}`);
    return this.projectRepository.upsertTranslation(id, locale, data);
  }

  private async ensureUniqueSlug(base: string): Promise<string> {
    let slug = base;
    let counter = 2;
    while (await this.projectRepository.findBySlug(slug)) {
      slug = `${base}-${counter}`;
      counter++;
    }
    return slug;
  }
}

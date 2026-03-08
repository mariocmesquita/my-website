import { Injectable } from '@nestjs/common';
import { type Project, type ProjectTranslation } from '@generated/prisma';
import { uuidv7 } from 'uuidv7';

import { PrismaService } from '@common/prisma/prisma.service';
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

@Injectable()
export class ProjectRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findPublishedList(locale = 'en'): Promise<ProjectListRow[]> {
    const projects = await this.prisma.project.findMany({
      where: { archived: false, publishDate: { lte: new Date() } },
      orderBy: { publishDate: 'desc' },
      select: {
        id: true,
        slug: true,
        title: true,
        summary: true,
        techStack: true,
        bannerImage: true,
        githubLink: true,
        translations: { where: { locale }, select: { title: true, summary: true } },
      },
    });
    return projects.map(({ translations, ...base }) => {
      const t = translations[0];
      if (locale === 'en' || !t) return { ...base, translated: locale === 'en' };
      return { ...base, title: t.title, summary: t.summary, translated: true };
    });
  }

  async findPublishedDetail(slug: string, locale = 'en'): Promise<ProjectDetailRow | null> {
    const project = await this.prisma.project.findFirst({
      where: { slug, archived: false, publishDate: { lte: new Date() } },
      select: {
        id: true,
        slug: true,
        title: true,
        summary: true,
        description: true,
        techStack: true,
        bannerImage: true,
        screenshots: true,
        githubLink: true,
        publishDate: true,
        posts: { select: { postId: true } },
        translations: {
          where: { locale },
          select: { title: true, summary: true, description: true },
        },
      },
    });
    if (!project) return null;
    const { posts, translations, ...rest } = project;
    const t = translations[0];
    const base = { ...rest, relatedPostIds: posts.map((p) => p.postId) };
    if (locale === 'en' || !t) return { ...base, translated: locale === 'en' };
    return {
      ...base,
      title: t.title,
      summary: t.summary,
      description: t.description,
      translated: true,
    };
  }

  async findAll(): Promise<ProjectAdminRow[]> {
    const projects = await this.prisma.project.findMany({
      orderBy: { publishDate: 'desc' },
      include: {
        posts: { select: { postId: true } },
        translations: { where: { locale: 'pt' } },
      },
    });
    return projects.map(({ posts, translations, ...rest }) => ({
      ...rest,
      relatedPostIds: posts.map((p) => p.postId),
      translated: translations.length > 0,
    }));
  }

  async findById(id: string): Promise<ProjectWithRelations | null> {
    const project = await this.prisma.project.findUnique({
      where: { id },
      include: { posts: { select: { postId: true } } },
    });
    if (!project) return null;
    const { posts, ...rest } = project;
    return { ...rest, relatedPostIds: posts.map((p) => p.postId) };
  }

  findBySlug(slug: string): Promise<Project | null> {
    return this.prisma.project.findUnique({ where: { slug } });
  }

  async create(data: CreateProjectInput, slug: string): Promise<ProjectWithRelations> {
    const id = uuidv7();
    const project = await this.prisma.$transaction(async (tx) => {
      const created = await tx.project.create({
        data: {
          id,
          slug,
          title: data.title,
          summary: data.summary,
          description: data.description,
          techStack: data.techStack,
          bannerImage: data.bannerImage ?? null,
          screenshots: data.screenshots ?? [],
          githubLink: data.githubLink || null,
          publishDate: new Date(data.publishDate),
          archived: data.archived ?? false,
        },
      });
      if (data.relatedPostIds.length > 0) {
        await tx.postProject.createMany({
          data: data.relatedPostIds.map((postId) => ({ projectId: id, postId })),
        });
      }
      return created;
    });
    return { ...project, relatedPostIds: data.relatedPostIds };
  }

  async update(id: string, data: UpdateProjectInput): Promise<ProjectWithRelations> {
    const project = await this.prisma.$transaction(async (tx) => {
      const updated = await tx.project.update({
        where: { id },
        data: {
          title: data.title,
          summary: data.summary,
          description: data.description,
          techStack: data.techStack,
          bannerImage: data.bannerImage ?? null,
          screenshots: data.screenshots ?? [],
          githubLink: data.githubLink || null,
          publishDate: new Date(data.publishDate),
          archived: data.archived ?? false,
        },
      });
      await tx.postProject.deleteMany({ where: { projectId: id } });
      if (data.relatedPostIds.length > 0) {
        await tx.postProject.createMany({
          data: data.relatedPostIds.map((postId) => ({ projectId: id, postId })),
        });
      }
      return updated;
    });
    return { ...project, relatedPostIds: data.relatedPostIds };
  }

  delete(id: string): Promise<Project> {
    return this.prisma.project.delete({ where: { id } });
  }

  async findTranslation(id: string, locale: string): Promise<ProjectTranslationRow> {
    const translation = await this.prisma.projectTranslation.findUnique({
      where: { projectId_locale: { projectId: id, locale } },
    });
    if (!translation) return null;
    return {
      locale: translation.locale,
      title: translation.title,
      summary: translation.summary,
      description: translation.description,
    };
  }

  async upsertTranslation(
    id: string,
    locale: string,
    data: UpsertProjectTranslationInput,
  ): Promise<ProjectTranslation> {
    return this.prisma.projectTranslation.upsert({
      where: { projectId_locale: { projectId: id, locale } },
      create: { id: uuidv7(), projectId: id, locale, ...data },
      update: data,
    });
  }
}

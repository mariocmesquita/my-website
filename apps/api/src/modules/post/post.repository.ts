import { Injectable } from '@nestjs/common';
import { type Post, type PostTranslation } from '@generated/prisma';
import { uuidv7 } from 'uuidv7';

import { PrismaService } from '@common/prisma/prisma.service';
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

@Injectable()
export class PostRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findPublishedList(locale = 'en'): Promise<PostListRow[]> {
    const posts = await this.prisma.post.findMany({
      where: {
        status: 'published',
        OR: [{ publishDate: null }, { publishDate: { lte: new Date() } }],
      },
      orderBy: { publishDate: 'desc' },
      select: {
        id: true,
        slug: true,
        title: true,
        summary: true,
        tags: true,
        techStack: true,
        bannerImage: true,
        publishDate: true,
        _count: { select: { likes: true } },
        translations: { where: { locale }, select: { title: true, summary: true, tags: true } },
      },
    });
    return posts.map(({ _count, translations, ...rest }) => {
      const t = translations[0];
      const base = { ...rest, likesCount: _count.likes };
      if (locale === 'en' || !t) return { ...base, translated: locale === 'en' };
      return {
        ...base,
        title: t.title,
        summary: t.summary,
        tags: t.tags as string[],
        translated: true,
      };
    });
  }

  async findPublishedDetail(
    slug: string,
    locale = 'en',
    visitorId?: string,
  ): Promise<PostDetailRow | null> {
    const post = await this.prisma.post.findFirst({
      where: {
        slug,
        status: 'published',
        OR: [{ publishDate: null }, { publishDate: { lte: new Date() } }],
      },
      select: {
        id: true,
        slug: true,
        title: true,
        summary: true,
        content: true,
        tags: true,
        techStack: true,
        bannerImage: true,
        publishDate: true,
        projects: { select: { projectId: true } },
        _count: { select: { likes: true } },
        translations: {
          where: { locale },
          select: { title: true, summary: true, content: true, tags: true },
        },
      },
    });
    if (!post) return null;

    let viewerLiked = false;
    if (visitorId) {
      const like = await this.prisma.postLike.findUnique({
        where: { postId_visitorId: { postId: post.id, visitorId } },
        select: { postId: true },
      });
      viewerLiked = !!like;
    }

    const { projects, _count, translations, ...rest } = post;
    const t = translations[0];
    const base = {
      ...rest,
      relatedProjectIds: projects.map((p) => p.projectId),
      likesCount: _count.likes,
      viewer: { liked: viewerLiked },
    };
    if (locale === 'en' || !t) return { ...base, translated: locale === 'en' };
    return {
      ...base,
      title: t.title,
      summary: t.summary,
      content: t.content,
      tags: t.tags as string[],
      translated: true,
    };
  }

  findPublishedId(slug: string): Promise<{ id: string } | null> {
    return this.prisma.post.findFirst({
      where: {
        slug,
        status: 'published',
        OR: [{ publishDate: null }, { publishDate: { lte: new Date() } }],
      },
      select: { id: true },
    });
  }

  async likePost(postId: string, visitorId: string): Promise<{ likesCount: number }> {
    try {
      await this.prisma.postLike.create({ data: { id: uuidv7(), postId, visitorId } });
    } catch {
      // Violação de constraint unique — already liked, idempotente
    }
    const count = await this.prisma.postLike.count({ where: { postId } });
    return { likesCount: count };
  }

  async findAll(): Promise<PostAdminRow[]> {
    const posts = await this.prisma.post.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        projects: { select: { projectId: true } },
        translations: { where: { locale: 'pt' } },
      },
    });
    return posts.map(({ projects, translations, ...rest }) => ({
      ...rest,
      relatedProjectIds: projects.map((p) => p.projectId),
      translated: translations.length > 0,
    }));
  }

  async findById(id: string): Promise<PostWithRelations | null> {
    const post = await this.prisma.post.findUnique({
      where: { id },
      include: { projects: { select: { projectId: true } } },
    });
    if (!post) return null;
    const { projects, ...rest } = post;
    return { ...rest, relatedProjectIds: projects.map((p) => p.projectId) };
  }

  findBySlug(slug: string): Promise<Post | null> {
    return this.prisma.post.findUnique({ where: { slug } });
  }

  async create(data: CreatePostInput, slug: string): Promise<PostWithRelations> {
    const id = uuidv7();
    const post = await this.prisma.$transaction(async (tx) => {
      const created = await tx.post.create({
        data: {
          id,
          slug,
          title: data.title,
          summary: data.summary,
          content: data.content,
          tags: data.tags ?? [],
          techStack: data.techStack ?? [],
          bannerImage: data.bannerImage ?? null,
          status: data.status ?? 'draft',
          publishDate: data.publishDate ? new Date(data.publishDate) : null,
        },
      });
      if (data.relatedProjectIds.length > 0) {
        await tx.postProject.createMany({
          data: data.relatedProjectIds.map((projectId) => ({ postId: id, projectId })),
        });
      }
      return created;
    });
    return { ...post, relatedProjectIds: data.relatedProjectIds };
  }

  async update(id: string, data: UpdatePostInput): Promise<PostWithRelations> {
    const post = await this.prisma.$transaction(async (tx) => {
      const updated = await tx.post.update({
        where: { id },
        data: {
          title: data.title,
          summary: data.summary,
          content: data.content,
          tags: data.tags ?? [],
          techStack: data.techStack ?? [],
          bannerImage: data.bannerImage ?? null,
          status: data.status ?? 'draft',
          publishDate: data.publishDate ? new Date(data.publishDate) : null,
        },
      });
      await tx.postProject.deleteMany({ where: { postId: id } });
      if (data.relatedProjectIds.length > 0) {
        await tx.postProject.createMany({
          data: data.relatedProjectIds.map((projectId) => ({ postId: id, projectId })),
        });
      }
      return updated;
    });
    return { ...post, relatedProjectIds: data.relatedProjectIds };
  }

  delete(id: string): Promise<Post> {
    return this.prisma.post.delete({ where: { id } });
  }

  async findTranslation(id: string, locale: string): Promise<PostTranslationRow> {
    const translation = await this.prisma.postTranslation.findUnique({
      where: { postId_locale: { postId: id, locale } },
    });
    if (!translation) return null;
    return {
      locale: translation.locale,
      title: translation.title,
      summary: translation.summary,
      content: translation.content,
      tags: translation.tags as string[],
    };
  }

  async upsertTranslation(
    id: string,
    locale: string,
    data: UpsertPostTranslationInput,
  ): Promise<PostTranslation> {
    return this.prisma.postTranslation.upsert({
      where: { postId_locale: { postId: id, locale } },
      create: { id: uuidv7(), postId: id, locale, ...data },
      update: data,
    });
  }
}

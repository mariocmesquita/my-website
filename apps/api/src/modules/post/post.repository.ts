import { Injectable } from '@nestjs/common';
import { uuidv7 } from 'uuidv7';

import { PrismaService } from '@common/prisma/prisma.service';
import { type CreatePostInput, type UpdatePostInput } from './post.schema';

@Injectable()
export class PostRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findPublishedList() {
    return this.prisma.post.findMany({
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
      },
    });
  }

  async findPublishedDetail(slug: string) {
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
      },
    });
    if (!post) return null;
    const { projects, ...rest } = post;
    return { ...rest, relatedProjectIds: projects.map((p) => p.projectId) };
  }

  async findAll() {
    const posts = await this.prisma.post.findMany({
      orderBy: { createdAt: 'desc' },
      include: { projects: { select: { projectId: true } } },
    });
    return posts.map(({ projects, ...rest }) => ({
      ...rest,
      relatedProjectIds: projects.map((p) => p.projectId),
    }));
  }

  async findById(id: string) {
    const post = await this.prisma.post.findUnique({
      where: { id },
      include: { projects: { select: { projectId: true } } },
    });
    if (!post) return null;
    const { projects, ...rest } = post;
    return { ...rest, relatedProjectIds: projects.map((p) => p.projectId) };
  }

  findBySlug(slug: string) {
    return this.prisma.post.findUnique({ where: { slug } });
  }

  async create(data: CreatePostInput, slug: string) {
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

  async update(id: string, data: UpdatePostInput) {
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

  delete(id: string) {
    return this.prisma.post.delete({ where: { id } });
  }
}

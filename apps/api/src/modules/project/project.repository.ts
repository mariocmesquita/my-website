import { Injectable } from '@nestjs/common';
import { uuidv7 } from 'uuidv7';

import { PrismaService } from '@common/prisma/prisma.service';
import { type CreateProjectInput, type UpdateProjectInput } from './project.schema';

@Injectable()
export class ProjectRepository {
  constructor(private readonly prisma: PrismaService) {}

  findPublishedList() {
    return this.prisma.project.findMany({
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
      },
    });
  }

  findPublishedDetail(slug: string) {
    return this.prisma.project.findFirst({
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
      },
    });
  }

  async findAll() {
    const projects = await this.prisma.project.findMany({
      orderBy: { publishDate: 'desc' },
      include: { posts: { select: { postId: true } } },
    });
    return projects.map(({ posts, ...rest }) => ({
      ...rest,
      relatedPostIds: posts.map((p) => p.postId),
    }));
  }

  async findById(id: string) {
    const project = await this.prisma.project.findUnique({
      where: { id },
      include: { posts: { select: { postId: true } } },
    });
    if (!project) return null;
    const { posts, ...rest } = project;
    return { ...rest, relatedPostIds: posts.map((p) => p.postId) };
  }

  findBySlug(slug: string) {
    return this.prisma.project.findUnique({ where: { slug } });
  }

  async create(data: CreateProjectInput, slug: string) {
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

  async update(id: string, data: UpdateProjectInput) {
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

  delete(id: string) {
    return this.prisma.project.delete({ where: { id } });
  }
}

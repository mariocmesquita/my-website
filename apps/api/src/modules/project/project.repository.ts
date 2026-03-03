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

  findAll() {
    return this.prisma.project.findMany({ orderBy: { publishDate: 'desc' } });
  }

  findBySlug(slug: string) {
    return this.prisma.project.findUnique({ where: { slug } });
  }

  create(data: CreateProjectInput, slug: string) {
    return this.prisma.project.create({
      data: {
        id: uuidv7(),
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
  }

  update(id: string, data: UpdateProjectInput) {
    return this.prisma.project.update({
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
  }

  delete(id: string) {
    return this.prisma.project.delete({ where: { id } });
  }
}

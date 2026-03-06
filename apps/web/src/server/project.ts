import { env } from '@my-website/env';
import {
  type ProjectDetail,
  ProjectDetailSchema,
  type ProjectListItem,
  ProjectListItemSchema,
} from '@my-website/schemas/project';
import { z } from 'zod';

export async function getProjectDetail(slug: string): Promise<ProjectDetail | null> {
  try {
    const response = await fetch(`${env.NEXT_PUBLIC_API_URL}/projects/${slug}`, {
      next: { revalidate: 60 },
    });
    if (response.status === 404) return null;
    if (!response.ok) {
      console.error('Erro ao buscar projeto:', response.status);
      return null;
    }
    const data = await response.json();
    return ProjectDetailSchema.parse(data.data);
  } catch (error) {
    console.error('Erro ao buscar projeto:', error);
    return null;
  }
}

export async function getPublishedProjects(): Promise<ProjectListItem[]> {
  try {
    const response = await fetch(`${env.NEXT_PUBLIC_API_URL}/projects`, {
      next: { revalidate: 60 },
    });
    if (!response.ok) {
      console.error('Erro ao buscar projetos:', response.status);
      return [];
    }
    const data = await response.json();
    return z.array(ProjectListItemSchema).parse(data.data);
  } catch (error) {
    console.error('Erro ao buscar projetos:', error);
    return [];
  }
}

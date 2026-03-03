import { env } from '@my-website/env';
import { type ProjectListItem, ProjectListItemSchema } from '@my-website/schemas/project';
import { z } from 'zod';

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

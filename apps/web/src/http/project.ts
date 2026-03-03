import { env } from '@my-website/env';
import {
  type CreateProjectInput,
  type ProjectAdmin,
  ProjectAdminSchema,
  type ProjectDetail,
  ProjectDetailSchema,
  type ProjectListItem,
  ProjectListItemSchema,
  type UpdateProjectInput,
} from '@my-website/schemas/project';
import { z } from 'zod';

import { handleEmptyResponse, handleResponse } from './utils';

export async function getProjects(): Promise<ProjectListItem[]> {
  const response = await fetch(`${env.NEXT_PUBLIC_API_URL}/projects`);
  return handleResponse(response, z.array(ProjectListItemSchema));
}

export async function getProjectsAdmin(token: string): Promise<ProjectAdmin[]> {
  const response = await fetch(`${env.NEXT_PUBLIC_API_URL}/projects/admin`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return handleResponse(response, z.array(ProjectAdminSchema));
}

export async function getProjectDetail(slug: string): Promise<ProjectDetail> {
  const response = await fetch(`${env.NEXT_PUBLIC_API_URL}/projects/${slug}`);
  return handleResponse(response, ProjectDetailSchema);
}

export async function uploadProjectFile(
  token: string,
  file: File,
  type: 'banner' | 'screenshot',
): Promise<string> {
  const formData = new FormData();
  formData.append('file', file);
  const response = await fetch(`${env.NEXT_PUBLIC_API_URL}/projects/upload?type=${type}`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });
  const data = await handleResponse(response, z.object({ url: z.string() }));
  return data.url;
}

export async function createProject(
  token: string,
  data: CreateProjectInput,
): Promise<ProjectAdmin> {
  const response = await fetch(`${env.NEXT_PUBLIC_API_URL}/projects`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(data),
  });
  return handleResponse(response, ProjectAdminSchema);
}

export async function updateProject(
  token: string,
  id: string,
  data: UpdateProjectInput,
): Promise<ProjectAdmin> {
  const response = await fetch(`${env.NEXT_PUBLIC_API_URL}/projects/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(data),
  });
  return handleResponse(response, ProjectAdminSchema);
}

export async function deleteProject(token: string, id: string): Promise<void> {
  const response = await fetch(`${env.NEXT_PUBLIC_API_URL}/projects/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
  return handleEmptyResponse(response);
}

export type {
  CreateProjectInput,
  ProjectAdmin,
  ProjectDetail,
  ProjectListItem,
  UpdateProjectInput,
};

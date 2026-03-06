import { env } from '@my-website/env';
import {
  type CreatePostInput,
  type PostAdmin,
  PostAdminSchema,
  type PostDetail,
  PostDetailSchema,
  type PostListItem,
  PostListItemSchema,
  type UpdatePostInput,
} from '@my-website/schemas/post';
import { z } from 'zod';

import { handleEmptyResponse, handleResponse } from './utils';

export async function getPosts(): Promise<PostListItem[]> {
  const response = await fetch(`${env.NEXT_PUBLIC_API_URL}/posts`);
  return handleResponse(response, z.array(PostListItemSchema));
}

export async function getPostsAdmin(token: string): Promise<PostAdmin[]> {
  const response = await fetch(`${env.NEXT_PUBLIC_API_URL}/posts/admin`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return handleResponse(response, z.array(PostAdminSchema));
}

export async function getPostAdmin(token: string, id: string): Promise<PostAdmin> {
  const response = await fetch(`${env.NEXT_PUBLIC_API_URL}/posts/admin/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return handleResponse(response, PostAdminSchema);
}

export async function getPostDetail(slug: string): Promise<PostDetail> {
  const response = await fetch(`${env.NEXT_PUBLIC_API_URL}/posts/${slug}`);
  return handleResponse(response, PostDetailSchema);
}

export async function uploadPostFile(token: string, file: File): Promise<string> {
  const formData = new FormData();
  formData.append('file', file);
  const response = await fetch(`${env.NEXT_PUBLIC_API_URL}/posts/upload`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });
  const data = await handleResponse(response, z.object({ url: z.string() }));
  return data.url;
}

export async function createPost(token: string, data: CreatePostInput): Promise<PostAdmin> {
  const response = await fetch(`${env.NEXT_PUBLIC_API_URL}/posts`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(data),
  });
  return handleResponse(response, PostAdminSchema);
}

export async function updatePost(
  token: string,
  id: string,
  data: UpdatePostInput,
): Promise<PostAdmin> {
  const response = await fetch(`${env.NEXT_PUBLIC_API_URL}/posts/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(data),
  });
  return handleResponse(response, PostAdminSchema);
}

export async function deletePost(token: string, id: string): Promise<void> {
  const response = await fetch(`${env.NEXT_PUBLIC_API_URL}/posts/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
  return handleEmptyResponse(response);
}

export type { CreatePostInput, PostAdmin, PostDetail, PostListItem, UpdatePostInput };

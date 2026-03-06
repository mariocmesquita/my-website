import { env } from '@my-website/env';
import {
  type PostDetail,
  PostDetailSchema,
  type PostListItem,
  PostListItemSchema,
} from '@my-website/schemas/post';
import { z } from 'zod';

export async function getPublishedPosts(): Promise<PostListItem[]> {
  try {
    const response = await fetch(`${env.NEXT_PUBLIC_API_URL}/posts`, {
      next: { revalidate: 60 },
    });
    if (!response.ok) {
      console.error('Erro ao buscar posts:', response.status);
      return [];
    }
    const data = await response.json();
    return z.array(PostListItemSchema).parse(data.data);
  } catch (error) {
    console.error('Erro ao buscar posts:', error);
    return [];
  }
}

export async function getPostDetail(slug: string): Promise<PostDetail | null> {
  try {
    const response = await fetch(`${env.NEXT_PUBLIC_API_URL}/posts/${slug}`, {
      next: { revalidate: 60 },
    });
    if (response.status === 404) return null;
    if (!response.ok) {
      console.error('Erro ao buscar post:', response.status);
      return null;
    }
    const data = await response.json();
    return PostDetailSchema.parse(data.data);
  } catch (error) {
    console.error('Erro ao buscar post:', error);
    return null;
  }
}

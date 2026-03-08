import { z } from 'zod';
import { type Post, type Prisma } from '@generated/prisma';

export {
  PostListItemSchema,
  PostDetailSchema,
  PostAdminSchema,
  CreatePostSchema,
  UpdatePostSchema,
  UpsertPostTranslationSchema,
  type PostListItem,
  type PostDetail,
  type PostAdmin,
  type CreatePostInput,
  type UpdatePostInput,
  type UpsertPostTranslationInput,
} from '@my-website/schemas/post';

export const LikePostSchema = z.object({
  visitorId: z.string().min(1, 'Identificador do visitante é obrigatório.'),
});

export type LikePostInput = z.infer<typeof LikePostSchema>;

export type PostListRow = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  tags: Prisma.JsonValue;
  techStack: Prisma.JsonValue;
  bannerImage: string | null;
  publishDate: Date | null;
  likesCount: number;
  translated: boolean;
};

export type PostDetailRow = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  content: string;
  tags: Prisma.JsonValue;
  techStack: Prisma.JsonValue;
  bannerImage: string | null;
  publishDate: Date | null;
  relatedProjectIds: string[];
  likesCount: number;
  viewer: { liked: boolean };
  translated: boolean;
};

export type PostAdminRow = Post & { relatedProjectIds: string[]; translated: boolean };
export type PostWithRelations = Post & { relatedProjectIds: string[] };

export type PostTranslationRow = {
  locale: string;
  title: string;
  summary: string;
  content: string;
  tags: string[];
} | null;

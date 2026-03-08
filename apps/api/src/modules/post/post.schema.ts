import { z } from 'zod';

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

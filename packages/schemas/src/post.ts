import { z } from "zod";

export const PostListItemSchema = z.object({
  id: z.uuid(),
  slug: z.string(),
  title: z.string(),
  summary: z.string(),
  tags: z.array(z.string()),
  techStack: z.array(z.string()),
  bannerImage: z.string().nullable(),
  publishDate: z.string().nullable(),
  likesCount: z.number(),
  translated: z.boolean().optional(),
});

export const PostDetailSchema = z.object({
  id: z.uuid(),
  slug: z.string(),
  title: z.string(),
  summary: z.string(),
  content: z.string(),
  tags: z.array(z.string()),
  techStack: z.array(z.string()),
  bannerImage: z.string().nullable(),
  publishDate: z.string().nullable(),
  relatedProjectIds: z.array(z.string()),
  likesCount: z.number(),
  viewer: z.object({ liked: z.boolean() }),
  translated: z.boolean().optional(),
});

export const PostAdminSchema = z.object({
  id: z.uuid(),
  slug: z.string(),
  title: z.string(),
  summary: z.string(),
  content: z.string(),
  tags: z.array(z.string()),
  techStack: z.array(z.string()),
  bannerImage: z.string().nullable(),
  status: z.string(),
  publishDate: z.string().nullable(),
  relatedProjectIds: z.array(z.string()),
  translated: z.boolean().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const CreatePostSchema = z.object({
  title: z
    .string()
    .min(1, "Título é obrigatório.")
    .max(200, "Título deve ter no máximo 200 caracteres."),
  summary: z
    .string()
    .min(1, "Resumo é obrigatório.")
    .max(300, "Resumo deve ter no máximo 300 caracteres."),
  content: z.string().min(1, "Conteúdo é obrigatório."),
  tags: z.array(z.string()).default([]),
  techStack: z.array(z.string()).default([]),
  bannerImage: z.string().nullable().optional(),
  status: z.enum(["draft", "published", "archived"]).default("draft"),
  publishDate: z.string().nullable().optional(),
  relatedProjectIds: z.array(z.string()).default([]),
});

export const UpdatePostSchema = CreatePostSchema;

export const UpsertPostTranslationSchema = z.object({
  title: z
    .string()
    .min(1, "Título é obrigatório.")
    .max(200, "Título deve ter no máximo 200 caracteres."),
  summary: z
    .string()
    .min(1, "Resumo é obrigatório.")
    .max(300, "Resumo deve ter no máximo 300 caracteres."),
  content: z.string().min(1, "Conteúdo é obrigatório."),
  tags: z.array(z.string()).default([]),
});

export const PostTranslationSchema = z.object({
  locale: z.string(),
  title: z.string(),
  summary: z.string(),
  content: z.string(),
  tags: z.array(z.string()),
});

export type PostListItem = z.infer<typeof PostListItemSchema>;
export type PostDetail = z.infer<typeof PostDetailSchema>;
export type PostAdmin = z.infer<typeof PostAdminSchema>;
export type CreatePostInput = z.infer<typeof CreatePostSchema>;
export type UpdatePostInput = z.infer<typeof UpdatePostSchema>;
export type UpsertPostTranslationInput = z.infer<
  typeof UpsertPostTranslationSchema
>;
export type PostTranslation = z.infer<typeof PostTranslationSchema>;

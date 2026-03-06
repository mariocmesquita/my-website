import { z } from "zod";

export const ProjectListItemSchema = z.object({
  id: z.uuid(),
  slug: z.string(),
  title: z.string(),
  summary: z.string(),
  techStack: z.array(z.string()),
  bannerImage: z.string().nullable(),
  githubLink: z.string().nullable(),
});

export const ProjectDetailSchema = z.object({
  id: z.uuid(),
  slug: z.string(),
  title: z.string(),
  summary: z.string(),
  description: z.string(),
  techStack: z.array(z.string()),
  bannerImage: z.string().nullable(),
  screenshots: z.array(z.string()),
  githubLink: z.string().nullable(),
  publishDate: z.string(),
  relatedPostIds: z.array(z.string()).default([]),
});

export const ProjectAdminSchema = z.object({
  id: z.uuid(),
  slug: z.string(),
  title: z.string(),
  summary: z.string(),
  description: z.string(),
  techStack: z.array(z.string()),
  bannerImage: z.string().nullable(),
  screenshots: z.array(z.string()),
  githubLink: z.string().nullable(),
  publishDate: z.string(),
  archived: z.boolean(),
  relatedPostIds: z.array(z.string()).default([]),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const CreateProjectSchema = z.object({
  title: z
    .string()
    .min(1, "Título é obrigatório.")
    .max(200, "Título deve ter no máximo 200 caracteres."),
  summary: z
    .string()
    .min(1, "Resumo é obrigatório.")
    .max(300, "Resumo deve ter no máximo 300 caracteres."),
  description: z.string().min(1, "Descrição é obrigatória."),
  techStack: z
    .array(z.string().min(1))
    .min(1, "Adicione pelo menos uma tecnologia."),
  bannerImage: z.string().nullable().optional(),
  screenshots: z.array(z.string()).default([]),
  githubLink: z
    .url("Link do GitHub inválido.")
    .nullable()
    .optional()
    .or(z.literal("")),
  publishDate: z.string().min(1, "Data de publicação é obrigatória."),
  archived: z.boolean().default(false),
  relatedPostIds: z.array(z.string()).default([]),
});

export const UpdateProjectSchema = CreateProjectSchema;

export type ProjectListItem = z.infer<typeof ProjectListItemSchema>;
export type ProjectDetail = z.infer<typeof ProjectDetailSchema>;
export type ProjectAdmin = z.infer<typeof ProjectAdminSchema>;
export type CreateProjectInput = z.infer<typeof CreateProjectSchema>;
export type UpdateProjectInput = z.infer<typeof UpdateProjectSchema>;

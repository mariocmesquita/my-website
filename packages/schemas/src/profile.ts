import { z } from "zod";

export const SocialLinksSchema = z.object({
  github: z.url("URL do GitHub inválida.").optional().or(z.literal("")),
  linkedin: z.url("URL do LinkedIn inválida.").optional().or(z.literal("")),
  instagram: z.url("URL do Instagram inválida.").optional().or(z.literal("")),
  youtube: z.url("URL do YouTube inválida.").optional().or(z.literal("")),
});

export const ProfileSchema = z.object({
  id: z.string(),
  name: z
    .string()
    .min(1, "Nome é obrigatório.")
    .max(50, "Nome deve ter no máximo 50 caracteres."),
  position: z
    .string()
    .min(1, "Cargo é obrigatório.")
    .max(50, "Cargo deve ter no máximo 50 caracteres."),
  description: z
    .string()
    .min(1, "Descrição é obrigatória.")
    .max(130, "Descrição deve ter no máximo 130 caracteres."),
  bio: z
    .string()
    .min(1, "Bio é obrigatória.")
    .max(1000, "Bio deve ter no máximo 1000 caracteres."),
  email: z
    .email("E-mail inválido.")
    .max(50, "E-mail deve ter no máximo 50 caracteres."),
  socialLinks: SocialLinksSchema,
  translated: z.boolean().optional(),
  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime(),
});

export const UpdateProfileSchema = z.object({
  name: z
    .string()
    .min(1, "Nome é obrigatório.")
    .max(50, "Nome deve ter no máximo 50 caracteres."),
  position: z
    .string()
    .min(1, "Cargo é obrigatório.")
    .max(50, "Cargo deve ter no máximo 50 caracteres."),
  description: z
    .string()
    .min(1, "Descrição é obrigatória.")
    .max(130, "Descrição deve ter no máximo 130 caracteres."),
  bio: z
    .string()
    .min(1, "Bio é obrigatória.")
    .max(1000, "Bio deve ter no máximo 1000 caracteres."),
  email: z
    .email("E-mail inválido.")
    .max(50, "E-mail deve ter no máximo 50 caracteres."),
  socialLinks: SocialLinksSchema.optional(),
});

export const UpsertProfileTranslationSchema = z.object({
  position: z
    .string()
    .min(1, "Cargo é obrigatório.")
    .max(50, "Cargo deve ter no máximo 50 caracteres."),
  description: z
    .string()
    .min(1, "Descrição é obrigatória.")
    .max(130, "Descrição deve ter no máximo 130 caracteres."),
  bio: z
    .string()
    .min(1, "Bio é obrigatória.")
    .max(1000, "Bio deve ter no máximo 1000 caracteres."),
});

export const ProfileTranslationSchema = z.object({
  locale: z.string(),
  position: z.string(),
  description: z.string(),
  bio: z.string(),
});

export type SocialLinks = z.infer<typeof SocialLinksSchema>;
export type Profile = z.infer<typeof ProfileSchema>;
export type UpdateProfileInput = z.infer<typeof UpdateProfileSchema>;
export type UpsertProfileTranslationInput = z.infer<
  typeof UpsertProfileTranslationSchema
>;
export type ProfileTranslation = z.infer<typeof ProfileTranslationSchema>;

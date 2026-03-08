import { z } from "zod";

export const CareerSchema = z.object({
  id: z.uuid(),
  company: z.string(),
  role: z.string(),
  startDate: z.string(),
  endDate: z.string().nullable(),
  content: z.string(),
  translated: z.boolean().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const CreateCareerSchema = z.object({
  company: z
    .string()
    .min(1, "Empresa é obrigatória.")
    .max(100, "Empresa deve ter no máximo 100 caracteres."),
  role: z
    .string()
    .min(1, "Cargo é obrigatório.")
    .max(100, "Cargo deve ter no máximo 100 caracteres."),
  startDate: z.string().min(1, "Data de início é obrigatória."),
  endDate: z.string().nullable().optional(),
  content: z.string().min(1, "Conteúdo é obrigatório."),
});

export const UpdateCareerSchema = CreateCareerSchema;

export const UpsertCareerTranslationSchema = z.object({
  role: z
    .string()
    .min(1, "Cargo é obrigatório.")
    .max(100, "Cargo deve ter no máximo 100 caracteres."),
  content: z.string().min(1, "Conteúdo é obrigatório."),
});

export const CareerTranslationSchema = z.object({
  locale: z.string(),
  role: z.string(),
  content: z.string(),
});

export type Career = z.infer<typeof CareerSchema>;
export type CreateCareerInput = z.infer<typeof CreateCareerSchema>;
export type UpdateCareerInput = z.infer<typeof UpdateCareerSchema>;
export type UpsertCareerTranslationInput = z.infer<
  typeof UpsertCareerTranslationSchema
>;
export type CareerTranslation = z.infer<typeof CareerTranslationSchema>;

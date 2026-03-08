import { type Career } from '@generated/prisma';

export {
  CreateCareerSchema,
  UpdateCareerSchema,
  UpsertCareerTranslationSchema,
  type CreateCareerInput,
  type UpdateCareerInput,
  type UpsertCareerTranslationInput,
} from '@my-website/schemas/career';

export type CareerRow = Career & { translated: boolean };
export type CareerTranslationRow = { locale: string; role: string; content: string } | null;

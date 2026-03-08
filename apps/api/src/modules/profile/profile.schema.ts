import { type Profile } from '@generated/prisma';

export {
  SocialLinksSchema,
  UpdateProfileSchema,
  UpsertProfileTranslationSchema,
  type SocialLinks,
  type UpdateProfileInput,
  type UpsertProfileTranslationInput,
} from '@my-website/schemas/profile';

export type ProfileRow = Profile & { translated: boolean };
export type ProfileTranslationRow = {
  locale: string;
  position: string;
  description: string;
  bio: string;
} | null;

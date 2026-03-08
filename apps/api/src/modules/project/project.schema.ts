import { type Project, type Prisma } from '@generated/prisma';

export {
  ProjectListItemSchema,
  ProjectDetailSchema,
  ProjectAdminSchema,
  CreateProjectSchema,
  UpdateProjectSchema,
  UpsertProjectTranslationSchema,
  type ProjectListItem,
  type ProjectDetail,
  type ProjectAdmin,
  type CreateProjectInput,
  type UpdateProjectInput,
  type UpsertProjectTranslationInput,
} from '@my-website/schemas/project';

export type ProjectListRow = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  techStack: Prisma.JsonValue;
  bannerImage: string | null;
  githubLink: string | null;
  translated: boolean;
};

export type ProjectDetailRow = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  description: string;
  techStack: Prisma.JsonValue;
  bannerImage: string | null;
  screenshots: Prisma.JsonValue;
  githubLink: string | null;
  publishDate: Date;
  relatedPostIds: string[];
  translated: boolean;
};

export type ProjectAdminRow = Project & { relatedPostIds: string[]; translated: boolean };
export type ProjectWithRelations = Project & { relatedPostIds: string[] };

export type ProjectTranslationRow = {
  locale: string;
  title: string;
  summary: string;
  description: string;
} | null;

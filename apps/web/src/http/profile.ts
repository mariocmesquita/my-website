import { env } from '@my-website/env';
import {
  type Profile,
  type SocialLinks,
  SocialLinksSchema,
  type UpdateProfileInput,
} from '@my-website/schemas/profile';
import { z } from 'zod';

import { handleResponse } from './utils';

export const ProfileSchema = z.object({
  id: z.string(),
  name: z.string().min(1, 'Nome é obrigatório.').max(50, 'Nome deve ter no máximo 50 caracteres.'),
  position: z
    .string()
    .min(1, 'Cargo é obrigatório.')
    .max(50, 'Cargo deve ter no máximo 50 caracteres.'),
  description: z
    .string()
    .min(1, 'Descrição é obrigatória.')
    .max(130, 'Descrição deve ter no máximo 130 caracteres.'),
  bio: z.string().min(1, 'Bio é obrigatória.').max(1000, 'Bio deve ter no máximo 1000 caracteres.'),
  email: z.email('E-mail inválido.').max(50),
  socialLinks: SocialLinksSchema,
  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime(),
});

export type { Profile, SocialLinks, UpdateProfileInput };

export async function getProfile(): Promise<Profile | null> {
  const response = await fetch(`${env.NEXT_PUBLIC_API_URL}/profile`);
  if (response.status === 404) return null;
  return handleResponse(response, ProfileSchema);
}

export async function updateProfile(token: string, data: UpdateProfileInput): Promise<Profile> {
  const response = await fetch(`${env.NEXT_PUBLIC_API_URL}/profile`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  return handleResponse(response, ProfileSchema);
}

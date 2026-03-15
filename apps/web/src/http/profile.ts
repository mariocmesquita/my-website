import { env } from '@my-website/env';
import {
  type Profile,
  ProfileSchema,
  type ProfileTranslation,
  ProfileTranslationSchema,
  type SocialLinks,
  type UpdateProfileInput,
  type UpsertProfileTranslationInput,
} from '@my-website/schemas/profile';

import { handleResponse } from './utils';

export async function getProfileTranslation(
  token: string,
  locale: string,
): Promise<ProfileTranslation | null> {
  const response = await fetch(`${env.NEXT_PUBLIC_API_URL}/profile/translations/${locale}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (response.status === 404) return null;
  return handleResponse(response, ProfileTranslationSchema);
}

export async function upsertProfileTranslation(
  token: string,
  locale: string,
  data: UpsertProfileTranslationInput,
): Promise<ProfileTranslation> {
  const response = await fetch(`${env.NEXT_PUBLIC_API_URL}/profile/translations/${locale}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(data),
  });
  return handleResponse(response, ProfileTranslationSchema);
}

export type {
  Profile,
  ProfileTranslation,
  SocialLinks,
  UpdateProfileInput,
  UpsertProfileTranslationInput,
};

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

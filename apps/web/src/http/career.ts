import { env } from '@my-website/env';
import {
  type Career,
  CareerSchema,
  type CareerTranslation,
  CareerTranslationSchema,
  type CreateCareerInput,
  type UpdateCareerInput,
  type UpsertCareerTranslationInput,
} from '@my-website/schemas/career';
import { z } from 'zod';

import { handleEmptyResponse, handleResponse } from './utils';

export async function getCareers(): Promise<Career[]> {
  const response = await fetch(`${env.NEXT_PUBLIC_API_URL}/career`);
  return handleResponse(response, z.array(CareerSchema));
}

export async function getCareersAdmin(token: string): Promise<Career[]> {
  const response = await fetch(`${env.NEXT_PUBLIC_API_URL}/career/admin`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return handleResponse(response, z.array(CareerSchema));
}

export async function createCareer(token: string, data: CreateCareerInput): Promise<Career> {
  const response = await fetch(`${env.NEXT_PUBLIC_API_URL}/career`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ ...data, endDate: data.endDate || null }),
  });
  return handleResponse(response, CareerSchema);
}

export async function updateCareer(
  token: string,
  id: string,
  data: UpdateCareerInput,
): Promise<Career> {
  const response = await fetch(`${env.NEXT_PUBLIC_API_URL}/career/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ ...data, endDate: data.endDate || null }),
  });
  return handleResponse(response, CareerSchema);
}

export async function deleteCareer(token: string, id: string): Promise<void> {
  const response = await fetch(`${env.NEXT_PUBLIC_API_URL}/career/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
  return handleEmptyResponse(response);
}

export async function getCareerTranslation(
  token: string,
  id: string,
  locale: string,
): Promise<CareerTranslation | null> {
  const response = await fetch(`${env.NEXT_PUBLIC_API_URL}/career/${id}/translations/${locale}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (response.status === 404) return null;
  return handleResponse(response, CareerTranslationSchema);
}

export async function upsertCareerTranslation(
  token: string,
  id: string,
  locale: string,
  data: UpsertCareerTranslationInput,
): Promise<CareerTranslation> {
  const response = await fetch(`${env.NEXT_PUBLIC_API_URL}/career/${id}/translations/${locale}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(data),
  });
  return handleResponse(response, CareerTranslationSchema);
}

export type {
  Career,
  CareerTranslation,
  CreateCareerInput,
  UpdateCareerInput,
  UpsertCareerTranslationInput,
};

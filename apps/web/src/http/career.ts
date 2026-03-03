import { env } from '@my-website/env';
import {
  type Career,
  CareerSchema,
  type CreateCareerInput,
  type UpdateCareerInput,
} from '@my-website/schemas/career';
import { z } from 'zod';

import { handleEmptyResponse, handleResponse } from './utils';

export async function getCareers(): Promise<Career[]> {
  const response = await fetch(`${env.NEXT_PUBLIC_API_URL}/career`);
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

export type { Career, CreateCareerInput, UpdateCareerInput };

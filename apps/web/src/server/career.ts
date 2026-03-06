import { env } from '@my-website/env';
import { type Career, CareerSchema } from '@my-website/schemas/career';
import { z } from 'zod';

export async function getCareerData(): Promise<Career[]> {
  try {
    const response = await fetch(`${env.NEXT_PUBLIC_API_URL}/career`, {
      next: { revalidate: 60 },
    });
    if (!response.ok) {
      console.error('Erro ao buscar carreiras:', response.status);
      return [];
    }
    const data = await response.json();
    return z.array(CareerSchema).parse(data.data);
  } catch (error) {
    console.error('Erro ao buscar carreiras:', error);
    return [];
  }
}

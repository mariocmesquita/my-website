import { type z } from 'zod';

export async function handleResponse<T>(response: Response, schema: z.ZodType<T>): Promise<T> {
  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    const message = (data as { message?: string }).message ?? 'Erro na requisição.';
    throw new Error(message);
  }
  const json = await response.json();
  return schema.parse(json.data);
}

export async function handleEmptyResponse(response: Response): Promise<void> {
  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    const message = (data as { message?: string }).message ?? 'Erro na requisição.';
    throw new Error(message);
  }
}

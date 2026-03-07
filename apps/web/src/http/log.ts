import { env } from '@my-website/env';
import { type LogListResponse, LogListResponseSchema } from '@my-website/schemas/log';

import { handleResponse } from './utils';

export async function getLogs(
  token: string,
  page: number = 1,
  limit: number = 50,
): Promise<LogListResponse> {
  const params = new URLSearchParams({ page: String(page), limit: String(limit) });
  const response = await fetch(`${env.NEXT_PUBLIC_API_URL}/logs?${params}`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: 'no-store',
  });
  return handleResponse(response, LogListResponseSchema);
}

export type { LogEntry, LogListResponse } from '@my-website/schemas/log';

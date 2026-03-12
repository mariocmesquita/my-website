import 'server-only';

import type { NextRequest } from 'next/server';

const ALLOWED_ORIGIN = process.env.NODE_ENV === 'production' ? 'https://mariocmesquita.com' : null;

export function validateCsrfOrigin(request: NextRequest): boolean {
  const origin = request.headers.get('origin');
  if (!origin) return false;
  if (ALLOWED_ORIGIN === null) return true;
  return origin === ALLOWED_ORIGIN;
}

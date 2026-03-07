import { NextRequest, NextResponse } from 'next/server';

import { validateCsrfOrigin } from '@/server/csrf';
import { verifyIdToken } from '@/server/firebase-admin';
import { checkRateLimit } from '@/server/rate-limit';
import { clearSession, setSession } from '@/server/session';

export async function POST(request: NextRequest) {
  if (!validateCsrfOrigin(request)) {
    return NextResponse.json({ message: 'Origem inválida.' }, { status: 403 });
  }

  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';
  const rateLimit = checkRateLimit(`session:${ip}`);
  if (!rateLimit.allowed) {
    return NextResponse.json(
      { message: 'Muitas tentativas. Tente novamente em breve.' },
      { status: 429, headers: { 'Retry-After': String(rateLimit.retryAfter) } },
    );
  }

  const body = await request.json().catch(() => null);
  const idToken: unknown = body?.idToken;

  if (typeof idToken !== 'string' || idToken.trim() === '') {
    return NextResponse.json({ message: 'Token inválido.' }, { status: 400 });
  }

  try {
    const decoded = await verifyIdToken(idToken);
    await setSession(decoded.uid, decoded.email ?? null);
    return NextResponse.json({ message: 'Sessão iniciada.' }, { status: 200 });
  } catch {
    return NextResponse.json({ message: 'Token de autenticação inválido.' }, { status: 401 });
  }
}

export async function DELETE(request: NextRequest) {
  if (!validateCsrfOrigin(request)) {
    return NextResponse.json({ message: 'Origem inválida.' }, { status: 403 });
  }

  try {
    await clearSession();
    return NextResponse.json({ message: 'Sessão encerrada.' }, { status: 200 });
  } catch {
    return NextResponse.json({ message: 'Erro ao encerrar sessão.' }, { status: 500 });
  }
}

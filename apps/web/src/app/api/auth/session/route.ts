import { NextRequest, NextResponse } from 'next/server';

import { clearSession, setSession } from '@/lib/session';

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const uid: unknown = body?.uid;
  const email: unknown = body?.email;

  if (typeof uid !== 'string' || uid.trim() === '') {
    return NextResponse.json({ message: 'UID inválido.' }, { status: 400 });
  }

  try {
    await setSession(uid, typeof email === 'string' ? email : null);
    return NextResponse.json({ message: 'Sessão iniciada.' }, { status: 200 });
  } catch {
    return NextResponse.json({ message: 'Erro ao criar sessão.' }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    await clearSession();
    return NextResponse.json({ message: 'Sessão encerrada.' }, { status: 200 });
  } catch {
    return NextResponse.json({ message: 'Erro ao encerrar sessão.' }, { status: 500 });
  }
}

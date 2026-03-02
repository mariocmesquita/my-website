import 'server-only';

import { getIronSession } from 'iron-session';
import { cookies } from 'next/headers';

export interface SessionData {
  uid: string;
  email: string | null;
}

function getSessionSecret(): string {
  const secret = process.env.SESSION_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error(
      'Variável de ambiente SESSION_SECRET deve ter pelo menos 32 caracteres. ' +
        'Defina no arquivo .env antes de executar a aplicação.',
    );
  }
  return secret;
}

const sessionConfig = {
  get password() {
    return getSessionSecret();
  },
  cookieName: 'mw_session',
  cookieOptions: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    maxAge: 60 * 60 * 24 * 7,
  },
};

export async function getSession() {
  const cookieStore = await cookies();
  const session = await getIronSession<SessionData>(cookieStore, sessionConfig);
  return session;
}

export async function setSession(uid: string, email: string | null) {
  const session = await getSession();
  session.uid = uid;
  session.email = email;
  await session.save();
}

export async function clearSession() {
  const session = await getSession();
  session.destroy();
}

export async function verifySession() {
  const session = await getSession();
  if (!session.uid) return null;
  return { uid: session.uid, email: session.email };
}

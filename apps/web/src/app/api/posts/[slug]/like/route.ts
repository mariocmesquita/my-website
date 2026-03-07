import { env } from '@my-website/env';
import { NextRequest, NextResponse } from 'next/server';

const VISITOR_COOKIE = 'mw_visitor_id';
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365; // 1 ano

export async function POST(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const visitorId = request.cookies.get(VISITOR_COOKIE)?.value ?? crypto.randomUUID();

  const apiRes = await fetch(`${env.NEXT_PUBLIC_API_URL}/posts/${slug}/like`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ visitorId }),
  });

  if (!apiRes.ok) {
    return NextResponse.json({ message: 'Erro ao curtir post.' }, { status: apiRes.status });
  }

  const data = await apiRes.json();
  const response = NextResponse.json(data, { status: 200 });

  response.cookies.set(VISITOR_COOKIE, visitorId, {
    httpOnly: true,
    sameSite: 'lax',
    maxAge: COOKIE_MAX_AGE,
    path: '/',
  });

  return response;
}

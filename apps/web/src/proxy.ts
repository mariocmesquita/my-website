import { type NextRequest, NextResponse } from 'next/server';

import { getSession } from '@/server/session';

const PROTECTED_ROUTES = ['/admin'];
const AUTH_ROUTES = ['/auth/sign-in'];
const LOGIN_PAGE = '/auth/sign-in';

export default async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isProtected = PROTECTED_ROUTES.some((route) => pathname.startsWith(route));
  const isAuthRoute = AUTH_ROUTES.some((route) => pathname.startsWith(route));

  if (isProtected) {
    const session = await getSession();
    if (!session.uid) {
      const url = new URL(LOGIN_PAGE, request.url);
      url.searchParams.set('next', pathname);
      return NextResponse.redirect(url);
    }
  }

  if (isAuthRoute) {
    const session = await getSession();
    if (session.uid) {
      return NextResponse.redirect(new URL('/admin/dashboard', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.svg$).*)'],
};

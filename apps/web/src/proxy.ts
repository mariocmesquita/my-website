import { type NextRequest, NextResponse } from 'next/server';
import createMiddleware from 'next-intl/middleware';

import { routing } from '@/i18n/routing';
import { getSession } from '@/server/session';

const SUPPORTED_LOCALES: string[] = [...routing.locales];

const PROTECTED_ROUTES = ['/admin'];
const AUTH_ROUTES = ['/auth/sign-in'];
const LOGIN_PAGE = '/auth/sign-in';

const intlMiddleware = createMiddleware(routing);

function matchesPath(pathname: string, base: string): boolean {
  return pathname === base || pathname.startsWith(`${base}/`);
}

function getPathLocale(pathname: string): string | null {
  return (
    SUPPORTED_LOCALES.find(
      (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`),
    ) ?? null
  );
}

export default async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isProtected = PROTECTED_ROUTES.some((route) => matchesPath(pathname, route));
  const isAuthRoute = AUTH_ROUTES.some((route) => matchesPath(pathname, route));

  if (isProtected) {
    const session = await getSession();
    if (!session.uid) {
      const url = new URL(LOGIN_PAGE, request.url);
      url.searchParams.set('next', pathname);
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  if (isAuthRoute) {
    const session = await getSession();
    if (session.uid) {
      return NextResponse.redirect(new URL('/admin/dashboard', request.url));
    }
    return NextResponse.next();
  }

  const pathLocale = getPathLocale(pathname);

  if (pathLocale !== null) {
    const strippedPath = pathname.slice(`/${pathLocale}`.length) || '/';
    const isStrippedProtected = PROTECTED_ROUTES.some((r) => matchesPath(strippedPath, r));
    const isStrippedAuth = AUTH_ROUTES.some((r) => matchesPath(strippedPath, r));
    if (isStrippedProtected || isStrippedAuth) {
      return NextResponse.redirect(new URL(strippedPath, request.url));
    }
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: ['/((?!web-api|_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.svg$).*)'],
};

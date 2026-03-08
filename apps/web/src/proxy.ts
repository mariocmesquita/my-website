import { type NextRequest, NextResponse } from 'next/server';

import { routing } from '@/i18n/routing';
import { getSession } from '@/server/session';

const SUPPORTED_LOCALES: string[] = [...routing.locales];
const DEFAULT_LOCALE = routing.defaultLocale;
const LOCALE_COOKIE = 'NEXT_LOCALE';

const PROTECTED_ROUTES = ['/admin'];
const AUTH_ROUTES = ['/auth/sign-in'];
const LOGIN_PAGE = '/auth/sign-in';

// Routes that should be served under a locale prefix
const PUBLIC_PATHS = ['/', '/blog', '/projects'];

function getLocale(request: NextRequest): string {
  // 1. Cookie override
  const cookie = request.cookies.get(LOCALE_COOKIE)?.value;
  if (cookie && SUPPORTED_LOCALES.includes(cookie)) return cookie;

  // 2. Accept-Language header
  const acceptLanguage = request.headers.get('accept-language') ?? '';
  const preferred = acceptLanguage.split(',')[0]?.split('-')[0]?.toLowerCase() ?? '';
  if (preferred === 'pt') return 'pt';

  return DEFAULT_LOCALE;
}

export default async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip locale routing for admin, auth, api, and static files
  const isProtected = PROTECTED_ROUTES.some((route) => pathname.startsWith(route));
  const isAuthRoute = AUTH_ROUTES.some((route) => pathname.startsWith(route));

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

  // Check if path already has a locale prefix
  const pathnameHasLocale = SUPPORTED_LOCALES.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`,
  );

  if (pathnameHasLocale) {
    const locale =
      SUPPORTED_LOCALES.find((l) => pathname.startsWith(`/${l}/`) || pathname === `/${l}`) ??
      DEFAULT_LOCALE;
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-next-intl-locale', locale);
    return NextResponse.next({ request: { headers: requestHeaders } });
  }

  // Redirect public routes to locale-prefixed version
  const isPublicPath =
    pathname === '/' || PUBLIC_PATHS.some((p) => p !== '/' && pathname.startsWith(p));

  if (isPublicPath) {
    const locale = getLocale(request);
    const url = new URL(`/${locale}${pathname === '/' ? '' : pathname}`, request.url);
    url.search = request.nextUrl.search;
    const response = NextResponse.redirect(url);
    response.cookies.set(LOCALE_COOKIE, locale, { path: '/', maxAge: 60 * 60 * 24 * 365 });
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.svg$).*)'],
};

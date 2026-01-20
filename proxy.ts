import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';
import {
  publicRoutes,
  authRoutes,
  apiAuthPrefix,
  DEFAULT_LOGIN_REDIRECT,
} from './routes';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'your-secret-key'
);

const ACCESS_TOKEN_COOKIE = 'auth_token';
const REFRESH_TOKEN_COOKIE = 'refresh_token';

const isPublicRoute = (pathname: string): boolean => {
  return publicRoutes.includes(pathname);
};

const isAuthRoute = (pathname: string): boolean => {
  return authRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );
};

const isApiAuthRoute = (pathname: string): boolean => {
  return pathname.startsWith(apiAuthPrefix);
};

async function verifyToken(token: string): Promise<boolean> {
  try {
    await jwtVerify(token, JWT_SECRET);
    return true;
  } catch {
    return false;
  }
}

export async function proxy(request: NextRequest) {
  const { nextUrl } = request;
  let { pathname } = nextUrl;

  // Normalize pathname - remove trailing slash except for root
  if (pathname !== '/' && pathname.endsWith('/')) {
    pathname = pathname.slice(0, -1);
  }

  // 1. Allow API routes (handled by Hono)
  if (isApiAuthRoute(pathname)) {
    return NextResponse.next();
  }

  // 2. Allow public routes - NO authentication check needed
  if (isPublicRoute(pathname)) {
    return NextResponse.next();
  }

  // 3. For auth routes and protected routes, we need to check session
  const accessToken = request.cookies.get(ACCESS_TOKEN_COOKIE)?.value;
  const refreshToken = request.cookies.get(REFRESH_TOKEN_COOKIE)?.value;
  const isAccessTokenValid = accessToken ? await verifyToken(accessToken) : false;
  const hasValidSession = isAccessTokenValid || (!isAccessTokenValid && !!refreshToken);

  // 4. Auth routes (login, register, etc.) - for unauthenticated users
  if (isAuthRoute(pathname)) {
    if (hasValidSession) {
      // Authenticated user trying to access auth pages - redirect away
      const callbackUrl = nextUrl.searchParams.get('callbackUrl');
      const redirectUrl =
        callbackUrl && !isAuthRoute(callbackUrl) && !isPublicRoute(callbackUrl)
          ? callbackUrl
          : DEFAULT_LOGIN_REDIRECT;
      return NextResponse.redirect(new URL(redirectUrl, nextUrl.origin));
    }
    // Not authenticated - allow access to auth routes
    return NextResponse.next();
  }

  // 5. Protected routes - require authentication
  if (!hasValidSession) {
    const loginUrl = new URL('/login', nextUrl.origin);
    loginUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 6. Authenticated user accessing protected route - allow
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, images, etc.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|gif|svg|ico|webp)$).*)',
  ],
};

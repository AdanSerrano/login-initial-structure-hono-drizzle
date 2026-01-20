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
  const { pathname } = nextUrl;

  const accessToken = request.cookies.get(ACCESS_TOKEN_COOKIE)?.value;
  const refreshToken = request.cookies.get(REFRESH_TOKEN_COOKIE)?.value;

  // Verify access token
  const isAccessTokenValid = accessToken ? await verifyToken(accessToken) : false;

  // User is considered logged in if:
  // 1. Access token is valid, OR
  // 2. Access token expired but refresh token exists (will be refreshed on client)
  const hasValidSession = isAccessTokenValid || (!isAccessTokenValid && !!refreshToken);

  // Allow API auth routes (including refresh endpoint)
  if (isApiAuthRoute(pathname)) {
    return NextResponse.next();
  }

  // Allow public routes
  if (isPublicRoute(pathname)) {
    return NextResponse.next();
  }

  // Handle auth routes (login, register, etc.)
  if (isAuthRoute(pathname)) {
    if (hasValidSession) {
      // If has valid session, redirect to callbackUrl or default redirect
      const callbackUrl = nextUrl.searchParams.get('callbackUrl');
      const redirectUrl =
        callbackUrl && !isAuthRoute(callbackUrl) && !isPublicRoute(callbackUrl)
          ? callbackUrl
          : DEFAULT_LOGIN_REDIRECT;
      return NextResponse.redirect(new URL(redirectUrl, nextUrl.origin));
    }
    // If no session, allow access to auth routes
    return NextResponse.next();
  }

  // For protected routes
  // If no valid session, redirect to login
  if (!hasValidSession) {
    const loginUrl = new URL('/login', nextUrl.origin);
    // Save original URL as callbackUrl for post-login redirect
    if (!isAuthRoute(pathname) && !isPublicRoute(pathname)) {
      loginUrl.searchParams.set('callbackUrl', pathname);
    }
    return NextResponse.redirect(loginUrl);
  }

  // User has valid session (or needs to refresh) - allow access
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.jpg$|.*\\.jpeg$|.*\\.gif$|.*\\.svg$|.*\\.ico$|.*\\.webp$).*)',
    '/',
  ],
};

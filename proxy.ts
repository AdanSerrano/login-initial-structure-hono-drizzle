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

const COOKIE_NAME = 'auth_token';

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

  const token = request.cookies.get(COOKIE_NAME)?.value;
  const isLoggedIn = token ? await verifyToken(token) : false;

  // Permitir rutas de API de autenticación
  if (isApiAuthRoute(pathname)) {
    return NextResponse.next();
  }

  // Permitir rutas públicas
  if (isPublicRoute(pathname)) {
    return NextResponse.next();
  }

  // Manejo de rutas de autenticación (login, register, etc.)
  if (isAuthRoute(pathname)) {
    if (isLoggedIn) {
      // Si está logueado, redirigir al callbackUrl o al redirect por defecto
      const callbackUrl = nextUrl.searchParams.get('callbackUrl');
      const redirectUrl =
        callbackUrl && !isAuthRoute(callbackUrl) && !isPublicRoute(callbackUrl)
          ? callbackUrl
          : DEFAULT_LOGIN_REDIRECT;
      return NextResponse.redirect(new URL(redirectUrl, nextUrl.origin));
    }
    // Si no está logueado, permitir acceso a rutas de auth
    return NextResponse.next();
  }

  // Para cualquier otra ruta (rutas protegidas)
  // Si no está logueado, redirigir al login
  if (!isLoggedIn) {
    const loginUrl = new URL('/login', nextUrl.origin);
    // Guardar la URL original como callbackUrl para redirigir después del login
    if (!isAuthRoute(pathname) && !isPublicRoute(pathname)) {
      loginUrl.searchParams.set('callbackUrl', pathname);
    }
    return NextResponse.redirect(loginUrl);
  }

  // Usuario logueado accediendo a ruta protegida - permitir
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.jpg$|.*\\.jpeg$|.*\\.gif$|.*\\.svg$|.*\\.ico$|.*\\.webp$).*)',
    '/',
  ],
};

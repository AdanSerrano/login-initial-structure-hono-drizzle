import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';
import { db } from '@/db';
import { usersTable } from '@/db/schema';
import { eq } from 'drizzle-orm';
import type { UserResponse } from '@/modules/user/types/user.types';
import { JWT_SECRET_ENCODED, TOKEN_CONFIG } from './jwt-config';
import { sessionsService } from '@/modules/sessions/services/sessions.service';

const { ACCESS_TOKEN_COOKIE, REFRESH_TOKEN_COOKIE } = TOKEN_CONFIG;

const ACCESS_TOKEN_MAX_AGE = 60 * 15; // 15 minutes

interface JwtPayload {
  userId: string;
  email: string;
  name?: string | null;
  userName?: string | null;
  emailVerified?: string | null; // ISO date string stored in JWT
  image?: string | null;
  role?: string;
  isTwoFactorEnabled?: boolean;
  twoFactorMethod?: string | null;
}

/**
 * Get the current session from cookies (Server-side only)
 * Similar to NextAuth's auth() function
 */
export async function auth(): Promise<{ user: UserResponse } | null> {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get(ACCESS_TOKEN_COOKIE)?.value;
    const refreshToken = cookieStore.get(REFRESH_TOKEN_COOKIE)?.value;

    // No tokens at all
    if (!accessToken && !refreshToken) {
      return null;
    }

    let userId: string | null = null;

    // Try to verify access token
    if (accessToken) {
      try {
        const { payload } = await jwtVerify(accessToken, JWT_SECRET_ENCODED);
        const jwtData = payload as unknown as JwtPayload;
        userId = jwtData.userId;

        // If JWT contains user data, use it directly (faster, no DB query)
        if (jwtData.name !== undefined) {
          return {
            user: {
              id: jwtData.userId,
              email: jwtData.email,
              name: jwtData.name || null,
              userName: jwtData.userName || null,
              emailVerified: jwtData.emailVerified ? new Date(jwtData.emailVerified) : null,
              image: jwtData.image || null,
              role: jwtData.role || 'user',
              isTwoFactorEnabled: jwtData.isTwoFactorEnabled || false,
              twoFactorMethod: jwtData.twoFactorMethod || null,
              createdAt: new Date(),
              updatedAt: new Date(),
            } as UserResponse,
          };
        }
      } catch {
        // Access token invalid/expired
        // Try to refresh using the refresh token if available
        if (refreshToken) {
          const refreshResult = await sessionsService.refreshAccessToken(refreshToken);

          if (refreshResult.success) {
            // Set new access token cookie
            cookieStore.set(ACCESS_TOKEN_COOKIE, refreshResult.data.accessToken, {
              httpOnly: true,
              secure: process.env.NODE_ENV === 'production',
              sameSite: 'lax',
              maxAge: ACCESS_TOKEN_MAX_AGE,
              path: '/',
            });

            return { user: refreshResult.data.user as UserResponse };
          } else {
            // Refresh failed - clear both cookies
            cookieStore.delete(ACCESS_TOKEN_COOKIE);
            cookieStore.delete(REFRESH_TOKEN_COOKIE);
            return null;
          }
        }
        return null;
      }
    }

    // Fallback: If access token is valid but doesn't have user data, query DB
    if (userId) {
      const users = await db
        .select({
          id: usersTable.id,
          userName: usersTable.userName,
          name: usersTable.name,
          email: usersTable.email,
          emailVerified: usersTable.emailVerified,
          image: usersTable.image,
          role: usersTable.role,
          isTwoFactorEnabled: usersTable.isTwoFactorEnabled,
          twoFactorMethod: usersTable.twoFactorMethod,
          createdAt: usersTable.createdAt,
          updatedAt: usersTable.updatedAt,
        })
        .from(usersTable)
        .where(eq(usersTable.id, userId));

      const user = users[0];
      if (user) {
        return { user: user as UserResponse };
      }
    }

    // No access token but refresh token exists - try to refresh
    if (refreshToken && !userId) {
      const refreshResult = await sessionsService.refreshAccessToken(refreshToken);

      if (refreshResult.success) {
        // Set new access token cookie
        cookieStore.set(ACCESS_TOKEN_COOKIE, refreshResult.data.accessToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: ACCESS_TOKEN_MAX_AGE,
          path: '/',
        });

        return { user: refreshResult.data.user as UserResponse };
      } else {
        // Refresh failed - clear cookies
        cookieStore.delete(ACCESS_TOKEN_COOKIE);
        cookieStore.delete(REFRESH_TOKEN_COOKIE);
        return null;
      }
    }

    return null;
  } catch {
    return null;
  }
}

/**
 * Check if user has a valid session (for middleware/server components)
 */
export async function isAuthenticated(): Promise<boolean> {
  const session = await auth();
  return session !== null;
}

import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';
import { db } from '@/db';
import { usersTable } from '@/db/schema';
import { eq } from 'drizzle-orm';
import type { UserResponse } from '@/modules/user/types/user.types';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'your-secret-key'
);

const ACCESS_TOKEN_COOKIE = 'auth_token';
const REFRESH_TOKEN_COOKIE = 'refresh_token';

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
        const { payload } = await jwtVerify(accessToken, JWT_SECRET);
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
        // Access token invalid/expired, but we have refresh token
        // The client will handle refresh via axios interceptor
        if (!refreshToken) {
          return null;
        }
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

    // Access token expired but refresh token exists
    // Return a special state that tells client to refresh
    if (refreshToken && !userId) {
      return null; // Client will handle refresh
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

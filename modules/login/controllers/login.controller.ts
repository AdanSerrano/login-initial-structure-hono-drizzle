import type { Context } from 'hono';
import { setCookie } from 'hono/cookie';
import { LoginService } from '../services/login.service';
import type { LoginInput } from '../validations/schema/login.schema';

const ACCESS_TOKEN_COOKIE = 'auth_token';
const REFRESH_TOKEN_COOKIE = 'refresh_token';

// Cookie durations
const ACCESS_TOKEN_MAX_AGE = 60 * 15; // 15 minutes
const REFRESH_TOKEN_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

export class LoginController {
  private service: LoginService;

  constructor() {
    this.service = new LoginService();
  }

  async login(c: Context) {
    const data = await c.req.json<LoginInput>();

    // Extract IP address and User-Agent for audit logging
    const ipAddress = c.req.header('x-forwarded-for')?.split(',')[0]?.trim()
      || c.req.header('x-real-ip')
      || 'unknown';
    const userAgent = c.req.header('user-agent') || 'unknown';

    const result = await this.service.login(data, { ipAddress, userAgent });

    if (!result.success) {
      // Check if email verification is required
      if ('requiresEmailVerification' in result && result.requiresEmailVerification) {
        return c.json({
          requiresEmailVerification: true,
          email: result.email,
        }, 403);
      }

      // Check if account is deleted (within grace period)
      if ('accountDeleted' in result && result.accountDeleted) {
        return c.json({
          accountDeleted: true,
          daysRemaining: result.daysRemaining,
          email: result.email,
          error: result.error,
        }, 403);
      }

      // At this point, result must have error property
      if ('error' in result) {
        return c.json({ error: result.error }, 401);
      }
      return c.json({ error: 'Error desconocido' }, 401);
    }

    // Check if 2FA is required
    if ('requiresTwoFactor' in result && result.requiresTwoFactor) {
      return c.json({ requiresTwoFactor: true, userId: result.userId });
    }

    // At this point, result must have data property
    if (!('data' in result)) {
      return c.json({ error: 'Error interno' }, 500);
    }

    // Set access token cookie (short-lived)
    setCookie(c, ACCESS_TOKEN_COOKIE, result.data.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Lax',
      maxAge: ACCESS_TOKEN_MAX_AGE,
      path: '/',
    });

    // Set refresh token cookie (long-lived)
    setCookie(c, REFRESH_TOKEN_COOKIE, result.data.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Lax',
      maxAge: REFRESH_TOKEN_MAX_AGE,
      path: '/',
    });

    // Return user data (no tokens in response body)
    return c.json({ user: result.data.user });
  }
}

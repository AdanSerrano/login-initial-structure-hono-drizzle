import type { Context } from 'hono';
import { setCookie } from 'hono/cookie';
import { LoginService } from '../services/login.service';
import type { LoginInput } from '../validations/schema/login.schema';

const COOKIE_NAME = 'auth_token';
const COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 7 días

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
          email: result.email
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

    // Setear cookie HttpOnly con el token
    setCookie(c, COOKIE_NAME, result.data.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Lax',
      maxAge: COOKIE_MAX_AGE,
      path: '/',
    });

    // Solo devolver el usuario, no el token
    return c.json({ user: result.data.user });
  }
}

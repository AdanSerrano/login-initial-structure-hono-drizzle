import type { Context } from 'hono';
import { getCookie, setCookie, deleteCookie } from 'hono/cookie';
import jwt from 'jsonwebtoken';
import { sessionsService } from '../services/sessions.service';
import { JWT_SECRET, TOKEN_CONFIG } from '@/lib/jwt-config';

const { ACCESS_TOKEN_COOKIE, REFRESH_TOKEN_COOKIE } = TOKEN_CONFIG;

const ACCESS_TOKEN_MAX_AGE = 60 * 15; // 15 minutes
const REFRESH_TOKEN_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

interface JwtPayload {
  userId: string;
  email: string;
}

export class SessionsController {
  private getClientInfo(c: Context) {
    const ipAddress = c.req.header('x-forwarded-for')?.split(',')[0]?.trim()
      || c.req.header('x-real-ip')
      || 'unknown';
    const userAgent = c.req.header('user-agent') || 'unknown';
    return { ipAddress, userAgent };
  }

  private async getUserIdFromToken(c: Context): Promise<string | null> {
    const token = getCookie(c, ACCESS_TOKEN_COOKIE);
    if (!token) return null;

    try {
      const payload = jwt.verify(token, JWT_SECRET) as JwtPayload;
      return payload.userId;
    } catch {
      return null;
    }
  }

  /**
   * Refresh access token using refresh token
   */
  async refresh(c: Context) {
    const refreshToken = getCookie(c, REFRESH_TOKEN_COOKIE);

    if (!refreshToken) {
      return c.json({ error: 'No hay token de refresco' }, 401);
    }

    const clientInfo = this.getClientInfo(c);
    const result = await sessionsService.refreshAccessToken(refreshToken, clientInfo);

    if (!result.success) {
      // Clear both cookies on error
      deleteCookie(c, ACCESS_TOKEN_COOKIE, { path: '/' });
      deleteCookie(c, REFRESH_TOKEN_COOKIE, { path: '/' });
      return c.json({ error: result.error }, 401);
    }

    // Set new access token
    setCookie(c, ACCESS_TOKEN_COOKIE, result.data.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Lax',
      maxAge: ACCESS_TOKEN_MAX_AGE,
      path: '/',
    });

    return c.json({ user: result.data.user });
  }

  /**
   * Get all sessions for current user
   */
  async getSessions(c: Context) {
    const userId = await this.getUserIdFromToken(c);

    if (!userId) {
      return c.json({ error: 'No autenticado' }, 401);
    }

    const refreshToken = getCookie(c, REFRESH_TOKEN_COOKIE);
    const sessions = await sessionsService.getSessions(userId, refreshToken);

    return c.json({ sessions });
  }

  /**
   * Revoke a specific session
   */
  async revokeSession(c: Context) {
    const userId = await this.getUserIdFromToken(c);

    if (!userId) {
      return c.json({ error: 'No autenticado' }, 401);
    }

    const { sessionId } = await c.req.json<{ sessionId: string }>();

    if (!sessionId) {
      return c.json({ error: 'sessionId es requerido' }, 400);
    }

    const clientInfo = this.getClientInfo(c);
    const result = await sessionsService.revokeSession(userId, sessionId, clientInfo);

    if (!result.success) {
      return c.json({ error: result.error }, 400);
    }

    return c.json({ message: 'Sesión cerrada correctamente' });
  }

  /**
   * Revoke all sessions except current
   */
  async revokeAllOtherSessions(c: Context) {
    const userId = await this.getUserIdFromToken(c);

    if (!userId) {
      return c.json({ error: 'No autenticado' }, 401);
    }

    const refreshToken = getCookie(c, REFRESH_TOKEN_COOKIE);

    if (!refreshToken) {
      return c.json({ error: 'No hay sesión actual' }, 400);
    }

    const clientInfo = this.getClientInfo(c);
    const result = await sessionsService.revokeAllOtherSessions(userId, refreshToken, clientInfo);

    return c.json({
      message: `${result.count} sesión${result.count === 1 ? '' : 'es'} cerrada${result.count === 1 ? '' : 's'}`,
      count: result.count,
    });
  }
}

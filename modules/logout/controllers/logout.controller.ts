import type { Context } from 'hono';
import { deleteCookie, getCookie } from 'hono/cookie';
import { auditLogsService } from '@/modules/audit-logs/services/audit-logs.service';
import { LoginService } from '@/modules/login/services/login.service';
import { sessionsService } from '@/modules/sessions/services/sessions.service';

const ACCESS_TOKEN_COOKIE = 'auth_token';
const REFRESH_TOKEN_COOKIE = 'refresh_token';

export class LogoutController {
  private loginService: LoginService;

  constructor() {
    this.loginService = new LoginService();
  }

  async logout(c: Context) {
    // Get user info before deleting cookie for audit log
    const accessToken = getCookie(c, ACCESS_TOKEN_COOKIE);
    const refreshToken = getCookie(c, REFRESH_TOKEN_COOKIE);
    let userId: string | null = null;

    if (accessToken) {
      const user = await this.loginService.getUserFromToken(accessToken);
      userId = user?.id || null;
    }

    // Extract IP and User-Agent for audit log
    const ipAddress = c.req.header('x-forwarded-for')?.split(',')[0]?.trim()
      || c.req.header('x-real-ip')
      || 'unknown';
    const userAgent = c.req.header('user-agent') || 'unknown';

    // Delete refresh token from database
    if (refreshToken) {
      await sessionsService.deleteRefreshToken(refreshToken);
    }

    // Delete access token cookie
    deleteCookie(c, ACCESS_TOKEN_COOKIE, {
      path: '/',
    });

    // Delete refresh token cookie
    deleteCookie(c, REFRESH_TOKEN_COOKIE, {
      path: '/',
    });

    // Log the logout event
    if (userId) {
      await auditLogsService.log('LOGOUT', {
        userId,
        ipAddress,
        userAgent,
      });
    }

    return c.json({ message: 'Sesión cerrada correctamente' });
  }
}

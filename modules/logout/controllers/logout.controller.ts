import type { Context } from 'hono';
import { deleteCookie, getCookie } from 'hono/cookie';
import { auditLogsService } from '@/modules/audit-logs/services/audit-logs.service';
import { LoginService } from '@/modules/login/services/login.service';

const COOKIE_NAME = 'auth_token';

export class LogoutController {
  private loginService: LoginService;

  constructor() {
    this.loginService = new LoginService();
  }

  async logout(c: Context) {
    // Get user info before deleting cookie for audit log
    const token = getCookie(c, COOKIE_NAME);
    let userId: string | null = null;

    if (token) {
      const user = await this.loginService.getUserFromToken(token);
      userId = user?.id || null;
    }

    // Extract IP and User-Agent for audit log
    const ipAddress = c.req.header('x-forwarded-for')?.split(',')[0]?.trim()
      || c.req.header('x-real-ip')
      || 'unknown';
    const userAgent = c.req.header('user-agent') || 'unknown';

    deleteCookie(c, COOKIE_NAME, {
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

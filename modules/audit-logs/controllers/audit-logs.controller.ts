import type { Context } from 'hono';
import { AuditLogsService } from '../services/audit-logs.service';
import { LoginService } from '@/modules/login/services/login.service';
import { getCookie } from 'hono/cookie';

const COOKIE_NAME = 'auth_token';

export class AuditLogsController {
  private service: AuditLogsService;
  private loginService: LoginService;

  constructor() {
    this.service = new AuditLogsService();
    this.loginService = new LoginService();
  }

  async getMyActivity(c: Context) {
    const token = getCookie(c, COOKIE_NAME);

    if (!token) {
      return c.json({ error: 'No autorizado' }, 401);
    }

    const user = await this.loginService.getUserFromToken(token);

    if (!user) {
      return c.json({ error: 'No autorizado' }, 401);
    }

    const page = parseInt(c.req.query('page') || '1', 10);
    const limit = parseInt(c.req.query('limit') || '20', 10);

    const result = await this.service.getActivityLog(user.id, page, limit);

    return c.json(result);
  }
}

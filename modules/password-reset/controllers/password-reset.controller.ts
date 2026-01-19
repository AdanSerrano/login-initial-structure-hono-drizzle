import type { Context } from 'hono';
import { PasswordResetService } from '../services/password-reset.service';
import type { RequestPasswordResetInput, ResetPasswordInput } from '../validations/schema/password-reset.schema';

export class PasswordResetController {
  private service: PasswordResetService;

  constructor() {
    this.service = new PasswordResetService();
  }

  private getClientInfo(c: Context) {
    const ipAddress = c.req.header('x-forwarded-for')?.split(',')[0]?.trim()
      || c.req.header('x-real-ip')
      || 'unknown';
    const userAgent = c.req.header('user-agent') || 'unknown';
    return { ipAddress, userAgent };
  }

  async requestReset(c: Context) {
    const data = await c.req.json<RequestPasswordResetInput>();
    const clientInfo = this.getClientInfo(c);
    const result = await this.service.requestPasswordReset(data, clientInfo);

    if (!result.success) {
      return c.json({ error: result.error }, 400);
    }

    return c.json({ message: result.message });
  }

  async resetPassword(c: Context) {
    const data = await c.req.json<ResetPasswordInput>();
    const clientInfo = this.getClientInfo(c);
    const result = await this.service.resetPassword(data, clientInfo);

    if (!result.success) {
      return c.json({ error: result.error }, 400);
    }

    return c.json({ message: result.message });
  }

  async validateToken(c: Context) {
    const token = c.req.query('token');

    if (!token) {
      return c.json({ error: 'Token requerido' }, 400);
    }

    const result = await this.service.validateToken(token);

    if (!result.success) {
      return c.json({ error: result.error }, 400);
    }

    return c.json({ valid: true, email: result.email });
  }
}

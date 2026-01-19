import type { Context } from 'hono';
import { EmailVerificationService } from '../services/email-verification.service';
import type { VerifyEmailInput, ResendVerificationInput } from '../validations/schema/email-verification.schema';

export class EmailVerificationController {
  private service: EmailVerificationService;

  constructor() {
    this.service = new EmailVerificationService();
  }

  private getClientInfo(c: Context) {
    const ipAddress = c.req.header('x-forwarded-for')?.split(',')[0]?.trim()
      || c.req.header('x-real-ip')
      || 'unknown';
    const userAgent = c.req.header('user-agent') || 'unknown';
    return { ipAddress, userAgent };
  }

  async verify(c: Context) {
    const data = await c.req.json<VerifyEmailInput>();
    const clientInfo = this.getClientInfo(c);
    const result = await this.service.verifyEmail(data.token, clientInfo);

    if (!result.success) {
      return c.json({ error: result.error }, 400);
    }

    return c.json({ message: result.message });
  }

  async verifyFromQuery(c: Context) {
    const token = c.req.query('token');

    if (!token) {
      return c.json({ error: 'Token requerido' }, 400);
    }

    const clientInfo = this.getClientInfo(c);
    const result = await this.service.verifyEmail(token, clientInfo);

    if (!result.success) {
      return c.json({ error: result.error }, 400);
    }

    return c.json({ message: result.message });
  }

  async resend(c: Context) {
    const data = await c.req.json<ResendVerificationInput>();
    const clientInfo = this.getClientInfo(c);
    const result = await this.service.resendVerification(data, clientInfo);

    if (!result.success) {
      return c.json({ error: result.error }, 400);
    }

    return c.json({ message: result.message });
  }
}

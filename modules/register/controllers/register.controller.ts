import type { Context } from 'hono';
import { RegisterService } from '../services/register.service';
import type { RegisterInput } from '../validations/schema/register.schema';

export class RegisterController {
  private service: RegisterService;

  constructor() {
    this.service = new RegisterService();
  }

  async register(c: Context) {
    const data = await c.req.json<RegisterInput>();

    // Extract IP address and User-Agent for audit logging
    const ipAddress = c.req.header('x-forwarded-for')?.split(',')[0]?.trim()
      || c.req.header('x-real-ip')
      || 'unknown';
    const userAgent = c.req.header('user-agent') || 'unknown';

    const result = await this.service.register(data, { ipAddress, userAgent });

    if (!result.success) {
      return c.json({ error: result.error }, 400);
    }

    return c.json({ message: result.message }, 201);
  }
}

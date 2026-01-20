import type { Context } from 'hono';
import { emailChangeService } from '../services/email-change.service';
import { requestEmailChangeSchema, verifyEmailChangeSchema } from '../validations/schema/email-change.schema';

export class EmailChangeController {
  async requestChange(c: Context) {
    const userId = c.get('userId');
    if (!userId) {
      return c.json({ error: 'No autorizado' }, 401);
    }

    const body = await c.req.json();
    const validation = requestEmailChangeSchema.safeParse(body);

    if (!validation.success) {
      return c.json(
        { error: validation.error.issues[0]?.message || 'Datos inválidos' },
        400
      );
    }

    const ipAddress = c.req.header('x-forwarded-for')?.split(',')[0]?.trim()
      || c.req.header('x-real-ip')
      || 'unknown';
    const userAgent = c.req.header('user-agent') || 'unknown';

    const result = await emailChangeService.requestEmailChange(
      userId,
      validation.data,
      { ipAddress, userAgent }
    );

    if (!result.success) {
      return c.json({ error: result.error }, 400);
    }

    return c.json({ message: result.message });
  }

  async verifyChange(c: Context) {
    const body = await c.req.json();
    const validation = verifyEmailChangeSchema.safeParse(body);

    if (!validation.success) {
      return c.json(
        { error: validation.error.issues[0]?.message || 'Datos inválidos' },
        400
      );
    }

    const ipAddress = c.req.header('x-forwarded-for')?.split(',')[0]?.trim()
      || c.req.header('x-real-ip')
      || 'unknown';
    const userAgent = c.req.header('user-agent') || 'unknown';

    const result = await emailChangeService.verifyEmailChange(
      validation.data.token,
      { ipAddress, userAgent }
    );

    if (!result.success) {
      return c.json({ error: result.error }, 400);
    }

    return c.json({ message: result.message, newEmail: result.newEmail });
  }

  async getPending(c: Context) {
    const userId = c.get('userId');
    if (!userId) {
      return c.json({ error: 'No autorizado' }, 401);
    }

    const pending = await emailChangeService.getPendingRequest(userId);

    if (!pending) {
      return c.json({ hasPending: false });
    }

    return c.json({
      hasPending: true,
      newEmail: pending.newEmail,
      expiresAt: pending.expiresAt,
    });
  }

  async cancelPending(c: Context) {
    const userId = c.get('userId');
    if (!userId) {
      return c.json({ error: 'No autorizado' }, 401);
    }

    await emailChangeService.cancelPendingRequest(userId);
    return c.json({ message: 'Solicitud cancelada' });
  }
}

export const emailChangeController = new EmailChangeController();

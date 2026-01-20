import type { Context } from 'hono';
import { setCookie } from 'hono/cookie';
import { magicLinkService } from '../services/magic-link.service';
import { z } from 'zod';

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
const ACCESS_TOKEN_COOKIE = 'auth_token';
const REFRESH_TOKEN_COOKIE = 'refresh_token';

const sendMagicLinkSchema = z.object({
  email: z.string().email('Correo electrónico inválido'),
});

const verifyMagicLinkSchema = z.object({
  token: z.string().min(1, 'Token requerido'),
});

export class MagicLinkController {
  async sendMagicLink(c: Context) {
    const body = await c.req.json();
    const validation = sendMagicLinkSchema.safeParse(body);

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

    const result = await magicLinkService.sendMagicLink(
      validation.data.email,
      { ipAddress, userAgent }
    );

    if (!result.success) {
      return c.json({ error: result.error }, 400);
    }

    return c.json({ message: result.message });
  }

  async verifyMagicLink(c: Context) {
    const body = await c.req.json();
    const validation = verifyMagicLinkSchema.safeParse(body);

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

    const result = await magicLinkService.verifyMagicLink(
      validation.data.token,
      { ipAddress, userAgent }
    );

    if (!result.success) {
      return c.json({ error: result.error }, 400);
    }

    // Set cookies
    setCookie(c, ACCESS_TOKEN_COOKIE, result.accessToken!, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Lax',
      path: '/',
      maxAge: 15 * 60, // 15 minutes
    });

    setCookie(c, REFRESH_TOKEN_COOKIE, result.refreshToken!, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    return c.json({
      message: 'Sesión iniciada exitosamente',
      user: result.user,
      isNewUser: result.isNewUser,
    });
  }
}

export const magicLinkController = new MagicLinkController();

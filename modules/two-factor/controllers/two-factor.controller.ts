import type { Context } from 'hono';
import { setCookie, getCookie } from 'hono/cookie';
import jwt from 'jsonwebtoken';
import { TwoFactorService } from '../services/two-factor.service';
import type { VerifyTwoFactorInput, VerifyTwoFactorLoginInput } from '../validations/schema/two-factor.schema';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const ACCESS_TOKEN_COOKIE = 'auth_token';
const REFRESH_TOKEN_COOKIE = 'refresh_token';

// Cookie durations
const ACCESS_TOKEN_MAX_AGE = 60 * 15; // 15 minutes
const REFRESH_TOKEN_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

interface JwtPayload {
  userId: string;
  email: string;
}

export class TwoFactorController {
  private service: TwoFactorService;

  constructor() {
    this.service = new TwoFactorService();
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

  private getClientInfo(c: Context) {
    const ipAddress = c.req.header('x-forwarded-for')?.split(',')[0]?.trim()
      || c.req.header('x-real-ip')
      || 'unknown';
    const userAgent = c.req.header('user-agent') || 'unknown';
    return { ipAddress, userAgent };
  }

  private setAuthCookies(c: Context, accessToken: string, refreshToken: string) {
    // Set access token cookie (short-lived)
    setCookie(c, ACCESS_TOKEN_COOKIE, accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Lax',
      maxAge: ACCESS_TOKEN_MAX_AGE,
      path: '/',
    });

    // Set refresh token cookie (long-lived)
    setCookie(c, REFRESH_TOKEN_COOKIE, refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Lax',
      maxAge: REFRESH_TOKEN_MAX_AGE,
      path: '/',
    });
  }

  // Setup 2FA with Authenticator (TOTP)
  async setupAuthenticator(c: Context) {
    const userId = await this.getUserIdFromToken(c);

    if (!userId) {
      return c.json({ error: 'No autenticado' }, 401);
    }

    const result = await this.service.setupAuthenticator(userId);

    if (!result.success) {
      return c.json({ error: result.error }, 400);
    }

    return c.json(result.data);
  }

  // Setup 2FA with Email
  async setupEmail(c: Context) {
    const userId = await this.getUserIdFromToken(c);

    if (!userId) {
      return c.json({ error: 'No autenticado' }, 401);
    }

    const result = await this.service.setupEmail(userId);

    if (!result.success) {
      return c.json({ error: result.error }, 400);
    }

    return c.json(result.data);
  }

  // Verify and enable 2FA with Authenticator
  async verifyAuthenticator(c: Context) {
    const userId = await this.getUserIdFromToken(c);

    if (!userId) {
      return c.json({ error: 'No autenticado' }, 401);
    }

    const data = await c.req.json<VerifyTwoFactorInput>();
    const clientInfo = this.getClientInfo(c);
    const result = await this.service.verifyAndEnableAuthenticator(userId, data, clientInfo);

    if (!result.success) {
      return c.json({ error: result.error }, 400);
    }

    return c.json({ message: result.message });
  }

  // Verify and enable 2FA with Email
  async verifyEmail(c: Context) {
    const userId = await this.getUserIdFromToken(c);

    if (!userId) {
      return c.json({ error: 'No autenticado' }, 401);
    }

    const data = await c.req.json<VerifyTwoFactorInput>();
    const clientInfo = this.getClientInfo(c);
    const result = await this.service.verifyAndEnableEmail(userId, data, clientInfo);

    if (!result.success) {
      return c.json({ error: result.error }, 400);
    }

    return c.json({ message: result.message });
  }

  // Send disable code (for email method)
  async sendDisableCode(c: Context) {
    const userId = await this.getUserIdFromToken(c);

    if (!userId) {
      return c.json({ error: 'No autenticado' }, 401);
    }

    const result = await this.service.sendDisableCode(userId);

    if (!result.success) {
      return c.json({ error: result.error }, 400);
    }

    return c.json({ message: 'Código enviado a tu correo' });
  }

  // Disable 2FA
  async disable(c: Context) {
    const userId = await this.getUserIdFromToken(c);

    if (!userId) {
      return c.json({ error: 'No autenticado' }, 401);
    }

    const data = await c.req.json<VerifyTwoFactorInput>();
    const clientInfo = this.getClientInfo(c);
    const result = await this.service.disableTwoFactor(userId, data, clientInfo);

    if (!result.success) {
      return c.json({ error: result.error }, 400);
    }

    return c.json({ message: result.message });
  }

  // Send login code (for email method during login)
  async sendLoginCode(c: Context) {
    const { userId } = await c.req.json<{ userId: string }>();

    if (!userId) {
      return c.json({ error: 'userId es requerido' }, 400);
    }

    const result = await this.service.sendLoginCode(userId);

    if (!result.success) {
      return c.json({ error: result.error }, 400);
    }

    return c.json({ message: 'Código enviado a tu correo' });
  }

  // Verify 2FA during login
  async verifyLogin(c: Context) {
    const data = await c.req.json<VerifyTwoFactorLoginInput & { trustDevice?: boolean }>();
    const clientInfo = this.getClientInfo(c);
    const result = await this.service.verifyTwoFactorLogin(
      { userId: data.userId, code: data.code },
      { ...clientInfo, trustDevice: data.trustDevice }
    );

    if (!result.success) {
      return c.json({ error: result.error }, 401);
    }

    // Set both access and refresh token cookies
    this.setAuthCookies(c, result.accessToken, result.refreshToken);

    return c.json({ user: result.data.user });
  }

  // Get 2FA method for user
  async getMethod(c: Context) {
    const userId = await this.getUserIdFromToken(c);

    if (!userId) {
      return c.json({ error: 'No autenticado' }, 401);
    }

    const result = await this.service.getTwoFactorMethod(userId);

    if (!result) {
      return c.json({ error: 'Usuario no encontrado' }, 404);
    }

    return c.json(result);
  }

  // Generate backup codes
  async generateBackupCodes(c: Context) {
    const userId = await this.getUserIdFromToken(c);

    if (!userId) {
      return c.json({ error: 'No autenticado' }, 401);
    }

    const clientInfo = this.getClientInfo(c);
    const result = await this.service.generateBackupCodes(userId, clientInfo);

    if (!result.success) {
      return c.json({ error: result.error }, 400);
    }

    return c.json(result.data);
  }

  // Verify login with backup code
  async verifyLoginWithBackupCode(c: Context) {
    const data = await c.req.json<{ userId: string; code: string; trustDevice?: boolean }>();
    const clientInfo = this.getClientInfo(c);
    const result = await this.service.verifyTwoFactorLoginWithBackupCode(
      { userId: data.userId, code: data.code },
      { ...clientInfo, trustDevice: data.trustDevice }
    );

    if (!result.success) {
      return c.json({ error: result.error }, 401);
    }

    // Set both access and refresh token cookies
    this.setAuthCookies(c, result.accessToken, result.refreshToken);

    return c.json({ user: result.data.user, remainingCodes: result.remainingCodes });
  }

  // Get remaining backup codes count
  async getBackupCodesCount(c: Context) {
    const userId = await this.getUserIdFromToken(c);

    if (!userId) {
      return c.json({ error: 'No autenticado' }, 401);
    }

    const count = await this.service.getRemainingBackupCodes(userId);
    return c.json({ remainingCodes: count });
  }
}

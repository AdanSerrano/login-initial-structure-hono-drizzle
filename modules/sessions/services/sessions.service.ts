import jwt from 'jsonwebtoken';
import { SessionsRepository } from '../repository/sessions.repository';
import { auditLogsService } from '@/modules/audit-logs/services/audit-logs.service';
import type { Session, RefreshTokenResult } from '../types/sessions.types';
import type { User, TwoFactorMethod } from '@/modules/login/types/login.types';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Token durations
const ACCESS_TOKEN_EXPIRES_IN = '15m'; // 15 minutes
const REFRESH_TOKEN_EXPIRES_DAYS = 7; // 7 days

export interface SessionOptions {
  ipAddress?: string;
  userAgent?: string;
}

export class SessionsService {
  private repository: SessionsRepository;

  constructor() {
    this.repository = new SessionsRepository();
  }

  /**
   * Generate access token (short-lived JWT)
   * Includes full user data to avoid DB queries on every request
   */
  generateAccessToken(userId: string, email: string, userData?: Partial<User>): string {
    const payload = {
      userId,
      email,
      // Include user data if provided (for faster auth() without DB query)
      ...(userData && {
        name: userData.name,
        userName: userData.userName,
        emailVerified: userData.emailVerified,
        image: userData.image,
        role: userData.role,
        isTwoFactorEnabled: userData.isTwoFactorEnabled,
        twoFactorMethod: userData.twoFactorMethod,
      }),
    };
    return jwt.sign(payload, JWT_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRES_IN });
  }

  /**
   * Generate refresh token (long-lived UUID stored in DB)
   */
  async createRefreshToken(
    userId: string,
    options: SessionOptions = {}
  ): Promise<{ token: string; expiresAt: Date }> {
    const token = crypto.randomUUID();
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + REFRESH_TOKEN_EXPIRES_DAYS);

    // Parse device name from user agent
    const deviceName = this.parseDeviceName(options.userAgent);

    await this.repository.create({
      userId,
      token,
      expiresAt,
      ipAddress: options.ipAddress,
      userAgent: options.userAgent,
      deviceName,
    });

    return { token, expiresAt };
  }

  /**
   * Refresh access token using refresh token
   */
  async refreshAccessToken(
    refreshToken: string,
    options: SessionOptions = {}
  ): Promise<{ success: true; data: RefreshTokenResult } | { success: false; error: string }> {
    const tokenRecord = await this.repository.findByToken(refreshToken);

    if (!tokenRecord) {
      return { success: false, error: 'Token de refresco inválido' };
    }

    // Check if expired
    if (tokenRecord.expiresAt < new Date()) {
      await this.repository.delete(tokenRecord.id);
      return { success: false, error: 'Token de refresco expirado' };
    }

    // Get user
    const user = await this.repository.findUserById(tokenRecord.userId);

    if (!user) {
      await this.repository.delete(tokenRecord.id);
      return { success: false, error: 'Usuario no encontrado' };
    }

    // Check if user is blocked or deleted
    if (user.isBlocked || user.deletedAt) {
      await this.repository.delete(tokenRecord.id);
      return { success: false, error: 'Cuenta no disponible' };
    }

    // Update last used
    await this.repository.updateLastUsedAt(tokenRecord.id);

    const userData = {
      id: user.id,
      userName: user.userName,
      name: user.name,
      email: user.email,
      emailVerified: user.emailVerified,
      image: user.image,
      role: user.role,
      isTwoFactorEnabled: user.isTwoFactorEnabled,
      twoFactorMethod: user.twoFactorMethod as TwoFactorMethod | null,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    // Generate new access token with user data
    const accessToken = this.generateAccessToken(user.id, user.email!, userData);

    return {
      success: true,
      data: {
        accessToken,
        user: userData,
      },
    };
  }

  /**
   * Get all sessions for a user
   */
  async getSessions(userId: string, currentToken?: string): Promise<Session[]> {
    const tokens = await this.repository.findAllByUserId(userId);

    return tokens.map((token) => ({
      id: token.id,
      deviceName: token.deviceName,
      ipAddress: token.ipAddress,
      userAgent: token.userAgent,
      lastUsedAt: token.lastUsedAt,
      createdAt: token.createdAt,
      isCurrent: token.token === currentToken,
    }));
  }

  /**
   * Revoke a specific session
   */
  async revokeSession(
    userId: string,
    sessionId: string,
    options: SessionOptions = {}
  ): Promise<{ success: boolean; error?: string }> {
    const session = await this.repository.findById(sessionId);

    if (!session) {
      return { success: false, error: 'Sesión no encontrada' };
    }

    if (session.userId !== userId) {
      return { success: false, error: 'No autorizado' };
    }

    await this.repository.delete(sessionId);

    await auditLogsService.log('SESSION_REVOKED', {
      userId,
      ipAddress: options.ipAddress,
      userAgent: options.userAgent,
      metadata: { revokedSessionId: sessionId },
    });

    return { success: true };
  }

  /**
   * Revoke all sessions except current
   */
  async revokeAllOtherSessions(
    userId: string,
    currentToken: string,
    options: SessionOptions = {}
  ): Promise<{ success: boolean; count: number }> {
    const sessions = await this.repository.findAllByUserId(userId);
    let count = 0;

    for (const session of sessions) {
      if (session.token !== currentToken) {
        await this.repository.delete(session.id);
        count++;
      }
    }

    if (count > 0) {
      await auditLogsService.log('SESSION_REVOKED', {
        userId,
        ipAddress: options.ipAddress,
        userAgent: options.userAgent,
        metadata: { revokedCount: count, type: 'all_other_sessions' },
      });
    }

    return { success: true, count };
  }

  /**
   * Revoke all sessions (for logout from all devices)
   */
  async revokeAllSessions(
    userId: string,
    options: SessionOptions = {}
  ): Promise<void> {
    const count = await this.repository.countByUserId(userId);
    await this.repository.deleteAllByUserId(userId);

    if (count > 0) {
      await auditLogsService.log('SESSION_REVOKED', {
        userId,
        ipAddress: options.ipAddress,
        userAgent: options.userAgent,
        metadata: { revokedCount: count, type: 'all_sessions' },
      });
    }
  }

  /**
   * Delete refresh token by token value
   */
  async deleteRefreshToken(token: string): Promise<void> {
    await this.repository.deleteByToken(token);
  }

  /**
   * Clean up expired tokens (call periodically)
   */
  async cleanupExpiredTokens(): Promise<void> {
    await this.repository.deleteExpired();
  }

  /**
   * Parse device name from user agent
   */
  private parseDeviceName(userAgent?: string | null): string | null {
    if (!userAgent) return null;

    const ua = userAgent.toLowerCase();

    // Browser detection
    let browser = 'Navegador desconocido';
    if (ua.includes('firefox')) browser = 'Firefox';
    else if (ua.includes('edg/')) browser = 'Edge';
    else if (ua.includes('chrome')) browser = 'Chrome';
    else if (ua.includes('safari')) browser = 'Safari';
    else if (ua.includes('opera') || ua.includes('opr/')) browser = 'Opera';

    // OS detection
    let os = '';
    if (ua.includes('windows')) os = 'Windows';
    else if (ua.includes('mac os') || ua.includes('macos')) os = 'macOS';
    else if (ua.includes('linux')) os = 'Linux';
    else if (ua.includes('android')) os = 'Android';
    else if (ua.includes('iphone') || ua.includes('ipad')) os = 'iOS';

    return os ? `${browser} en ${os}` : browser;
  }
}

export const sessionsService = new SessionsService();

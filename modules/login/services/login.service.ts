import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { LoginRepository } from '../repository/login.repository';
import { auditLogsService } from '@/modules/audit-logs/services/audit-logs.service';
import type { LoginInput } from '../validations/schema/login.schema';
import type { User, JwtPayload, LoginResult, TwoFactorMethod } from '../types/login.types';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const JWT_EXPIRES_IN = '7d';

// Rate limiting constants
const MAX_FAILED_ATTEMPTS = 5;
const LOCK_DURATION_MINUTES = 15;

export interface LoginOptions {
  ipAddress?: string;
  userAgent?: string;
}

export class LoginService {
  private repository: LoginRepository;

  constructor() {
    this.repository = new LoginRepository();
  }

  async login(data: LoginInput, options: LoginOptions = {}): Promise<LoginResult> {
    const { ipAddress, userAgent } = options;
    const existingUser = await this.repository.findByEmailOrUsername(data.identifier);

    if (!existingUser || !existingUser.password) {
      // Log failed attempt for non-existent user
      await auditLogsService.log('LOGIN_FAILED', {
        ipAddress,
        userAgent,
        metadata: { identifier: data.identifier, reason: 'user_not_found' },
      });
      return { success: false, error: 'Credenciales inválidas' };
    }

    // Check if user is completely blocked
    if (existingUser.isBlocked) {
      await auditLogsService.log('LOGIN_FAILED', {
        userId: existingUser.id,
        ipAddress,
        userAgent,
        metadata: { reason: 'account_blocked' },
      });
      return {
        success: false,
        error: existingUser.blockedReason || 'Tu cuenta ha sido bloqueada. Contacta al administrador.'
      };
    }

    // Check if LOGIN action is specifically blocked
    if (existingUser.blockedActions?.includes('LOGIN')) {
      await auditLogsService.log('LOGIN_FAILED', {
        userId: existingUser.id,
        ipAddress,
        userAgent,
        metadata: { reason: 'login_action_blocked' },
      });
      return {
        success: false,
        error: 'El inicio de sesión ha sido deshabilitado para tu cuenta.'
      };
    }

    // Check if account is temporarily locked (due to failed attempts)
    if (existingUser.lockedUntil && existingUser.lockedUntil > new Date()) {
      const remainingMinutes = Math.ceil((existingUser.lockedUntil.getTime() - Date.now()) / 60000);
      await auditLogsService.log('LOGIN_FAILED', {
        userId: existingUser.id,
        ipAddress,
        userAgent,
        metadata: { reason: 'account_locked', remainingMinutes },
      });
      return {
        success: false,
        error: `Cuenta bloqueada temporalmente. Intenta de nuevo en ${remainingMinutes} minuto${remainingMinutes === 1 ? '' : 's'}.`
      };
    }

    const isPasswordValid = await bcrypt.compare(data.password, existingUser.password);

    if (!isPasswordValid) {
      // Increment failed attempts
      const attempts = (existingUser.failedLoginAttempts || 0) + 1;

      if (attempts >= MAX_FAILED_ATTEMPTS) {
        // Lock account for 15 minutes
        const lockedUntil = new Date(Date.now() + LOCK_DURATION_MINUTES * 60 * 1000);
        await this.repository.lockAccount(existingUser.id, lockedUntil);

        await auditLogsService.log('ACCOUNT_LOCKED', {
          userId: existingUser.id,
          ipAddress,
          userAgent,
          metadata: {
            reason: 'max_failed_attempts',
            failedAttempts: attempts,
            lockedUntilTimestamp: lockedUntil.toISOString(),
          },
        });

        return {
          success: false,
          error: `Demasiados intentos fallidos. Tu cuenta ha sido bloqueada por ${LOCK_DURATION_MINUTES} minutos.`
        };
      } else {
        // Update failed attempts counter
        await this.repository.updateFailedLoginAttempts(existingUser.id, attempts, new Date());

        await auditLogsService.log('LOGIN_FAILED', {
          userId: existingUser.id,
          ipAddress,
          userAgent,
          metadata: {
            reason: 'invalid_password',
            failedAttempts: attempts,
            attemptsRemaining: MAX_FAILED_ATTEMPTS - attempts,
          },
        });
      }

      return { success: false, error: 'Credenciales inválidas' };
    }

    // Check if email is verified
    if (!existingUser.emailVerified) {
      await auditLogsService.log('LOGIN_FAILED', {
        userId: existingUser.id,
        ipAddress,
        userAgent,
        metadata: { reason: 'email_not_verified' },
      });
      return {
        success: false,
        requiresEmailVerification: true,
        email: existingUser.email!,
      };
    }

    // Check if 2FA is enabled
    if (existingUser.isTwoFactorEnabled && existingUser.twoFactorMethod) {
      // Don't log LOGIN_SUCCESS yet - will be logged after 2FA verification
      return {
        success: true,
        requiresTwoFactor: true,
        userId: existingUser.id,
        twoFactorMethod: existingUser.twoFactorMethod as TwoFactorMethod,
      };
    }

    // Reset failed attempts on successful login
    if (existingUser.failedLoginAttempts > 0 || existingUser.lockedUntil) {
      await this.repository.unlockAccount(existingUser.id);
    }

    const user: User = {
      id: existingUser.id,
      userName: existingUser.userName,
      name: existingUser.name,
      email: existingUser.email,
      emailVerified: existingUser.emailVerified,
      image: existingUser.image,
      role: existingUser.role,
      isTwoFactorEnabled: existingUser.isTwoFactorEnabled,
      twoFactorMethod: existingUser.twoFactorMethod as TwoFactorMethod | null,
      createdAt: existingUser.createdAt,
      updatedAt: existingUser.updatedAt,
    };

    const token = this.generateToken(user);

    // Log successful login
    await auditLogsService.log('LOGIN_SUCCESS', {
      userId: user.id,
      ipAddress,
      userAgent,
    });

    return {
      success: true,
      data: { user, token },
    };
  }

  async getUserFromToken(token: string): Promise<User | null> {
    try {
      const payload = jwt.verify(token, JWT_SECRET) as JwtPayload;
      const user = await this.repository.findById(payload.userId);

      if (!user) return null;

      return {
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
    } catch {
      return null;
    }
  }

  private generateToken(user: User): string {
    return jwt.sign(
      { userId: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );
  }
}

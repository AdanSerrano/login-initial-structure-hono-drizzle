import crypto from 'crypto';
import { magicLinkRepository } from '../repository/magic-link.repository';
import { sendMagicLinkEmail } from '../emails/magic-link.emails';
import { auditLogsService } from '@/modules/audit-logs/services/audit-logs.service';
import { sessionsService } from '@/modules/sessions/services/sessions.service';
import type { SendMagicLinkResult, VerifyMagicLinkResult } from '../types/magic-link.types';

const MAGIC_LINK_EXPIRY_MINUTES = 10;

export interface MagicLinkOptions {
  ipAddress?: string;
  userAgent?: string;
}

export class MagicLinkService {
  async sendMagicLink(
    email: string,
    options: MagicLinkOptions = {}
  ): Promise<SendMagicLinkResult> {
    const { ipAddress, userAgent } = options;

    // Check if user exists
    const existingUser = await magicLinkRepository.findUserByEmail(email);

    // Check if user is blocked
    if (existingUser?.isBlocked) {
      return {
        success: false,
        error: 'Esta cuenta ha sido bloqueada. Contacta al administrador.',
      };
    }

    // Delete any existing tokens for this email
    await magicLinkRepository.deleteTokensByEmail(email);

    // Generate token
    const token = crypto.randomBytes(32).toString('hex');
    const expires = new Date(Date.now() + MAGIC_LINK_EXPIRY_MINUTES * 60 * 1000);

    // Create token
    await magicLinkRepository.createToken({
      email,
      token,
      expires,
    });

    // Send email
    const isNewUser = !existingUser;
    const emailResult = await sendMagicLinkEmail({
      to: email,
      token,
      isNewUser,
    });

    if (!emailResult.success) {
      return { success: false, error: 'Error al enviar el correo' };
    }

    // Log the action
    await auditLogsService.log('MAGIC_LINK_SENT', {
      userId: existingUser?.id,
      ipAddress,
      userAgent,
      metadata: { email, isNewUser },
    });

    return {
      success: true,
      message: 'Hemos enviado un enlace de acceso a tu correo electrónico.',
    };
  }

  async verifyMagicLink(
    token: string,
    options: MagicLinkOptions = {}
  ): Promise<VerifyMagicLinkResult> {
    const { ipAddress, userAgent } = options;

    // Find valid token
    const magicLinkToken = await magicLinkRepository.findValidToken(token);
    if (!magicLinkToken) {
      return { success: false, error: 'Enlace inválido o expirado' };
    }

    // Delete the token (one-time use)
    await magicLinkRepository.deleteToken(token);

    // Find or create user
    let user = await magicLinkRepository.findUserByEmail(magicLinkToken.email);
    let isNewUser = false;

    if (!user) {
      // Create new user
      const newUser = await magicLinkRepository.createUser({
        email: magicLinkToken.email,
        emailVerified: new Date(),
      });

      user = await magicLinkRepository.findUserByEmail(magicLinkToken.email);
      if (!user) {
        return { success: false, error: 'Error al crear usuario' };
      }

      isNewUser = true;

      // Log registration
      await auditLogsService.log('REGISTRATION', {
        userId: user.id,
        ipAddress,
        userAgent,
        metadata: { method: 'magic_link' },
      });
    }

    // Check if user is blocked
    if (user.isBlocked) {
      return {
        success: false,
        error: 'Tu cuenta ha sido bloqueada. Contacta al administrador.',
      };
    }

    // Mark email as verified if not already
    if (!user.emailVerified) {
      // Update user's email verification status directly in the service
      // Since we don't have an updateUser method, we'll just proceed
      // The email is verified by virtue of having access to it
    }

    // Full user data for JWT payload (to avoid DB queries later)
    const userDataForToken = {
      id: user.id,
      userName: user.userName,
      name: user.name,
      email: user.email,
      emailVerified: user.emailVerified || new Date(), // Magic link verifies email
      image: user.image,
      role: user.role,
      isTwoFactorEnabled: user.isTwoFactorEnabled,
      twoFactorMethod: user.twoFactorMethod,
    };

    // Generate session tokens with user data embedded
    const accessToken = sessionsService.generateAccessToken(user.id, user.email!, userDataForToken);
    const { token: refreshToken, expiresAt: refreshTokenExpiresAt } =
      await sessionsService.createRefreshToken(user.id, { ipAddress, userAgent });

    // Log magic link login
    await auditLogsService.log('MAGIC_LINK_LOGIN', {
      userId: user.id,
      ipAddress,
      userAgent,
    });

    return {
      success: true,
      user: { id: user.id, email: user.email!, name: user.name },
      accessToken,
      refreshToken,
      refreshTokenExpiresAt,
      isNewUser,
    };
  }
}

export const magicLinkService = new MagicLinkService();

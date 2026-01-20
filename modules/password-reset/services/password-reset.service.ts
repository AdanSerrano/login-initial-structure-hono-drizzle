import bcrypt from 'bcryptjs';
import { PasswordResetRepository } from '../repository/password-reset.repository';
import { sendPasswordResetEmail } from '../emails/password-reset.emails';
import { generateVerificationToken, TOKEN_EXPIRY } from '@/lib/tokens';
import { auditLogsService } from '@/modules/audit-logs/services/audit-logs.service';
import { passwordHistoryService } from '@/modules/password-history/services/password-history.service';
import type { RequestPasswordResetInput, ResetPasswordInput } from '../validations/schema/password-reset.schema';

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
const BCRYPT_SALT_ROUNDS = 10;

export interface PasswordResetOptions {
  ipAddress?: string;
  userAgent?: string;
}

export class PasswordResetService {
  private repository: PasswordResetRepository;

  constructor() {
    this.repository = new PasswordResetRepository();
  }

  async requestPasswordReset(
    data: RequestPasswordResetInput,
    options: PasswordResetOptions = {}
  ): Promise<{ success: true; message: string } | { success: false; error: string }> {
    const { ipAddress, userAgent } = options;
    const user = await this.repository.findUserByEmail(data.email);

    // Always return success to prevent email enumeration
    if (!user) {
      return {
        success: true,
        message: 'Si el email existe, recibirás un correo con instrucciones.'
      };
    }

    // Delete any existing tokens for this email
    await this.repository.deleteTokensByEmail(data.email);

    // Generate new token
    const token = generateVerificationToken();
    const expires = new Date(Date.now() + TOKEN_EXPIRY.PASSWORD_RESET);

    await this.repository.createToken(data.email, token, expires);

    // Send email
    const resetLink = `${APP_URL}/reset-password?token=${token}`;
    const emailResult = await sendPasswordResetEmail({
      to: data.email,
      resetLink,
      userName: user.name ?? undefined,
    });

    if (!emailResult.success) {
      return { success: false, error: 'Error al enviar el correo' };
    }

    // Log password reset request
    await auditLogsService.log('PASSWORD_RESET_REQUESTED', {
      userId: user.id,
      ipAddress,
      userAgent,
    });

    return {
      success: true,
      message: 'Si el email existe, recibirás un correo con instrucciones.'
    };
  }

  async resetPassword(
    data: ResetPasswordInput,
    options: PasswordResetOptions = {}
  ): Promise<{ success: true; message: string } | { success: false; error: string }> {
    const { ipAddress, userAgent } = options;
    const tokenRecord = await this.repository.findValidToken(data.token);

    if (!tokenRecord) {
      return { success: false, error: 'Token inválido o expirado' };
    }

    // Get user for audit log and password history check
    const user = await this.repository.findUserByEmail(tokenRecord.email);

    if (!user) {
      return { success: false, error: 'Usuario no encontrado' };
    }

    // Check if password was used recently
    const wasUsedRecently = await passwordHistoryService.wasPasswordUsedRecently(
      user.id,
      data.password
    );

    if (wasUsedRecently) {
      return {
        success: false,
        error: 'No puedes usar una contraseña que hayas usado recientemente. Por favor, elige una nueva.',
      };
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(data.password, BCRYPT_SALT_ROUNDS);

    // Update user password
    await this.repository.updateUserPassword(tokenRecord.email, hashedPassword);

    // Add password to history
    await passwordHistoryService.addPasswordToHistory(user.id, hashedPassword);

    // Reset failed login attempts and unlock account
    await this.repository.resetLoginAttempts(tokenRecord.email);

    // Delete the used token
    await this.repository.deleteToken(tokenRecord.id);

    // Log password reset completed
    await auditLogsService.log('PASSWORD_RESET_COMPLETED', {
      userId: user.id,
      ipAddress,
      userAgent,
    });

    return { success: true, message: 'Contraseña actualizada correctamente' };
  }

  async validateToken(token: string): Promise<{ success: true; email: string } | { success: false; error: string }> {
    const tokenRecord = await this.repository.findValidToken(token);

    if (!tokenRecord) {
      return { success: false, error: 'Token inválido o expirado' };
    }

    return { success: true, email: tokenRecord.email };
  }
}

import { EmailVerificationRepository } from '../repository/email-verification.repository';
import { sendVerificationEmail } from '../emails/email-verification.emails';
import { generateVerificationToken, TOKEN_EXPIRY } from '@/lib/tokens';
import { auditLogsService } from '@/modules/audit-logs/services/audit-logs.service';
import type { ResendVerificationInput } from '../validations/schema/email-verification.schema';

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

export interface VerificationOptions {
  ipAddress?: string;
  userAgent?: string;
}

export class EmailVerificationService {
  private repository: EmailVerificationRepository;

  constructor() {
    this.repository = new EmailVerificationRepository();
  }

  async verifyEmail(
    token: string,
    options: VerificationOptions = {}
  ): Promise<{ success: true; message: string } | { success: false; error: string }> {
    const { ipAddress, userAgent } = options;
    const tokenRecord = await this.repository.findValidToken(token);

    if (!tokenRecord) {
      return { success: false, error: 'Token inválido o expirado' };
    }

    // Check if user exists
    const user = await this.repository.findUserByEmail(tokenRecord.email);
    if (!user) {
      return { success: false, error: 'Usuario no encontrado' };
    }

    // Check if already verified
    if (user.emailVerified) {
      await this.repository.deleteToken(tokenRecord.id);
      return { success: true, message: 'El correo ya fue verificado anteriormente' };
    }

    // Mark email as verified
    await this.repository.markEmailAsVerified(tokenRecord.email);

    // Delete the used token
    await this.repository.deleteToken(tokenRecord.id);

    // Log email verification
    await auditLogsService.log('EMAIL_VERIFIED', {
      userId: user.id,
      ipAddress,
      userAgent,
    });

    return { success: true, message: 'Correo verificado correctamente' };
  }

  async resendVerification(
    data: ResendVerificationInput,
    options: VerificationOptions = {}
  ): Promise<{ success: true; message: string } | { success: false; error: string }> {
    const { ipAddress, userAgent } = options;
    const user = await this.repository.findUserByEmail(data.email);

    // Always return success to prevent email enumeration
    if (!user) {
      return {
        success: true,
        message: 'Si el email existe, recibirás un correo de verificación.'
      };
    }

    // Check if already verified
    if (user.emailVerified) {
      return { success: false, error: 'El correo ya está verificado' };
    }

    // Delete any existing tokens for this email
    await this.repository.deleteTokensByEmail(data.email);

    // Generate new token
    const token = generateVerificationToken();
    const expires = new Date(Date.now() + TOKEN_EXPIRY.VERIFICATION);

    await this.repository.createToken(data.email, token, expires);

    // Send email
    const verificationLink = `${APP_URL}/verify-email?token=${token}`;
    const emailResult = await sendVerificationEmail({
      to: data.email,
      verificationLink,
      userName: user.name ?? undefined,
    });

    if (!emailResult.success) {
      return { success: false, error: 'Error al enviar el correo' };
    }

    // Log email verification resent
    await auditLogsService.log('EMAIL_VERIFICATION_RESENT', {
      userId: user.id,
      ipAddress,
      userAgent,
    });

    return {
      success: true,
      message: 'Si el email existe, recibirás un correo de verificación.'
    };
  }

  async sendVerificationEmailToUser(email: string, userName?: string): Promise<{ success: boolean; error?: string }> {
    // Delete any existing tokens for this email
    await this.repository.deleteTokensByEmail(email);

    // Generate new token
    const token = generateVerificationToken();
    const expires = new Date(Date.now() + TOKEN_EXPIRY.VERIFICATION);

    await this.repository.createToken(email, token, expires);

    // Send email
    const verificationLink = `${APP_URL}/verify-email?token=${token}`;
    const emailResult = await sendVerificationEmail({
      to: email,
      verificationLink,
      userName,
    });

    return emailResult;
  }
}

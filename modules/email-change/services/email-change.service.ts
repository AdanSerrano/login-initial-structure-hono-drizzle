import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { emailChangeRepository } from '../repository/email-change.repository';
import { sendEmailChangeVerification, sendEmailChangedNotification } from '../emails/email-change.emails';
import { auditLogsService } from '@/modules/audit-logs/services/audit-logs.service';
import type { RequestEmailChangeInput } from '../validations/schema/email-change.schema';
import type { RequestEmailChangeResult, VerifyEmailChangeResult } from '../types/email-change.types';

const EMAIL_CHANGE_TOKEN_EXPIRY_HOURS = 1;

export interface EmailChangeOptions {
  ipAddress?: string;
  userAgent?: string;
}

export class EmailChangeService {
  async requestEmailChange(
    userId: string,
    data: RequestEmailChangeInput,
    options: EmailChangeOptions = {}
  ): Promise<RequestEmailChangeResult> {
    const { ipAddress, userAgent } = options;

    // Get current user
    const user = await emailChangeRepository.findUserById(userId);
    if (!user || !user.email) {
      return { success: false, error: 'Usuario no encontrado' };
    }

    // Verify password
    if (!user.password) {
      return { success: false, error: 'Esta cuenta usa inicio de sesión social' };
    }

    const isPasswordValid = await bcrypt.compare(data.password, user.password);
    if (!isPasswordValid) {
      return { success: false, error: 'Contraseña incorrecta' };
    }

    // Check if new email is same as current
    if (data.newEmail.toLowerCase() === user.email.toLowerCase()) {
      return { success: false, error: 'El nuevo correo debe ser diferente al actual' };
    }

    // Check if new email is already in use
    const existingUser = await emailChangeRepository.findUserByEmail(data.newEmail);
    if (existingUser) {
      return { success: false, error: 'Este correo electrónico ya está en uso' };
    }

    // Delete any existing pending requests for this user
    await emailChangeRepository.deleteByUserId(userId);

    // Generate token
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + EMAIL_CHANGE_TOKEN_EXPIRY_HOURS * 60 * 60 * 1000);

    // Create request
    await emailChangeRepository.createRequest({
      userId,
      currentEmail: user.email,
      newEmail: data.newEmail,
      token,
      expiresAt,
    });

    // Send verification email to NEW email
    await sendEmailChangeVerification({
      to: data.newEmail,
      userName: user.name || undefined,
      token,
      currentEmail: user.email,
    });

    // Log the request
    await auditLogsService.log('EMAIL_CHANGE_REQUESTED', {
      userId,
      ipAddress,
      userAgent,
      metadata: {
        currentEmail: user.email,
        newEmail: data.newEmail,
      },
    });

    return {
      success: true,
      message: `Se ha enviado un correo de verificación a ${data.newEmail}`,
    };
  }

  async verifyEmailChange(
    token: string,
    options: EmailChangeOptions = {}
  ): Promise<VerifyEmailChangeResult> {
    const { ipAddress, userAgent } = options;

    // Find valid request
    const request = await emailChangeRepository.findValidByToken(token);
    if (!request) {
      return { success: false, error: 'Enlace inválido o expirado' };
    }

    // Double check new email isn't taken (could have been taken since request)
    const existingUser = await emailChangeRepository.findUserByEmail(request.newEmail);
    if (existingUser) {
      await emailChangeRepository.deleteByToken(token);
      return { success: false, error: 'Este correo electrónico ya está en uso' };
    }

    // Get user
    const user = await emailChangeRepository.findUserById(request.userId);
    if (!user) {
      await emailChangeRepository.deleteByToken(token);
      return { success: false, error: 'Usuario no encontrado' };
    }

    // Update email
    await emailChangeRepository.updateUserEmail(request.userId, request.newEmail);

    // Delete the request
    await emailChangeRepository.deleteByToken(token);

    // Send notification to OLD email
    await sendEmailChangedNotification({
      to: request.currentEmail,
      userName: user.name || undefined,
      newEmail: request.newEmail,
      changedAt: new Date(),
    });

    // Log the change
    await auditLogsService.log('EMAIL_CHANGED', {
      userId: request.userId,
      ipAddress,
      userAgent,
      metadata: {
        previousEmail: request.currentEmail,
        newEmail: request.newEmail,
      },
    });

    return {
      success: true,
      message: 'Tu correo electrónico ha sido actualizado exitosamente',
      newEmail: request.newEmail,
    };
  }

  async getPendingRequest(userId: string) {
    return emailChangeRepository.findPendingByUserId(userId);
  }

  async cancelPendingRequest(userId: string): Promise<{ success: boolean }> {
    await emailChangeRepository.deleteByUserId(userId);
    return { success: true };
  }
}

export const emailChangeService = new EmailChangeService();

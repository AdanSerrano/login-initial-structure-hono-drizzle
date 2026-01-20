import { UserRepository } from '../repository/user.repository';
import type { UpdateUserInput } from '../validations/schema/user.schema';
import type { UserResponse, TwoFactorMethod } from '../types/user.types';
import { auditLogsService } from '@/modules/audit-logs/services/audit-logs.service';
import bcrypt from 'bcryptjs';

const GRACE_PERIOD_DAYS = 30;

export class UserService {
  private repository: UserRepository;

  constructor() {
    this.repository = new UserRepository();
  }

  async getUser(userId: string): Promise<{ success: true; data: UserResponse } | { success: false; error: string }> {
    const user = await this.repository.findById(userId);

    if (!user) {
      return { success: false, error: 'Usuario no encontrado' };
    }

    return {
      success: true,
      data: {
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
      },
    };
  }

  async updateUser(userId: string, data: UpdateUserInput): Promise<{ success: true; data: UserResponse } | { success: false; error: string }> {
    const user = await this.repository.findById(userId);

    if (!user) {
      return { success: false, error: 'Usuario no encontrado' };
    }

    // Check if userName is taken by another user
    if (data.userName && data.userName !== user.userName) {
      const existingUser = await this.repository.findByUserName(data.userName);
      if (existingUser && existingUser.id !== userId) {
        return { success: false, error: 'El nombre de usuario ya está en uso' };
      }
    }

    const updatedUser = await this.repository.update(userId, data);

    if (!updatedUser) {
      return { success: false, error: 'Error al actualizar el usuario' };
    }

    return {
      success: true,
      data: {
        id: updatedUser.id,
        userName: updatedUser.userName,
        name: updatedUser.name,
        email: updatedUser.email,
        emailVerified: updatedUser.emailVerified,
        image: updatedUser.image,
        role: updatedUser.role,
        isTwoFactorEnabled: updatedUser.isTwoFactorEnabled,
        twoFactorMethod: updatedUser.twoFactorMethod as TwoFactorMethod | null,
        createdAt: updatedUser.createdAt,
        updatedAt: updatedUser.updatedAt,
      },
    };
  }

  async deleteUser(
    userId: string,
    options?: { ipAddress?: string; userAgent?: string }
  ): Promise<{ success: true; message: string } | { success: false; error: string }> {
    const user = await this.repository.findById(userId);

    if (!user) {
      return { success: false, error: 'Usuario no encontrado' };
    }

    // Soft delete: mark deletion date
    await this.repository.softDelete(userId);

    // Log in audit
    const scheduledDeletionDate = new Date(Date.now() + GRACE_PERIOD_DAYS * 24 * 60 * 60 * 1000);
    await auditLogsService.log('ACCOUNT_DELETED', {
      userId,
      ipAddress: options?.ipAddress,
      userAgent: options?.userAgent,
      metadata: { scheduledForDeletion: scheduledDeletionDate.toISOString() },
    });

    return {
      success: true,
      message: `Tu cuenta ha sido programada para eliminarse en ${GRACE_PERIOD_DAYS} días. Puedes reactivarla iniciando sesión.`,
    };
  }

  async reactivateAccount(
    email: string,
    password: string,
    options?: { ipAddress?: string; userAgent?: string }
  ): Promise<{ success: true; message: string } | { success: false; error: string }> {
    const user = await this.repository.findByEmail(email);

    if (!user || !user.deletedAt) {
      return { success: false, error: 'Cuenta no encontrada' };
    }

    // Verify grace period
    const deletedAt = new Date(user.deletedAt);
    const daysSinceDeleted = Math.floor((Date.now() - deletedAt.getTime()) / (1000 * 60 * 60 * 24));

    if (daysSinceDeleted >= GRACE_PERIOD_DAYS) {
      return { success: false, error: 'El período de reactivación ha expirado' };
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password!);
    if (!isPasswordValid) {
      return { success: false, error: 'Contraseña incorrecta' };
    }

    // Reactivate account
    await this.repository.reactivate(user.id);

    // Log in audit
    await auditLogsService.log('ACCOUNT_REACTIVATED', {
      userId: user.id,
      ipAddress: options?.ipAddress,
      userAgent: options?.userAgent,
    });

    return { success: true, message: 'Tu cuenta ha sido reactivada exitosamente' };
  }

  async cleanupExpiredAccounts(): Promise<{
    success: true;
    anonymizedCount: number;
    anonymizedUserIds: string[];
  }> {
    const expiredAccounts = await this.repository.findExpiredDeletedAccounts(GRACE_PERIOD_DAYS);

    const anonymizedUserIds: string[] = [];

    for (const account of expiredAccounts) {
      // Skip if already anonymized (email ends with @anonymous.local)
      if (account.email?.endsWith('@anonymous.local')) {
        continue;
      }

      await this.repository.anonymize(account.id);

      // Log in audit
      await auditLogsService.log('ACCOUNT_ANONYMIZED', {
        userId: account.id,
        metadata: {
          originalEmail: account.email,
          deletedAt: account.deletedAt?.toISOString(),
        },
      });

      anonymizedUserIds.push(account.id);
    }

    return {
      success: true,
      anonymizedCount: anonymizedUserIds.length,
      anonymizedUserIds,
    };
  }
}

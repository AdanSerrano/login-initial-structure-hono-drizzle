import type { AuditAction } from '@/db/schema';
import type { PaginatedResponse } from '@/types/pagination.types';

export interface AuditLogEntry {
  id: string;
  userId: string | null;
  action: AuditAction;
  ipAddress: string | null;
  userAgent: string | null;
  metadata: Record<string, unknown> | null;
  createdAt: Date;
}

export interface CreateAuditLogInput {
  userId?: string | null;
  action: AuditAction;
  ipAddress?: string | null;
  userAgent?: string | null;
  metadata?: Record<string, unknown> | null;
}

export type AuditLogListResponse = PaginatedResponse<AuditLogEntry>;

export const AUDIT_ACTION_LABELS: Record<AuditAction, string> = {
  LOGIN_SUCCESS: 'Inicio de sesión exitoso',
  LOGIN_FAILED: 'Intento de inicio de sesión fallido',
  LOGOUT: 'Cierre de sesión',
  PASSWORD_RESET_REQUESTED: 'Solicitud de restablecimiento de contraseña',
  PASSWORD_RESET_COMPLETED: 'Contraseña restablecida',
  EMAIL_VERIFIED: 'Correo electrónico verificado',
  EMAIL_VERIFICATION_RESENT: 'Correo de verificación reenviado',
  TWO_FACTOR_ENABLED: '2FA activado',
  TWO_FACTOR_DISABLED: '2FA desactivado',
  TWO_FACTOR_VERIFIED: '2FA verificado',
  ACCOUNT_LOCKED: 'Cuenta bloqueada temporalmente',
  ACCOUNT_UNLOCKED: 'Cuenta desbloqueada',
  ACCOUNT_BLOCKED: 'Cuenta bloqueada',
  ACCOUNT_UNBLOCKED: 'Cuenta desbloqueada',
  ACCOUNT_DELETED: 'Cuenta eliminada',
  ACCOUNT_REACTIVATED: 'Cuenta reactivada',
  ACCOUNT_ANONYMIZED: 'Cuenta anonimizada',
  REGISTRATION: 'Registro de cuenta',
};

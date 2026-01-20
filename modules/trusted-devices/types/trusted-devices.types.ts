import type { TrustedDevice } from '@/db/schema';

export interface TrustedDeviceInfo {
  id: string;
  deviceName: string | null;
  ipAddress: string | null;
  trustedUntil: Date;
  createdAt: Date;
}

export interface CreateTrustedDeviceInput {
  userId: string;
  deviceFingerprint: string;
  deviceName?: string | null;
  ipAddress?: string | null;
  trustedDays?: number;
}

export interface CheckTrustedDeviceInput {
  userId: string;
  deviceFingerprint: string;
}

export type { TrustedDevice };

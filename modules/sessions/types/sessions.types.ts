import type { RefreshToken } from '@/db/schema';

export interface Session {
  id: string;
  deviceName: string | null;
  ipAddress: string | null;
  userAgent: string | null;
  lastUsedAt: Date | null;
  createdAt: Date;
  isCurrent: boolean;
}

export interface CreateRefreshTokenInput {
  userId: string;
  token: string;
  expiresAt: Date;
  ipAddress?: string | null;
  userAgent?: string | null;
  deviceName?: string | null;
}

export interface RefreshTokenResult {
  accessToken: string;
  user: {
    id: string;
    userName: string | null;
    name: string | null;
    email: string | null;
    emailVerified: Date | null;
    image: string | null;
    role: string;
    isTwoFactorEnabled: boolean;
    twoFactorMethod: string | null;
    createdAt: Date;
    updatedAt: Date;
  };
}

export type { RefreshToken };

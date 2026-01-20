export type Role = 'USER' | 'ADMIN';
export type TwoFactorMethod = 'EMAIL' | 'AUTHENTICATOR';

export interface User {
  id: string;
  userName: string | null;
  name: string | null;
  email: string | null;
  emailVerified: Date | null;
  image: string | null;
  role: Role;
  isTwoFactorEnabled: boolean;
  twoFactorMethod: TwoFactorMethod | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface LoginResponse {
  user: User;
  token: string;
  refreshToken: string;
  refreshTokenExpiresAt: Date;
}

export interface JwtPayload {
  userId: string;
  email: string;
}

export type LoginResult =
  | { success: true; data: LoginResponse }
  | { success: true; requiresTwoFactor: true; userId: string; twoFactorMethod: TwoFactorMethod }
  | { success: false; error: string }
  | { success: false; requiresEmailVerification: true; email: string }
  | { success: false; accountDeleted: true; daysRemaining: number; email: string; error: string };

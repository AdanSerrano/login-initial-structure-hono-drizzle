export type TwoFactorMethod = 'EMAIL' | 'AUTHENTICATOR';

export interface TwoFactorSetupResponse {
  secret: string;
  qrCode: string;
  method: TwoFactorMethod;
}

export interface TwoFactorEmailSetupResponse {
  method: 'EMAIL';
  message: string;
}

export interface TwoFactorVerifyResponse {
  message: string;
}

export interface TwoFactorLoginResponse {
  user: {
    id: string;
    userName: string | null;
    name: string | null;
    email: string | null;
    emailVerified: Date | null;
    image: string | null;
    role: 'USER' | 'ADMIN';
    isTwoFactorEnabled: boolean;
    twoFactorMethod: TwoFactorMethod | null;
    createdAt: Date;
    updatedAt: Date;
  };
}

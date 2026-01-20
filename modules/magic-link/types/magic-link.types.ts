export interface SendMagicLinkInput {
  email: string;
}

export interface VerifyMagicLinkInput {
  token: string;
}

export interface SendMagicLinkResult {
  success: boolean;
  error?: string;
  message?: string;
}

export interface VerifyMagicLinkResult {
  success: boolean;
  error?: string;
  user?: {
    id: string;
    email: string;
    name: string | null;
  };
  accessToken?: string;
  refreshToken?: string;
  refreshTokenExpiresAt?: Date;
  isNewUser?: boolean;
}

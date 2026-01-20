export interface EmailChangeRequest {
  id: string;
  userId: string;
  currentEmail: string;
  newEmail: string;
  token: string;
  expiresAt: Date;
  createdAt: Date;
}

export interface RequestEmailChangeInput {
  newEmail: string;
  password: string;
}

export interface VerifyEmailChangeInput {
  token: string;
}

export interface RequestEmailChangeResult {
  success: boolean;
  error?: string;
  message?: string;
}

export interface VerifyEmailChangeResult {
  success: boolean;
  error?: string;
  message?: string;
  newEmail?: string;
}

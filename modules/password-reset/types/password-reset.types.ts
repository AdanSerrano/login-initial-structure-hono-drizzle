export interface PasswordResetRequestResponse {
  message: string;
}

export interface PasswordResetResponse {
  message: string;
}

export interface PasswordResetToken {
  id: string;
  email: string;
  token: string;
  expires: Date;
}

export interface VerificationResponse {
  message: string;
}

export interface ResendVerificationResponse {
  message: string;
}

export interface VerificationToken {
  id: string;
  email: string;
  token: string;
  expires: Date;
}

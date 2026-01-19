export type TwoFactorMethod = 'EMAIL' | 'AUTHENTICATOR';

export interface UserResponse {
  id: string;
  userName: string | null;
  name: string | null;
  email: string | null;
  emailVerified: Date | null;
  image: string | null;
  role: string;
  isTwoFactorEnabled: boolean;
  twoFactorMethod: TwoFactorMethod | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface UpdateUserInput {
  name?: string;
  userName?: string;
  image?: string;
}

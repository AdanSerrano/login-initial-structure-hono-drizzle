export type Role = 'USER' | 'ADMIN';

export interface User {
  id: string;
  userName: string | null;
  name: string | null;
  email: string | null;
  emailVerified: Date | null;
  image: string | null;
  role: Role;
  isTwoFactorEnabled: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface RegisterResponse {
  user: User;
  token: string;
}

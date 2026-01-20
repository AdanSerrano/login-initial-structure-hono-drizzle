import { apiClient } from '@/lib/axios';
import type { LoginInput } from '../validations/schema/login.schema';
import type { User } from '../types/login.types';
import type { AxiosError } from 'axios';

interface LoginSuccessResponse {
  user: User;
}

interface LoginTwoFactorResponse {
  requiresTwoFactor: true;
  userId: string;
}

interface LoginEmailVerificationResponse {
  requiresEmailVerification: true;
  email: string;
}

interface LoginAccountDeletedResponse {
  accountDeleted: true;
  daysRemaining: number;
  email: string;
}

export type LoginApiResponse =
  | LoginSuccessResponse
  | LoginTwoFactorResponse
  | LoginEmailVerificationResponse
  | LoginAccountDeletedResponse;

export const loginApi = {
  login: async (data: LoginInput): Promise<LoginApiResponse> => {
    try {
      const response = await apiClient.post<LoginApiResponse>('/login', data);
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<{
        requiresEmailVerification?: boolean;
        accountDeleted?: boolean;
        daysRemaining?: number;
        email?: string;
        error?: string;
      }>;

      // Handle email verification required (403)
      if (axiosError.response?.status === 403 && axiosError.response.data?.requiresEmailVerification) {
        return {
          requiresEmailVerification: true,
          email: axiosError.response.data.email!,
        };
      }

      // Handle account deleted (within grace period)
      if (axiosError.response?.status === 403 && axiosError.response.data?.accountDeleted) {
        return {
          accountDeleted: true,
          daysRemaining: axiosError.response.data.daysRemaining!,
          email: axiosError.response.data.email!,
        };
      }

      // Re-throw other errors
      throw error;
    }
  },
};

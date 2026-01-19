import { apiClient } from '@/lib/axios';
import type { RequestPasswordResetInput, ResetPasswordInput } from '../validations/schema/password-reset.schema';

interface MessageResponse {
  message: string;
}

interface ValidateTokenResponse {
  valid: boolean;
  email: string;
}

export const passwordResetApi = {
  requestReset: async (data: RequestPasswordResetInput): Promise<MessageResponse> => {
    const response = await apiClient.post<MessageResponse>('/password-reset/request', data);
    return response.data;
  },

  resetPassword: async (data: ResetPasswordInput): Promise<MessageResponse> => {
    const response = await apiClient.post<MessageResponse>('/password-reset/reset', data);
    return response.data;
  },

  validateToken: async (token: string): Promise<ValidateTokenResponse> => {
    const response = await apiClient.get<ValidateTokenResponse>(`/password-reset/validate?token=${token}`);
    return response.data;
  },
};

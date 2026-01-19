import { apiClient } from '@/lib/axios';
import type { VerifyEmailInput, ResendVerificationInput } from '../validations/schema/email-verification.schema';

interface MessageResponse {
  message: string;
}

export const emailVerificationApi = {
  verify: async (data: VerifyEmailInput): Promise<MessageResponse> => {
    const response = await apiClient.post<MessageResponse>('/email-verification/verify', data);
    return response.data;
  },

  verifyFromToken: async (token: string): Promise<MessageResponse> => {
    const response = await apiClient.get<MessageResponse>(`/email-verification/verify?token=${token}`);
    return response.data;
  },

  resend: async (data: ResendVerificationInput): Promise<MessageResponse> => {
    const response = await apiClient.post<MessageResponse>('/email-verification/resend', data);
    return response.data;
  },
};

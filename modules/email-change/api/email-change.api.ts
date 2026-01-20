import { apiClient } from '@/lib/axios';
import type { RequestEmailChangeInput } from '../validations/schema/email-change.schema';

interface MessageResponse {
  message: string;
}

interface VerifyResponse {
  message: string;
  newEmail: string;
}

interface PendingResponse {
  hasPending: boolean;
  newEmail?: string;
  expiresAt?: string;
}

export const emailChangeApi = {
  requestChange: async (data: RequestEmailChangeInput): Promise<MessageResponse> => {
    const response = await apiClient.post<MessageResponse>('/email-change/request', data);
    return response.data;
  },

  verifyChange: async (token: string): Promise<VerifyResponse> => {
    const response = await apiClient.post<VerifyResponse>('/email-change/verify', { token });
    return response.data;
  },

  getPending: async (): Promise<PendingResponse> => {
    const response = await apiClient.get<PendingResponse>('/email-change/pending');
    return response.data;
  },

  cancelPending: async (): Promise<MessageResponse> => {
    const response = await apiClient.delete<MessageResponse>('/email-change/pending');
    return response.data;
  },
};

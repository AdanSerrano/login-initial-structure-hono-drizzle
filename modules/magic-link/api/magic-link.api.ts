import { apiClient } from '@/lib/axios';

interface MessageResponse {
  message: string;
}

interface VerifyResponse {
  success: boolean;
  user?: {
    id: string;
    email: string;
    name: string | null;
  };
  isNewUser?: boolean;
  error?: string;
}

export const magicLinkApi = {
  sendMagicLink: async (email: string): Promise<MessageResponse> => {
    const response = await apiClient.post<MessageResponse>('/magic-link/send', { email });
    return response.data;
  },

  verifyMagicLink: async (token: string): Promise<VerifyResponse> => {
    const response = await apiClient.post<VerifyResponse>('/magic-link/verify', { token });
    return response.data;
  },
};

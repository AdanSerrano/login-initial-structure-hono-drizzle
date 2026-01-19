import { apiClient } from '@/lib/axios';

interface LogoutResponse {
  message: string;
}

export const logoutApi = {
  logout: async (): Promise<void> => {
    await apiClient.post<LogoutResponse>('/logout');
  },
};

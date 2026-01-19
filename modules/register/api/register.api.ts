import { apiClient } from '@/lib/axios';
import type { RegisterInput } from '../validations/schema/register.schema';

interface RegisterResponse {
  message: string;
}

export const registerApi = {
  register: async (data: RegisterInput): Promise<RegisterResponse> => {
    const response = await apiClient.post<RegisterResponse>('/register', data);
    return response.data;
  },
};

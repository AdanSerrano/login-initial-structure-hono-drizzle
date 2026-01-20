import { apiClient } from '@/lib/axios';
import type { UserResponse, UpdateUserInput } from '../types/user.types';

interface ApiResponse<T> {
  user?: T;
  message?: string;
  error?: string;
}

export const userApi = {
  getMe: async (): Promise<UserResponse> => {
    const response = await apiClient.get<ApiResponse<UserResponse>>('/user/me');
    if (response.data.user) {
      return response.data.user;
    }
    throw new Error(response.data.error || 'Error al obtener usuario');
  },

  updateMe: async (data: UpdateUserInput): Promise<UserResponse> => {
    const response = await apiClient.put<ApiResponse<UserResponse>>('/user/me', data);
    if (response.data.user) {
      return response.data.user;
    }
    throw new Error(response.data.error || 'Error al actualizar usuario');
  },

  deleteMe: async (): Promise<string> => {
    const response = await apiClient.delete<ApiResponse<never>>('/user/me');
    if (response.data.error) {
      throw new Error(response.data.error);
    }
    return response.data.message || 'Cuenta eliminada';
  },

  reactivateAccount: async (email: string, password: string): Promise<string> => {
    const response = await apiClient.post<ApiResponse<never>>('/user/reactivate', {
      email,
      password,
    });
    if (response.data.error) {
      throw new Error(response.data.error);
    }
    return response.data.message || 'Cuenta reactivada';
  },
};

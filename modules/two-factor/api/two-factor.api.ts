import { apiClient } from '@/lib/axios';
import type { VerifyTwoFactorInput, VerifyTwoFactorLoginInput } from '../validations/schema/two-factor.schema';
import type { TwoFactorSetupResponse, TwoFactorEmailSetupResponse, TwoFactorLoginResponse, BackupCodesResponse, TwoFactorMethodResponse } from '../types/two-factor.types';

interface MessageResponse {
  message: string;
}

interface BackupCodeLoginResponse extends TwoFactorLoginResponse {
  remainingCodes: number;
}

interface BackupCodesCountResponse {
  remainingCodes: number;
}

export const twoFactorApi = {
  // Setup methods
  setupAuthenticator: async (): Promise<TwoFactorSetupResponse> => {
    const response = await apiClient.post<TwoFactorSetupResponse>('/two-factor/setup/authenticator');
    return response.data;
  },

  setupEmail: async (): Promise<TwoFactorEmailSetupResponse> => {
    const response = await apiClient.post<TwoFactorEmailSetupResponse>('/two-factor/setup/email');
    return response.data;
  },

  // Verify and enable methods
  verifyAuthenticator: async (data: VerifyTwoFactorInput): Promise<MessageResponse> => {
    const response = await apiClient.post<MessageResponse>('/two-factor/verify/authenticator', data);
    return response.data;
  },

  verifyEmail: async (data: VerifyTwoFactorInput): Promise<MessageResponse> => {
    const response = await apiClient.post<MessageResponse>('/two-factor/verify/email', data);
    return response.data;
  },

  // Disable methods
  sendDisableCode: async (): Promise<MessageResponse> => {
    const response = await apiClient.post<MessageResponse>('/two-factor/send-disable-code');
    return response.data;
  },

  disable: async (data: VerifyTwoFactorInput): Promise<MessageResponse> => {
    const response = await apiClient.post<MessageResponse>('/two-factor/disable', data);
    return response.data;
  },

  // Login methods
  sendLoginCode: async (userId: string): Promise<MessageResponse> => {
    const response = await apiClient.post<MessageResponse>('/two-factor/send-login-code', { userId });
    return response.data;
  },

  verifyLogin: async (data: VerifyTwoFactorLoginInput & { trustDevice?: boolean }): Promise<TwoFactorLoginResponse> => {
    const response = await apiClient.post<TwoFactorLoginResponse>('/two-factor/verify-login', data);
    return response.data;
  },

  // Get current method
  getMethod: async (): Promise<TwoFactorMethodResponse> => {
    const response = await apiClient.get<TwoFactorMethodResponse>('/two-factor/method');
    return response.data;
  },

  // Backup codes methods
  generateBackupCodes: async (): Promise<BackupCodesResponse> => {
    const response = await apiClient.post<BackupCodesResponse>('/two-factor/backup-codes/generate');
    return response.data;
  },

  verifyLoginWithBackupCode: async (data: { userId: string; code: string; trustDevice?: boolean }): Promise<BackupCodeLoginResponse> => {
    const response = await apiClient.post<BackupCodeLoginResponse>('/two-factor/backup-codes/verify-login', data);
    return response.data;
  },

  getBackupCodesCount: async (): Promise<BackupCodesCountResponse> => {
    const response = await apiClient.get<BackupCodesCountResponse>('/two-factor/backup-codes/count');
    return response.data;
  },
};

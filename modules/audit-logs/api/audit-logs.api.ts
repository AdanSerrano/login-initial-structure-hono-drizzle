import { apiClient } from '@/lib/axios';
import type { AuditLogListResponse } from '../types/audit-logs.types';

export const auditLogsApi = {
  getMyActivity: async (page = 1, limit = 20): Promise<AuditLogListResponse> => {
    const response = await apiClient.get<AuditLogListResponse>(
      `/audit-logs?page=${page}&limit=${limit}`
    );
    return response.data;
  },
};

import { apiClient } from '@/lib/axios';
import type { AuditLogListResponse } from '../types/audit-logs.types';

export const auditLogsApi = {
  getMyActivity: async (limit = 20, offset = 0): Promise<AuditLogListResponse> => {
    const response = await apiClient.get<AuditLogListResponse>(
      `/audit-logs?limit=${limit}&offset=${offset}`
    );
    return response.data;
  },
};

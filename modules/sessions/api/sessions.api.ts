import { api } from '@/lib/axios';
import type { Session } from '../types/sessions.types';

interface SessionsResponse {
  sessions: Session[];
}

interface RefreshResponse {
  user: {
    id: string;
    userName: string | null;
    name: string | null;
    email: string | null;
    emailVerified: Date | null;
    image: string | null;
    role: string;
    isTwoFactorEnabled: boolean;
    twoFactorMethod: string | null;
    createdAt: Date;
    updatedAt: Date;
  };
}

export const sessionsApi = {
  /**
   * Refresh the access token using the refresh token cookie
   */
  async refresh(): Promise<RefreshResponse> {
    const response = await api.post<RefreshResponse>('/sessions/refresh');
    return response.data;
  },

  /**
   * Get all sessions for the current user
   */
  async getSessions(): Promise<SessionsResponse> {
    const response = await api.get<SessionsResponse>('/sessions');
    return response.data;
  },

  /**
   * Revoke a specific session
   */
  async revokeSession(sessionId: string): Promise<{ message: string }> {
    const response = await api.delete<{ message: string }>('/sessions/revoke', {
      data: { sessionId },
    });
    return response.data;
  },

  /**
   * Revoke all other sessions except the current one
   */
  async revokeAllOtherSessions(): Promise<{ message: string; count: number }> {
    const response = await api.delete<{ message: string; count: number }>(
      '/sessions/revoke-all-other'
    );
    return response.data;
  },
};

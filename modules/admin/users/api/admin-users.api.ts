import { api } from "@/lib/axios";
import type { PaginatedResponse } from "@/types/pagination.types";
import type {
  AdminUser,
  GetUsersParams,
  UpdateUserInput,
  BlockUserInput,
  AdminUserStats,
} from "../types/admin-users.types";

interface SingleUserResponse {
  data: AdminUser;
  message?: string;
}

interface StatsResponse {
  data: AdminUserStats;
}

interface MessageResponse {
  message: string;
  count?: number;
}

export const adminUsersApi = {
  async getUsers(params: Partial<GetUsersParams>): Promise<PaginatedResponse<AdminUser>> {
    const searchParams = new URLSearchParams();

    if (params.page) searchParams.set("page", String(params.page));
    if (params.limit) searchParams.set("limit", String(params.limit));
    if (params.search) searchParams.set("search", params.search);
    if (params.role) searchParams.set("role", params.role);
    if (params.status) searchParams.set("status", params.status);
    if (params.emailVerified) searchParams.set("emailVerified", params.emailVerified);
    if (params.twoFactor) searchParams.set("twoFactor", params.twoFactor);
    if (params.sortField) searchParams.set("sortField", params.sortField);
    if (params.sortDirection) searchParams.set("sortDirection", params.sortDirection);

    const response = await api.get<PaginatedResponse<AdminUser>>(
      `/admin/users?${searchParams.toString()}`
    );
    return response.data;
  },

  async getUserById(id: string): Promise<AdminUser> {
    const response = await api.get<SingleUserResponse>(`/admin/users/${id}`);
    return response.data.data;
  },

  async updateUser(id: string, data: UpdateUserInput): Promise<AdminUser> {
    const response = await api.put<SingleUserResponse>(`/admin/users/${id}`, data);
    return response.data.data;
  },

  async blockUser(id: string, data: BlockUserInput): Promise<AdminUser> {
    const response = await api.post<SingleUserResponse>(`/admin/users/${id}/block`, data);
    return response.data.data;
  },

  async unblockUser(id: string): Promise<AdminUser> {
    const response = await api.post<SingleUserResponse>(`/admin/users/${id}/unblock`);
    return response.data.data;
  },

  async deleteUser(id: string): Promise<AdminUser> {
    const response = await api.delete<SingleUserResponse>(`/admin/users/${id}`);
    return response.data.data;
  },

  async restoreUser(id: string): Promise<AdminUser> {
    const response = await api.post<SingleUserResponse>(`/admin/users/${id}/restore`);
    return response.data.data;
  },

  async permanentDeleteUser(id: string): Promise<void> {
    await api.delete(`/admin/users/${id}/permanent`);
  },

  async changeRole(id: string, role: "USER" | "ADMIN"): Promise<AdminUser> {
    const response = await api.post<SingleUserResponse>(`/admin/users/${id}/role`, { role });
    return response.data.data;
  },

  async unlockAccount(id: string): Promise<AdminUser> {
    const response = await api.post<SingleUserResponse>(`/admin/users/${id}/unlock`);
    return response.data.data;
  },

  async getStats(): Promise<AdminUserStats> {
    const response = await api.get<StatsResponse>("/admin/users/stats");
    return response.data.data;
  },

  async revokeAllSessions(id: string): Promise<{ count: number }> {
    const response = await api.post<MessageResponse>(`/admin/users/${id}/revoke-sessions`);
    return { count: response.data.count || 0 };
  },
};

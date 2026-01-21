import { AdminUsersRepository } from "../repository/admin-users.repository";
import { createPaginatedResponse, type PaginatedResponse } from "@/types/pagination.types";
import type {
  AdminUser,
  GetUsersParams,
  UpdateUserInput,
  BlockUserInput,
  AdminUserStats,
} from "../types/admin-users.types";

export class AdminUsersService {
  private repository: AdminUsersRepository;

  constructor() {
    this.repository = new AdminUsersRepository();
  }

  async getUsers(params: GetUsersParams): Promise<PaginatedResponse<AdminUser>> {
    const { users, total } = await this.repository.findAll(params);
    return createPaginatedResponse(users, params.page, params.limit, total);
  }

  async getUserById(id: string): Promise<AdminUser | null> {
    return this.repository.findById(id);
  }

  async updateUser(id: string, data: UpdateUserInput): Promise<AdminUser | null> {
    const user = await this.repository.findById(id);
    if (!user) {
      return null;
    }
    return this.repository.update(id, data);
  }

  async blockUser(id: string, data: BlockUserInput): Promise<AdminUser | null> {
    const user = await this.repository.findById(id);
    if (!user) {
      return null;
    }

    if (user.role === "ADMIN") {
      throw new Error("No se puede bloquear a un administrador");
    }

    return this.repository.blockUser(id, data);
  }

  async unblockUser(id: string): Promise<AdminUser | null> {
    const user = await this.repository.findById(id);
    if (!user) {
      return null;
    }
    return this.repository.unblockUser(id);
  }

  async softDeleteUser(id: string): Promise<AdminUser | null> {
    const user = await this.repository.findById(id);
    if (!user) {
      return null;
    }

    if (user.role === "ADMIN") {
      throw new Error("No se puede eliminar a un administrador");
    }

    return this.repository.softDelete(id);
  }

  async restoreUser(id: string): Promise<AdminUser | null> {
    const user = await this.repository.findById(id);
    if (!user) {
      return null;
    }
    return this.repository.restore(id);
  }

  async permanentDeleteUser(id: string): Promise<boolean> {
    const user = await this.repository.findById(id);
    if (!user) {
      return false;
    }

    if (user.role === "ADMIN") {
      throw new Error("No se puede eliminar permanentemente a un administrador");
    }

    return this.repository.permanentDelete(id);
  }

  async changeUserRole(id: string, role: "USER" | "ADMIN"): Promise<AdminUser | null> {
    const user = await this.repository.findById(id);
    if (!user) {
      return null;
    }
    return this.repository.changeRole(id, role);
  }

  async unlockAccount(id: string): Promise<AdminUser | null> {
    const user = await this.repository.findById(id);
    if (!user) {
      return null;
    }
    return this.repository.unlockAccount(id);
  }

  async getStats(): Promise<AdminUserStats> {
    return this.repository.getStats();
  }

  async revokeAllUserSessions(id: string): Promise<{ count: number }> {
    const user = await this.repository.findById(id);
    if (!user) {
      throw new Error("Usuario no encontrado");
    }
    const count = await this.repository.revokeAllSessions(id);
    return { count };
  }
}

import type { Context } from "hono";
import { AdminUsersService } from "../services/admin-users.service";
import type { GetUsersParams } from "../types/admin-users.types";

export class AdminUsersController {
  private service: AdminUsersService;

  constructor() {
    this.service = new AdminUsersService();
  }

  async getUsers(c: Context) {
    const query = c.req.query();

    const params: GetUsersParams = {
      page: parseInt(query.page || "1", 10),
      limit: parseInt(query.limit || "10", 10),
      search: query.search || undefined,
      role: (query.role as GetUsersParams["role"]) || "ALL",
      status: (query.status as GetUsersParams["status"]) || "ALL",
      emailVerified: (query.emailVerified as GetUsersParams["emailVerified"]) || "ALL",
      twoFactor: (query.twoFactor as GetUsersParams["twoFactor"]) || "ALL",
      sortField: query.sortField || "createdAt",
      sortDirection: (query.sortDirection as "asc" | "desc") || "desc",
    };

    const result = await this.service.getUsers(params);
    return c.json(result);
  }

  async getUserById(c: Context) {
    const id = c.req.param("id");
    const user = await this.service.getUserById(id);

    if (!user) {
      return c.json({ error: "Usuario no encontrado" }, 404);
    }

    return c.json({ data: user });
  }

  async updateUser(c: Context) {
    const id = c.req.param("id");
    const data = await c.req.json();

    const user = await this.service.updateUser(id, data);

    if (!user) {
      return c.json({ error: "Usuario no encontrado" }, 404);
    }

    return c.json({ data: user, message: "Usuario actualizado correctamente" });
  }

  async blockUser(c: Context) {
    const id = c.req.param("id");
    const data = await c.req.json();

    try {
      const user = await this.service.blockUser(id, data);

      if (!user) {
        return c.json({ error: "Usuario no encontrado" }, 404);
      }

      return c.json({ data: user, message: "Usuario bloqueado correctamente" });
    } catch (error) {
      if (error instanceof Error) {
        return c.json({ error: error.message }, 400);
      }
      return c.json({ error: "Error al bloquear usuario" }, 500);
    }
  }

  async unblockUser(c: Context) {
    const id = c.req.param("id");

    const user = await this.service.unblockUser(id);

    if (!user) {
      return c.json({ error: "Usuario no encontrado" }, 404);
    }

    return c.json({ data: user, message: "Usuario desbloqueado correctamente" });
  }

  async deleteUser(c: Context) {
    const id = c.req.param("id");

    try {
      const user = await this.service.softDeleteUser(id);

      if (!user) {
        return c.json({ error: "Usuario no encontrado" }, 404);
      }

      return c.json({ data: user, message: "Usuario eliminado correctamente" });
    } catch (error) {
      if (error instanceof Error) {
        return c.json({ error: error.message }, 400);
      }
      return c.json({ error: "Error al eliminar usuario" }, 500);
    }
  }

  async restoreUser(c: Context) {
    const id = c.req.param("id");

    const user = await this.service.restoreUser(id);

    if (!user) {
      return c.json({ error: "Usuario no encontrado" }, 404);
    }

    return c.json({ data: user, message: "Usuario restaurado correctamente" });
  }

  async permanentDeleteUser(c: Context) {
    const id = c.req.param("id");

    try {
      const result = await this.service.permanentDeleteUser(id);

      if (!result) {
        return c.json({ error: "Usuario no encontrado" }, 404);
      }

      return c.json({ message: "Usuario eliminado permanentemente" });
    } catch (error) {
      if (error instanceof Error) {
        return c.json({ error: error.message }, 400);
      }
      return c.json({ error: "Error al eliminar usuario" }, 500);
    }
  }

  async changeRole(c: Context) {
    const id = c.req.param("id");
    const { role } = await c.req.json<{ role: "USER" | "ADMIN" }>();

    const user = await this.service.changeUserRole(id, role);

    if (!user) {
      return c.json({ error: "Usuario no encontrado" }, 404);
    }

    return c.json({ data: user, message: "Rol actualizado correctamente" });
  }

  async unlockAccount(c: Context) {
    const id = c.req.param("id");

    const user = await this.service.unlockAccount(id);

    if (!user) {
      return c.json({ error: "Usuario no encontrado" }, 404);
    }

    return c.json({ data: user, message: "Cuenta desbloqueada correctamente" });
  }

  async getStats(c: Context) {
    const stats = await this.service.getStats();
    return c.json({ data: stats });
  }

  async revokeAllSessions(c: Context) {
    const id = c.req.param("id");

    try {
      const result = await this.service.revokeAllUserSessions(id);
      return c.json({
        message: `${result.count} sesiones revocadas correctamente`,
        count: result.count,
      });
    } catch (error) {
      if (error instanceof Error) {
        return c.json({ error: error.message }, 400);
      }
      return c.json({ error: "Error al revocar sesiones" }, 500);
    }
  }
}

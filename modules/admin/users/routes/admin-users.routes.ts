import { Hono } from "hono";
import { AdminUsersController } from "../controllers/admin-users.controller";

const adminUsersController = new AdminUsersController();

export const adminUsersRoutes = new Hono()
  .get("/", (c) => adminUsersController.getUsers(c))

  .get("/stats", (c) => adminUsersController.getStats(c))

  .get("/:id", (c) => adminUsersController.getUserById(c))

  .put("/:id", (c) => adminUsersController.updateUser(c))

  .post("/:id/block", (c) => adminUsersController.blockUser(c))

  .post("/:id/unblock", (c) => adminUsersController.unblockUser(c))

  .delete("/:id", (c) => adminUsersController.deleteUser(c))

  .post("/:id/restore", (c) => adminUsersController.restoreUser(c))

  .delete("/:id/permanent", (c) => adminUsersController.permanentDeleteUser(c))

  .post("/:id/role", (c) => adminUsersController.changeRole(c))

  .post("/:id/unlock", (c) => adminUsersController.unlockAccount(c))

  .post("/:id/revoke-sessions", (c) => adminUsersController.revokeAllSessions(c));

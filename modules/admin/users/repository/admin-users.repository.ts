import { db } from "@/db";
import { usersTable, refreshTokensTable } from "@/db/schema";
import {
  eq,
  and,
  or,
  like,
  isNull,
  isNotNull,
  desc,
  asc,
  sql,
  count,
  gte,
} from "drizzle-orm";
import type {
  GetUsersParams,
  AdminUser,
  UpdateUserInput,
  BlockUserInput,
  AdminUserStats,
} from "../types/admin-users.types";

export class AdminUsersRepository {
  async findAll(params: GetUsersParams): Promise<{ users: AdminUser[]; total: number }> {
    const {
      page,
      limit,
      search,
      role,
      status,
      emailVerified,
      twoFactor,
      sortField = "createdAt",
      sortDirection = "desc",
    } = params;

    const offset = (page - 1) * limit;
    const conditions = [];

    if (search) {
      conditions.push(
        or(
          like(usersTable.name, `%${search}%`),
          like(usersTable.email, `%${search}%`),
          like(usersTable.userName, `%${search}%`)
        )
      );
    }

    if (role && role !== "ALL") {
      conditions.push(eq(usersTable.role, role));
    }

    if (status && status !== "ALL") {
      switch (status) {
        case "ACTIVE":
          conditions.push(
            and(eq(usersTable.isBlocked, false), isNull(usersTable.deletedAt))
          );
          break;
        case "BLOCKED":
          conditions.push(eq(usersTable.isBlocked, true));
          break;
        case "DELETED":
          conditions.push(isNotNull(usersTable.deletedAt));
          break;
      }
    }

    if (emailVerified && emailVerified !== "ALL") {
      if (emailVerified === "VERIFIED") {
        conditions.push(isNotNull(usersTable.emailVerified));
      } else {
        conditions.push(isNull(usersTable.emailVerified));
      }
    }

    if (twoFactor && twoFactor !== "ALL") {
      if (twoFactor === "ENABLED") {
        conditions.push(eq(usersTable.isTwoFactorEnabled, true));
      } else {
        conditions.push(eq(usersTable.isTwoFactorEnabled, false));
      }
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    const sortColumn = this.getSortColumn(sortField);
    const orderBy = sortDirection === "asc" ? asc(sortColumn) : desc(sortColumn);

    const [users, totalResult] = await Promise.all([
      db
        .select({
          id: usersTable.id,
          userName: usersTable.userName,
          name: usersTable.name,
          email: usersTable.email,
          emailVerified: usersTable.emailVerified,
          image: usersTable.image,
          role: usersTable.role,
          isTwoFactorEnabled: usersTable.isTwoFactorEnabled,
          twoFactorMethod: usersTable.twoFactorMethod,
          isBlocked: usersTable.isBlocked,
          blockedReason: usersTable.blockedReason,
          blockedAt: usersTable.blockedAt,
          blockedActions: usersTable.blockedActions,
          deletedAt: usersTable.deletedAt,
          lastLoginAt: usersTable.lastLoginAt,
          lastLoginIp: usersTable.lastLoginIp,
          lastLoginCountry: usersTable.lastLoginCountry,
          lastLoginCity: usersTable.lastLoginCity,
          failedLoginAttempts: usersTable.failedLoginAttempts,
          lockedUntil: usersTable.lockedUntil,
          createdAt: usersTable.createdAt,
          updatedAt: usersTable.updatedAt,
        })
        .from(usersTable)
        .where(whereClause)
        .orderBy(orderBy)
        .limit(limit)
        .offset(offset),
      db
        .select({ count: count() })
        .from(usersTable)
        .where(whereClause),
    ]);

    return {
      users: users as AdminUser[],
      total: totalResult[0]?.count ?? 0,
    };
  }

  private getSortColumn(field: string) {
    switch (field) {
      case "id":
        return usersTable.id;
      case "userName":
        return usersTable.userName;
      case "name":
        return usersTable.name;
      case "email":
        return usersTable.email;
      case "role":
        return usersTable.role;
      case "isBlocked":
        return usersTable.isBlocked;
      case "emailVerified":
        return usersTable.emailVerified;
      case "isTwoFactorEnabled":
        return usersTable.isTwoFactorEnabled;
      case "lastLoginAt":
        return usersTable.lastLoginAt;
      case "updatedAt":
        return usersTable.updatedAt;
      case "createdAt":
      default:
        return usersTable.createdAt;
    }
  }

  async findById(id: string): Promise<AdminUser | null> {
    const [user] = await db
      .select({
        id: usersTable.id,
        userName: usersTable.userName,
        name: usersTable.name,
        email: usersTable.email,
        emailVerified: usersTable.emailVerified,
        image: usersTable.image,
        role: usersTable.role,
        isTwoFactorEnabled: usersTable.isTwoFactorEnabled,
        twoFactorMethod: usersTable.twoFactorMethod,
        isBlocked: usersTable.isBlocked,
        blockedReason: usersTable.blockedReason,
        blockedAt: usersTable.blockedAt,
        blockedActions: usersTable.blockedActions,
        deletedAt: usersTable.deletedAt,
        lastLoginAt: usersTable.lastLoginAt,
        lastLoginIp: usersTable.lastLoginIp,
        lastLoginCountry: usersTable.lastLoginCountry,
        lastLoginCity: usersTable.lastLoginCity,
        failedLoginAttempts: usersTable.failedLoginAttempts,
        lockedUntil: usersTable.lockedUntil,
        createdAt: usersTable.createdAt,
        updatedAt: usersTable.updatedAt,
      })
      .from(usersTable)
      .where(eq(usersTable.id, id))
      .limit(1);

    return (user as AdminUser) || null;
  }

  async update(id: string, data: UpdateUserInput): Promise<AdminUser | null> {
    await db.update(usersTable).set(data).where(eq(usersTable.id, id));
    return this.findById(id);
  }

  async blockUser(id: string, data: BlockUserInput): Promise<AdminUser | null> {
    await db
      .update(usersTable)
      .set({
        isBlocked: true,
        blockedReason: data.reason,
        blockedAt: new Date(),
        blockedActions: data.blockedActions || null,
      })
      .where(eq(usersTable.id, id));
    return this.findById(id);
  }

  async unblockUser(id: string): Promise<AdminUser | null> {
    await db
      .update(usersTable)
      .set({
        isBlocked: false,
        blockedReason: null,
        blockedAt: null,
        blockedActions: null,
      })
      .where(eq(usersTable.id, id));
    return this.findById(id);
  }

  async softDelete(id: string): Promise<AdminUser | null> {
    await db
      .update(usersTable)
      .set({ deletedAt: new Date() })
      .where(eq(usersTable.id, id));
    return this.findById(id);
  }

  async restore(id: string): Promise<AdminUser | null> {
    await db
      .update(usersTable)
      .set({ deletedAt: null })
      .where(eq(usersTable.id, id));
    return this.findById(id);
  }

  async permanentDelete(id: string): Promise<boolean> {
    await db.delete(refreshTokensTable).where(eq(refreshTokensTable.userId, id));
    await db.delete(usersTable).where(eq(usersTable.id, id));
    return true;
  }

  async changeRole(id: string, role: "USER" | "ADMIN"): Promise<AdminUser | null> {
    await db.update(usersTable).set({ role }).where(eq(usersTable.id, id));
    return this.findById(id);
  }

  async unlockAccount(id: string): Promise<AdminUser | null> {
    await db
      .update(usersTable)
      .set({
        lockedUntil: null,
        failedLoginAttempts: 0,
        lastFailedLogin: null,
      })
      .where(eq(usersTable.id, id));
    return this.findById(id);
  }

  async getStats(): Promise<AdminUserStats> {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const [stats] = await db
      .select({
        totalUsers: count(),
        activeUsers: sql<number>`SUM(CASE WHEN ${usersTable.isBlocked} = false AND ${usersTable.deletedAt} IS NULL THEN 1 ELSE 0 END)`,
        blockedUsers: sql<number>`SUM(CASE WHEN ${usersTable.isBlocked} = true THEN 1 ELSE 0 END)`,
        deletedUsers: sql<number>`SUM(CASE WHEN ${usersTable.deletedAt} IS NOT NULL THEN 1 ELSE 0 END)`,
        verifiedUsers: sql<number>`SUM(CASE WHEN ${usersTable.emailVerified} IS NOT NULL THEN 1 ELSE 0 END)`,
        twoFactorEnabled: sql<number>`SUM(CASE WHEN ${usersTable.isTwoFactorEnabled} = true THEN 1 ELSE 0 END)`,
        adminUsers: sql<number>`SUM(CASE WHEN ${usersTable.role} = 'ADMIN' THEN 1 ELSE 0 END)`,
      })
      .from(usersTable);

    const [recentStats] = await db
      .select({ count: count() })
      .from(usersTable)
      .where(gte(usersTable.createdAt, thirtyDaysAgo));

    return {
      totalUsers: stats?.totalUsers ?? 0,
      activeUsers: Number(stats?.activeUsers) ?? 0,
      blockedUsers: Number(stats?.blockedUsers) ?? 0,
      deletedUsers: Number(stats?.deletedUsers) ?? 0,
      verifiedUsers: Number(stats?.verifiedUsers) ?? 0,
      twoFactorEnabled: Number(stats?.twoFactorEnabled) ?? 0,
      adminUsers: Number(stats?.adminUsers) ?? 0,
      recentRegistrations: recentStats?.count ?? 0,
    };
  }

  async revokeAllSessions(userId: string): Promise<number> {
    const sessions = await db
      .select({ id: refreshTokensTable.id })
      .from(refreshTokensTable)
      .where(eq(refreshTokensTable.userId, userId));

    if (sessions.length > 0) {
      await db
        .delete(refreshTokensTable)
        .where(eq(refreshTokensTable.userId, userId));
    }

    return sessions.length;
  }
}

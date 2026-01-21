import type { User, Role, BlockedAction } from "@/db/schema";

export interface AdminUser {
  id: string;
  userName: string | null;
  name: string | null;
  email: string | null;
  emailVerified: Date | null;
  image: string | null;
  role: Role;
  isTwoFactorEnabled: boolean;
  twoFactorMethod: string | null;
  isBlocked: boolean;
  blockedReason: string | null;
  blockedAt: Date | null;
  blockedActions: BlockedAction[] | null;
  deletedAt: Date | null;
  lastLoginAt: Date | null;
  lastLoginIp: string | null;
  lastLoginCountry: string | null;
  lastLoginCity: string | null;
  failedLoginAttempts: number;
  lockedUntil: Date | null;
  createdAt: Date;
  updatedAt: Date;
  sessionsCount?: number;
}

export interface AdminUserFilters {
  search?: string;
  role?: Role | "ALL";
  status?: "ACTIVE" | "BLOCKED" | "DELETED" | "ALL";
  emailVerified?: "VERIFIED" | "UNVERIFIED" | "ALL";
  twoFactor?: "ENABLED" | "DISABLED" | "ALL";
}

export interface AdminUserSorting {
  field: keyof AdminUser;
  direction: "asc" | "desc";
}

export interface GetUsersParams {
  page: number;
  limit: number;
  search?: string;
  role?: Role | "ALL";
  status?: "ACTIVE" | "BLOCKED" | "DELETED" | "ALL";
  emailVerified?: "VERIFIED" | "UNVERIFIED" | "ALL";
  twoFactor?: "ENABLED" | "DISABLED" | "ALL";
  sortField?: string;
  sortDirection?: "asc" | "desc";
}

export interface UpdateUserInput {
  name?: string;
  userName?: string;
  email?: string;
  role?: Role;
}

export interface BlockUserInput {
  reason: string;
  blockedActions?: BlockedAction[];
}

export interface AdminUserStats {
  totalUsers: number;
  activeUsers: number;
  blockedUsers: number;
  deletedUsers: number;
  verifiedUsers: number;
  twoFactorEnabled: number;
  adminUsers: number;
  recentRegistrations: number;
}

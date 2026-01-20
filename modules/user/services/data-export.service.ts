import { db } from '@/db';
import {
  usersTable,
  auditLogsTable,
  refreshTokensTable,
  backupCodesTable,
  trustedDevicesTable,
} from '@/db/schema';
import { eq, desc } from 'drizzle-orm';

interface ExportedUserData {
  exportedAt: string;
  user: {
    id: string;
    userName: string | null;
    name: string | null;
    email: string | null;
    emailVerified: Date | null;
    role: string;
    isTwoFactorEnabled: boolean;
    twoFactorMethod: string | null;
    createdAt: Date;
    updatedAt: Date;
  };
  activityLog: Array<{
    action: string;
    ipAddress: string | null;
    userAgent: string | null;
    createdAt: Date;
  }>;
  sessions: Array<{
    deviceName: string | null;
    ipAddress: string | null;
    createdAt: Date;
    lastUsedAt: Date | null;
  }>;
  trustedDevices: Array<{
    deviceName: string | null;
    ipAddress: string | null;
    trustedUntil: Date;
    createdAt: Date;
  }>;
  backupCodesCount: number;
}

export class DataExportService {
  async exportUserData(userId: string): Promise<{ success: true; data: ExportedUserData } | { success: false; error: string }> {
    // Get user
    const users = await db
      .select({
        id: usersTable.id,
        userName: usersTable.userName,
        name: usersTable.name,
        email: usersTable.email,
        emailVerified: usersTable.emailVerified,
        role: usersTable.role,
        isTwoFactorEnabled: usersTable.isTwoFactorEnabled,
        twoFactorMethod: usersTable.twoFactorMethod,
        createdAt: usersTable.createdAt,
        updatedAt: usersTable.updatedAt,
      })
      .from(usersTable)
      .where(eq(usersTable.id, userId));

    const user = users[0];
    if (!user) {
      return { success: false, error: 'Usuario no encontrado' };
    }

    // Get audit logs (last 100)
    const auditLogs = await db
      .select({
        action: auditLogsTable.action,
        ipAddress: auditLogsTable.ipAddress,
        userAgent: auditLogsTable.userAgent,
        createdAt: auditLogsTable.createdAt,
      })
      .from(auditLogsTable)
      .where(eq(auditLogsTable.userId, userId))
      .orderBy(desc(auditLogsTable.createdAt))
      .limit(100);

    // Get active sessions
    const sessions = await db
      .select({
        deviceName: refreshTokensTable.deviceName,
        ipAddress: refreshTokensTable.ipAddress,
        createdAt: refreshTokensTable.createdAt,
        lastUsedAt: refreshTokensTable.lastUsedAt,
      })
      .from(refreshTokensTable)
      .where(eq(refreshTokensTable.userId, userId))
      .orderBy(desc(refreshTokensTable.createdAt));

    // Get trusted devices
    const trustedDevices = await db
      .select({
        deviceName: trustedDevicesTable.deviceName,
        ipAddress: trustedDevicesTable.ipAddress,
        trustedUntil: trustedDevicesTable.trustedUntil,
        createdAt: trustedDevicesTable.createdAt,
      })
      .from(trustedDevicesTable)
      .where(eq(trustedDevicesTable.userId, userId))
      .orderBy(desc(trustedDevicesTable.createdAt));

    // Get backup codes count (don't export actual codes for security)
    const backupCodes = await db
      .select()
      .from(backupCodesTable)
      .where(eq(backupCodesTable.userId, userId));

    const exportedData: ExportedUserData = {
      exportedAt: new Date().toISOString(),
      user,
      activityLog: auditLogs,
      sessions,
      trustedDevices,
      backupCodesCount: backupCodes.length,
    };

    return { success: true, data: exportedData };
  }
}

export const dataExportService = new DataExportService();

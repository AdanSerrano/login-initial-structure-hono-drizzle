import { db } from '@/db';
import { auditLogsTable } from '@/db/schema';
import { eq, desc, sql } from 'drizzle-orm';
import type { CreateAuditLogInput, AuditLogEntry } from '../types/audit-logs.types';

export class AuditLogsRepository {
  async create(data: CreateAuditLogInput): Promise<void> {
    await db.insert(auditLogsTable).values({
      userId: data.userId || null,
      action: data.action,
      ipAddress: data.ipAddress || null,
      userAgent: data.userAgent || null,
      metadata: data.metadata || null,
    });
  }

  async findByUserId(userId: string, limit = 20, offset = 0): Promise<AuditLogEntry[]> {
    const results = await db
      .select()
      .from(auditLogsTable)
      .where(eq(auditLogsTable.userId, userId))
      .orderBy(desc(auditLogsTable.createdAt))
      .limit(limit)
      .offset(offset);

    return results as AuditLogEntry[];
  }

  async countByUserId(userId: string): Promise<number> {
    const result = await db
      .select({ count: sql<number>`count(*)` })
      .from(auditLogsTable)
      .where(eq(auditLogsTable.userId, userId));

    return result[0]?.count || 0;
  }

  async findRecent(userId: string, limit = 10): Promise<AuditLogEntry[]> {
    return this.findByUserId(userId, limit, 0);
  }
}

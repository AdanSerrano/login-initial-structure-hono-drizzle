import { AuditLogsRepository } from '../repository/audit-logs.repository';
import type { AuditAction } from '@/db/schema';
import type { AuditLogListResponse } from '../types/audit-logs.types';

export class AuditLogsService {
  private repository: AuditLogsRepository;

  constructor() {
    this.repository = new AuditLogsRepository();
  }

  async log(
    action: AuditAction,
    options: {
      userId?: string | null;
      ipAddress?: string | null;
      userAgent?: string | null;
      metadata?: Record<string, unknown> | null;
    } = {}
  ): Promise<void> {
    try {
      await this.repository.create({
        action,
        userId: options.userId,
        ipAddress: options.ipAddress,
        userAgent: options.userAgent,
        metadata: options.metadata,
      });
    } catch (error) {
      // Log error but don't fail the main operation
      console.error('Failed to create audit log:', error);
    }
  }

  async getActivityLog(userId: string, limit = 20, offset = 0): Promise<AuditLogListResponse> {
    const [logs, total] = await Promise.all([
      this.repository.findByUserId(userId, limit, offset),
      this.repository.countByUserId(userId),
    ]);

    return {
      logs,
      total,
      hasMore: offset + logs.length < total,
    };
  }

  async getRecentActivity(userId: string, limit = 10): Promise<AuditLogListResponse> {
    return this.getActivityLog(userId, limit, 0);
  }
}

// Singleton instance for easy use across modules
export const auditLogsService = new AuditLogsService();

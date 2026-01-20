import { AuditLogsRepository } from '../repository/audit-logs.repository';
import type { AuditAction } from '@/db/schema';
import type { AuditLogListResponse } from '../types/audit-logs.types';
import { createPaginatedResponse } from '@/types/pagination.types';

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
      console.error('Failed to create audit log:', error);
    }
  }

  async getActivityLog(userId: string, page = 1, limit = 20): Promise<AuditLogListResponse> {
    const offset = (page - 1) * limit;

    const [logs, total] = await Promise.all([
      this.repository.findByUserId(userId, limit, offset),
      this.repository.countByUserId(userId),
    ]);

    return createPaginatedResponse(logs, page, limit, total);
  }

  async getRecentActivity(userId: string, limit = 10): Promise<AuditLogListResponse> {
    return this.getActivityLog(userId, 1, limit);
  }
}

// Singleton instance for easy use across modules
export const auditLogsService = new AuditLogsService();

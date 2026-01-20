import { AuditLogsRepository } from '../repository/audit-logs.repository';
import type { AuditAction } from '@/db/schema';
import type { AuditLogListResponse } from '../types/audit-logs.types';
import { createPaginatedResponse } from '@/types/pagination.types';
import { getGeoLocation, type GeoLocation } from '@/lib/geoip';

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
      // Get geolocation from IP address
      let location: GeoLocation | null = null;
      if (options.ipAddress) {
        location = await getGeoLocation(options.ipAddress);
      }

      // Merge location into metadata
      const enrichedMetadata = {
        ...options.metadata,
        ...(location && {
          location: {
            country: location.country,
            countryCode: location.countryCode,
            city: location.city,
            region: location.region,
          },
        }),
      };

      await this.repository.create({
        action,
        userId: options.userId,
        ipAddress: options.ipAddress,
        userAgent: options.userAgent,
        metadata: Object.keys(enrichedMetadata).length > 0 ? enrichedMetadata : null,
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

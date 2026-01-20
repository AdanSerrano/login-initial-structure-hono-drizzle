import crypto from 'crypto';
import { trustedDevicesRepository } from '../repository/trusted-devices.repository';
import { auditLogsService } from '@/modules/audit-logs/services/audit-logs.service';
import type { TrustedDeviceInfo } from '../types/trusted-devices.types';

const DEFAULT_TRUSTED_DAYS = 30;

class TrustedDevicesService {
  /**
   * Generate a device fingerprint based on user agent and IP
   * This is a simple implementation - for production, you might want to use
   * a more sophisticated fingerprinting solution
   */
  generateFingerprint(userAgent: string, ipAddress: string): string {
    const data = `${userAgent}|${ipAddress}`;
    return crypto.createHash('sha256').update(data).digest('hex');
  }

  /**
   * Parse user agent to get a friendly device name
   */
  parseDeviceName(userAgent: string): string {
    if (!userAgent || userAgent === 'unknown') {
      return 'Dispositivo desconocido';
    }

    let browser = 'Navegador';
    let os = '';

    // Detect browser
    if (userAgent.includes('Chrome') && !userAgent.includes('Edg')) {
      browser = 'Chrome';
    } else if (userAgent.includes('Firefox')) {
      browser = 'Firefox';
    } else if (userAgent.includes('Safari') && !userAgent.includes('Chrome')) {
      browser = 'Safari';
    } else if (userAgent.includes('Edg')) {
      browser = 'Edge';
    } else if (userAgent.includes('Opera') || userAgent.includes('OPR')) {
      browser = 'Opera';
    }

    // Detect OS
    if (userAgent.includes('Windows')) {
      os = 'Windows';
    } else if (userAgent.includes('Mac OS')) {
      os = 'macOS';
    } else if (userAgent.includes('Linux')) {
      os = 'Linux';
    } else if (userAgent.includes('Android')) {
      os = 'Android';
    } else if (userAgent.includes('iPhone') || userAgent.includes('iPad')) {
      os = 'iOS';
    }

    return os ? `${browser} en ${os}` : browser;
  }

  /**
   * Check if a device is trusted for a user
   */
  async isDeviceTrusted(userId: string, userAgent: string, ipAddress: string): Promise<boolean> {
    const fingerprint = this.generateFingerprint(userAgent, ipAddress);
    const device = await trustedDevicesRepository.findValidDevice(userId, fingerprint);
    return device !== null;
  }

  /**
   * Trust a device for 30 days (default)
   */
  async trustDevice(
    userId: string,
    userAgent: string,
    ipAddress: string,
    trustedDays: number = DEFAULT_TRUSTED_DAYS
  ): Promise<TrustedDeviceInfo> {
    const fingerprint = this.generateFingerprint(userAgent, ipAddress);
    const deviceName = this.parseDeviceName(userAgent);

    // Remove any existing trusted device with same fingerprint
    await trustedDevicesRepository.deleteByFingerprint(userId, fingerprint);

    // Create new trusted device
    const device = await trustedDevicesRepository.create({
      userId,
      deviceFingerprint: fingerprint,
      deviceName,
      ipAddress,
      trustedDays,
    });

    // Log the action
    await auditLogsService.log('DEVICE_TRUSTED', {
      userId,
      ipAddress,
      userAgent,
      metadata: {
        deviceName,
        trustedDays,
      },
    });

    return {
      id: device.id,
      deviceName: device.deviceName,
      ipAddress: device.ipAddress,
      trustedUntil: device.trustedUntil,
      createdAt: device.createdAt,
    };
  }

  /**
   * Get all trusted devices for a user
   */
  async getUserTrustedDevices(userId: string): Promise<TrustedDeviceInfo[]> {
    const devices = await trustedDevicesRepository.findByUserId(userId);

    return devices.map((device) => ({
      id: device.id,
      deviceName: device.deviceName,
      ipAddress: device.ipAddress,
      trustedUntil: device.trustedUntil,
      createdAt: device.createdAt,
    }));
  }

  /**
   * Revoke trust for a specific device
   */
  async revokeTrust(userId: string, deviceId: string): Promise<void> {
    const device = await trustedDevicesRepository.findById(deviceId);

    if (!device || device.userId !== userId) {
      return;
    }

    await trustedDevicesRepository.deleteById(deviceId);
  }

  /**
   * Revoke trust for all devices of a user
   */
  async revokeAllTrust(userId: string): Promise<number> {
    return await trustedDevicesRepository.deleteByUserId(userId);
  }

  /**
   * Clean up expired trusted devices (can be run as a cron job)
   */
  async cleanupExpired(): Promise<number> {
    return await trustedDevicesRepository.deleteExpired();
  }
}

export const trustedDevicesService = new TrustedDevicesService();

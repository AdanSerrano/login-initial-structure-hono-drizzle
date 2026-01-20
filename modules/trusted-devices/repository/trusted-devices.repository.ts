import { db } from '@/db';
import { trustedDevicesTable } from '@/db/schema';
import { eq, and, gt, lt } from 'drizzle-orm';
import type { CreateTrustedDeviceInput, TrustedDevice } from '../types/trusted-devices.types';

const DEFAULT_TRUSTED_DAYS = 30;

class TrustedDevicesRepository {
  async create(input: CreateTrustedDeviceInput): Promise<TrustedDevice> {
    const trustedDays = input.trustedDays ?? DEFAULT_TRUSTED_DAYS;
    const trustedUntil = new Date();
    trustedUntil.setDate(trustedUntil.getDate() + trustedDays);

    const [device] = await db
      .insert(trustedDevicesTable)
      .values({
        userId: input.userId,
        deviceFingerprint: input.deviceFingerprint,
        deviceName: input.deviceName ?? null,
        ipAddress: input.ipAddress ?? null,
        trustedUntil,
      })
      .$returningId();

    const created = await this.findById(device.id);
    return created!;
  }

  async findById(id: string): Promise<TrustedDevice | null> {
    const [device] = await db
      .select()
      .from(trustedDevicesTable)
      .where(eq(trustedDevicesTable.id, id))
      .limit(1);

    return device ?? null;
  }

  async findValidDevice(userId: string, fingerprint: string): Promise<TrustedDevice | null> {
    const now = new Date();

    const [device] = await db
      .select()
      .from(trustedDevicesTable)
      .where(
        and(
          eq(trustedDevicesTable.userId, userId),
          eq(trustedDevicesTable.deviceFingerprint, fingerprint),
          gt(trustedDevicesTable.trustedUntil, now)
        )
      )
      .limit(1);

    return device ?? null;
  }

  async findByUserId(userId: string): Promise<TrustedDevice[]> {
    const now = new Date();

    return await db
      .select()
      .from(trustedDevicesTable)
      .where(
        and(
          eq(trustedDevicesTable.userId, userId),
          gt(trustedDevicesTable.trustedUntil, now)
        )
      )
      .orderBy(trustedDevicesTable.createdAt);
  }

  async deleteById(id: string): Promise<void> {
    await db.delete(trustedDevicesTable).where(eq(trustedDevicesTable.id, id));
  }

  async deleteByUserId(userId: string): Promise<number> {
    const result = await db
      .delete(trustedDevicesTable)
      .where(eq(trustedDevicesTable.userId, userId));

    return result[0].affectedRows;
  }

  async deleteExpired(): Promise<number> {
    const now = new Date();
    const result = await db
      .delete(trustedDevicesTable)
      .where(lt(trustedDevicesTable.trustedUntil, now));

    return result[0].affectedRows;
  }

  async deleteByFingerprint(userId: string, fingerprint: string): Promise<void> {
    await db
      .delete(trustedDevicesTable)
      .where(
        and(
          eq(trustedDevicesTable.userId, userId),
          eq(trustedDevicesTable.deviceFingerprint, fingerprint)
        )
      );
  }
}

export const trustedDevicesRepository = new TrustedDevicesRepository();

import { db } from '@/db';
import { usersTable } from '@/db/schema';
import { eq, and, isNotNull, lt } from 'drizzle-orm';
import type { UpdateUserInput } from '../validations/schema/user.schema';
import bcrypt from 'bcryptjs';

export class UserRepository {
  async findById(id: string) {
    const result = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.id, id));
    return result[0] ?? null;
  }

  async findByEmail(email: string) {
    const result = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, email));
    return result[0] ?? null;
  }

  async findByUserName(userName: string) {
    const result = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.userName, userName));
    return result[0] ?? null;
  }

  async update(id: string, data: UpdateUserInput) {
    await db
      .update(usersTable)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(eq(usersTable.id, id));

    return this.findById(id);
  }

  async delete(id: string) {
    await db
      .delete(usersTable)
      .where(eq(usersTable.id, id));
  }

  async softDelete(id: string) {
    await db
      .update(usersTable)
      .set({ deletedAt: new Date() })
      .where(eq(usersTable.id, id));
  }

  async reactivate(id: string) {
    await db
      .update(usersTable)
      .set({ deletedAt: null })
      .where(eq(usersTable.id, id));
  }

  async findExpiredDeletedAccounts(gracePeriodDays: number = 30) {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - gracePeriodDays);

    const result = await db
      .select()
      .from(usersTable)
      .where(
        and(
          isNotNull(usersTable.deletedAt),
          lt(usersTable.deletedAt, cutoffDate),
          // Only get accounts that haven't been anonymized yet (still have email)
          isNotNull(usersTable.email)
        )
      );

    return result;
  }

  async anonymize(id: string) {
    const anonymousId = crypto.randomUUID().slice(0, 8);
    const randomPassword = await bcrypt.hash(crypto.randomUUID(), 10);

    await db
      .update(usersTable)
      .set({
        email: `deleted_${anonymousId}@anonymous.local`,
        userName: null,
        name: 'Usuario Eliminado',
        password: randomPassword,
        image: null,
        isTwoFactorEnabled: false,
        twoFactorMethod: null,
        twoFactorSecret: null,
        failedLoginAttempts: 0,
        lockedUntil: null,
        lastFailedLogin: null,
        updatedAt: new Date(),
      })
      .where(eq(usersTable.id, id));
  }
}

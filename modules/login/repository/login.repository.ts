import { db } from '@/db';
import { usersTable } from '@/db/schema';
import { eq, or } from 'drizzle-orm';

export class LoginRepository {
  async findByEmailOrUsername(identifier: string) {
    const result = await db
      .select()
      .from(usersTable)
      .where(
        or(
          eq(usersTable.email, identifier),
          eq(usersTable.userName, identifier)
        )
      );
    return result[0] ?? null;
  }

  async findByEmail(email: string) {
    const result = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, email));
    return result[0] ?? null;
  }

  async findById(id: string) {
    const result = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.id, id));
    return result[0] ?? null;
  }

  async updateFailedLoginAttempts(id: string, attempts: number, lastFailedLogin: Date | null) {
    await db
      .update(usersTable)
      .set({
        failedLoginAttempts: attempts,
        lastFailedLogin,
      })
      .where(eq(usersTable.id, id));
  }

  async lockAccount(id: string, lockedUntil: Date) {
    await db
      .update(usersTable)
      .set({ lockedUntil })
      .where(eq(usersTable.id, id));
  }

  async unlockAccount(id: string) {
    await db
      .update(usersTable)
      .set({
        lockedUntil: null,
        failedLoginAttempts: 0,
      })
      .where(eq(usersTable.id, id));
  }
}

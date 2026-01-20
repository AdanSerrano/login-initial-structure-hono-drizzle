import { db } from '@/db';
import { emailChangeRequestsTable, usersTable } from '@/db/schema';
import { eq, and, gt, lt } from 'drizzle-orm';

export class EmailChangeRepository {
  async createRequest(data: {
    userId: string;
    currentEmail: string;
    newEmail: string;
    token: string;
    expiresAt: Date;
  }) {
    const result = await db
      .insert(emailChangeRequestsTable)
      .values(data);
    return result;
  }

  async findByToken(token: string) {
    const result = await db
      .select()
      .from(emailChangeRequestsTable)
      .where(eq(emailChangeRequestsTable.token, token));
    return result[0] ?? null;
  }

  async findValidByToken(token: string) {
    const now = new Date();
    const result = await db
      .select()
      .from(emailChangeRequestsTable)
      .where(
        and(
          eq(emailChangeRequestsTable.token, token),
          gt(emailChangeRequestsTable.expiresAt, now)
        )
      );
    return result[0] ?? null;
  }

  async findPendingByUserId(userId: string) {
    const now = new Date();
    const result = await db
      .select()
      .from(emailChangeRequestsTable)
      .where(
        and(
          eq(emailChangeRequestsTable.userId, userId),
          gt(emailChangeRequestsTable.expiresAt, now)
        )
      );
    return result[0] ?? null;
  }

  async deleteByToken(token: string) {
    await db
      .delete(emailChangeRequestsTable)
      .where(eq(emailChangeRequestsTable.token, token));
  }

  async deleteByUserId(userId: string) {
    await db
      .delete(emailChangeRequestsTable)
      .where(eq(emailChangeRequestsTable.userId, userId));
  }

  async deleteExpired() {
    const now = new Date();
    await db
      .delete(emailChangeRequestsTable)
      .where(lt(emailChangeRequestsTable.expiresAt, now));
  }

  async updateUserEmail(userId: string, newEmail: string) {
    await db
      .update(usersTable)
      .set({
        email: newEmail,
        emailVerified: new Date(),
      })
      .where(eq(usersTable.id, userId));
  }

  async findUserByEmail(email: string) {
    const result = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, email));
    return result[0] ?? null;
  }

  async findUserById(id: string) {
    const result = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.id, id));
    return result[0] ?? null;
  }
}

export const emailChangeRepository = new EmailChangeRepository();

import { db } from '@/db';
import { passwordResetTokensTable, usersTable } from '@/db/schema';
import { eq, and, gt } from 'drizzle-orm';

export class PasswordResetRepository {
  async findUserByEmail(email: string) {
    const result = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, email));
    return result[0] ?? null;
  }

  async findValidToken(token: string) {
    const result = await db
      .select()
      .from(passwordResetTokensTable)
      .where(
        and(
          eq(passwordResetTokensTable.token, token),
          gt(passwordResetTokensTable.expires, new Date())
        )
      );
    return result[0] ?? null;
  }

  async findTokenByEmail(email: string) {
    const result = await db
      .select()
      .from(passwordResetTokensTable)
      .where(eq(passwordResetTokensTable.email, email));
    return result[0] ?? null;
  }

  async createToken(email: string, token: string, expires: Date) {
    const id = crypto.randomUUID();
    await db.insert(passwordResetTokensTable).values({
      id,
      email,
      token,
      expires,
    });
    return { id, email, token, expires };
  }

  async deleteToken(id: string) {
    await db
      .delete(passwordResetTokensTable)
      .where(eq(passwordResetTokensTable.id, id));
  }

  async deleteTokensByEmail(email: string) {
    await db
      .delete(passwordResetTokensTable)
      .where(eq(passwordResetTokensTable.email, email));
  }

  async updateUserPassword(email: string, hashedPassword: string) {
    await db
      .update(usersTable)
      .set({ password: hashedPassword })
      .where(eq(usersTable.email, email));
  }

  async resetLoginAttempts(email: string) {
    await db
      .update(usersTable)
      .set({
        failedLoginAttempts: 0,
        lockedUntil: null,
        lastFailedLogin: null,
      })
      .where(eq(usersTable.email, email));
  }
}

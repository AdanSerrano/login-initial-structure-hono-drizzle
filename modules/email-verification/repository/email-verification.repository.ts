import { db } from '@/db';
import { verificationTokensTable, usersTable } from '@/db/schema';
import { eq, and, gt } from 'drizzle-orm';

export class EmailVerificationRepository {
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
      .from(verificationTokensTable)
      .where(
        and(
          eq(verificationTokensTable.token, token),
          gt(verificationTokensTable.expires, new Date())
        )
      );
    return result[0] ?? null;
  }

  async findTokenByEmail(email: string) {
    const result = await db
      .select()
      .from(verificationTokensTable)
      .where(eq(verificationTokensTable.email, email));
    return result[0] ?? null;
  }

  async createToken(email: string, token: string, expires: Date) {
    const id = crypto.randomUUID();
    await db.insert(verificationTokensTable).values({
      id,
      email,
      token,
      expires,
    });
    return { id, email, token, expires };
  }

  async deleteToken(id: string) {
    await db
      .delete(verificationTokensTable)
      .where(eq(verificationTokensTable.id, id));
  }

  async deleteTokensByEmail(email: string) {
    await db
      .delete(verificationTokensTable)
      .where(eq(verificationTokensTable.email, email));
  }

  async markEmailAsVerified(email: string) {
    await db
      .update(usersTable)
      .set({ emailVerified: new Date() })
      .where(eq(usersTable.email, email));
  }
}

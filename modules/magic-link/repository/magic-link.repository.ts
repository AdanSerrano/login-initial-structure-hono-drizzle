import { db } from '@/db';
import { magicLinkTokensTable, usersTable } from '@/db/schema';
import { eq, and, gt, lt } from 'drizzle-orm';

export class MagicLinkRepository {
  async createToken(data: {
    email: string;
    token: string;
    expires: Date;
  }) {
    await db.insert(magicLinkTokensTable).values(data);
  }

  async findValidToken(token: string) {
    const now = new Date();
    const result = await db
      .select()
      .from(magicLinkTokensTable)
      .where(
        and(
          eq(magicLinkTokensTable.token, token),
          gt(magicLinkTokensTable.expires, now)
        )
      );
    return result[0] ?? null;
  }

  async deleteToken(token: string) {
    await db
      .delete(magicLinkTokensTable)
      .where(eq(magicLinkTokensTable.token, token));
  }

  async deleteTokensByEmail(email: string) {
    await db
      .delete(magicLinkTokensTable)
      .where(eq(magicLinkTokensTable.email, email));
  }

  async deleteExpiredTokens() {
    const now = new Date();
    await db
      .delete(magicLinkTokensTable)
      .where(lt(magicLinkTokensTable.expires, now));
  }

  async findUserByEmail(email: string) {
    const result = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, email));
    return result[0] ?? null;
  }

  async createUser(data: {
    email: string;
    emailVerified: Date;
  }) {
    const result = await db
      .insert(usersTable)
      .values({
        email: data.email,
        emailVerified: data.emailVerified,
        role: 'USER',
      })
      .$returningId();
    return result[0];
  }
}

export const magicLinkRepository = new MagicLinkRepository();

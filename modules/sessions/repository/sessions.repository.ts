import { db } from '@/db';
import { refreshTokensTable, usersTable } from '@/db/schema';
import { eq, and, lt, desc } from 'drizzle-orm';
import type { CreateRefreshTokenInput } from '../types/sessions.types';

export class SessionsRepository {
  async create(data: CreateRefreshTokenInput): Promise<string> {
    const id = crypto.randomUUID();
    await db.insert(refreshTokensTable).values({
      id,
      userId: data.userId,
      token: data.token,
      expiresAt: data.expiresAt,
      ipAddress: data.ipAddress,
      userAgent: data.userAgent,
      deviceName: data.deviceName,
    });
    return id;
  }

  async findByToken(token: string) {
    const [refreshToken] = await db
      .select()
      .from(refreshTokensTable)
      .where(eq(refreshTokensTable.token, token))
      .limit(1);
    return refreshToken || null;
  }

  async findById(id: string) {
    const [refreshToken] = await db
      .select()
      .from(refreshTokensTable)
      .where(eq(refreshTokensTable.id, id))
      .limit(1);
    return refreshToken || null;
  }

  async findAllByUserId(userId: string) {
    return db
      .select()
      .from(refreshTokensTable)
      .where(eq(refreshTokensTable.userId, userId))
      .orderBy(desc(refreshTokensTable.createdAt));
  }

  async findUserById(userId: string) {
    const [user] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.id, userId))
      .limit(1);
    return user || null;
  }

  async updateLastUsedAt(id: string): Promise<void> {
    await db
      .update(refreshTokensTable)
      .set({ lastUsedAt: new Date() })
      .where(eq(refreshTokensTable.id, id));
  }

  async delete(id: string): Promise<void> {
    await db.delete(refreshTokensTable).where(eq(refreshTokensTable.id, id));
  }

  async deleteByToken(token: string): Promise<void> {
    await db.delete(refreshTokensTable).where(eq(refreshTokensTable.token, token));
  }

  async deleteAllByUserId(userId: string): Promise<void> {
    await db.delete(refreshTokensTable).where(eq(refreshTokensTable.userId, userId));
  }

  async deleteAllExceptCurrent(userId: string, currentTokenId: string): Promise<number> {
    const result = await db
      .delete(refreshTokensTable)
      .where(
        and(
          eq(refreshTokensTable.userId, userId),
          lt(refreshTokensTable.id, currentTokenId)
        )
      );

    // For sessions other than current
    const otherSessions = await db
      .delete(refreshTokensTable)
      .where(
        and(
          eq(refreshTokensTable.userId, userId),
          // Not the current token
          eq(refreshTokensTable.id, currentTokenId) ? undefined : eq(refreshTokensTable.id, refreshTokensTable.id)
        )
      );

    return 0; // MySQL doesn't return affected rows easily with drizzle
  }

  async deleteExpired(): Promise<void> {
    await db
      .delete(refreshTokensTable)
      .where(lt(refreshTokensTable.expiresAt, new Date()));
  }

  async countByUserId(userId: string): Promise<number> {
    const sessions = await db
      .select()
      .from(refreshTokensTable)
      .where(eq(refreshTokensTable.userId, userId));
    return sessions.length;
  }
}

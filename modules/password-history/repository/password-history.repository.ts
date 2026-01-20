import { db } from '@/db';
import { passwordHistoryTable } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';

const MAX_HISTORY_COUNT = 3;

export class PasswordHistoryRepository {
  async addToHistory(userId: string, passwordHash: string): Promise<void> {
    // Add new password to history
    await db.insert(passwordHistoryTable).values({
      userId,
      passwordHash,
    });

    // Clean up old entries (keep only the last MAX_HISTORY_COUNT)
    const history = await this.getHistory(userId);
    if (history.length > MAX_HISTORY_COUNT) {
      const idsToDelete = history
        .slice(MAX_HISTORY_COUNT)
        .map((h) => h.id);

      for (const id of idsToDelete) {
        await db
          .delete(passwordHistoryTable)
          .where(eq(passwordHistoryTable.id, id));
      }
    }
  }

  async getHistory(userId: string): Promise<Array<{ id: string; passwordHash: string; createdAt: Date }>> {
    return db
      .select({
        id: passwordHistoryTable.id,
        passwordHash: passwordHistoryTable.passwordHash,
        createdAt: passwordHistoryTable.createdAt,
      })
      .from(passwordHistoryTable)
      .where(eq(passwordHistoryTable.userId, userId))
      .orderBy(desc(passwordHistoryTable.createdAt));
  }

  async deleteByUserId(userId: string): Promise<void> {
    await db
      .delete(passwordHistoryTable)
      .where(eq(passwordHistoryTable.userId, userId));
  }
}

export const passwordHistoryRepository = new PasswordHistoryRepository();

import { db } from '@/db';
import { usersTable, twoFactorTokensTable, twoFactorConfirmationsTable, backupCodesTable, type TwoFactorMethod } from '@/db/schema';
import { eq, and, gt } from 'drizzle-orm';
import crypto from 'crypto';

export class TwoFactorRepository {
  async findUserById(id: string) {
    const result = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.id, id));
    return result[0] ?? null;
  }

  async findUserByEmail(email: string) {
    const result = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, email));
    return result[0] ?? null;
  }

  async updateUserTwoFactorSecret(userId: string, secret: string | null) {
    await db
      .update(usersTable)
      .set({ twoFactorSecret: secret })
      .where(eq(usersTable.id, userId));
  }

  async enableTwoFactor(userId: string, method: TwoFactorMethod) {
    await db
      .update(usersTable)
      .set({
        isTwoFactorEnabled: true,
        twoFactorMethod: method,
      })
      .where(eq(usersTable.id, userId));
  }

  async disableTwoFactor(userId: string) {
    await db
      .update(usersTable)
      .set({
        isTwoFactorEnabled: false,
        twoFactorMethod: null,
        twoFactorSecret: null
      })
      .where(eq(usersTable.id, userId));
  }

  // Token-based 2FA methods (for email-based codes)
  async findValidToken(email: string) {
    const result = await db
      .select()
      .from(twoFactorTokensTable)
      .where(
        and(
          eq(twoFactorTokensTable.email, email),
          gt(twoFactorTokensTable.expires, new Date())
        )
      );
    return result[0] ?? null;
  }

  async createToken(email: string, token: string, expires: Date) {
    const id = crypto.randomUUID();
    await db.insert(twoFactorTokensTable).values({
      id,
      email,
      token,
      expires,
    });
    return { id, email, token, expires };
  }

  async deleteToken(id: string) {
    await db
      .delete(twoFactorTokensTable)
      .where(eq(twoFactorTokensTable.id, id));
  }

  async deleteTokensByEmail(email: string) {
    await db
      .delete(twoFactorTokensTable)
      .where(eq(twoFactorTokensTable.email, email));
  }

  // 2FA Confirmation (for tracking that 2FA was verified during login)
  async findConfirmation(userId: string) {
    const result = await db
      .select()
      .from(twoFactorConfirmationsTable)
      .where(eq(twoFactorConfirmationsTable.userId, userId));
    return result[0] ?? null;
  }

  async createConfirmation(userId: string) {
    const id = crypto.randomUUID();
    await db.insert(twoFactorConfirmationsTable).values({
      id,
      userId,
    });
    return { id, userId };
  }

  async deleteConfirmation(userId: string) {
    await db
      .delete(twoFactorConfirmationsTable)
      .where(eq(twoFactorConfirmationsTable.userId, userId));
  }

  // Backup Codes methods
  async createBackupCodes(userId: string, codes: string[]): Promise<void> {
    const values = codes.map(code => ({
      id: crypto.randomUUID(),
      userId,
      codeHash: this.hashCode(code),
      isUsed: false,
    }));

    await db.insert(backupCodesTable).values(values);
  }

  async findUnusedBackupCodes(userId: string) {
    const result = await db
      .select()
      .from(backupCodesTable)
      .where(
        and(
          eq(backupCodesTable.userId, userId),
          eq(backupCodesTable.isUsed, false)
        )
      );
    return result;
  }

  async findBackupCodeByHash(userId: string, codeHash: string) {
    const result = await db
      .select()
      .from(backupCodesTable)
      .where(
        and(
          eq(backupCodesTable.userId, userId),
          eq(backupCodesTable.codeHash, codeHash),
          eq(backupCodesTable.isUsed, false)
        )
      );
    return result[0] ?? null;
  }

  async markBackupCodeAsUsed(codeId: string): Promise<void> {
    await db
      .update(backupCodesTable)
      .set({
        isUsed: true,
        usedAt: new Date(),
      })
      .where(eq(backupCodesTable.id, codeId));
  }

  async deleteAllBackupCodes(userId: string): Promise<void> {
    await db
      .delete(backupCodesTable)
      .where(eq(backupCodesTable.userId, userId));
  }

  async countRemainingBackupCodes(userId: string): Promise<number> {
    const result = await db
      .select()
      .from(backupCodesTable)
      .where(
        and(
          eq(backupCodesTable.userId, userId),
          eq(backupCodesTable.isUsed, false)
        )
      );
    return result.length;
  }

  private hashCode(code: string): string {
    return crypto.createHash('sha256').update(code).digest('hex');
  }

  verifyBackupCode(code: string, codeHash: string): boolean {
    return this.hashCode(code) === codeHash;
  }
}

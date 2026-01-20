import bcrypt from 'bcryptjs';
import { passwordHistoryRepository } from '../repository/password-history.repository';

export class PasswordHistoryService {
  /**
   * Check if a password was used recently by the user
   * @returns true if password was used recently, false otherwise
   */
  async wasPasswordUsedRecently(userId: string, password: string): Promise<boolean> {
    const history = await passwordHistoryRepository.getHistory(userId);

    for (const entry of history) {
      const isMatch = await bcrypt.compare(password, entry.passwordHash);
      if (isMatch) {
        return true;
      }
    }

    return false;
  }

  /**
   * Add a new password to the user's history
   */
  async addPasswordToHistory(userId: string, passwordHash: string): Promise<void> {
    await passwordHistoryRepository.addToHistory(userId, passwordHash);
  }

  /**
   * Delete all password history for a user (used when deleting account)
   */
  async deleteUserHistory(userId: string): Promise<void> {
    await passwordHistoryRepository.deleteByUserId(userId);
  }
}

export const passwordHistoryService = new PasswordHistoryService();

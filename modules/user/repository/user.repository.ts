import { db } from '@/db';
import { usersTable } from '@/db/schema';
import { eq } from 'drizzle-orm';
import type { UpdateUserInput } from '../validations/schema/user.schema';

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
}

import { db } from '@/db';
import { usersTable } from '@/db/schema';
import { eq, or } from 'drizzle-orm';
import type { RegisterInput } from '../validations/schema/register.schema';

export class RegisterRepository {
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

  async findByEmailOrUserName(email: string, userName: string) {
    const result = await db
      .select()
      .from(usersTable)
      .where(or(eq(usersTable.email, email), eq(usersTable.userName, userName)));
    return result[0] ?? null;
  }

  async create(data: Omit<RegisterInput, 'confirmPassword'> & { password: string }) {
    const id = crypto.randomUUID();
    const now = new Date();

    await db.insert(usersTable).values({
      id,
      userName: data.userName,
      name: data.name,
      email: data.email,
      password: data.password,
    });

    return {
      id,
      userName: data.userName,
      name: data.name,
      email: data.email,
      emailVerified: null,
      role: 'USER' as const,
      createdAt: now,
      updatedAt: now,
    };
  }
}

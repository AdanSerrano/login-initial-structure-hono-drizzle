import type { Context } from 'hono';
import { getCookie } from 'hono/cookie';
import jwt from 'jsonwebtoken';
import { UserService } from '../services/user.service';
import type { UpdateUserInput } from '../validations/schema/user.schema';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const COOKIE_NAME = 'auth_token';

export class UserController {
  private service: UserService;

  constructor() {
    this.service = new UserService();
  }

  private getUserIdFromToken(c: Context): string | null {
    const token = getCookie(c, COOKIE_NAME);
    if (!token) return null;

    try {
      const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
      return decoded.userId;
    } catch {
      return null;
    }
  }

  async getMe(c: Context) {
    const userId = this.getUserIdFromToken(c);

    if (!userId) {
      return c.json({ error: 'No autenticado' }, 401);
    }

    const result = await this.service.getUser(userId);

    if (!result.success) {
      return c.json({ error: result.error }, 404);
    }

    return c.json({ user: result.data });
  }

  async updateMe(c: Context) {
    const userId = this.getUserIdFromToken(c);

    if (!userId) {
      return c.json({ error: 'No autenticado' }, 401);
    }

    const data = await c.req.json<UpdateUserInput>();
    const result = await this.service.updateUser(userId, data);

    if (!result.success) {
      return c.json({ error: result.error }, 400);
    }

    return c.json({ user: result.data });
  }

  async deleteMe(c: Context) {
    const userId = this.getUserIdFromToken(c);

    if (!userId) {
      return c.json({ error: 'No autenticado' }, 401);
    }

    const result = await this.service.deleteUser(userId);

    if (!result.success) {
      return c.json({ error: result.error }, 400);
    }

    return c.json({ message: result.message });
  }
}

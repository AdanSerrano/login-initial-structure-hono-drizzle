import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { UserController } from '../controllers/user.controller';
import { updateUserSchema } from '../validations/schema/user.schema';

const userRoutes = new Hono();
const controller = new UserController();

// GET /api/user/me - Get current user
userRoutes.get('/me', (c) => controller.getMe(c));

// PUT /api/user/me - Update current user
userRoutes.put('/me', zValidator('json', updateUserSchema), (c) => controller.updateMe(c));

// DELETE /api/user/me - Delete current user
userRoutes.delete('/me', (c) => controller.deleteMe(c));

export { userRoutes };

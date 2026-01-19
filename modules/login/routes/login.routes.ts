import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { LoginController } from '../controllers/login.controller';
import { loginSchema } from '../validations/schema/login.schema';

const loginController = new LoginController();

export const loginRoutes = new Hono()
  .post('/', zValidator('json', loginSchema), (c) => loginController.login(c));

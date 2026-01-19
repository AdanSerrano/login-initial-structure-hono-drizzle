import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { RegisterController } from '../controllers/register.controller';
import { registerSchema } from '../validations/schema/register.schema';

const registerController = new RegisterController();

export const registerRoutes = new Hono()
  .post('/', zValidator('json', registerSchema), (c) => registerController.register(c));

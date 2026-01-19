import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { PasswordResetController } from '../controllers/password-reset.controller';
import { requestPasswordResetSchema, resetPasswordSchema } from '../validations/schema/password-reset.schema';

const passwordResetController = new PasswordResetController();

export const passwordResetRoutes = new Hono()
  .post('/request', zValidator('json', requestPasswordResetSchema), (c) => passwordResetController.requestReset(c))
  .post('/reset', zValidator('json', resetPasswordSchema), (c) => passwordResetController.resetPassword(c))
  .get('/validate', (c) => passwordResetController.validateToken(c));

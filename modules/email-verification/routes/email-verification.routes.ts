import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { EmailVerificationController } from '../controllers/email-verification.controller';
import { verifyEmailSchema, resendVerificationSchema } from '../validations/schema/email-verification.schema';

const emailVerificationController = new EmailVerificationController();

export const emailVerificationRoutes = new Hono()
  .post('/verify', zValidator('json', verifyEmailSchema), (c) => emailVerificationController.verify(c))
  .get('/verify', (c) => emailVerificationController.verifyFromQuery(c))
  .post('/resend', zValidator('json', resendVerificationSchema), (c) => emailVerificationController.resend(c));

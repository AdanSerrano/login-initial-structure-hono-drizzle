import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { TwoFactorController } from '../controllers/two-factor.controller';
import { verifyTwoFactorSchema, verifyTwoFactorLoginSchema } from '../validations/schema/two-factor.schema';

const twoFactorController = new TwoFactorController();

export const twoFactorRoutes = new Hono()
  // Setup endpoints
  .post('/setup/authenticator', (c) => twoFactorController.setupAuthenticator(c))
  .post('/setup/email', (c) => twoFactorController.setupEmail(c))
  // Verify and enable endpoints
  .post('/verify/authenticator', zValidator('json', verifyTwoFactorSchema), (c) => twoFactorController.verifyAuthenticator(c))
  .post('/verify/email', zValidator('json', verifyTwoFactorSchema), (c) => twoFactorController.verifyEmail(c))
  // Disable endpoint
  .post('/send-disable-code', (c) => twoFactorController.sendDisableCode(c))
  .post('/disable', zValidator('json', verifyTwoFactorSchema), (c) => twoFactorController.disable(c))
  // Login endpoints
  .post('/send-login-code', (c) => twoFactorController.sendLoginCode(c))
  .post('/verify-login', zValidator('json', verifyTwoFactorLoginSchema), (c) => twoFactorController.verifyLogin(c))
  // Get method
  .get('/method', (c) => twoFactorController.getMethod(c));

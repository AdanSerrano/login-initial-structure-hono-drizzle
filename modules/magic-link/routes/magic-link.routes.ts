import { Hono } from 'hono';
import { magicLinkController } from '../controllers/magic-link.controller';

const magicLinkRoutes = new Hono();

// Send magic link email
magicLinkRoutes.post('/send', (c) => magicLinkController.sendMagicLink(c));

// Verify magic link token and login
magicLinkRoutes.post('/verify', (c) => magicLinkController.verifyMagicLink(c));

export { magicLinkRoutes };

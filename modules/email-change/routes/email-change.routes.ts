import { Hono } from 'hono';
import { emailChangeController } from '../controllers/email-change.controller';

const emailChangeRoutes = new Hono();

// Request email change (requires auth)
emailChangeRoutes.post('/request', (c) => emailChangeController.requestChange(c));

// Verify email change (public - clicked from email)
emailChangeRoutes.post('/verify', (c) => emailChangeController.verifyChange(c));

// Get pending request (requires auth)
emailChangeRoutes.get('/pending', (c) => emailChangeController.getPending(c));

// Cancel pending request (requires auth)
emailChangeRoutes.delete('/pending', (c) => emailChangeController.cancelPending(c));

export { emailChangeRoutes };

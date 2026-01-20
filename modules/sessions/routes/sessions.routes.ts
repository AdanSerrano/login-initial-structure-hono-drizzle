import { Hono } from 'hono';
import { SessionsController } from '../controllers/sessions.controller';

const sessionsRoutes = new Hono();
const controller = new SessionsController();

// Refresh access token
sessionsRoutes.post('/refresh', (c) => controller.refresh(c));

// Get all sessions
sessionsRoutes.get('/', (c) => controller.getSessions(c));

// Revoke a specific session
sessionsRoutes.delete('/revoke', (c) => controller.revokeSession(c));

// Revoke all other sessions
sessionsRoutes.delete('/revoke-all-other', (c) => controller.revokeAllOtherSessions(c));

export { sessionsRoutes };

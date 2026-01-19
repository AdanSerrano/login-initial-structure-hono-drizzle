import { Hono } from 'hono';
import { LogoutController } from '../controllers/logout.controller';

const logoutRoutes = new Hono();
const controller = new LogoutController();

// POST /api/logout
logoutRoutes.post('/', (c) => controller.logout(c));

export { logoutRoutes };

import { Hono } from 'hono';
import { AuditLogsController } from '../controllers/audit-logs.controller';

const auditLogsRoutes = new Hono();
const controller = new AuditLogsController();

auditLogsRoutes.get('/', (c) => controller.getMyActivity(c));

export { auditLogsRoutes };

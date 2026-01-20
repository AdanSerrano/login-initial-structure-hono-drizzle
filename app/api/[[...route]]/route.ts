import { Hono } from 'hono'
import { handle } from 'hono/vercel'
import { registerRoutes } from '@/modules/register/routes/register.routes'
import { loginRoutes } from '@/modules/login/routes/login.routes'
import { logoutRoutes } from '@/modules/logout/routes/logout.routes'
import { userRoutes } from '@/modules/user/routes/user.routes'
import { passwordResetRoutes } from '@/modules/password-reset/routes/password-reset.routes'
import { emailVerificationRoutes } from '@/modules/email-verification/routes/email-verification.routes'
import { twoFactorRoutes } from '@/modules/two-factor/routes/two-factor.routes'
import { auditLogsRoutes } from '@/modules/audit-logs/routes/audit-logs.routes'
import { sessionsRoutes } from '@/modules/sessions/routes/sessions.routes'
import { emailChangeRoutes } from '@/modules/email-change/routes/email-change.routes'
import { magicLinkRoutes } from '@/modules/magic-link/routes/magic-link.routes'

const app = new Hono().basePath('/api')

app.get('/hello', (c) => {
  return c.json({
    message: 'Hello Next.js!',
  })
})

app.route('/register', registerRoutes)
app.route('/login', loginRoutes)
app.route('/logout', logoutRoutes)
app.route('/user', userRoutes)
app.route('/password-reset', passwordResetRoutes)
app.route('/email-verification', emailVerificationRoutes)
app.route('/two-factor', twoFactorRoutes)
app.route('/audit-logs', auditLogsRoutes)
app.route('/sessions', sessionsRoutes)
app.route('/email-change', emailChangeRoutes)
app.route('/magic-link', magicLinkRoutes)

export const GET = handle(app)
export const POST = handle(app)
export const PUT = handle(app)
export const DELETE = handle(app)
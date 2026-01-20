import type { Context, Next } from 'hono';

interface RateLimitStore {
  [key: string]: {
    count: number;
    resetTime: number;
  };
}

interface RateLimitConfig {
  windowMs: number;
  maxRequests: number;
  message?: string;
  keyGenerator?: (c: Context) => string;
}

const stores: Map<string, RateLimitStore> = new Map();

function cleanupExpiredEntries(store: RateLimitStore, now: number) {
  for (const key in store) {
    if (store[key].resetTime <= now) {
      delete store[key];
    }
  }
}

export function createRateLimiter(name: string, config: RateLimitConfig) {
  const {
    windowMs,
    maxRequests,
    message = 'Demasiadas solicitudes. Por favor, intenta de nuevo más tarde.',
    keyGenerator = (c: Context) => {
      return c.req.header('x-forwarded-for')?.split(',')[0]?.trim()
        || c.req.header('x-real-ip')
        || 'unknown';
    },
  } = config;

  if (!stores.has(name)) {
    stores.set(name, {});
  }

  return async (c: Context, next: Next) => {
    const store = stores.get(name)!;
    const now = Date.now();
    const key = keyGenerator(c);

    // Limpiar entradas expiradas periódicamente
    if (Math.random() < 0.01) {
      cleanupExpiredEntries(store, now);
    }

    const entry = store[key];

    if (!entry || entry.resetTime <= now) {
      store[key] = {
        count: 1,
        resetTime: now + windowMs,
      };
    } else {
      entry.count++;

      if (entry.count > maxRequests) {
        const retryAfter = Math.ceil((entry.resetTime - now) / 1000);

        c.header('Retry-After', retryAfter.toString());
        c.header('X-RateLimit-Limit', maxRequests.toString());
        c.header('X-RateLimit-Remaining', '0');
        c.header('X-RateLimit-Reset', entry.resetTime.toString());

        return c.json(
          {
            error: message,
            retryAfter,
          },
          429
        );
      }
    }

    const current = store[key];
    c.header('X-RateLimit-Limit', maxRequests.toString());
    c.header('X-RateLimit-Remaining', Math.max(0, maxRequests - current.count).toString());
    c.header('X-RateLimit-Reset', current.resetTime.toString());

    await next();
  };
}

// Rate limiters preconfigurados para diferentes endpoints
export const rateLimiters = {
  // Login: 5 intentos por minuto por IP
  login: createRateLimiter('login', {
    windowMs: 60 * 1000,
    maxRequests: 5,
    message: 'Demasiados intentos de inicio de sesión. Intenta de nuevo en un minuto.',
  }),

  // Registro: 3 por hora por IP
  register: createRateLimiter('register', {
    windowMs: 60 * 60 * 1000,
    maxRequests: 3,
    message: 'Demasiados intentos de registro. Intenta de nuevo más tarde.',
  }),

  // Password reset: 3 por hora por IP
  passwordReset: createRateLimiter('password-reset', {
    windowMs: 60 * 60 * 1000,
    maxRequests: 3,
    message: 'Demasiadas solicitudes de restablecimiento. Intenta de nuevo más tarde.',
  }),

  // Email verification resend: 3 por hora por IP
  emailVerification: createRateLimiter('email-verification', {
    windowMs: 60 * 60 * 1000,
    maxRequests: 3,
    message: 'Demasiadas solicitudes de verificación. Intenta de nuevo más tarde.',
  }),

  // Magic link: 3 por hora por IP
  magicLink: createRateLimiter('magic-link', {
    windowMs: 60 * 60 * 1000,
    maxRequests: 3,
    message: 'Demasiadas solicitudes de enlace mágico. Intenta de nuevo más tarde.',
  }),

  // 2FA code send: 5 por 5 minutos por IP
  twoFactorSend: createRateLimiter('2fa-send', {
    windowMs: 5 * 60 * 1000,
    maxRequests: 5,
    message: 'Demasiadas solicitudes de código 2FA. Intenta de nuevo en unos minutos.',
  }),

  // General API: 100 por minuto por IP
  api: createRateLimiter('api', {
    windowMs: 60 * 1000,
    maxRequests: 100,
    message: 'Límite de solicitudes excedido. Intenta de nuevo en un minuto.',
  }),
};

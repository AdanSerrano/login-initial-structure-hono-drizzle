const JWT_SECRET_VALUE = process.env.JWT_SECRET;

if (!JWT_SECRET_VALUE) {
  throw new Error(
    'JWT_SECRET is required. Please set it in your environment variables.\n' +
    'Generate a secure secret with: openssl rand -base64 32'
  );
}

export const JWT_SECRET = JWT_SECRET_VALUE;
export const JWT_SECRET_ENCODED = new TextEncoder().encode(JWT_SECRET_VALUE);

export const TOKEN_CONFIG = {
  ACCESS_TOKEN_EXPIRY: '15m',
  REFRESH_TOKEN_EXPIRY_DAYS: 7,
  ACCESS_TOKEN_COOKIE: 'auth_token',
  REFRESH_TOKEN_COOKIE: 'refresh_token',
} as const;

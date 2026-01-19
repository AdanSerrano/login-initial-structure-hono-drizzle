export function generateVerificationToken(): string {
  return crypto.randomUUID();
}

export function generateSixDigitCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export const TOKEN_EXPIRY = {
  VERIFICATION: 24 * 60 * 60 * 1000, // 24 hours
  PASSWORD_RESET: 60 * 60 * 1000, // 1 hour
  TWO_FACTOR: 5 * 60 * 1000, // 5 minutes
} as const;

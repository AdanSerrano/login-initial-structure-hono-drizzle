import { randomInt, randomBytes } from 'crypto';

export function generateVerificationToken(): string {
  return crypto.randomUUID();
}

export function generateSixDigitCode(): string {
  return randomInt(100000, 999999).toString();
}

export function generateSecureToken(length: number = 32): string {
  return randomBytes(length).toString('hex');
}

export const TOKEN_EXPIRY = {
  VERIFICATION: 24 * 60 * 60 * 1000, // 24 hours
  PASSWORD_RESET: 60 * 60 * 1000, // 1 hour
  TWO_FACTOR: 5 * 60 * 1000, // 5 minutes
  MAGIC_LINK: 15 * 60 * 1000, // 15 minutes
  EMAIL_CHANGE: 24 * 60 * 60 * 1000, // 24 hours
} as const;

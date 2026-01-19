import { z } from 'zod';

export const verifyEmailSchema = z.object({
  token: z
    .string()
    .min(1, 'El token es requerido'),
});

export const resendVerificationSchema = z.object({
  email: z
    .string()
    .email('El email no es válido'),
});

export type VerifyEmailInput = z.infer<typeof verifyEmailSchema>;
export type ResendVerificationInput = z.infer<typeof resendVerificationSchema>;

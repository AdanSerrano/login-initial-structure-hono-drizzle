import { z } from 'zod';

export const verifyTwoFactorSchema = z.object({
  code: z
    .string()
    .length(6, 'El código debe tener 6 dígitos')
    .regex(/^\d+$/, 'El código solo debe contener números'),
});

export const verifyTwoFactorLoginSchema = z.object({
  userId: z
    .string()
    .min(1, 'El ID de usuario es requerido'),
  code: z
    .string()
    .length(6, 'El código debe tener 6 dígitos')
    .regex(/^\d+$/, 'El código solo debe contener números'),
});

export type VerifyTwoFactorInput = z.infer<typeof verifyTwoFactorSchema>;
export type VerifyTwoFactorLoginInput = z.infer<typeof verifyTwoFactorLoginSchema>;

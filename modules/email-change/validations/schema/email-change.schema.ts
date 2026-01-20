import { z } from 'zod';

export const requestEmailChangeSchema = z.object({
  newEmail: z
    .string()
    .min(1, 'El correo electrónico es requerido')
    .email('Correo electrónico inválido'),
  password: z
    .string()
    .min(1, 'La contraseña es requerida'),
});

export const verifyEmailChangeSchema = z.object({
  token: z.string().min(1, 'El token es requerido'),
});

export type RequestEmailChangeInput = z.infer<typeof requestEmailChangeSchema>;
export type VerifyEmailChangeInput = z.infer<typeof verifyEmailChangeSchema>;

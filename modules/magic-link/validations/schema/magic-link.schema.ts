import { z } from 'zod';

export const sendMagicLinkSchema = z.object({
  email: z
    .string()
    .min(1, 'El email es requerido')
    .email('Email inválido'),
});

export const verifyMagicLinkSchema = z.object({
  token: z.string().min(1, 'El token es requerido'),
});

export type SendMagicLinkInput = z.infer<typeof sendMagicLinkSchema>;
export type VerifyMagicLinkInput = z.infer<typeof verifyMagicLinkSchema>;

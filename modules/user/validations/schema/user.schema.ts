import { z } from 'zod';

export const updateUserSchema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres').optional(),
  userName: z.string().min(3, 'El nombre de usuario debe tener al menos 3 caracteres').optional(),
  image: z.string().url('URL de imagen inválida').optional(),
});

export type UpdateUserInput = z.infer<typeof updateUserSchema>;

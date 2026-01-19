'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { requestPasswordResetSchema, type RequestPasswordResetInput } from '../../validations/schema/password-reset.schema';

interface Props {
  onSubmit: (values: RequestPasswordResetInput) => Promise<void>;
  isPending?: boolean;
  error?: string | null;
  success?: boolean;
}

export function RequestResetForm({ onSubmit, isPending, error, success }: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RequestPasswordResetInput>({
    resolver: zodResolver(requestPasswordResetSchema),
    defaultValues: {
      email: '',
    },
  });

  if (success) {
    return (
      <div className="p-4 rounded-md bg-green-50 text-green-700 text-sm">
        <p className="font-medium">Correo enviado</p>
        <p>Si el email existe, recibirás un correo con instrucciones para restablecer tu contraseña.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="tu@email.com"
          {...register('email')}
          disabled={isPending}
        />
        {errors.email && (
          <p className="text-sm text-red-500">{errors.email.message}</p>
        )}
      </div>

      {error && (
        <div className="p-3 rounded-md bg-red-50 text-red-500 text-sm">
          {error}
        </div>
      )}

      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? 'Enviando...' : 'Enviar instrucciones'}
      </Button>
    </form>
  );
}

'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { resendVerificationSchema, type ResendVerificationInput } from '../../validations/schema/email-verification.schema';

interface Props {
  onSubmit: (values: ResendVerificationInput) => Promise<void>;
  isPending?: boolean;
  error?: string | null;
  success?: boolean;
}

export function ResendVerificationForm({ onSubmit, isPending, error, success }: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResendVerificationInput>({
    resolver: zodResolver(resendVerificationSchema),
    defaultValues: {
      email: '',
    },
  });

  if (success) {
    return (
      <div className="p-4 rounded-md bg-green-50 text-green-700 text-sm">
        <p className="font-medium">Correo enviado</p>
        <p>Si el email existe, recibirás un correo de verificación.</p>
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
        {isPending ? 'Enviando...' : 'Reenviar verificación'}
      </Button>
    </form>
  );
}

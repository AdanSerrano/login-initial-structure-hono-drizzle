'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { sendMagicLinkSchema, type SendMagicLinkInput } from '../../validations/schema/magic-link.schema';

interface Props {
  onSubmit: (email: string) => Promise<boolean>;
  isPending?: boolean;
  error?: string | null;
  success?: boolean;
}

export function MagicLinkForm({ onSubmit, isPending, error, success }: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SendMagicLinkInput>({
    resolver: zodResolver(sendMagicLinkSchema),
    defaultValues: {
      email: '',
    },
  });

  const handleFormSubmit = async (data: SendMagicLinkInput) => {
    await onSubmit(data.email);
  };

  if (success) {
    return (
      <div className="p-4 rounded-md bg-green-50 text-green-700 text-sm">
        <p className="font-medium">Enlace enviado</p>
        <p>Revisa tu bandeja de entrada. Si el email está registrado, recibirás un enlace para iniciar sesión.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
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
        {isPending ? 'Enviando...' : 'Enviar enlace mágico'}
      </Button>
    </form>
  );
}

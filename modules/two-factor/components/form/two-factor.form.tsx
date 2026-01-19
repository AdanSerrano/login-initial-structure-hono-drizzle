'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { verifyTwoFactorSchema, type VerifyTwoFactorInput } from '../../validations/schema/two-factor.schema';

interface Props {
  onSubmit: (values: VerifyTwoFactorInput) => Promise<void>;
  isPending?: boolean;
  error?: string | null;
  submitText?: string;
}

export function TwoFactorForm({ onSubmit, isPending, error, submitText = 'Verificar' }: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<VerifyTwoFactorInput>({
    resolver: zodResolver(verifyTwoFactorSchema),
    defaultValues: {
      code: '',
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="code">Código de verificación</Label>
        <Input
          id="code"
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={6}
          placeholder="000000"
          className="text-center text-2xl tracking-widest"
          {...register('code')}
          disabled={isPending}
        />
        {errors.code && (
          <p className="text-sm text-red-500">{errors.code.message}</p>
        )}
      </div>

      {error && (
        <div className="p-3 rounded-md bg-red-50 text-red-500 text-sm">
          {error}
        </div>
      )}

      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? 'Verificando...' : submitText}
      </Button>
    </form>
  );
}

'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, AlertCircle } from 'lucide-react';
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
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="code" className="text-sm font-medium">Código de verificación</Label>
        <Input
          id="code"
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={6}
          placeholder="000000"
          className="h-14 text-center text-2xl tracking-[0.5em] font-mono bg-secondary/50 border-0 focus-visible:bg-background focus-visible:ring-2"
          {...register('code')}
          disabled={isPending}
          autoComplete="one-time-code"
        />
        {errors.code && (
          <p className="text-sm text-destructive flex items-center justify-center gap-1">
            <AlertCircle className="w-3 h-3" />
            {errors.code.message}
          </p>
        )}
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm flex items-start gap-3">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <p>{error}</p>
        </div>
      )}

      <Button
        type="submit"
        className="w-full h-11 font-medium"
        disabled={isPending}
      >
        {isPending ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Verificando...
          </>
        ) : (
          submitText
        )}
      </Button>
    </form>
  );
}

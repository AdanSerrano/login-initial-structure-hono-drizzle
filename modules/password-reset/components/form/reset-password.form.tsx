'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PasswordInput } from '@/components/ui/pasword-input';
import { Label } from '@/components/ui/label';
import { PasswordStrengthIndicator } from '@/components/ui/password-strength-indicator';
import { resetPasswordFormSchema, type ResetPasswordFormInput } from '../../validations/schema/password-reset.schema';

interface Props {
  onSubmit: (values: ResetPasswordFormInput) => Promise<void>;
  isPending?: boolean;
  error?: string | null;
}

export function ResetPasswordForm({ onSubmit, isPending, error }: Props) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ResetPasswordFormInput>({
    resolver: zodResolver(resetPasswordFormSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });

  const password = watch('password');

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="password" className="text-sm font-medium">Nueva contraseña</Label>
        <PasswordInput
          id="password"
          placeholder="••••••••"
          className="h-11 bg-secondary/50 border-0 focus-visible:bg-background focus-visible:ring-2"
          {...register('password')}
          disabled={isPending}
        />
        {errors.password && (
          <p className="text-sm text-destructive flex items-center gap-1">
            <AlertCircle className="w-3 h-3" />
            {errors.password.message}
          </p>
        )}
        <PasswordStrengthIndicator password={password || ''} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword" className="text-sm font-medium">Confirmar contraseña</Label>
        <PasswordInput
          id="confirmPassword"
          placeholder="••••••••"
          className="h-11 bg-secondary/50 border-0 focus-visible:bg-background focus-visible:ring-2"
          {...register('confirmPassword')}
          disabled={isPending}
        />
        {errors.confirmPassword && (
          <p className="text-sm text-destructive flex items-center gap-1">
            <AlertCircle className="w-3 h-3" />
            {errors.confirmPassword.message}
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
            Restableciendo...
          </>
        ) : (
          'Restablecer contraseña'
        )}
      </Button>
    </form>
  );
}

'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { PasswordInput } from '@/components/ui/pasword-input';
import { Label } from '@/components/ui/label';
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
    formState: { errors },
  } = useForm<ResetPasswordFormInput>({
    resolver: zodResolver(resetPasswordFormSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="password">Nueva contraseña</Label>
        <PasswordInput
          id="password"
          placeholder="********"
          {...register('password')}
          disabled={isPending}
        />
        {errors.password && (
          <p className="text-sm text-red-500">{errors.password.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirmar contraseña</Label>
        <PasswordInput
          id="confirmPassword"
          placeholder="********"
          {...register('confirmPassword')}
          disabled={isPending}
        />
        {errors.confirmPassword && (
          <p className="text-sm text-red-500">{errors.confirmPassword.message}</p>
        )}
      </div>

      <div className="text-xs text-gray-500 space-y-1">
        <p>La contraseña debe contener:</p>
        <ul className="list-disc list-inside">
          <li>Al menos 8 caracteres</li>
          <li>Al menos una mayúscula</li>
          <li>Al menos una minúscula</li>
          <li>Al menos un número</li>
          <li>Al menos un carácter especial</li>
        </ul>
      </div>

      {error && (
        <div className="p-3 rounded-md bg-red-50 text-red-500 text-sm">
          {error}
        </div>
      )}

      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? 'Restableciendo...' : 'Restablecer contraseña'}
      </Button>
    </form>
  );
}

'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PasswordInput } from '@/components/ui/pasword-input';
import { Label } from '@/components/ui/label';
import { loginSchema, type LoginInput } from '../../validations/schema/login.schema';

interface Props {
  onSubmit: (values: LoginInput) => Promise<void>;
  isPending?: boolean;
  error?: string | null;
}

export function LoginForm({ onSubmit, isPending, error }: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      identifier: '',
      password: '',
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="identifier">Email o nombre de usuario</Label>
        <Input
          id="identifier"
          type="text"
          placeholder="tu@email.com o usuario"
          {...register('identifier')}
          disabled={isPending}
        />
        {errors.identifier && (
          <p className="text-sm text-red-500">{errors.identifier.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Contraseña</Label>
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

      {error && (
        <div className="p-3 rounded-md bg-red-50 text-red-500 text-sm">
          {error}
        </div>
      )}

      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? 'Iniciando sesión...' : 'Iniciar sesión'}
      </Button>
    </form>
  );
}

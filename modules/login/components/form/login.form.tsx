'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { User, Loader2, AlertCircle } from 'lucide-react';
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
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="identifier" className="text-sm font-medium">
          Email o nombre de usuario
        </Label>
        <div className="relative">
          <Input
            id="identifier"
            type="text"
            placeholder="tu@email.com"
            className="h-11 pl-10 bg-secondary/50 border-0 focus-visible:bg-background focus-visible:ring-2"
            {...register('identifier')}
            disabled={isPending}
          />
          <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        </div>
        {errors.identifier && (
          <p className="text-sm text-destructive flex items-center gap-1">
            <AlertCircle className="w-3 h-3" />
            {errors.identifier.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="password" className="text-sm font-medium">
          Contraseña
        </Label>
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
            Iniciando sesión...
          </>
        ) : (
          'Iniciar sesión'
        )}
      </Button>
    </form>
  );
}

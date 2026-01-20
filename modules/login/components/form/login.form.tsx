'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { User, Loader2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PasswordInput } from '@/components/ui/pasword-input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
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
      <div className={cn('space-y-2 animate-fade-in-up stagger-1', errors.identifier && 'animate-shake')}>
        <Label htmlFor="identifier" className="text-sm font-medium">
          Email o nombre de usuario
        </Label>
        <div className="relative group">
          <Input
            id="identifier"
            type="text"
            placeholder="tu@email.com"
            className={cn(
              'h-11 pl-10 bg-secondary/50 border-0 focus-visible:bg-background focus-visible:ring-2',
              'input-focus-animation transition-all duration-200',
              errors.identifier && 'ring-2 ring-destructive/50'
            )}
            {...register('identifier')}
            disabled={isPending}
          />
          <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground transition-colors group-focus-within:text-primary" />
        </div>
        {errors.identifier && (
          <p className="text-sm text-destructive flex items-center gap-1 animate-fade-in">
            <AlertCircle className="w-3 h-3" />
            {errors.identifier.message}
          </p>
        )}
      </div>

      <div className={cn('space-y-2 animate-fade-in-up stagger-2', errors.password && 'animate-shake')}>
        <Label htmlFor="password" className="text-sm font-medium">
          Contraseña
        </Label>
        <PasswordInput
          id="password"
          placeholder="••••••••"
          className={cn(
            'h-11 bg-secondary/50 border-0 focus-visible:bg-background focus-visible:ring-2',
            'input-focus-animation transition-all duration-200',
            errors.password && 'ring-2 ring-destructive/50'
          )}
          {...register('password')}
          disabled={isPending}
        />
        {errors.password && (
          <p className="text-sm text-destructive flex items-center gap-1 animate-fade-in">
            <AlertCircle className="w-3 h-3" />
            {errors.password.message}
          </p>
        )}
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm flex items-start gap-3 animate-fade-in animate-shake">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <p>{error}</p>
        </div>
      )}

      <Button
        type="submit"
        className="w-full h-11 font-medium btn-press animate-fade-in-up stagger-3 transition-all duration-200 hover:shadow-lg hover:shadow-primary/25"
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

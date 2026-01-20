'use client';

import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Mail, User, UserCircle, Loader2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PasswordInput } from '@/components/ui/pasword-input';
import { Label } from '@/components/ui/label';
import { PasswordStrengthIndicator } from '@/components/ui/password-strength-indicator';
import { cn } from '@/lib/utils';
import { registerSchema, type RegisterInput } from '../../validations/schema/register.schema';

interface Props {
  onSubmit: (values: RegisterInput) => Promise<void>;
  isPending?: boolean;
  error?: string | null;
}

export function RegisterForm({ onSubmit, isPending, error }: Props) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: '',
      userName: '',
      name: '',
      password: '',
      confirmPassword: '',
    },
  });

  const password = watch('password');

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2 animate-fade-in-up stagger-1">
        <div className={cn('space-y-2', errors.email && 'animate-shake')}>
          <Label htmlFor="email" className="text-sm font-medium">Email</Label>
          <div className="relative group">
            <Input
              id="email"
              type="email"
              placeholder="tu@email.com"
              className={cn(
                'h-11 pl-10 bg-secondary/50 border-0 focus-visible:bg-background focus-visible:ring-2',
                'input-focus-animation transition-all duration-200',
                errors.email && 'ring-2 ring-destructive/50'
              )}
              {...register('email')}
              disabled={isPending}
            />
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground transition-colors group-focus-within:text-primary" />
          </div>
          {errors.email && (
            <p className="text-sm text-destructive flex items-center gap-1 animate-fade-in">
              <AlertCircle className="w-3 h-3" />
              {errors.email.message}
            </p>
          )}
        </div>

        <div className={cn('space-y-2', errors.userName && 'animate-shake')}>
          <Label htmlFor="userName" className="text-sm font-medium">Usuario</Label>
          <div className="relative group">
            <Input
              id="userName"
              type="text"
              placeholder="mi_usuario"
              className={cn(
                'h-11 pl-10 bg-secondary/50 border-0 focus-visible:bg-background focus-visible:ring-2',
                'input-focus-animation transition-all duration-200',
                errors.userName && 'ring-2 ring-destructive/50'
              )}
              {...register('userName')}
              disabled={isPending}
            />
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground transition-colors group-focus-within:text-primary" />
          </div>
          {errors.userName && (
            <p className="text-sm text-destructive flex items-center gap-1 animate-fade-in">
              <AlertCircle className="w-3 h-3" />
              {errors.userName.message}
            </p>
          )}
        </div>
      </div>

      <div className={cn('space-y-2 animate-fade-in-up stagger-2', errors.name && 'animate-shake')}>
        <Label htmlFor="name" className="text-sm font-medium">Nombre completo</Label>
        <div className="relative group">
          <Input
            id="name"
            type="text"
            placeholder="Juan Pérez"
            className={cn(
              'h-11 pl-10 bg-secondary/50 border-0 focus-visible:bg-background focus-visible:ring-2',
              'input-focus-animation transition-all duration-200',
              errors.name && 'ring-2 ring-destructive/50'
            )}
            {...register('name')}
            disabled={isPending}
          />
          <UserCircle className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground transition-colors group-focus-within:text-primary" />
        </div>
        {errors.name && (
          <p className="text-sm text-destructive flex items-center gap-1 animate-fade-in">
            <AlertCircle className="w-3 h-3" />
            {errors.name.message}
          </p>
        )}
      </div>

      <div className={cn('space-y-2 animate-fade-in-up stagger-3', errors.password && 'animate-shake')}>
        <Label htmlFor="password" className="text-sm font-medium">Contraseña</Label>
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
        <PasswordStrengthIndicator password={password || ''} />
      </div>

      <div className={cn('space-y-2 animate-fade-in-up stagger-4', errors.confirmPassword && 'animate-shake')}>
        <Label htmlFor="confirmPassword" className="text-sm font-medium">Confirmar contraseña</Label>
        <PasswordInput
          id="confirmPassword"
          placeholder="••••••••"
          className={cn(
            'h-11 bg-secondary/50 border-0 focus-visible:bg-background focus-visible:ring-2',
            'input-focus-animation transition-all duration-200',
            errors.confirmPassword && 'ring-2 ring-destructive/50'
          )}
          {...register('confirmPassword')}
          disabled={isPending}
        />
        {errors.confirmPassword && (
          <p className="text-sm text-destructive flex items-center gap-1 animate-fade-in">
            <AlertCircle className="w-3 h-3" />
            {errors.confirmPassword.message}
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
        className="w-full h-11 font-medium btn-press animate-fade-in-up stagger-5 transition-all duration-200 hover:shadow-lg hover:shadow-primary/25"
        disabled={isPending}
      >
        {isPending ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Creando cuenta...
          </>
        ) : (
          'Crear cuenta'
        )}
      </Button>

      <p className="text-xs text-center text-muted-foreground animate-fade-in stagger-5">
        Al crear una cuenta, aceptas nuestros{' '}
        <Link href="/terms" className="text-primary hover:underline transition-colors">Términos de Servicio</Link>
        {' '}y{' '}
        <Link href="/privacy" className="text-primary hover:underline transition-colors">Política de Privacidad</Link>
      </p>
    </form>
  );
}

'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Mail, AlertCircle } from 'lucide-react';
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
    return null;
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="email" className="text-sm font-medium">Email</Label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            id="email"
            type="email"
            placeholder="tu@email.com"
            className="h-11 pl-10 bg-secondary/50 border-0 focus-visible:bg-background focus-visible:ring-2"
            {...register('email')}
            disabled={isPending}
          />
        </div>
        {errors.email && (
          <p className="text-sm text-destructive flex items-center gap-1">
            <AlertCircle className="w-3 h-3" />
            {errors.email.message}
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
            Enviando enlace...
          </>
        ) : (
          'Enviar enlace mágico'
        )}
      </Button>
    </form>
  );
}

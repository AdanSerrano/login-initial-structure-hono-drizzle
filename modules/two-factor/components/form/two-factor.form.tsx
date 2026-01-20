'use client';

import { useState } from 'react';
import { Loader2, AlertCircle, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
  InputOTPSeparator,
} from '@/components/ui/input-otp';
import { cn } from '@/lib/utils';
import type { VerifyTwoFactorInput } from '../../validations/schema/two-factor.schema';

interface Props {
  onSubmit: (values: VerifyTwoFactorInput) => Promise<void>;
  isPending?: boolean;
  error?: string | null;
  submitText?: string;
}

export function TwoFactorForm({ onSubmit, isPending, error, submitText = 'Verificar' }: Props) {
  const [code, setCode] = useState('');
  const [localError, setLocalError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);

    if (code.length !== 6) {
      setLocalError('El código debe tener 6 dígitos');
      return;
    }

    await onSubmit({ code });
  };

  const handleComplete = async (value: string) => {
    if (value.length === 6) {
      setLocalError(null);
      await onSubmit({ code: value });
    }
  };

  const displayError = error || localError;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center justify-center gap-2 text-center">
          <ShieldCheck className="w-5 h-5 text-violet-600" />
          <Label className="text-sm font-medium text-muted-foreground">
            Ingresa el código de 6 dígitos
          </Label>
        </div>

        <div className="flex justify-center">
          <InputOTP
            maxLength={6}
            value={code}
            onChange={setCode}
            onComplete={handleComplete}
            disabled={isPending}
            className="gap-2"
          >
            <InputOTPGroup>
              <InputOTPSlot
                index={0}
                className={cn(
                  "w-12 h-14 text-xl font-semibold rounded-lg border-2",
                  "bg-gradient-to-b from-background to-muted/30",
                  "border-border/50 focus:border-violet-500",
                  "data-[active=true]:border-violet-500 data-[active=true]:ring-violet-500/20",
                  "transition-all duration-200"
                )}
              />
              <InputOTPSlot
                index={1}
                className={cn(
                  "w-12 h-14 text-xl font-semibold rounded-lg border-2",
                  "bg-gradient-to-b from-background to-muted/30",
                  "border-border/50 focus:border-violet-500",
                  "data-[active=true]:border-violet-500 data-[active=true]:ring-violet-500/20",
                  "transition-all duration-200"
                )}
              />
              <InputOTPSlot
                index={2}
                className={cn(
                  "w-12 h-14 text-xl font-semibold rounded-lg border-2",
                  "bg-gradient-to-b from-background to-muted/30",
                  "border-border/50 focus:border-violet-500",
                  "data-[active=true]:border-violet-500 data-[active=true]:ring-violet-500/20",
                  "transition-all duration-200"
                )}
              />
            </InputOTPGroup>

            <InputOTPSeparator className="text-muted-foreground" />

            <InputOTPGroup>
              <InputOTPSlot
                index={3}
                className={cn(
                  "w-12 h-14 text-xl font-semibold rounded-lg border-2",
                  "bg-gradient-to-b from-background to-muted/30",
                  "border-border/50 focus:border-violet-500",
                  "data-[active=true]:border-violet-500 data-[active=true]:ring-violet-500/20",
                  "transition-all duration-200"
                )}
              />
              <InputOTPSlot
                index={4}
                className={cn(
                  "w-12 h-14 text-xl font-semibold rounded-lg border-2",
                  "bg-gradient-to-b from-background to-muted/30",
                  "border-border/50 focus:border-violet-500",
                  "data-[active=true]:border-violet-500 data-[active=true]:ring-violet-500/20",
                  "transition-all duration-200"
                )}
              />
              <InputOTPSlot
                index={5}
                className={cn(
                  "w-12 h-14 text-xl font-semibold rounded-lg border-2",
                  "bg-gradient-to-b from-background to-muted/30",
                  "border-border/50 focus:border-violet-500",
                  "data-[active=true]:border-violet-500 data-[active=true]:ring-violet-500/20",
                  "transition-all duration-200"
                )}
              />
            </InputOTPGroup>
          </InputOTP>
        </div>

        <p className="text-xs text-center text-muted-foreground">
          Ingresa el código de tu app de autenticación
        </p>
      </div>

      {displayError && (
        <Alert variant="destructive" className="border-destructive/50 bg-destructive/10">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{displayError}</AlertDescription>
        </Alert>
      )}

      <Button
        type="submit"
        className="w-full h-12 font-medium bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 shadow-lg shadow-purple-500/25"
        disabled={isPending || code.length !== 6}
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

'use client';

import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface AnimatedFormFieldProps {
  children: ReactNode;
  className?: string;
  index?: number;
  error?: boolean;
}

export function AnimatedFormField({
  children,
  className,
  index = 0,
  error = false
}: AnimatedFormFieldProps) {
  const staggerClass = index <= 5 ? `stagger-${index + 1}` : 'stagger-5';

  return (
    <div
      className={cn(
        'animate-fade-in-up',
        staggerClass,
        error && 'animate-shake',
        className
      )}
    >
      {children}
    </div>
  );
}

interface AnimatedErrorMessageProps {
  children: ReactNode;
  className?: string;
}

export function AnimatedErrorMessage({
  children,
  className
}: AnimatedErrorMessageProps) {
  return (
    <div className={cn('animate-fade-in animate-shake', className)}>
      {children}
    </div>
  );
}

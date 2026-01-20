'use client';

import { CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SuccessAnimationProps {
  title: string;
  description?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function SuccessAnimation({
  title,
  description,
  className,
  size = 'md'
}: SuccessAnimationProps) {
  const sizes = {
    sm: {
      container: 'w-12 h-12',
      icon: 'w-6 h-6',
      title: 'text-base',
      description: 'text-xs'
    },
    md: {
      container: 'w-16 h-16',
      icon: 'w-8 h-8',
      title: 'text-lg',
      description: 'text-sm'
    },
    lg: {
      container: 'w-20 h-20',
      icon: 'w-10 h-10',
      title: 'text-xl',
      description: 'text-base'
    }
  };

  return (
    <div className={cn('text-center', className)}>
      <div
        className={cn(
          'mx-auto rounded-2xl bg-emerald-100 flex items-center justify-center mb-4',
          'animate-bounce-in glow-success',
          sizes[size].container
        )}
      >
        <CheckCircle2 className={cn('text-emerald-600', sizes[size].icon)} />
      </div>
      <h3 className={cn('font-semibold text-emerald-900 animate-fade-in stagger-1', sizes[size].title)}>
        {title}
      </h3>
      {description && (
        <p className={cn('text-emerald-700 mt-2 animate-fade-in stagger-2', sizes[size].description)}>
          {description}
        </p>
      )}
    </div>
  );
}

'use client';

import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

type TransitionVariant = 'fade' | 'slide-up' | 'slide-down' | 'slide-left' | 'slide-right' | 'scale' | 'none';

interface PageTransitionProps {
  children: ReactNode;
  className?: string;
  variant?: TransitionVariant;
  delay?: number;
}

const variantClasses: Record<TransitionVariant, string> = {
  'fade': 'animate-fade-in',
  'slide-up': 'animate-fade-in-up',
  'slide-down': 'animate-slide-in-down',
  'slide-left': 'animate-slide-in-left',
  'slide-right': 'animate-slide-in-right',
  'scale': 'animate-scale-in',
  'none': '',
};

export function PageTransition({
  children,
  className,
  variant = 'slide-up',
  delay = 0
}: PageTransitionProps) {
  return (
    <div
      className={cn(variantClasses[variant], className)}
      style={{ animationDelay: delay ? `${delay}ms` : undefined }}
    >
      {children}
    </div>
  );
}

interface PageHeaderProps {
  title: string;
  description?: string;
  children?: ReactNode;
  className?: string;
}

export function PageHeader({
  title,
  description,
  children,
  className
}: PageHeaderProps) {
  return (
    <div className={cn('mb-8', className)}>
      <h1 className="text-2xl sm:text-3xl font-bold text-foreground animate-fade-in-up">
        {title}
      </h1>
      {description && (
        <p className="text-muted-foreground mt-2 animate-fade-in-up stagger-1">
          {description}
        </p>
      )}
      {children && (
        <div className="mt-4 animate-fade-in-up stagger-2">
          {children}
        </div>
      )}
    </div>
  );
}

interface PageContentProps {
  children: ReactNode;
  className?: string;
}

export function PageContent({ children, className }: PageContentProps) {
  return (
    <div className={cn('animate-fade-in-up stagger-2', className)}>
      {children}
    </div>
  );
}

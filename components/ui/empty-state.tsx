'use client';

import { ReactNode } from 'react';
import {
  FileQuestion,
  Search,
  Inbox,
  Users,
  Shield,
  Bell,
  Activity,
  FolderOpen,
  type LucideIcon
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type EmptyStateVariant =
  | 'default'
  | 'search'
  | 'inbox'
  | 'users'
  | 'security'
  | 'notifications'
  | 'activity'
  | 'folder';

interface EmptyStateProps {
  variant?: EmptyStateVariant;
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  secondaryAction?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
  children?: ReactNode;
}

const variantIcons: Record<EmptyStateVariant, LucideIcon> = {
  default: FileQuestion,
  search: Search,
  inbox: Inbox,
  users: Users,
  security: Shield,
  notifications: Bell,
  activity: Activity,
  folder: FolderOpen,
};

const variantColors: Record<EmptyStateVariant, string> = {
  default: 'from-gray-100 to-gray-200 text-gray-400',
  search: 'from-blue-100 to-blue-200 text-blue-400',
  inbox: 'from-purple-100 to-purple-200 text-purple-400',
  users: 'from-green-100 to-green-200 text-green-400',
  security: 'from-amber-100 to-amber-200 text-amber-400',
  notifications: 'from-pink-100 to-pink-200 text-pink-400',
  activity: 'from-cyan-100 to-cyan-200 text-cyan-400',
  folder: 'from-orange-100 to-orange-200 text-orange-400',
};

export function EmptyState({
  variant = 'default',
  icon,
  title,
  description,
  action,
  secondaryAction,
  className,
  children
}: EmptyStateProps) {
  const Icon = icon || variantIcons[variant];
  const colorClasses = variantColors[variant];

  return (
    <div className={cn(
      'flex flex-col items-center justify-center py-12 px-4 text-center',
      'animate-fade-in',
      className
    )}>
      {/* Animated Icon Container */}
      <div className={cn(
        'relative mb-6 animate-bounce-in'
      )}>
        {/* Background Glow */}
        <div className={cn(
          'absolute inset-0 rounded-full blur-xl opacity-50',
          `bg-gradient-to-br ${colorClasses.split(' ')[0]} ${colorClasses.split(' ')[1]}`
        )} />

        {/* Icon Circle */}
        <div className={cn(
          'relative w-20 h-20 rounded-full flex items-center justify-center',
          'bg-gradient-to-br shadow-lg',
          colorClasses.split(' ').slice(0, 2).join(' ')
        )}>
          <Icon className={cn(
            'w-10 h-10 animate-float',
            colorClasses.split(' ')[2]
          )} />
        </div>

        {/* Decorative Dots */}
        <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-current opacity-20 animate-pulse" />
        <div className="absolute -bottom-2 -left-2 w-2 h-2 rounded-full bg-current opacity-30 animate-pulse stagger-2" />
      </div>

      {/* Text Content */}
      <h3 className="text-lg font-semibold text-foreground mb-2 animate-fade-in stagger-1">
        {title}
      </h3>

      {description && (
        <p className="text-sm text-muted-foreground max-w-sm mb-6 animate-fade-in stagger-2">
          {description}
        </p>
      )}

      {/* Actions */}
      {(action || secondaryAction) && (
        <div className="flex flex-col sm:flex-row gap-3 animate-fade-in stagger-3">
          {action && (
            <Button
              onClick={action.onClick}
              className="btn-press"
            >
              {action.label}
            </Button>
          )}
          {secondaryAction && (
            <Button
              variant="outline"
              onClick={secondaryAction.onClick}
              className="btn-press"
            >
              {secondaryAction.label}
            </Button>
          )}
        </div>
      )}

      {/* Custom Children */}
      {children && (
        <div className="mt-6 animate-fade-in stagger-4">
          {children}
        </div>
      )}
    </div>
  );
}

// Preset Empty States for common use cases
export function NoSearchResults({ query, onClear }: { query: string; onClear: () => void }) {
  return (
    <EmptyState
      variant="search"
      title="Sin resultados"
      description={`No encontramos resultados para "${query}". Intenta con otros términos de búsqueda.`}
      action={{
        label: 'Limpiar búsqueda',
        onClick: onClear
      }}
    />
  );
}

export function NoNotifications() {
  return (
    <EmptyState
      variant="notifications"
      title="Sin notificaciones"
      description="No tienes notificaciones nuevas. Te avisaremos cuando haya algo importante."
    />
  );
}

export function NoActivityLogs() {
  return (
    <EmptyState
      variant="activity"
      title="Sin actividad reciente"
      description="Tu historial de actividad aparecerá aquí. Comienza a usar la aplicación para ver tu actividad."
    />
  );
}

export function NoUsers() {
  return (
    <EmptyState
      variant="users"
      title="Sin usuarios"
      description="No hay usuarios registrados aún. Los nuevos usuarios aparecerán aquí."
    />
  );
}

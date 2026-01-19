'use client';

import { useActivityLog } from '../hooks/audit-logs.hook';
import { AUDIT_ACTION_LABELS } from '../types/audit-logs.types';
import type { AuditAction } from '@/db/schema';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const ACTION_ICONS: Record<AuditAction, string> = {
  LOGIN_SUCCESS: '✓',
  LOGIN_FAILED: '✗',
  LOGOUT: '→',
  PASSWORD_RESET_REQUESTED: '🔑',
  PASSWORD_RESET_COMPLETED: '🔐',
  EMAIL_VERIFIED: '✉',
  EMAIL_VERIFICATION_RESENT: '📧',
  TWO_FACTOR_ENABLED: '🛡',
  TWO_FACTOR_DISABLED: '🔓',
  TWO_FACTOR_VERIFIED: '✓',
  ACCOUNT_LOCKED: '🔒',
  ACCOUNT_UNLOCKED: '🔓',
  ACCOUNT_BLOCKED: '⛔',
  ACCOUNT_UNBLOCKED: '✓',
  REGISTRATION: '👤',
};

const ACTION_COLORS: Record<AuditAction, 'default' | 'secondary' | 'destructive' | 'outline'> = {
  LOGIN_SUCCESS: 'default',
  LOGIN_FAILED: 'destructive',
  LOGOUT: 'secondary',
  PASSWORD_RESET_REQUESTED: 'outline',
  PASSWORD_RESET_COMPLETED: 'default',
  EMAIL_VERIFIED: 'default',
  EMAIL_VERIFICATION_RESENT: 'outline',
  TWO_FACTOR_ENABLED: 'default',
  TWO_FACTOR_DISABLED: 'secondary',
  TWO_FACTOR_VERIFIED: 'default',
  ACCOUNT_LOCKED: 'destructive',
  ACCOUNT_UNLOCKED: 'default',
  ACCOUNT_BLOCKED: 'destructive',
  ACCOUNT_UNBLOCKED: 'default',
  REGISTRATION: 'default',
};

function formatDate(date: Date | string): string {
  const d = new Date(date);
  return d.toLocaleDateString('es-ES', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function parseUserAgent(userAgent: string): string {
  if (!userAgent || userAgent === 'unknown') return 'Desconocido';

  // Simple parsing for common browsers
  if (userAgent.includes('Chrome') && !userAgent.includes('Edg')) {
    return 'Chrome';
  }
  if (userAgent.includes('Firefox')) {
    return 'Firefox';
  }
  if (userAgent.includes('Safari') && !userAgent.includes('Chrome')) {
    return 'Safari';
  }
  if (userAgent.includes('Edg')) {
    return 'Edge';
  }
  if (userAgent.includes('Opera') || userAgent.includes('OPR')) {
    return 'Opera';
  }

  return 'Navegador';
}

export function ActivityLogComponent() {
  const { logs, hasMore, isLoading, error, loadMore, refresh } = useActivityLog(10);

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Actividad reciente</CardTitle>
          <CardDescription>Historial de eventos de seguridad</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-destructive text-sm">{error}</p>
          <Button variant="outline" size="sm" onClick={refresh} className="mt-2">
            Reintentar
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">Actividad reciente</CardTitle>
            <CardDescription>Historial de eventos de seguridad</CardDescription>
          </div>
          <Button variant="ghost" size="sm" onClick={refresh} disabled={isLoading}>
            {isLoading ? 'Cargando...' : 'Actualizar'}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading && logs.length === 0 ? (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                <div className="w-8 h-8 rounded-full bg-muted" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-muted rounded w-1/3" />
                  <div className="h-3 bg-muted rounded w-1/4" />
                </div>
              </div>
            ))}
          </div>
        ) : logs.length === 0 ? (
          <p className="text-muted-foreground text-sm text-center py-4">
            No hay actividad registrada
          </p>
        ) : (
          <div className="space-y-2">
            {logs.map((log) => (
              <div
                key={log.id}
                className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-muted text-sm">
                  {ACTION_ICONS[log.action]}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge variant={ACTION_COLORS[log.action]} className="text-xs">
                      {AUDIT_ACTION_LABELS[log.action]}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                    <span>{formatDate(log.createdAt)}</span>
                    <span>•</span>
                    <span>{log.ipAddress || 'IP desconocida'}</span>
                    <span>•</span>
                    <span>{parseUserAgent(log.userAgent || '')}</span>
                  </div>
                </div>
              </div>
            ))}

            {hasMore && (
              <div className="pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={loadMore}
                  disabled={isLoading}
                  className="w-full"
                >
                  {isLoading ? 'Cargando...' : 'Cargar más'}
                </Button>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

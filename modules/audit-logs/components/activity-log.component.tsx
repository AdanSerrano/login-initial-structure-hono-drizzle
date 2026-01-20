'use client';

import { useEffect, useRef, useCallback } from 'react';
import { useActivityLog } from '../hooks/audit-logs.hook';
import { AUDIT_ACTION_LABELS } from '../types/audit-logs.types';
import type { AuditAction } from '@/db/schema';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Loader2 } from 'lucide-react';

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
  BACKUP_CODES_GENERATED: '📋',
  BACKUP_CODE_USED: '🎫',
  SESSION_REVOKED: '🚫',
  DEVICE_TRUSTED: '📱',
  SUSPICIOUS_LOGIN_DETECTED: '⚠',
  ACCOUNT_LOCKED: '🔒',
  ACCOUNT_UNLOCKED: '🔓',
  ACCOUNT_BLOCKED: '⛔',
  ACCOUNT_UNBLOCKED: '✓',
  ACCOUNT_DELETED: '🗑',
  ACCOUNT_REACTIVATED: '♻',
  ACCOUNT_ANONYMIZED: '👻',
  REGISTRATION: '👤',
  EMAIL_CHANGE_REQUESTED: '📧',
  EMAIL_CHANGED: '✉',
  MAGIC_LINK_SENT: '✨',
  MAGIC_LINK_LOGIN: '🔮',
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
  BACKUP_CODES_GENERATED: 'outline',
  BACKUP_CODE_USED: 'secondary',
  SESSION_REVOKED: 'destructive',
  DEVICE_TRUSTED: 'default',
  SUSPICIOUS_LOGIN_DETECTED: 'destructive',
  ACCOUNT_LOCKED: 'destructive',
  ACCOUNT_UNLOCKED: 'default',
  ACCOUNT_BLOCKED: 'destructive',
  ACCOUNT_UNBLOCKED: 'default',
  ACCOUNT_DELETED: 'destructive',
  ACCOUNT_REACTIVATED: 'default',
  ACCOUNT_ANONYMIZED: 'secondary',
  REGISTRATION: 'default',
  EMAIL_CHANGE_REQUESTED: 'outline',
  EMAIL_CHANGED: 'default',
  MAGIC_LINK_SENT: 'outline',
  MAGIC_LINK_LOGIN: 'default',
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

interface DeviceInfo {
  browser: string;
  os: string;
}

function parseUserAgent(userAgent: string): DeviceInfo {
  if (!userAgent || userAgent === 'unknown') {
    return { browser: 'Desconocido', os: '' };
  }

  // Detect browser
  let browser = 'Navegador';
  if (userAgent.includes('Chrome') && !userAgent.includes('Edg') && !userAgent.includes('OPR')) {
    browser = 'Chrome';
  } else if (userAgent.includes('Firefox')) {
    browser = 'Firefox';
  } else if (userAgent.includes('Safari') && !userAgent.includes('Chrome')) {
    browser = 'Safari';
  } else if (userAgent.includes('Edg')) {
    browser = 'Edge';
  } else if (userAgent.includes('Opera') || userAgent.includes('OPR')) {
    browser = 'Opera';
  }

  // Detect OS
  let os = '';
  if (userAgent.includes('Windows')) {
    os = 'Windows';
  } else if (userAgent.includes('Mac OS') || userAgent.includes('Macintosh')) {
    os = 'macOS';
  } else if (userAgent.includes('Linux') && !userAgent.includes('Android')) {
    os = 'Linux';
  } else if (userAgent.includes('Android')) {
    os = 'Android';
  } else if (userAgent.includes('iPhone') || userAgent.includes('iPad')) {
    os = 'iOS';
  }

  return { browser, os };
}

function formatDeviceInfo(userAgent: string): string {
  const { browser, os } = parseUserAgent(userAgent);
  if (os) {
    return `${browser} en ${os}`;
  }
  return browser;
}

interface LocationMetadata {
  country?: string;
  city?: string;
}

function getLocationFromMetadata(metadata: unknown): LocationMetadata | null {
  if (!metadata || typeof metadata !== 'object') return null;
  const meta = metadata as Record<string, unknown>;
  if (!meta.location || typeof meta.location !== 'object') return null;
  const location = meta.location as Record<string, unknown>;
  return {
    country: typeof location.country === 'string' ? location.country : undefined,
    city: typeof location.city === 'string' ? location.city : undefined,
  };
}

function formatLocation(metadata: unknown): string | null {
  const location = getLocationFromMetadata(metadata);
  if (!location) return null;

  const parts: string[] = [];
  if (location.city) parts.push(location.city);
  if (location.country) parts.push(location.country);

  return parts.length > 0 ? parts.join(', ') : null;
}

export function ActivityLogComponent() {
  const { logs, hasMore, isLoading, isLoadingMore, error, loadMore, refresh } = useActivityLog(10);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  const handleIntersection = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries;
      if (entry.isIntersecting && hasMore && !isLoadingMore) {
        loadMore();
      }
    },
    [hasMore, isLoadingMore, loadMore]
  );

  useEffect(() => {
    const observer = new IntersectionObserver(handleIntersection, {
      root: null,
      rootMargin: '100px',
      threshold: 0.1,
    });

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => observer.disconnect();
  }, [handleIntersection]);

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
            {isLoading && logs.length > 0 ? 'Cargando...' : 'Actualizar'}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {isLoading && logs.length === 0 ? (
          <div className="space-y-3 p-6">
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
          <p className="text-muted-foreground text-sm text-center py-8 px-6">
            No hay actividad registrada
          </p>
        ) : (
          <ScrollArea className="h-[400px]">
            <div className="space-y-1 p-4">
              {logs.map((log) => {
                const location = formatLocation(log.metadata);
                const deviceInfo = formatDeviceInfo(log.userAgent || '');

                return (
                  <div
                    key={log.id}
                    className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-muted text-sm shrink-0">
                      {ACTION_ICONS[log.action]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge variant={ACTION_COLORS[log.action]} className="text-xs">
                          {AUDIT_ACTION_LABELS[log.action]}
                        </Badge>
                      </div>
                      <div className="mt-1 text-xs text-muted-foreground">
                        <span>{deviceInfo}</span>
                        {location && (
                          <>
                            <span className="mx-1">•</span>
                            <span>{location}</span>
                          </>
                        )}
                      </div>
                      <div className="text-xs text-muted-foreground/70 mt-0.5">
                        {formatDate(log.createdAt)}
                      </div>
                    </div>
                  </div>
                );
              })}

              {hasMore && (
                <div ref={loadMoreRef} className="flex justify-center py-4">
                  {isLoadingMore && (
                    <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                  )}
                </div>
              )}

              {!hasMore && logs.length > 0 && (
                <p className="text-center text-xs text-muted-foreground py-4">
                  No hay más actividad
                </p>
              )}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
}

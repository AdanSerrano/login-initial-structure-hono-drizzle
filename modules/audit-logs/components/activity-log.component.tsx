'use client';

import { useEffect, useRef, useCallback } from 'react';
import { useActivityLog } from '../hooks/audit-logs.hook';
import { AUDIT_ACTION_LABELS } from '../types/audit-logs.types';
import type { AuditAction } from '@/db/schema';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  Loader2,
  RefreshCw,
  CheckCircle,
  XCircle,
  LogOut,
  Key,
  Lock,
  Mail,
  Shield,
  ShieldOff,
  Smartphone,
  AlertTriangle,
  Ban,
  Trash2,
  RotateCcw,
  UserPlus,
  Sparkles,
  Globe,
  Monitor,
  Clock,
  Info,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const ACTION_ICONS: Record<AuditAction, React.ReactNode> = {
  LOGIN_SUCCESS: <CheckCircle className="w-4 h-4 text-emerald-500" />,
  LOGIN_FAILED: <XCircle className="w-4 h-4 text-red-500" />,
  LOGOUT: <LogOut className="w-4 h-4 text-slate-500" />,
  PASSWORD_RESET_REQUESTED: <Key className="w-4 h-4 text-amber-500" />,
  PASSWORD_RESET_COMPLETED: <Lock className="w-4 h-4 text-emerald-500" />,
  EMAIL_VERIFIED: <Mail className="w-4 h-4 text-emerald-500" />,
  EMAIL_VERIFICATION_RESENT: <Mail className="w-4 h-4 text-blue-500" />,
  TWO_FACTOR_ENABLED: <Shield className="w-4 h-4 text-emerald-500" />,
  TWO_FACTOR_DISABLED: <ShieldOff className="w-4 h-4 text-amber-500" />,
  TWO_FACTOR_VERIFIED: <Shield className="w-4 h-4 text-violet-500" />,
  BACKUP_CODES_GENERATED: <Key className="w-4 h-4 text-blue-500" />,
  BACKUP_CODE_USED: <Key className="w-4 h-4 text-amber-500" />,
  SESSION_REVOKED: <Ban className="w-4 h-4 text-red-500" />,
  DEVICE_TRUSTED: <Smartphone className="w-4 h-4 text-emerald-500" />,
  SUSPICIOUS_LOGIN_DETECTED: <AlertTriangle className="w-4 h-4 text-red-500" />,
  ACCOUNT_LOCKED: <Lock className="w-4 h-4 text-red-500" />,
  ACCOUNT_UNLOCKED: <Lock className="w-4 h-4 text-emerald-500" />,
  ACCOUNT_BLOCKED: <Ban className="w-4 h-4 text-red-500" />,
  ACCOUNT_UNBLOCKED: <CheckCircle className="w-4 h-4 text-emerald-500" />,
  ACCOUNT_DELETED: <Trash2 className="w-4 h-4 text-red-500" />,
  ACCOUNT_REACTIVATED: <RotateCcw className="w-4 h-4 text-emerald-500" />,
  ACCOUNT_ANONYMIZED: <UserPlus className="w-4 h-4 text-slate-500" />,
  REGISTRATION: <UserPlus className="w-4 h-4 text-violet-500" />,
  EMAIL_CHANGE_REQUESTED: <Mail className="w-4 h-4 text-amber-500" />,
  EMAIL_CHANGED: <Mail className="w-4 h-4 text-emerald-500" />,
  MAGIC_LINK_SENT: <Sparkles className="w-4 h-4 text-violet-500" />,
  MAGIC_LINK_LOGIN: <Sparkles className="w-4 h-4 text-emerald-500" />,
};

type BadgeVariant = 'default' | 'secondary' | 'destructive' | 'outline';

const ACTION_BADGE_STYLES: Record<AuditAction, { variant: BadgeVariant; className: string }> = {
  LOGIN_SUCCESS: { variant: 'default', className: 'bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-emerald-200' },
  LOGIN_FAILED: { variant: 'destructive', className: 'bg-red-100 text-red-700 hover:bg-red-100 border-red-200' },
  LOGOUT: { variant: 'secondary', className: 'bg-slate-100 text-slate-700 hover:bg-slate-100' },
  PASSWORD_RESET_REQUESTED: { variant: 'outline', className: 'bg-amber-50 text-amber-700 border-amber-200' },
  PASSWORD_RESET_COMPLETED: { variant: 'default', className: 'bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-emerald-200' },
  EMAIL_VERIFIED: { variant: 'default', className: 'bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-emerald-200' },
  EMAIL_VERIFICATION_RESENT: { variant: 'outline', className: 'bg-blue-50 text-blue-700 border-blue-200' },
  TWO_FACTOR_ENABLED: { variant: 'default', className: 'bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-emerald-200' },
  TWO_FACTOR_DISABLED: { variant: 'secondary', className: 'bg-amber-100 text-amber-700 hover:bg-amber-100' },
  TWO_FACTOR_VERIFIED: { variant: 'default', className: 'bg-violet-100 text-violet-700 hover:bg-violet-100 border-violet-200' },
  BACKUP_CODES_GENERATED: { variant: 'outline', className: 'bg-blue-50 text-blue-700 border-blue-200' },
  BACKUP_CODE_USED: { variant: 'secondary', className: 'bg-amber-100 text-amber-700 hover:bg-amber-100' },
  SESSION_REVOKED: { variant: 'destructive', className: 'bg-red-100 text-red-700 hover:bg-red-100 border-red-200' },
  DEVICE_TRUSTED: { variant: 'default', className: 'bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-emerald-200' },
  SUSPICIOUS_LOGIN_DETECTED: { variant: 'destructive', className: 'bg-red-100 text-red-700 hover:bg-red-100 border-red-200' },
  ACCOUNT_LOCKED: { variant: 'destructive', className: 'bg-red-100 text-red-700 hover:bg-red-100 border-red-200' },
  ACCOUNT_UNLOCKED: { variant: 'default', className: 'bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-emerald-200' },
  ACCOUNT_BLOCKED: { variant: 'destructive', className: 'bg-red-100 text-red-700 hover:bg-red-100 border-red-200' },
  ACCOUNT_UNBLOCKED: { variant: 'default', className: 'bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-emerald-200' },
  ACCOUNT_DELETED: { variant: 'destructive', className: 'bg-red-100 text-red-700 hover:bg-red-100 border-red-200' },
  ACCOUNT_REACTIVATED: { variant: 'default', className: 'bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-emerald-200' },
  ACCOUNT_ANONYMIZED: { variant: 'secondary', className: 'bg-slate-100 text-slate-700 hover:bg-slate-100' },
  REGISTRATION: { variant: 'default', className: 'bg-violet-100 text-violet-700 hover:bg-violet-100 border-violet-200' },
  EMAIL_CHANGE_REQUESTED: { variant: 'outline', className: 'bg-amber-50 text-amber-700 border-amber-200' },
  EMAIL_CHANGED: { variant: 'default', className: 'bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-emerald-200' },
  MAGIC_LINK_SENT: { variant: 'outline', className: 'bg-violet-50 text-violet-700 border-violet-200' },
  MAGIC_LINK_LOGIN: { variant: 'default', className: 'bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-emerald-200' },
};

function formatDate(date: Date | string): string {
  const d = new Date(date);
  return d.toLocaleDateString('es-ES', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function formatFullDate(date: Date | string): string {
  const d = new Date(date);
  return d.toLocaleDateString('es-ES', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
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
      <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4">
        <p className="text-destructive text-sm">{error}</p>
        <Button variant="outline" size="sm" onClick={refresh} className="mt-2">
          Reintentar
        </Button>
      </div>
    );
  }

  return (
    <TooltipProvider>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            {logs.length > 0 ? `${logs.length} eventos registrados` : 'Sin actividad'}
          </p>
          <Button
            variant="ghost"
            size="sm"
            onClick={refresh}
            disabled={isLoading}
            className="gap-2 hover:bg-violet-50 hover:text-violet-700"
          >
            <RefreshCw className={cn("w-4 h-4", isLoading && "animate-spin")} />
            Actualizar
          </Button>
        </div>

        {isLoading && logs.length === 0 ? (
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="animate-pulse flex items-center gap-4 p-3 rounded-lg bg-muted/30">
                <div className="w-8 h-8 rounded-full bg-muted" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-muted rounded w-1/4" />
                  <div className="h-3 bg-muted rounded w-1/3" />
                </div>
                <div className="h-4 bg-muted rounded w-20" />
              </div>
            ))}
          </div>
        ) : logs.length === 0 ? (
          <div className="text-center py-12 rounded-lg border border-dashed border-border/50">
            <Info className="w-10 h-10 text-muted-foreground/50 mx-auto mb-3" />
            <p className="text-muted-foreground text-sm">No hay actividad registrada</p>
          </div>
        ) : (
          <ScrollArea className="h-[420px] rounded-lg border border-border/50">
            <Table>
              <TableHeader className="sticky top-0 bg-background/95 backdrop-blur-sm z-10">
                <TableRow className="hover:bg-transparent border-b border-border/50">
                  <TableHead className="w-[50px]"></TableHead>
                  <TableHead>Actividad</TableHead>
                  <TableHead className="hidden sm:table-cell">Dispositivo</TableHead>
                  <TableHead className="hidden md:table-cell">Ubicación</TableHead>
                  <TableHead className="text-right">Fecha</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {logs.map((log) => {
                  const location = formatLocation(log.metadata);
                  const { browser, os } = parseUserAgent(log.userAgent || '');
                  const badgeStyle = ACTION_BADGE_STYLES[log.action];

                  return (
                    <TableRow
                      key={log.id}
                      className="group hover:bg-violet-50/50 transition-colors border-b border-border/30"
                    >
                      <TableCell className="py-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center group-hover:scale-110 transition-transform">
                          {ACTION_ICONS[log.action]}
                        </div>
                      </TableCell>
                      <TableCell className="py-3">
                        <Badge
                          variant={badgeStyle.variant}
                          className={cn("text-xs font-medium", badgeStyle.className)}
                        >
                          {AUDIT_ACTION_LABELS[log.action]}
                        </Badge>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell py-3">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground cursor-help">
                              <Monitor className="w-4 h-4" />
                              <span className="truncate max-w-[120px]">{browser}</span>
                              {os && (
                                <span className="text-xs text-muted-foreground/70">({os})</span>
                              )}
                            </div>
                          </TooltipTrigger>
                          <TooltipContent side="bottom" className="max-w-xs">
                            <p className="text-xs break-all">{log.userAgent || 'Desconocido'}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TableCell>
                      <TableCell className="hidden md:table-cell py-3">
                        {location ? (
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Globe className="w-4 h-4" />
                            <span>{location}</span>
                          </div>
                        ) : (
                          <span className="text-xs text-muted-foreground/50">—</span>
                        )}
                      </TableCell>
                      <TableCell className="text-right py-3">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className="flex items-center justify-end gap-1.5 text-xs text-muted-foreground cursor-help">
                              <Clock className="w-3.5 h-3.5" />
                              <span>{formatDate(log.createdAt)}</span>
                            </div>
                          </TooltipTrigger>
                          <TooltipContent side="left">
                            <p className="text-xs">{formatFullDate(log.createdAt)}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>

            {hasMore && (
              <div ref={loadMoreRef} className="flex justify-center py-4">
                {isLoadingMore && (
                  <Loader2 className="h-5 w-5 animate-spin text-violet-500" />
                )}
              </div>
            )}

            {!hasMore && logs.length > 0 && (
              <p className="text-center text-xs text-muted-foreground py-4 border-t border-border/30">
                Has visto toda la actividad
              </p>
            )}
          </ScrollArea>
        )}
      </div>
    </TooltipProvider>
  );
}

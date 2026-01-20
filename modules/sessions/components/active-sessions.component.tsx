'use client';

import { useEffect } from 'react';
import { useSessions } from '../hooks/sessions.hook';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
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
  Monitor,
  Smartphone,
  Tablet,
  Globe,
  Loader2,
  LogOut,
  RefreshCw,
  Shield,
  Clock,
  MapPin,
  Info,
} from 'lucide-react';
import { cn } from '@/lib/utils';

function getDeviceIcon(userAgent: string | null) {
  if (!userAgent) return <Globe className="h-5 w-5 text-muted-foreground" />;

  const ua = userAgent.toLowerCase();
  if (ua.includes('mobile') || ua.includes('android') || ua.includes('iphone')) {
    return <Smartphone className="h-5 w-5 text-violet-500" />;
  }
  if (ua.includes('tablet') || ua.includes('ipad')) {
    return <Tablet className="h-5 w-5 text-blue-500" />;
  }
  return <Monitor className="h-5 w-5 text-emerald-500" />;
}

function getBrowserInfo(userAgent: string | null): string {
  if (!userAgent) return 'Desconocido';

  if (userAgent.includes('Chrome') && !userAgent.includes('Edg') && !userAgent.includes('OPR')) {
    return 'Chrome';
  } else if (userAgent.includes('Firefox')) {
    return 'Firefox';
  } else if (userAgent.includes('Safari') && !userAgent.includes('Chrome')) {
    return 'Safari';
  } else if (userAgent.includes('Edg')) {
    return 'Edge';
  } else if (userAgent.includes('Opera') || userAgent.includes('OPR')) {
    return 'Opera';
  }
  return 'Navegador';
}

function getOSInfo(userAgent: string | null): string {
  if (!userAgent) return '';

  if (userAgent.includes('Windows')) return 'Windows';
  if (userAgent.includes('Mac OS') || userAgent.includes('Macintosh')) return 'macOS';
  if (userAgent.includes('Linux') && !userAgent.includes('Android')) return 'Linux';
  if (userAgent.includes('Android')) return 'Android';
  if (userAgent.includes('iPhone') || userAgent.includes('iPad')) return 'iOS';
  return '';
}

function formatDate(date: Date | string | null): string {
  if (!date) return 'Nunca';
  const d = new Date(date);
  return d.toLocaleDateString('es-ES', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function getRelativeTime(date: Date | string | null): string {
  if (!date) return 'Desconocido';

  const now = new Date();
  const d = new Date(date);
  const diffMs = now.getTime() - d.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return 'Ahora';
  if (diffMins < 60) return `${diffMins}m`;
  if (diffHours < 24) return `${diffHours}h`;
  if (diffDays < 7) return `${diffDays}d`;
  return formatDate(date);
}

export function ActiveSessionsComponent() {
  const {
    sessions,
    isLoading,
    isPending,
    error,
    fetchSessions,
    revokeSession,
    revokeAllOtherSessions,
  } = useSessions();

  useEffect(() => {
    fetchSessions();
  }, [fetchSessions]);

  const otherSessionsCount = sessions.filter((s) => !s.isCurrent).length;

  if (error) {
    return (
      <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4">
        <p className="text-destructive text-sm">{error}</p>
        <Button variant="outline" size="sm" onClick={fetchSessions} className="mt-2">
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
            {sessions.length === 1
              ? '1 sesión activa'
              : `${sessions.length} sesiones activas`}
          </p>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={fetchSessions}
              disabled={isLoading}
              className="gap-2 hover:bg-violet-50 hover:text-violet-700"
            >
              <RefreshCw className={cn("h-4 w-4", isLoading && "animate-spin")} />
              <span className="hidden sm:inline">Actualizar</span>
            </Button>
            {otherSessionsCount > 0 && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={isPending}
                    className="gap-2 text-red-600 hover:text-red-700 hover:bg-red-50 hover:border-red-200"
                  >
                    <LogOut className="h-4 w-4" />
                    <span className="hidden sm:inline">Cerrar otras</span>
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Cerrar otras sesiones</AlertDialogTitle>
                    <AlertDialogDescription>
                      Esto cerrará todas las sesiones excepto la actual. Tendrás que iniciar sesión
                      de nuevo en esos dispositivos.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={revokeAllOtherSessions}
                      className="bg-red-600 hover:bg-red-700"
                    >
                      Cerrar {otherSessionsCount} sesión{otherSessionsCount === 1 ? '' : 'es'}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>
        </div>

        {isLoading && sessions.length === 0 ? (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse flex items-center gap-4 p-4 rounded-lg bg-muted/30">
                <div className="w-10 h-10 rounded-full bg-muted" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-muted rounded w-1/3" />
                  <div className="h-3 bg-muted rounded w-1/4" />
                </div>
              </div>
            ))}
          </div>
        ) : sessions.length === 0 ? (
          <div className="text-center py-12 rounded-lg border border-dashed border-border/50">
            <Info className="w-10 h-10 text-muted-foreground/50 mx-auto mb-3" />
            <p className="text-muted-foreground text-sm">No hay sesiones activas</p>
          </div>
        ) : (
          <div className="rounded-lg border border-border/50 overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent bg-muted/30 border-b border-border/50">
                  <TableHead className="w-[60px]">Tipo</TableHead>
                  <TableHead>Dispositivo</TableHead>
                  <TableHead className="hidden sm:table-cell">IP</TableHead>
                  <TableHead className="hidden md:table-cell">Último acceso</TableHead>
                  <TableHead className="w-[80px] text-right">Acción</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sessions.map((session) => {
                  const browser = getBrowserInfo(session.userAgent);
                  const os = getOSInfo(session.userAgent);

                  return (
                    <TableRow
                      key={session.id}
                      className={cn(
                        "group transition-colors border-b border-border/30",
                        session.isCurrent
                          ? "bg-violet-50/50 hover:bg-violet-50"
                          : "hover:bg-muted/50"
                      )}
                    >
                      <TableCell className="py-4">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className={cn(
                              "w-10 h-10 rounded-full flex items-center justify-center",
                              session.isCurrent
                                ? "bg-gradient-to-br from-violet-100 to-purple-100"
                                : "bg-gradient-to-br from-muted to-muted/50"
                            )}>
                              {getDeviceIcon(session.userAgent)}
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>
                            {session.deviceName || 'Dispositivo desconocido'}
                          </TooltipContent>
                        </Tooltip>
                      </TableCell>
                      <TableCell className="py-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-sm">
                              {browser}
                            </span>
                            {os && (
                              <span className="text-xs text-muted-foreground">
                                en {os}
                              </span>
                            )}
                            {session.isCurrent && (
                              <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-emerald-200 text-xs">
                                <Shield className="w-3 h-3 mr-1" />
                                Actual
                              </Badge>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground truncate max-w-[200px]">
                            {session.deviceName || 'Dispositivo desconocido'}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell py-4">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className="flex items-center gap-1.5 text-sm text-muted-foreground cursor-help">
                              <MapPin className="w-3.5 h-3.5" />
                              <span className="font-mono text-xs">
                                {session.ipAddress || '—'}
                              </span>
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>
                            Dirección IP
                          </TooltipContent>
                        </Tooltip>
                      </TableCell>
                      <TableCell className="hidden md:table-cell py-4">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className="flex items-center gap-1.5 text-xs text-muted-foreground cursor-help">
                              <Clock className="w-3.5 h-3.5" />
                              <span>{getRelativeTime(session.lastUsedAt || session.createdAt)}</span>
                            </div>
                          </TooltipTrigger>
                          <TooltipContent side="left">
                            {formatDate(session.lastUsedAt || session.createdAt)}
                          </TooltipContent>
                        </Tooltip>
                      </TableCell>
                      <TableCell className="text-right py-4">
                        {!session.isCurrent ? (
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                disabled={isPending}
                              >
                                <LogOut className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Cerrar sesión</AlertDialogTitle>
                                <AlertDialogDescription>
                                  ¿Estás seguro de que quieres cerrar esta sesión? El dispositivo tendrá que
                                  iniciar sesión de nuevo.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => revokeSession(session.id)}
                                  className="bg-red-600 hover:bg-red-700"
                                >
                                  Cerrar sesión
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        ) : (
                          <span className="text-xs text-muted-foreground">—</span>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </TooltipProvider>
  );
}

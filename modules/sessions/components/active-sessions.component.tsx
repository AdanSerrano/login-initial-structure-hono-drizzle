'use client';

import { useEffect } from 'react';
import { useSessions } from '../hooks/sessions.hook';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
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
import { Monitor, Smartphone, Tablet, Globe, Loader2, LogOut, RefreshCw } from 'lucide-react';

function getDeviceIcon(userAgent: string | null) {
  if (!userAgent) return <Globe className="h-5 w-5" />;

  const ua = userAgent.toLowerCase();
  if (ua.includes('mobile') || ua.includes('android') || ua.includes('iphone')) {
    return <Smartphone className="h-5 w-5" />;
  }
  if (ua.includes('tablet') || ua.includes('ipad')) {
    return <Tablet className="h-5 w-5" />;
  }
  return <Monitor className="h-5 w-5" />;
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

  if (diffMins < 1) return 'Justo ahora';
  if (diffMins < 60) return `Hace ${diffMins} minuto${diffMins === 1 ? '' : 's'}`;
  if (diffHours < 24) return `Hace ${diffHours} hora${diffHours === 1 ? '' : 's'}`;
  if (diffDays < 7) return `Hace ${diffDays} día${diffDays === 1 ? '' : 's'}`;
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
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Sesiones activas</CardTitle>
          <CardDescription>Administra tus sesiones en diferentes dispositivos</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-destructive text-sm">{error}</p>
          <Button variant="outline" size="sm" onClick={fetchSessions} className="mt-2">
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
            <CardTitle className="text-lg">Sesiones activas</CardTitle>
            <CardDescription>
              {sessions.length === 1
                ? 'Tienes 1 sesión activa'
                : `Tienes ${sessions.length} sesiones activas`}
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={fetchSessions}
              disabled={isLoading}
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            </Button>
            {otherSessionsCount > 0 && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" size="sm" disabled={isPending}>
                    Cerrar otras sesiones
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
                    <AlertDialogAction onClick={revokeAllOtherSessions}>
                      Cerrar {otherSessionsCount} sesión{otherSessionsCount === 1 ? '' : 'es'}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {isLoading && sessions.length === 0 ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : sessions.length === 0 ? (
          <p className="text-muted-foreground text-sm text-center py-8 px-6">
            No hay sesiones activas
          </p>
        ) : (
          <div className="divide-y">
            {sessions.map((session) => (
              <div
                key={session.id}
                className="flex items-center justify-between gap-4 px-6 py-4 hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-muted shrink-0">
                    {getDeviceIcon(session.userAgent)}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-medium text-sm truncate">
                        {session.deviceName || 'Dispositivo desconocido'}
                      </span>
                      {session.isCurrent && (
                        <Badge variant="secondary" className="text-xs">
                          Sesión actual
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground flex-wrap">
                      <span>{session.ipAddress || 'IP desconocida'}</span>
                      <span>•</span>
                      <span title={formatDate(session.lastUsedAt || session.createdAt)}>
                        Último acceso: {getRelativeTime(session.lastUsedAt || session.createdAt)}
                      </span>
                    </div>
                  </div>
                </div>

                {!session.isCurrent && (
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
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
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          Cerrar sesión
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

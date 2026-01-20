'use client';

import Link from 'next/link';
import { useUser } from '@/modules/user/hooks/user.hook';
import { SecuritySettingsForm } from '../components/security-settings.form';
import { ActiveSessionsComponent } from '@/modules/sessions/components/active-sessions.component';
import { ActivityLogComponent } from '@/modules/audit-logs/components/activity-log.component';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Shield,
  Fingerprint,
  Monitor,
  History,
  User,
  ChevronRight,
  CheckCircle,
  AlertTriangle,
} from 'lucide-react';

export function SecuritySettingsView() {
  const { user } = useUser();

  const securityScore = () => {
    let score = 0;
    if (user?.emailVerified) score += 33;
    if (user?.isTwoFactorEnabled) score += 34;
    score += 33; // Base score for having an account
    return score;
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 50) return 'text-amber-600';
    return 'text-red-600';
  };

  const getScoreBg = (score: number) => {
    if (score >= 80) return 'bg-green-100';
    if (score >= 50) return 'bg-amber-100';
    return 'bg-red-100';
  };

  const score = securityScore();

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Configuración de Seguridad</h1>
        <p className="text-gray-600 mt-1">Protege tu cuenta con estas opciones de seguridad</p>
      </div>

      {/* Security Overview Card */}
      <Card className="overflow-hidden">
        <div className="h-2 bg-gradient-to-r from-blue-600 to-purple-600"></div>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-6 md:items-center">
            {/* Security Score */}
            <div className="flex items-center gap-4">
              <div className={`w-20 h-20 rounded-2xl ${getScoreBg(score)} flex items-center justify-center`}>
                <span className={`text-3xl font-bold ${getScoreColor(score)}`}>{score}%</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Puntuación de Seguridad</h3>
                <p className="text-sm text-gray-600">
                  {score >= 80 ? 'Tu cuenta está bien protegida' :
                   score >= 50 ? 'Puedes mejorar tu seguridad' :
                   'Tu cuenta necesita más protección'}
                </p>
              </div>
            </div>

            {/* Quick Status */}
            <div className="flex-1 grid grid-cols-2 gap-4 md:pl-6 md:border-l">
              <div className="flex items-center gap-3">
                {user?.emailVerified ? (
                  <CheckCircle className="w-5 h-5 text-green-600" />
                ) : (
                  <AlertTriangle className="w-5 h-5 text-amber-600" />
                )}
                <div>
                  <p className="text-sm font-medium text-gray-900">Email</p>
                  <p className="text-xs text-gray-500">
                    {user?.emailVerified ? 'Verificado' : 'Sin verificar'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {user?.isTwoFactorEnabled ? (
                  <CheckCircle className="w-5 h-5 text-green-600" />
                ) : (
                  <AlertTriangle className="w-5 h-5 text-amber-600" />
                )}
                <div>
                  <p className="text-sm font-medium text-gray-900">2FA</p>
                  <p className="text-xs text-gray-500">
                    {user?.isTwoFactorEnabled ? `${user.twoFactorMethod}` : 'Deshabilitado'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 2FA Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <Fingerprint className="w-5 h-5 text-purple-600" />
            </div>
            <div className="flex-1">
              <CardTitle className="text-lg">Autenticación de Dos Factores</CardTitle>
              <CardDescription>
                Añade una capa extra de seguridad a tu cuenta
              </CardDescription>
            </div>
            {user?.isTwoFactorEnabled && (
              <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                <CheckCircle className="w-3 h-3 mr-1" />
                Activo
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <SecuritySettingsForm />
        </CardContent>
      </Card>

      {/* Active Sessions */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <Monitor className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <CardTitle className="text-lg">Sesiones Activas</CardTitle>
              <CardDescription>
                Dispositivos donde tu cuenta está iniciada
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <ActiveSessionsComponent />
        </CardContent>
      </Card>

      {/* Activity Log */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
              <History className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <CardTitle className="text-lg">Registro de Actividad</CardTitle>
              <CardDescription>
                Historial de acciones realizadas en tu cuenta
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <ActivityLogComponent />
        </CardContent>
      </Card>

      {/* Profile Quick Link */}
      <Card className="group hover:shadow-md transition-shadow">
        <Link href="/settings/profile">
          <CardContent className="flex items-center justify-between py-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <User className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Mi Perfil</h3>
                <p className="text-sm text-gray-600">
                  Información personal, email, datos
                </p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-colors" />
          </CardContent>
        </Link>
      </Card>
    </div>
  );
}

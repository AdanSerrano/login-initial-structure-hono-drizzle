'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useUser } from '../hooks/user.hook';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ProfileSkeleton } from '../components/profile.skeleton';
import { EditProfileForm } from '../components/edit-profile-form.component';
import { DangerZone } from '../components/danger-zone.component';
import { ExportDataDialog } from '../components/export-data-dialog.component';
import { ChangeEmailComponent } from '@/modules/email-change/components/change-email.component';
import {
  User,
  Mail,
  AtSign,
  Calendar,
  Shield,
  Download,
  Pencil,
  CheckCircle,
  AlertCircle,
  ChevronRight,
} from 'lucide-react';

export function ProfileView() {
  const { user, isLoading, isPending, updateUser } = useUser();
  const [isEditing, setIsEditing] = useState(false);

  if (isLoading) {
    return <ProfileSkeleton />;
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center py-20">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="w-8 h-8 text-gray-400" />
            </div>
            <CardTitle>No autenticado</CardTitle>
            <CardDescription>Debes iniciar sesión para ver tu perfil</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/login">
              <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                Iniciar sesión
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleUpdate = async (data: { name?: string; userName?: string }) => {
    await updateUser(data);
    setIsEditing(false);
  };

  const formatDate = (date: Date | null) => {
    if (!date) return 'No disponible';
    return new Intl.DateTimeFormat('es', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(new Date(date));
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Mi Perfil</h1>
        <p className="text-gray-600 mt-1">Gestiona tu información personal y preferencias de cuenta</p>
      </div>

      {/* Profile Card */}
      <Card className="overflow-hidden">
        <div className="h-24 bg-gradient-to-r from-blue-600 to-purple-600"></div>
        <CardContent className="relative pt-0">
          <div className="flex flex-col sm:flex-row gap-4 sm:items-end -mt-12">
            {/* Avatar */}
            <div className="w-24 h-24 rounded-xl bg-white shadow-lg flex items-center justify-center border-4 border-white overflow-hidden">
              {user.image ? (
                <img src={user.image} alt={user.name || ''} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                  <User className="w-10 h-10 text-blue-600" />
                </div>
              )}
            </div>

            {/* Name and Email */}
            <div className="flex-1 pb-2">
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-bold text-gray-900">{user.name || 'Usuario'}</h2>
                {user.emailVerified && (
                  <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Verificado
                  </Badge>
                )}
              </div>
              <p className="text-gray-600">{user.email}</p>
            </div>

            {/* Edit Button */}
            <Button
              variant="outline"
              onClick={() => setIsEditing(true)}
              className="gap-2"
            >
              <Pencil className="w-4 h-4" />
              Editar perfil
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 pt-6 border-t">
            <div className="text-center sm:text-left">
              <div className="flex items-center justify-center sm:justify-start gap-2 text-gray-500 mb-1">
                <AtSign className="w-4 h-4" />
                <span className="text-xs uppercase tracking-wider">Usuario</span>
              </div>
              <p className="font-medium text-gray-900">{user.userName || 'Sin definir'}</p>
            </div>
            <div className="text-center sm:text-left">
              <div className="flex items-center justify-center sm:justify-start gap-2 text-gray-500 mb-1">
                <Shield className="w-4 h-4" />
                <span className="text-xs uppercase tracking-wider">Rol</span>
              </div>
              <p className="font-medium text-gray-900 capitalize">{user.role?.toLowerCase() || 'Usuario'}</p>
            </div>
            <div className="text-center sm:text-left">
              <div className="flex items-center justify-center sm:justify-start gap-2 text-gray-500 mb-1">
                <Calendar className="w-4 h-4" />
                <span className="text-xs uppercase tracking-wider">Miembro desde</span>
              </div>
              <p className="font-medium text-gray-900">{formatDate(user.createdAt)}</p>
            </div>
            <div className="text-center sm:text-left">
              <div className="flex items-center justify-center sm:justify-start gap-2 text-gray-500 mb-1">
                <Mail className="w-4 h-4" />
                <span className="text-xs uppercase tracking-wider">Email</span>
              </div>
              <p className="font-medium text-gray-900 flex items-center gap-1">
                {user.emailVerified ? (
                  <span className="text-green-600 flex items-center gap-1">
                    <CheckCircle className="w-4 h-4" />
                    Verificado
                  </span>
                ) : (
                  <span className="text-amber-600 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    Pendiente
                  </span>
                )}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Edit Profile Form */}
      {isEditing && (
        <EditProfileForm
          initialData={{
            name: user.name || '',
            userName: user.userName || '',
          }}
          onSubmit={handleUpdate}
          onCancel={() => setIsEditing(false)}
          isPending={isPending}
        />
      )}

      {/* Change Email Section */}
      {user.email && (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-cyan-100 rounded-lg flex items-center justify-center">
                <Mail className="w-5 h-5 text-cyan-600" />
              </div>
              <div>
                <CardTitle className="text-lg">Cambiar Email</CardTitle>
                <CardDescription>
                  Actualiza tu dirección de correo electrónico
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <ChangeEmailComponent currentEmail={user.email} />
          </CardContent>
        </Card>
      )}

      {/* Privacy & Data */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
              <Download className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <CardTitle className="text-lg">Privacidad y Datos</CardTitle>
              <CardDescription>
                Gestiona tus datos personales y preferencias de privacidad (GDPR)
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <ExportDataDialog />
        </CardContent>
      </Card>

      {/* Security Quick Link */}
      <Card className="group hover:shadow-md transition-shadow">
        <Link href="/settings/security">
          <CardContent className="flex items-center justify-between py-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <Shield className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Configuración de Seguridad</h3>
                <p className="text-sm text-gray-600">
                  2FA, sesiones activas, registro de actividad
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {user.isTwoFactorEnabled ? (
                <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                  2FA Activo
                </Badge>
              ) : (
                <Badge variant="secondary">
                  2FA Inactivo
                </Badge>
              )}
              <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-colors" />
            </div>
          </CardContent>
        </Link>
      </Card>

      <Separator />

      {/* Danger Zone */}
      <DangerZone />
    </div>
  );
}

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
import { ScrollAnimation } from '@/components/ui/scroll-animation';
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
  Sparkles,
} from 'lucide-react';

export function ProfileView() {
  const { user, isLoading, isPending, updateUser } = useUser();
  const [isEditing, setIsEditing] = useState(false);

  if (isLoading) {
    return <ProfileSkeleton />;
  }

  if (!user) {
    return (
      <ScrollAnimation variant="fade-up">
        <div className="flex items-center justify-center py-20">
          <Card className="w-full max-w-md border-border/50 shadow-xl shadow-purple-500/5">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-violet-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="w-8 h-8 text-violet-600" />
              </div>
              <CardTitle>No autenticado</CardTitle>
              <CardDescription>Debes iniciar sesión para ver tu perfil</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/login">
                <Button className="w-full bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 shadow-lg shadow-purple-500/25">
                  Iniciar sesión
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </ScrollAnimation>
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
      <ScrollAnimation variant="fade-up">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-violet-500/20 to-purple-500/20 rounded-xl flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-violet-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">Mi Perfil</h1>
            <p className="text-muted-foreground mt-1">Gestiona tu información personal y preferencias de cuenta</p>
          </div>
        </div>
      </ScrollAnimation>

      {/* Profile Card */}
      <ScrollAnimation variant="fade-up" delay={0.1}>
        <Card className="overflow-hidden border-border/50 shadow-xl shadow-purple-500/5">
          <div className="h-24 bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRjMC0yIDItNCAyLTRzLTItMi00LTItNCAwLTQgMiAwIDIgMiA0IDQgNCA0IDAgNC0yIDQtNHoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-30"></div>
          </div>
          <CardContent className="relative pt-0">
            <div className="flex flex-col sm:flex-row gap-4 sm:items-end -mt-12">
              {/* Avatar */}
              <div className="w-24 h-24 rounded-xl bg-white shadow-lg shadow-purple-500/10 flex items-center justify-center border-4 border-white overflow-hidden">
                {user.image ? (
                  <img src={user.image} alt={user.name || ''} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-violet-100 to-purple-100 flex items-center justify-center">
                    <User className="w-10 h-10 text-violet-600" />
                  </div>
                )}
              </div>

              {/* Name and Email */}
              <div className="flex-1 pb-2">
                <div className="flex items-center gap-2">
                  <h2 className="text-2xl font-bold text-foreground">{user.name || 'Usuario'}</h2>
                  {user.emailVerified && (
                    <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-emerald-200">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Verificado
                    </Badge>
                  )}
                </div>
                <p className="text-muted-foreground">{user.email}</p>
              </div>

              {/* Edit Button */}
              <Button
                variant="outline"
                onClick={() => setIsEditing(true)}
                className="gap-2 hover:bg-violet-50 hover:text-violet-700 hover:border-violet-300 transition-colors"
              >
                <Pencil className="w-4 h-4" />
                Editar perfil
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 pt-6 border-t border-border/50">
              <div className="text-center sm:text-left group">
                <div className="flex items-center justify-center sm:justify-start gap-2 text-muted-foreground mb-1">
                  <AtSign className="w-4 h-4 group-hover:text-violet-600 transition-colors" />
                  <span className="text-xs uppercase tracking-wider">Usuario</span>
                </div>
                <p className="font-medium text-foreground">{user.userName || 'Sin definir'}</p>
              </div>
              <div className="text-center sm:text-left group">
                <div className="flex items-center justify-center sm:justify-start gap-2 text-muted-foreground mb-1">
                  <Shield className="w-4 h-4 group-hover:text-violet-600 transition-colors" />
                  <span className="text-xs uppercase tracking-wider">Rol</span>
                </div>
                <p className="font-medium text-foreground capitalize">{user.role?.toLowerCase() || 'Usuario'}</p>
              </div>
              <div className="text-center sm:text-left group">
                <div className="flex items-center justify-center sm:justify-start gap-2 text-muted-foreground mb-1">
                  <Calendar className="w-4 h-4 group-hover:text-violet-600 transition-colors" />
                  <span className="text-xs uppercase tracking-wider">Miembro desde</span>
                </div>
                <p className="font-medium text-foreground">{formatDate(user.createdAt)}</p>
              </div>
              <div className="text-center sm:text-left group">
                <div className="flex items-center justify-center sm:justify-start gap-2 text-muted-foreground mb-1">
                  <Mail className="w-4 h-4 group-hover:text-violet-600 transition-colors" />
                  <span className="text-xs uppercase tracking-wider">Email</span>
                </div>
                <p className="font-medium flex items-center gap-1 justify-center sm:justify-start">
                  {user.emailVerified ? (
                    <span className="text-emerald-600 flex items-center gap-1">
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
      </ScrollAnimation>

      {/* Edit Profile Form */}
      {isEditing && (
        <ScrollAnimation variant="fade-up">
          <EditProfileForm
            initialData={{
              name: user.name || '',
              userName: user.userName || '',
            }}
            onSubmit={handleUpdate}
            onCancel={() => setIsEditing(false)}
            isPending={isPending}
          />
        </ScrollAnimation>
      )}

      {/* Change Email Section */}
      {user.email && (
        <ScrollAnimation variant="fade-up" delay={0.15}>
          <Card className="border-border/50 shadow-lg shadow-purple-500/5 hover:shadow-xl hover:shadow-purple-500/10 transition-shadow">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-cyan-100 to-sky-100 rounded-lg flex items-center justify-center">
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
        </ScrollAnimation>
      )}

      {/* Privacy & Data */}
      <ScrollAnimation variant="fade-up" delay={0.2}>
        <Card className="border-border/50 shadow-lg shadow-purple-500/5 hover:shadow-xl hover:shadow-purple-500/10 transition-shadow">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-100 to-violet-100 rounded-lg flex items-center justify-center">
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
      </ScrollAnimation>

      {/* Security Quick Link */}
      <ScrollAnimation variant="fade-up" delay={0.25}>
        <Card className="group border-border/50 shadow-lg shadow-purple-500/5 hover:shadow-xl hover:shadow-purple-500/10 transition-all hover:border-violet-200">
          <Link href="/settings/security">
            <CardContent className="flex items-center justify-between py-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-violet-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Shield className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground group-hover:text-violet-700 transition-colors">Configuración de Seguridad</h3>
                  <p className="text-sm text-muted-foreground">
                    2FA, sesiones activas, registro de actividad
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {user.isTwoFactorEnabled ? (
                  <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-emerald-200">
                    2FA Activo
                  </Badge>
                ) : (
                  <Badge variant="secondary" className="bg-muted text-muted-foreground">
                    2FA Inactivo
                  </Badge>
                )}
                <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-violet-600 group-hover:translate-x-1 transition-all" />
              </div>
            </CardContent>
          </Link>
        </Card>
      </ScrollAnimation>

      <Separator className="bg-border/50" />

      {/* Danger Zone */}
      <ScrollAnimation variant="fade-up" delay={0.3}>
        <DangerZone />
      </ScrollAnimation>
    </div>
  );
}

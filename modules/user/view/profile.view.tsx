'use client';

import { useState } from 'react';
import { useUser } from '../hooks/user.hook';
import { useLogout } from '@/modules/logout/hooks/logout.hook';
import { Button } from '@/components/ui/button';
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ProfileSkeleton } from '../components/profile.skeleton';
import { ProfileCard } from '../components/profile-card.component';
import { EditProfileForm } from '../components/edit-profile-form.component';
import { DangerZone } from '../components/danger-zone.component';
import { ExportDataDialog } from '../components/export-data-dialog.component';
import { ChangeEmailComponent } from '@/modules/email-change/components/change-email.component';

export function ProfileView() {
  const { user, isLoading, isPending, updateUser } = useUser();
  const { logout, isPending: isLoggingOut } = useLogout();
  const [isEditing, setIsEditing] = useState(false);

  if (isLoading) {
    return <ProfileSkeleton />;
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>No autenticado</CardTitle>
            <CardDescription>Debes iniciar sesión para ver tu perfil</CardDescription>
          </CardHeader>
          <CardFooter>
            <Button asChild className="w-full">
              <a href="/login">Iniciar sesión</a>
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  const handleUpdate = async (data: { name?: string; userName?: string }) => {
    await updateUser(data);
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto space-y-6">
        <ProfileCard
          user={user}
          onEdit={() => setIsEditing(true)}
          onLogout={logout}
          isLoggingOut={isLoggingOut}
        />

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

        {user.email && (
          <ChangeEmailComponent currentEmail={user.email} />
        )}

        <Separator />

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Privacidad y datos</CardTitle>
            <CardDescription>
              Gestiona tus datos personales y preferencias de privacidad.
            </CardDescription>
          </CardHeader>
          <div className="px-6 pb-6">
            <ExportDataDialog />
          </div>
        </Card>

        <Separator />

        <DangerZone />
      </div>
    </div>
  );
}

'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import type { UserResponse } from '../types/user.types';

interface ProfileCardProps {
  user: UserResponse;
  onEdit: () => void;
  onLogout: () => void;
  isLoggingOut: boolean;
}

export function ProfileCard({ user, onEdit, onLogout, isLoggingOut }: ProfileCardProps) {
  const getInitials = (name: string | null) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Card>
      <CardHeader className="text-center">
        <Avatar className="w-24 h-24 mx-auto">
          <AvatarImage src={user.image || undefined} alt={user.name || 'Usuario'} />
          <AvatarFallback className="text-2xl">{getInitials(user.name)}</AvatarFallback>
        </Avatar>
        <CardTitle className="mt-4">{user.name || 'Sin nombre'}</CardTitle>
        <CardDescription>@{user.userName || 'sin-usuario'}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-gray-500">Email</p>
            <p className="font-medium">{user.email}</p>
          </div>
          <div>
            <p className="text-gray-500">Rol</p>
            <p className="font-medium capitalize">{user.role}</p>
          </div>
          <div>
            <p className="text-gray-500">Email verificado</p>
            <p className="font-medium">{user.emailVerified ? 'Sí' : 'No'}</p>
          </div>
          <div>
            <p className="text-gray-500">2FA habilitado</p>
            <p className="font-medium">{user.isTwoFactorEnabled ? 'Sí' : 'No'}</p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex gap-2">
        <Button variant="outline" onClick={onEdit} className="flex-1">
          Editar perfil
        </Button>
        <Button variant="outline" onClick={onLogout} disabled={isLoggingOut}>
          {isLoggingOut ? 'Cerrando...' : 'Cerrar sesión'}
        </Button>
      </CardFooter>
    </Card>
  );
}

"use client";

import { memo } from "react";
import {
  MoreHorizontal,
  Shield,
  ShieldOff,
  Trash2,
  RotateCcw,
  UserCog,
  Lock,
  Unlock,
  LogOut,
  Mail,
  MailCheck,
  Smartphone,
  Crown,
  User,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import type { DataTableColumn } from "@/components/ui/data-table";
import type { AdminUser } from "../../types/admin-users.types";

interface ColumnActions {
  onBlock: (user: AdminUser) => void;
  onUnblock: (user: AdminUser) => void;
  onDelete: (user: AdminUser) => void;
  onRestore: (user: AdminUser) => void;
  onChangeRole: (user: AdminUser) => void;
  onUnlock: (user: AdminUser) => void;
  onRevokeSessions: (user: AdminUser) => void;
  onEdit: (user: AdminUser) => void;
}

function getInitials(name: string | null, email: string | null): string {
  if (name) {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  }
  if (email) {
    return email[0].toUpperCase();
  }
  return "U";
}

function formatDate(date: Date | string | null): string {
  if (!date) return "-";
  const d = new Date(date);
  return formatDistanceToNow(d, { addSuffix: true, locale: es });
}

const UserCell = memo(function UserCell({ user }: { user: AdminUser }) {
  return (
    <div className="flex items-center gap-3">
      <Avatar className="h-9 w-9">
        <AvatarImage src={user.image || undefined} alt={user.name || ""} />
        <AvatarFallback className="bg-primary/10 text-primary text-xs font-medium">
          {getInitials(user.name, user.email)}
        </AvatarFallback>
      </Avatar>
      <div className="flex flex-col min-w-0">
        <span className="font-medium truncate">{user.name || "Sin nombre"}</span>
        <span className="text-xs text-muted-foreground truncate">
          {user.userName ? `@${user.userName}` : user.email}
        </span>
      </div>
    </div>
  );
});

const StatusBadge = memo(function StatusBadge({ user }: { user: AdminUser }) {
  if (user.deletedAt) {
    return (
      <Badge variant="destructive" className="gap-1">
        <Trash2 className="h-3 w-3" />
        Eliminado
      </Badge>
    );
  }

  if (user.isBlocked) {
    return (
      <Badge variant="destructive" className="gap-1 bg-orange-500 hover:bg-orange-600">
        <ShieldOff className="h-3 w-3" />
        Bloqueado
      </Badge>
    );
  }

  if (user.lockedUntil && new Date(user.lockedUntil) > new Date()) {
    return (
      <Badge variant="secondary" className="gap-1 bg-yellow-500/20 text-yellow-700">
        <Lock className="h-3 w-3" />
        Bloqueado temp.
      </Badge>
    );
  }

  return (
    <Badge variant="default" className="gap-1 bg-green-500/20 text-green-700 hover:bg-green-500/30">
      <Shield className="h-3 w-3" />
      Activo
    </Badge>
  );
});

const RoleBadge = memo(function RoleBadge({ role }: { role: string }) {
  if (role === "ADMIN") {
    return (
      <Badge className="gap-1 bg-purple-500/20 text-purple-700 hover:bg-purple-500/30">
        <Crown className="h-3 w-3" />
        Admin
      </Badge>
    );
  }

  return (
    <Badge variant="outline" className="gap-1">
      <User className="h-3 w-3" />
      Usuario
    </Badge>
  );
});

const SecurityIndicators = memo(function SecurityIndicators({ user }: { user: AdminUser }) {
  return (
    <div className="flex items-center gap-1">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div
              className={`p-1 rounded ${
                user.emailVerified
                  ? "bg-green-500/20 text-green-600"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {user.emailVerified ? (
                <MailCheck className="h-3.5 w-3.5" />
              ) : (
                <Mail className="h-3.5 w-3.5" />
              )}
            </div>
          </TooltipTrigger>
          <TooltipContent>
            {user.emailVerified ? "Email verificado" : "Email no verificado"}
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <div
              className={`p-1 rounded ${
                user.isTwoFactorEnabled
                  ? "bg-blue-500/20 text-blue-600"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              <Smartphone className="h-3.5 w-3.5" />
            </div>
          </TooltipTrigger>
          <TooltipContent>
            {user.isTwoFactorEnabled
              ? `2FA activo (${user.twoFactorMethod})`
              : "2FA desactivado"}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
});

const ActionsCell = memo(function ActionsCell({
  user,
  actions,
}: {
  user: AdminUser;
  actions: ColumnActions;
}) {
  const isDeleted = !!user.deletedAt;
  const isBlocked = user.isBlocked;
  const isLocked = user.lockedUntil && new Date(user.lockedUntil) > new Date();
  const isAdmin = user.role === "ADMIN";

  const handleContainerClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <div
      onClick={handleContainerClick}
      onDoubleClick={handleContainerClick}
      data-stop-propagation="true"
    >
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon-sm">
            <MoreHorizontal className="h-4 w-4" />
            <span className="sr-only">Acciones</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuLabel>Acciones</DropdownMenuLabel>
          <DropdownMenuSeparator />

          <DropdownMenuItem onClick={() => actions.onEdit(user)}>
            <UserCog className="h-4 w-4 mr-2" />
            Editar usuario
          </DropdownMenuItem>

          {!isDeleted && (
            <>
              <DropdownMenuItem onClick={() => actions.onChangeRole(user)}>
                <Crown className="h-4 w-4 mr-2" />
                Cambiar rol
              </DropdownMenuItem>

              <DropdownMenuItem onClick={() => actions.onRevokeSessions(user)}>
                <LogOut className="h-4 w-4 mr-2" />
                Cerrar sesiones
              </DropdownMenuItem>

              {isLocked && (
                <DropdownMenuItem onClick={() => actions.onUnlock(user)}>
                  <Unlock className="h-4 w-4 mr-2" />
                  Desbloquear cuenta
                </DropdownMenuItem>
              )}

              <DropdownMenuSeparator />

              {isBlocked ? (
                <DropdownMenuItem onClick={() => actions.onUnblock(user)}>
                  <Shield className="h-4 w-4 mr-2" />
                  Desbloquear
                </DropdownMenuItem>
              ) : (
                !isAdmin && (
                  <DropdownMenuItem
                    onClick={() => actions.onBlock(user)}
                    className="text-orange-600 focus:text-orange-600"
                  >
                    <ShieldOff className="h-4 w-4 mr-2" />
                    Bloquear
                  </DropdownMenuItem>
                )
              )}

              {!isAdmin && (
                <DropdownMenuItem
                  onClick={() => actions.onDelete(user)}
                  className="text-destructive focus:text-destructive"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Eliminar
                </DropdownMenuItem>
              )}
            </>
          )}

          {isDeleted && (
            <DropdownMenuItem onClick={() => actions.onRestore(user)}>
              <RotateCcw className="h-4 w-4 mr-2" />
              Restaurar
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
});

export function createAdminUsersColumns(actions: ColumnActions): DataTableColumn<AdminUser>[] {
  return [
    {
      accessorKey: "name",
      header: "Usuario",
      cell: ({ row }) => <UserCell user={row.original} />,
      meta: {
        minWidth: 220,
      },
      enableSorting: false,
    },
    {
      accessorKey: "email",
      header: "Email",
      cell: ({ row }) => (
        <span className="text-sm text-muted-foreground">{row.original.email || "-"}</span>
      ),
      meta: {
        minWidth: 200,
      },
    },
    {
      accessorKey: "role",
      header: "Rol",
      cell: ({ row }) => <RoleBadge role={row.original.role} />,
      meta: {
        width: 110,
        align: "center",
      },
    },
    {
      accessorKey: "isBlocked",
      header: "Estado",
      cell: ({ row }) => <StatusBadge user={row.original} />,
      meta: {
        width: 140,
        align: "center",
      },
    },
    {
      id: "security",
      header: "Seguridad",
      cell: ({ row }) => <SecurityIndicators user={row.original} />,
      enableSorting: false,
      meta: {
        width: 90,
        align: "center",
      },
    },
    {
      accessorKey: "lastLoginAt",
      header: "Último acceso",
      cell: ({ row }) => (
        <div className="text-sm">
          <div>{formatDate(row.original.lastLoginAt)}</div>
          {row.original.lastLoginCountry && (
            <div className="text-xs text-muted-foreground">
              {row.original.lastLoginCity}, {row.original.lastLoginCountry}
            </div>
          )}
        </div>
      ),
      meta: {
        minWidth: 150,
      },
    },
    {
      accessorKey: "createdAt",
      header: "Registro",
      cell: ({ row }) => (
        <span className="text-sm text-muted-foreground">
          {formatDate(row.original.createdAt)}
        </span>
      ),
      meta: {
        width: 130,
      },
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => <ActionsCell user={row.original} actions={actions} />,
      enableSorting: false,
      enableHiding: false,
      meta: {
        width: 50,
        pinned: "right",
        align: "center",
      },
    },
  ];
}

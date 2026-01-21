"use client";

import { memo } from "react";
import {
  Users,
  UserCheck,
  UserX,
  Shield,
  ShieldCheck,
  Crown,
  TrendingUp,
  Trash2,
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

import type { AdminUserStats } from "../../types/admin-users.types";

interface Props {
  stats: AdminUserStats | null;
  isLoading?: boolean;
}

interface StatCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  description?: string;
  variant?: "default" | "success" | "warning" | "danger" | "info";
}

const variantStyles = {
  default: "bg-muted/50",
  success: "bg-green-500/10 text-green-600",
  warning: "bg-orange-500/10 text-orange-600",
  danger: "bg-red-500/10 text-red-600",
  info: "bg-blue-500/10 text-blue-600",
};

const StatCard = memo(function StatCard({
  title,
  value,
  icon,
  description,
  variant = "default",
}: StatCardProps) {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold">{value.toLocaleString()}</p>
            {description && (
              <p className="text-xs text-muted-foreground">{description}</p>
            )}
          </div>
          <div className={`p-2 rounded-lg ${variantStyles[variant]}`}>{icon}</div>
        </div>
      </CardContent>
    </Card>
  );
});

const StatCardSkeleton = memo(function StatCardSkeleton() {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-8 w-16" />
          </div>
          <Skeleton className="h-10 w-10 rounded-lg" />
        </div>
      </CardContent>
    </Card>
  );
});

function AdminUsersStatsComponent({ stats, isLoading }: Props) {
  if (isLoading || !stats) {
    return (
      <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <StatCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
      <StatCard
        title="Total usuarios"
        value={stats.totalUsers}
        icon={<Users className="h-5 w-5" />}
        variant="default"
      />
      <StatCard
        title="Usuarios activos"
        value={stats.activeUsers}
        icon={<UserCheck className="h-5 w-5" />}
        variant="success"
      />
      <StatCard
        title="Bloqueados"
        value={stats.blockedUsers}
        icon={<UserX className="h-5 w-5" />}
        variant="warning"
      />
      <StatCard
        title="Eliminados"
        value={stats.deletedUsers}
        icon={<Trash2 className="h-5 w-5" />}
        variant="danger"
      />
      <StatCard
        title="Email verificado"
        value={stats.verifiedUsers}
        icon={<ShieldCheck className="h-5 w-5" />}
        variant="success"
      />
      <StatCard
        title="2FA activado"
        value={stats.twoFactorEnabled}
        icon={<Shield className="h-5 w-5" />}
        variant="info"
      />
      <StatCard
        title="Administradores"
        value={stats.adminUsers}
        icon={<Crown className="h-5 w-5" />}
        variant="info"
      />
      <StatCard
        title="Registros (30 días)"
        value={stats.recentRegistrations}
        icon={<TrendingUp className="h-5 w-5" />}
        description="Últimos 30 días"
        variant="success"
      />
    </div>
  );
}

export const AdminUsersStats = memo(AdminUsersStatsComponent);

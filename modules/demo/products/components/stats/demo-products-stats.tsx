"use client";

import { memo } from "react";
import {
  Package,
  CheckCircle,
  XCircle,
  Archive,
  AlertTriangle,
  DollarSign,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

import type { DemoProductStats } from "../../types/demo-products.types";

interface Props {
  stats: DemoProductStats | null;
  isLoading: boolean;
}

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ElementType;
  iconColor: string;
  isLoading: boolean;
}

const StatCard = memo(function StatCard({ title, value, icon: Icon, iconColor, isLoading }: StatCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <Icon className={`h-4 w-4 ${iconColor}`} />
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-7 w-16" />
        ) : (
          <div className="text-2xl font-bold">{value}</div>
        )}
      </CardContent>
    </Card>
  );
});

function DemoProductsStatsComponent({ stats, isLoading }: Props) {
  const formatCurrency = (value: number) =>
    `$${value.toLocaleString("es-MX", { maximumFractionDigits: 0 })}`;

  return (
    <div className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
      <StatCard
        title="Total"
        value={stats?.total ?? 0}
        icon={Package}
        iconColor="text-blue-500"
        isLoading={isLoading}
      />
      <StatCard
        title="Activos"
        value={stats?.active ?? 0}
        icon={CheckCircle}
        iconColor="text-green-500"
        isLoading={isLoading}
      />
      <StatCard
        title="Inactivos"
        value={stats?.inactive ?? 0}
        icon={XCircle}
        iconColor="text-amber-500"
        isLoading={isLoading}
      />
      <StatCard
        title="Descontinuados"
        value={stats?.discontinued ?? 0}
        icon={Archive}
        iconColor="text-gray-500"
        isLoading={isLoading}
      />
      <StatCard
        title="Stock Bajo"
        value={stats?.lowStock ?? 0}
        icon={AlertTriangle}
        iconColor="text-red-500"
        isLoading={isLoading}
      />
      <StatCard
        title="Valor Total"
        value={stats ? formatCurrency(stats.totalValue) : "$0"}
        icon={DollarSign}
        iconColor="text-emerald-500"
        isLoading={isLoading}
      />
    </div>
  );
}

export const DemoProductsStats = memo(DemoProductsStatsComponent);

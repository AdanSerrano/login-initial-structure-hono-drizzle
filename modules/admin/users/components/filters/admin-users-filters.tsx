"use client";

import { memo, useCallback } from "react";
import { Filter, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";

import type { AdminUserFilters } from "../../types/admin-users.types";

interface Props {
  filters: AdminUserFilters;
  onFiltersChange: (filters: Partial<AdminUserFilters>) => void;
}

function AdminUsersFiltersComponent({ filters, onFiltersChange }: Props) {
  const activeFiltersCount = [
    filters.role !== "ALL" && filters.role,
    filters.status !== "ALL" && filters.status,
    filters.emailVerified !== "ALL" && filters.emailVerified,
    filters.twoFactor !== "ALL" && filters.twoFactor,
  ].filter(Boolean).length;

  const handleReset = useCallback(() => {
    onFiltersChange({
      role: "ALL",
      status: "ALL",
      emailVerified: "ALL",
      twoFactor: "ALL",
    });
  }, [onFiltersChange]);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Filter className="h-4 w-4" />
          Filtros
          {activeFiltersCount > 0 && (
            <Badge variant="secondary" className="ml-1 h-5 w-5 p-0 flex items-center justify-center">
              {activeFiltersCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="end">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-medium">Filtros</h4>
            {activeFiltersCount > 0 && (
              <Button variant="ghost" size="sm" onClick={handleReset} className="h-8 gap-1">
                <X className="h-3 w-3" />
                Limpiar
              </Button>
            )}
          </div>

          <div className="space-y-3">
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Rol</label>
              <Select
                value={filters.role || "ALL"}
                onValueChange={(value) =>
                  onFiltersChange({ role: value as AdminUserFilters["role"] })
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">Todos</SelectItem>
                  <SelectItem value="USER">Usuario</SelectItem>
                  <SelectItem value="ADMIN">Administrador</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium">Estado</label>
              <Select
                value={filters.status || "ALL"}
                onValueChange={(value) =>
                  onFiltersChange({ status: value as AdminUserFilters["status"] })
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">Todos</SelectItem>
                  <SelectItem value="ACTIVE">Activos</SelectItem>
                  <SelectItem value="BLOCKED">Bloqueados</SelectItem>
                  <SelectItem value="DELETED">Eliminados</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium">Email</label>
              <Select
                value={filters.emailVerified || "ALL"}
                onValueChange={(value) =>
                  onFiltersChange({ emailVerified: value as AdminUserFilters["emailVerified"] })
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">Todos</SelectItem>
                  <SelectItem value="VERIFIED">Verificados</SelectItem>
                  <SelectItem value="UNVERIFIED">No verificados</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium">2FA</label>
              <Select
                value={filters.twoFactor || "ALL"}
                onValueChange={(value) =>
                  onFiltersChange({ twoFactor: value as AdminUserFilters["twoFactor"] })
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">Todos</SelectItem>
                  <SelectItem value="ENABLED">Activado</SelectItem>
                  <SelectItem value="DISABLED">Desactivado</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}

export const AdminUsersFilters = memo(AdminUsersFiltersComponent);

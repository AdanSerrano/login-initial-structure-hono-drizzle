"use client";

import { useRef, useCallback, memo } from "react";
import { RefreshCw } from "lucide-react";

import { Button } from "@/components/ui/button";
import { DataTableView } from "@/components/ui/dynamic-datatable-scaffold";

import { useAdminUsersViewModel } from "../view-model/admin-users.view-model";
import { AdminUsersStats } from "../components/stats/admin-users-stats";
import { AdminUsersSkeleton } from "../components/admin-users.skeleton";
import {
  BlockUserDialog,
  DeleteUserDialog,
  ChangeRoleDialog,
} from "../components/dialogs";

const AdminUsersHeader = memo(function AdminUsersHeader({
  isPending,
  onRefresh,
}: {
  isPending: boolean;
  onRefresh: () => void;
}) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Gestión de Usuarios</h1>
        <p className="text-muted-foreground">
          Administra los usuarios del sistema, sus roles y permisos.
        </p>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" onClick={onRefresh} disabled={isPending}>
          <RefreshCw className={`h-4 w-4 mr-2 ${isPending ? "animate-spin" : ""}`} />
          Actualizar
        </Button>
      </div>
    </div>
  );
});

export function AdminUsersView() {
  const initRef = useRef(false);

  const {
    dataTableConfig,
    stats,
    selectedUser,
    activeDialog,
    isLoading,
    isPending,
    isInitialized,
    fetchUsers,
    fetchStats,
    handleRefresh,
    closeDialog,
    handleBlock,
    handleDelete,
    handleChangeRole,
  } = useAdminUsersViewModel();

  const initializeData = useCallback(() => {
    if (!initRef.current) {
      initRef.current = true;
      fetchUsers();
      fetchStats();
    }
  }, [fetchUsers, fetchStats]);

  if (!initRef.current) {
    initializeData();
  }

  if (!isInitialized) {
    return <AdminUsersSkeleton />;
  }

  return (
    <div className="space-y-6">
      <AdminUsersHeader isPending={isPending} onRefresh={handleRefresh} />

      <AdminUsersStats stats={stats} isLoading={isLoading} />

      <DataTableView config={dataTableConfig} />

      <BlockUserDialog
        user={selectedUser}
        open={activeDialog === "block"}
        onOpenChange={(open) => !open && closeDialog()}
        onConfirm={handleBlock}
      />

      <DeleteUserDialog
        user={selectedUser}
        open={activeDialog === "delete"}
        onOpenChange={(open) => !open && closeDialog()}
        onConfirm={handleDelete}
      />

      <ChangeRoleDialog
        user={selectedUser}
        open={activeDialog === "role"}
        onOpenChange={(open) => !open && closeDialog()}
        onConfirm={handleChangeRole}
      />
    </div>
  );
}

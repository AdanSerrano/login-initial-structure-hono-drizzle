"use client";

import { useRef, useCallback, memo } from "react";
import { RefreshCw } from "lucide-react";

import { Button } from "@/components/ui/button";
import { CustomDataTable } from "@/components/ui/custom-datatable";

import { useAdminUsersViewModel } from "../view-model/admin-users.view-model";
import { AdminUsersStats } from "../components/stats/admin-users-stats";
import { AdminUsersSkeleton } from "../components/admin-users.skeleton";
import {
  BlockUserDialog,
  DeleteUserDialog,
  ChangeRoleDialog,
} from "../components/dialogs";
import { useAdminUsersStore } from "../state/admin-users.state";

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

// Stats section - reads directly from store with selector to avoid unnecessary re-renders
const AdminUsersStatsSection = memo(function AdminUsersStatsSection() {
  const stats = useAdminUsersStore((state) => state.stats);
  const isLoading = useAdminUsersStore((state) => state.isLoading);

  return <AdminUsersStats stats={stats} isLoading={isLoading && !stats} />;
});

// DataTable section - isolated to prevent stats re-renders
const AdminUsersDataTableSection = memo(function AdminUsersDataTableSection() {
  const {
    dataTableConfig,
    selectedUser,
    activeDialog,
    closeDialog,
    handleBlock,
    handleDelete,
    handleChangeRole,
  } = useAdminUsersViewModel();

  return (
    <>
      <CustomDataTable
        data={dataTableConfig.data}
        columns={dataTableConfig.columns}
        getRowId={dataTableConfig.getRowId}
        selection={dataTableConfig.selection}
        expansion={dataTableConfig.expansion}
        pagination={dataTableConfig.pagination}
        sorting={dataTableConfig.sorting}
        filter={dataTableConfig.filter}
        columnVisibility={dataTableConfig.columnVisibility}
        toolbarConfig={dataTableConfig.toolbarConfig}
        export={dataTableConfig.exportConfig}
        copy={dataTableConfig.copyConfig}
        print={dataTableConfig.printConfig}
        fullscreen={dataTableConfig.fullscreenConfig}
        style={dataTableConfig.style}
        isLoading={dataTableConfig.isLoading}
        isPending={dataTableConfig.isPending}
        emptyMessage={dataTableConfig.emptyMessage}
        emptyIcon={dataTableConfig.emptyIcon}
        headerActions={dataTableConfig.headerActions}
        bulkActions={dataTableConfig.bulkActions}
        onRowClick={dataTableConfig.onRowClick}
        onRowDoubleClick={dataTableConfig.onRowDoubleClick}
        onRowContextMenu={dataTableConfig.onRowContextMenu}
      />

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
        key={selectedUser?.id}
        user={selectedUser}
        open={activeDialog === "role"}
        onOpenChange={(open) => !open && closeDialog()}
        onConfirm={handleChangeRole}
      />
    </>
  );
});

export function AdminUsersView() {
  const initRef = useRef(false);
  const isPending = useAdminUsersStore((state) => state.isLoading);
  const isInitialized = useAdminUsersStore((state) => state.isInitialized);

  const {
    fetchUsers,
    fetchStats,
    handleRefresh,
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

      <AdminUsersStatsSection />

      <AdminUsersDataTableSection />
    </div>
  );
}

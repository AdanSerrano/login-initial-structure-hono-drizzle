"use client";

import { useCallback, useMemo } from "react";
import { RefreshCw, Trash2, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { DataTableScaffoldConfig } from "@/components/ui/dynamic-datatable-scaffold/config.types";

import { useAdminUsers } from "../hooks/admin-users.hook";
import { createAdminUsersColumns } from "../components/columns/admin-users.columns";
import { AdminUsersFilters } from "../components/filters/admin-users-filters";
import { UserExpandedContent } from "../components/expanded/user-expanded-content";
import type { AdminUser, BlockUserInput } from "../types/admin-users.types";

export function useAdminUsersViewModel() {
  const {
    users,
    stats,
    selectedUser,
    pagination,
    filters,
    sorting,
    rowSelection,
    expanded,
    activeDialog,
    isLoading,
    isPending,
    isInitialized,
    fetchUsers,
    fetchStats,
    handleRefresh,
    handlePaginationChange,
    handleSortingChange,
    handleFiltersChange,
    handleSearchChange,
    handleRowSelectionChange,
    handleExpandedChange,
    getSelectedUsers,
    openDialog,
    closeDialog,
    blockUser,
    unblockUser,
    deleteUser,
    restoreUser,
    bulkDeleteUsers,
    changeRole,
    unlockAccount,
    revokeAllSessions,
  } = useAdminUsers();

  // User action handlers
  const handleBlock = useCallback(
    async (id: string, data: BlockUserInput) => {
      await blockUser(id, data);
    },
    [blockUser]
  );

  const handleUnblock = useCallback(
    async (id: string) => {
      await unblockUser(id);
    },
    [unblockUser]
  );

  const handleDelete = useCallback(
    async (id: string) => {
      await deleteUser(id);
    },
    [deleteUser]
  );

  const handleRestore = useCallback(
    async (id: string) => {
      await restoreUser(id);
    },
    [restoreUser]
  );

  const handleChangeRole = useCallback(
    async (id: string, role: "USER" | "ADMIN") => {
      await changeRole(id, role);
    },
    [changeRole]
  );

  const handleUnlock = useCallback(
    async (id: string) => {
      await unlockAccount(id);
    },
    [unlockAccount]
  );

  const handleRevokeSessions = useCallback(
    async (id: string) => {
      await revokeAllSessions(id);
    },
    [revokeAllSessions]
  );

  const handleBulkDelete = useCallback(async () => {
    const selectedUsers = getSelectedUsers();
    if (selectedUsers.length > 0) {
      await bulkDeleteUsers(selectedUsers.map((u) => u.id));
    }
  }, [getSelectedUsers, bulkDeleteUsers]);

  // Create columns with actions
  const columns = useMemo(
    () =>
      createAdminUsersColumns({
        onBlock: (user) => openDialog("block", user),
        onUnblock: (user) => handleUnblock(user.id),
        onDelete: (user) => openDialog("delete", user),
        onRestore: (user) => handleRestore(user.id),
        onChangeRole: (user) => openDialog("role", user),
        onUnlock: (user) => handleUnlock(user.id),
        onRevokeSessions: (user) => handleRevokeSessions(user.id),
        onEdit: (user) => openDialog("edit", user),
      }),
    [openDialog, handleUnblock, handleRestore, handleUnlock, handleRevokeSessions]
  );

  const dataTableConfig: DataTableScaffoldConfig<AdminUser> = useMemo(
    () => ({
      data: users,
      columns,

      pagination: {
        pageIndex: pagination.pageIndex,
        pageSize: pagination.pageSize,
        totalRows: pagination.totalRows,
        totalPages: pagination.totalPages,
        pageSizeOptions: [5, 10, 20, 50, 100],
        onPaginationChange: handlePaginationChange,
        showPageNumbers: true,
        showFirstLast: true,
      },

      sorting: {
        sorting,
        onSortingChange: handleSortingChange,
        manualSorting: true,
      },

      selection: {
        enabled: true,
        mode: "multiple",
        showCheckbox: true,
        rowSelection,
        onRowSelectionChange: handleRowSelectionChange,
      },

      filter: {
        globalFilter: filters.search,
        onGlobalFilterChange: handleSearchChange,
        placeholder: "Buscar por nombre, email o usuario...",
      },

      expansion: {
        enabled: true,
        expandOnClick: false,
        renderContent: (user) => <UserExpandedContent user={user} />,
      },

      export: {
        enabled: true,
        formats: ["csv", "json"],
        filename: "usuarios",
      },

      style: {
        striped: true,
        hover: true,
        stickyHeader: true,
        density: "default",
        borderStyle: "default",
        maxHeight: 600,
      },

      isLoading: isLoading && !users.length,
      isPending,
      emptyMessage: "No se encontraron usuarios",
      emptyIcon: <Users className="h-12 w-12 text-muted-foreground/50" />,

      getRowId: (row) => row.id,

      toolbar: <AdminUsersFilters filters={filters} onFiltersChange={handleFiltersChange} />,

      headerActions: (
        <Button variant="outline" size="sm" className="gap-2">
          <Users className="h-4 w-4" />
          <span className="hidden sm:inline">{pagination.totalRows} usuarios</span>
        </Button>
      ),

      bulkActions: (selectedRows) => (
        <>
          <Button variant="destructive" size="sm" onClick={handleBulkDelete} className="gap-2">
            <Trash2 className="h-4 w-4" />
            Eliminar seleccionados
          </Button>
          <span className="text-sm text-muted-foreground">
            {selectedRows.length} usuario{selectedRows.length > 1 ? "s" : ""} seleccionado
            {selectedRows.length > 1 ? "s" : ""}
          </span>
        </>
      ),
    }),
    [
      users,
      columns,
      pagination,
      sorting,
      rowSelection,
      filters,
      isLoading,
      isPending,
      handlePaginationChange,
      handleSortingChange,
      handleRowSelectionChange,
      handleSearchChange,
      handleFiltersChange,
      handleBulkDelete,
    ]
  );

  return {
    // Ready-to-use config
    dataTableConfig,

    // Data for other components
    stats,
    selectedUser,

    // UI State
    activeDialog,
    isLoading,
    isPending,
    isInitialized,

    // Initialization
    fetchUsers,
    fetchStats,
    handleRefresh,

    // Dialog handlers
    openDialog,
    closeDialog,

    // User actions for dialogs
    handleBlock,
    handleDelete,
    handleChangeRole,
  };
}

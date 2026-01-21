"use client";

import { useCallback, useMemo } from "react";
import { Trash2, Users } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import type {
  CustomColumnDef,
  SelectionConfig,
  ExpansionConfig,
  PaginationConfig,
  SortingConfig,
  FilterConfig,
  StyleConfig,
  SortingState,
  ColumnVisibilityConfig,
  ToolbarConfig,
  ExportConfig,
  CopyConfig,
  PrintConfig,
  FullscreenConfig,
  ExportFormat,
} from "@/components/ui/custom-datatable";

import { useAdminUsers } from "../hooks/admin-users.hook";
import { createAdminUsersCustomColumns } from "../components/columns/admin-users-custom.columns";
import { AdminUsersFilters } from "../components/filters/admin-users-filters";
import { UserExpandedContent } from "../components/expanded/user-expanded-content";
import type { AdminUser, BlockUserInput } from "../types/admin-users.types";

export interface AdminUsersDataTableConfig {
  data: AdminUser[];
  columns: CustomColumnDef<AdminUser>[];
  getRowId: (row: AdminUser) => string;
  selection: SelectionConfig<AdminUser>;
  expansion: ExpansionConfig<AdminUser>;
  pagination: PaginationConfig;
  sorting: SortingConfig;
  filter: FilterConfig;
  columnVisibility: ColumnVisibilityConfig;
  toolbarConfig: ToolbarConfig;
  exportConfig: ExportConfig<AdminUser>;
  copyConfig: CopyConfig;
  printConfig: PrintConfig;
  fullscreenConfig: FullscreenConfig;
  style: StyleConfig;
  isLoading: boolean;
  isPending: boolean;
  emptyMessage: string;
  emptyIcon: React.ReactNode;
  headerActions: React.ReactNode;
  bulkActions: (selectedRows: AdminUser[]) => React.ReactNode;
  onRowClick: (row: AdminUser, event: React.MouseEvent) => void;
  onRowDoubleClick: (row: AdminUser, event: React.MouseEvent) => void;
  onRowContextMenu: (row: AdminUser, event: React.MouseEvent) => void;
}

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
    columnVisibility,
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
    handleColumnVisibilityChange,
    getSelectedUsers,
    clearSelection,
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
      createAdminUsersCustomColumns({
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

  // Sorting change handler adapted for CustomDataTable
  const handleCustomSortingChange = useCallback(
    (newSorting: SortingState[]) => {
      handleSortingChange(newSorting);
    },
    [handleSortingChange]
  );

  // Selection config
  const selectionConfig: SelectionConfig<AdminUser> = useMemo(
    () => ({
      enabled: true,
      mode: "multiple",
      showCheckbox: true,
      selectedRows: rowSelection,
      onSelectionChange: handleRowSelectionChange,
      selectOnRowClick: true,
    }),
    [rowSelection, handleRowSelectionChange]
  );

  // Expansion config
  const expansionConfig: ExpansionConfig<AdminUser> = useMemo(
    () => ({
      enabled: true,
      expandedRows: expanded,
      onExpansionChange: handleExpandedChange,
      renderContent: (user) => <UserExpandedContent user={user} />,
      expandOnClick: false,
    }),
    [expanded, handleExpandedChange]
  );

  // Pagination config
  const paginationConfig: PaginationConfig = useMemo(
    () => ({
      pageIndex: pagination.pageIndex,
      pageSize: pagination.pageSize,
      totalRows: pagination.totalRows,
      totalPages: pagination.totalPages,
      pageSizeOptions: [5, 10, 20, 50, 100],
      onPaginationChange: handlePaginationChange,
      showPageNumbers: true,
      showFirstLast: true,
    }),
    [pagination, handlePaginationChange]
  );

  // Sorting config
  const sortingConfig: SortingConfig = useMemo(
    () => ({
      sorting,
      onSortingChange: handleCustomSortingChange,
      manualSorting: true,
    }),
    [sorting, handleCustomSortingChange]
  );

  // Filter config
  const filterConfig: FilterConfig = useMemo(
    () => ({
      globalFilter: filters.search || "",
      onGlobalFilterChange: handleSearchChange,
      placeholder: "Buscar por nombre, email o usuario...",
    }),
    [filters.search, handleSearchChange]
  );

  // Style config
  const styleConfig: StyleConfig = useMemo(
    () => ({
      striped: true,
      hover: true,
      stickyHeader: true,
      density: "default",
      borderStyle: "default",
      maxHeight: 600,
    }),
    []
  );

  // Column visibility config
  const columnVisibilityConfig: ColumnVisibilityConfig = useMemo(
    () => ({
      enabled: true,
      columnVisibility,
      onColumnVisibilityChange: handleColumnVisibilityChange,
      alwaysVisibleColumns: ["name", "actions"],
    }),
    [columnVisibility, handleColumnVisibilityChange]
  );

  // Toolbar config - with filters as custom start
  const toolbarConfigOptions: ToolbarConfig = useMemo(
    () => ({
      show: true,
      showSearch: true,
      showExport: true,
      showColumnVisibility: true,
      showDensityToggle: true,
      showRefresh: true,
      showCopy: true,
      showPrint: true,
      showFullscreen: true,
      onRefresh: handleRefresh,
      customStart: <AdminUsersFilters filters={filters} onFiltersChange={handleFiltersChange} />,
    }),
    [handleRefresh, filters, handleFiltersChange]
  );

  // Export handler - real implementation
  const handleExport = useCallback((format: ExportFormat, data: AdminUser[]) => {
    const filename = `usuarios_${new Date().toISOString().split("T")[0]}`;

    // Prepare data for export (exclude sensitive fields)
    const exportData = data.map((user) => ({
      id: user.id,
      nombre: user.name || "",
      email: user.email,
      usuario: user.userName || "",
      rol: user.role,
      estado: user.isBlocked ? "Bloqueado" : user.deletedAt ? "Eliminado" : "Activo",
      emailVerificado: user.emailVerified ? "Sí" : "No",
      creadoEn: user.createdAt ? new Date(user.createdAt).toLocaleDateString("es-ES") : "",
      ultimoAcceso: user.lastLoginAt ? new Date(user.lastLoginAt).toLocaleDateString("es-ES") : "Nunca",
    }));

    let content: string;
    let mimeType: string;
    let fileExtension: string;

    switch (format) {
      case "csv": {
        const headers = Object.keys(exportData[0] || {});
        const csvRows = [
          headers.join(","),
          ...exportData.map((row) =>
            headers
              .map((header) => {
                const value = String(row[header as keyof typeof row] ?? "");
                // Escape quotes and wrap in quotes if contains comma or quote
                if (value.includes(",") || value.includes('"') || value.includes("\n")) {
                  return `"${value.replace(/"/g, '""')}"`;
                }
                return value;
              })
              .join(",")
          ),
        ];
        content = csvRows.join("\n");
        mimeType = "text/csv;charset=utf-8;";
        fileExtension = "csv";
        break;
      }
      case "json": {
        content = JSON.stringify(exportData, null, 2);
        mimeType = "application/json;charset=utf-8;";
        fileExtension = "json";
        break;
      }
      case "xlsx": {
        const headers = Object.keys(exportData[0] || {});
        const csvRows = [
          headers.join("\t"),
          ...exportData.map((row) =>
            headers.map((header) => String(row[header as keyof typeof row] ?? "")).join("\t")
          ),
        ];
        content = csvRows.join("\n");
        mimeType = "application/vnd.ms-excel;charset=utf-8;";
        fileExtension = "xls";
        break;
      }
      default:
        return;
    }

    // Create and download file
    const blob = new Blob(["\ufeff" + content], { type: mimeType }); // BOM for UTF-8
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${filename}.${fileExtension}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast.success(`Exportación completada`, {
      description: `${data.length} usuarios exportados como ${format.toUpperCase()}`,
    });
  }, []);

  // Export config
  const exportConfigOptions: ExportConfig<AdminUser> = useMemo(
    () => ({
      enabled: true,
      formats: ["csv", "json", "xlsx"],
      filename: "usuarios",
      onExport: handleExport,
    }),
    [handleExport]
  );

  // Copy config
  const copyConfigOptions: CopyConfig = useMemo(
    () => ({
      enabled: true,
      format: "csv",
      includeHeaders: true,
      onCopy: () => {
        toast.success("Datos copiados al portapapeles");
      },
    }),
    []
  );

  // Print config
  const printConfigOptions: PrintConfig = useMemo(
    () => ({
      enabled: true,
      title: "Listado de Usuarios",
      showLogo: false,
      pageSize: "A4",
      orientation: "landscape",
    }),
    []
  );

  // Fullscreen config
  const fullscreenConfigOptions: FullscreenConfig = useMemo(
    () => ({
      enabled: true,
      onFullscreenChange: (isFullscreen) => {
        if (isFullscreen) {
          toast.info("Modo pantalla completa activado", {
            description: "Presiona Escape para salir",
            duration: 2000,
          });
        }
      },
    }),
    []
  );

  // Header actions
  const headerActions = useMemo(
    () => (
      <Button variant="outline" size="sm" className="gap-2">
        <Users className="h-4 w-4" />
        <span className="hidden sm:inline">{pagination.totalRows} usuarios</span>
      </Button>
    ),
    [pagination.totalRows]
  );

  // Bulk actions
  const bulkActions = useCallback(
    (selectedRows: AdminUser[]) => (
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
    [handleBulkDelete]
  );

  // Row event handlers
  const handleRowClick = useCallback((user: AdminUser) => {
    toast.info(`Click en: ${user.name || user.email}`, {
      description: `ID: ${user.id}`,
      duration: 2000,
    });
  }, []);

  const handleRowDoubleClick = useCallback((user: AdminUser) => {
    toast.success(`Doble click en: ${user.name || user.email}`, {
      description: "Abriendo detalles del usuario...",
      duration: 2500,
    });
  }, []);

  const handleRowContextMenu = useCallback((user: AdminUser, event: React.MouseEvent) => {
    toast(`Menú contextual: ${user.name || user.email}`, {
      description: `Posición: (${event.clientX}, ${event.clientY})`,
      duration: 2000,
    });
  }, []);

  // Complete config for CustomDataTable
  const dataTableConfig: AdminUsersDataTableConfig = useMemo(
    () => ({
      data: users,
      columns,
      getRowId: (row) => row.id,
      selection: selectionConfig,
      expansion: expansionConfig,
      pagination: paginationConfig,
      sorting: sortingConfig,
      filter: filterConfig,
      columnVisibility: columnVisibilityConfig,
      toolbarConfig: toolbarConfigOptions,
      exportConfig: exportConfigOptions,
      copyConfig: copyConfigOptions,
      printConfig: printConfigOptions,
      fullscreenConfig: fullscreenConfigOptions,
      style: styleConfig,
      isLoading: isLoading && !users.length,
      isPending,
      emptyMessage: "No se encontraron usuarios",
      emptyIcon: <Users className="h-12 w-12 text-muted-foreground/50" />,
      headerActions,
      bulkActions,
      onRowClick: handleRowClick,
      onRowDoubleClick: handleRowDoubleClick,
      onRowContextMenu: handleRowContextMenu,
    }),
    [
      users,
      columns,
      selectionConfig,
      expansionConfig,
      paginationConfig,
      sortingConfig,
      filterConfig,
      columnVisibilityConfig,
      toolbarConfigOptions,
      exportConfigOptions,
      copyConfigOptions,
      printConfigOptions,
      fullscreenConfigOptions,
      styleConfig,
      isLoading,
      isPending,
      headerActions,
      bulkActions,
      handleRowClick,
      handleRowDoubleClick,
      handleRowContextMenu,
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

    // Selection helpers
    getSelectedUsers,
    clearSelection,
  };
}

"use client";

import { useCallback, useMemo, useRef } from "react";
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

const getRowId = (row: AdminUser) => row.id;

const STYLE_CONFIG: StyleConfig = {
  striped: true,
  hover: true,
  stickyHeader: true,
  density: "default",
  borderStyle: "default",
  maxHeight: 600,
};

const COPY_CONFIG: CopyConfig = {
  enabled: true,
  format: "csv",
  includeHeaders: true,
  onCopy: () => {
    toast.success("Datos copiados al portapapeles");
  },
};

const PRINT_CONFIG: PrintConfig = {
  enabled: true,
  title: "Listado de Usuarios",
  showLogo: false,
  pageSize: "A4",
  orientation: "landscape",
};

const FULLSCREEN_CONFIG: FullscreenConfig = {
  enabled: true,
  onFullscreenChange: (isFullscreen) => {
    if (isFullscreen) {
      toast.info("Modo pantalla completa activado", {
        description: "Presiona Escape para salir",
        duration: 2000,
      });
    }
  },
};

const PAGE_SIZE_OPTIONS = [5, 10, 20, 50, 100];
const EXPORT_FORMATS: ExportFormat[] = ["csv", "json", "xlsx"];
const ALWAYS_VISIBLE_COLUMNS = ["name", "actions"];

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

  const actionsRef = useRef({
    openDialog,
    unblockUser,
    restoreUser,
    unlockAccount,
    revokeAllSessions,
    getSelectedUsers,
    bulkDeleteUsers,
  });

  actionsRef.current = {
    openDialog,
    unblockUser,
    restoreUser,
    unlockAccount,
    revokeAllSessions,
    getSelectedUsers,
    bulkDeleteUsers,
  };
  const handleBlock = useCallback(
    async (id: string, data: BlockUserInput) => {
      await blockUser(id, data);
    },
    [blockUser]
  );

  const handleUnblock = useCallback(async (id: string) => {
    await actionsRef.current.unblockUser(id);
  }, []);

  const handleDelete = useCallback(
    async (id: string) => {
      await deleteUser(id);
    },
    [deleteUser]
  );

  const handleRestore = useCallback(async (id: string) => {
    await actionsRef.current.restoreUser(id);
  }, []);

  const handleChangeRole = useCallback(
    async (id: string, role: "USER" | "ADMIN") => {
      await changeRole(id, role);
    },
    [changeRole]
  );

  const handleUnlock = useCallback(async (id: string) => {
    await actionsRef.current.unlockAccount(id);
  }, []);

  const handleRevokeSessions = useCallback(async (id: string) => {
    await actionsRef.current.revokeAllSessions(id);
  }, []);

  const handleBulkDelete = useCallback(async () => {
    const selectedUsers = actionsRef.current.getSelectedUsers();
    if (selectedUsers.length > 0) {
      await actionsRef.current.bulkDeleteUsers(selectedUsers.map((u) => u.id));
    }
  }, []);

  // Create columns with actions - stable callbacks via refs
  const columns = useMemo(
    () =>
      createAdminUsersCustomColumns({
        onBlock: (user) => actionsRef.current.openDialog("block", user),
        onUnblock: (user) => handleUnblock(user.id),
        onDelete: (user) => actionsRef.current.openDialog("delete", user),
        onRestore: (user) => handleRestore(user.id),
        onChangeRole: (user) => actionsRef.current.openDialog("role", user),
        onUnlock: (user) => handleUnlock(user.id),
        onRevokeSessions: (user) => handleRevokeSessions(user.id),
        onEdit: (user) => actionsRef.current.openDialog("edit", user),
      }),
    [handleUnblock, handleRestore, handleUnlock, handleRevokeSessions]
  );

  // Sorting change handler - just pass through, no wrapper needed
  const handleCustomSortingChange = handleSortingChange;

  // Stable renderContent for expansion - memoize the function itself
  const renderExpandedContent = useCallback(
    (user: AdminUser) => <UserExpandedContent user={user} />,
    []
  );

  // Selection config - only changes when rowSelection or handler changes
  const selectionConfig: SelectionConfig<AdminUser> = useMemo(
    () => ({
      enabled: true,
      mode: "multiple" as const,
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
      renderContent: renderExpandedContent,
      expandOnClick: false,
    }),
    [expanded, handleExpandedChange, renderExpandedContent]
  );

  // Pagination config - only essential dependencies
  const paginationConfig: PaginationConfig = useMemo(
    () => ({
      pageIndex: pagination.pageIndex,
      pageSize: pagination.pageSize,
      totalRows: pagination.totalRows,
      totalPages: pagination.totalPages,
      pageSizeOptions: PAGE_SIZE_OPTIONS,
      onPaginationChange: handlePaginationChange,
      showPageNumbers: true,
      showFirstLast: true,
    }),
    [
      pagination.pageIndex,
      pagination.pageSize,
      pagination.totalRows,
      pagination.totalPages,
      handlePaginationChange,
    ]
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

  // Column visibility config
  const columnVisibilityConfig: ColumnVisibilityConfig = useMemo(
    () => ({
      enabled: true,
      columnVisibility,
      onColumnVisibilityChange: handleColumnVisibilityChange,
      alwaysVisibleColumns: ALWAYS_VISIBLE_COLUMNS,
    }),
    [columnVisibility, handleColumnVisibilityChange]
  );

  // Memoize filters component to prevent re-renders
  const filtersComponent = useMemo(
    () => <AdminUsersFilters filters={filters} onFiltersChange={handleFiltersChange} />,
    [filters, handleFiltersChange]
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
      customStart: filtersComponent,
    }),
    [handleRefresh, filtersComponent]
  );

  // Export handler - stable callback (no dependencies needed)
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

  // Export config - use stable reference
  const exportConfigOptions: ExportConfig<AdminUser> = useMemo(
    () => ({
      enabled: true,
      formats: EXPORT_FORMATS,
      filename: "usuarios",
      onExport: handleExport,
    }),
    [handleExport]
  );

  // Header actions - only depends on totalRows
  const headerActions = useMemo(
    () => (
      <Button variant="outline" size="sm" className="gap-2">
        <Users className="h-4 w-4" />
        <span className="hidden sm:inline">{pagination.totalRows} usuarios</span>
      </Button>
    ),
    [pagination.totalRows]
  );

  // Bulk actions - stable callback
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

  // Row event handlers - all stable (no dependencies)
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

  const emptyIcon = useMemo(() => <Users className="h-12 w-12 text-muted-foreground/50" />, []);

  const showLoading = isLoading && !users.length;

  const dataTableConfig: AdminUsersDataTableConfig = useMemo(
    () => ({
      data: users,
      columns,
      getRowId,
      selection: selectionConfig,
      expansion: expansionConfig,
      pagination: paginationConfig,
      sorting: sortingConfig,
      filter: filterConfig,
      columnVisibility: columnVisibilityConfig,
      toolbarConfig: toolbarConfigOptions,
      exportConfig: exportConfigOptions,
      copyConfig: COPY_CONFIG,
      printConfig: PRINT_CONFIG,
      fullscreenConfig: FULLSCREEN_CONFIG,
      style: STYLE_CONFIG,
      isLoading: showLoading,
      isPending,
      emptyMessage: "No se encontraron usuarios",
      emptyIcon,
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
      showLoading,
      isPending,
      emptyIcon,
      headerActions,
      bulkActions,
      handleRowClick,
      handleRowDoubleClick,
      handleRowContextMenu,
    ]
  );

  return {
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
    openDialog,
    closeDialog,
    handleBlock,
    handleDelete,
    handleChangeRole,
    getSelectedUsers,
    clearSelection,
  };
}

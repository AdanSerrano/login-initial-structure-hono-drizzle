"use client";

import { useCallback, useRef, useTransition, useDeferredValue, useMemo } from "react";
import { toast } from "sonner";
import type {
  PaginationState,
  SortingState,
  RowSelectionState,
  VisibilityState,
  ColumnFiltersState,
  ExpandedState,
} from "@tanstack/react-table";
import { adminUsersApi } from "../api/admin-users.api";
import { useAdminUsersStore } from "../state/admin-users.state";
import type {
  AdminUserFilters,
  UpdateUserInput,
  BlockUserInput,
} from "../types/admin-users.types";

export function useAdminUsers() {
  const [isPending, startTransition] = useTransition();
  const abortControllerRef = useRef<AbortController | null>(null);

  const store = useAdminUsersStore();
  const {
    users,
    setUsers,
    pagination,
    setPagination,
    filters,
    setFilters,
    sorting,
    setSorting,
    stats,
    setStats,
    selectedUser,
    setSelectedUser,
    rowSelection,
    setRowSelection,
    columnVisibility,
    setColumnVisibility,
    columnFilters,
    setColumnFilters,
    expanded,
    setExpanded,
    activeDialog,
    openDialog,
    closeDialog,
    isLoading,
    setIsLoading,
    isInitialized,
    setIsInitialized,
    updateUser: updateUserInStore,
    bulkUpdateUsers,
    removeUser,
    getSelectedUsers,
    clearSelection,
    selectAll,
    toggleRowSelection,
  } = store;

  const deferredSearch = useDeferredValue(filters.search || "");

  const fetchUsers = useCallback(async () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();

    setIsLoading(true);
    try {
      const currentState = useAdminUsersStore.getState();
      const response = await adminUsersApi.getUsers({
        page: currentState.pagination.pageIndex + 1,
        limit: currentState.pagination.pageSize,
        search: currentState.filters.search || undefined,
        role: currentState.filters.role,
        status: currentState.filters.status,
        emailVerified: currentState.filters.emailVerified,
        twoFactor: currentState.filters.twoFactor,
        sortField: currentState.sorting[0]?.id,
        sortDirection: currentState.sorting[0]?.desc ? "desc" : "asc",
      });

      setUsers(response.data);
      setPagination({
        pageIndex: response.pagination.page - 1,
        pageSize: response.pagination.limit,
        totalRows: response.pagination.total,
        totalPages: response.pagination.totalPages,
      });

      if (!isInitialized) {
        setIsInitialized(true);
      }
    } catch (error) {
      if (error instanceof Error && error.name !== "AbortError") {
        toast.error(error.message || "Error al cargar usuarios");
      }
    } finally {
      setIsLoading(false);
    }
  }, [setUsers, setPagination, setIsLoading, isInitialized, setIsInitialized]);

  const fetchStats = useCallback(async () => {
    try {
      const data = await adminUsersApi.getStats();
      setStats(data);
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  }, [setStats]);

  const handlePaginationChange = useCallback(
    (newPagination: PaginationState) => {
      const currentState = useAdminUsersStore.getState();
      setPagination({
        ...currentState.pagination,
        pageIndex: newPagination.pageIndex,
        pageSize: newPagination.pageSize,
      });
      startTransition(() => {
        fetchUsers();
      });
    },
    [setPagination, fetchUsers]
  );

  const handleSortingChange = useCallback(
    (newSorting: SortingState) => {
      setSorting(newSorting);
      startTransition(() => {
        fetchUsers();
      });
    },
    [setSorting, fetchUsers]
  );

  const handleFiltersChange = useCallback(
    (newFilters: Partial<AdminUserFilters>) => {
      const currentState = useAdminUsersStore.getState();
      setFilters({ ...currentState.filters, ...newFilters });
      setPagination({ ...currentState.pagination, pageIndex: 0 });
      startTransition(() => {
        fetchUsers();
      });
    },
    [setFilters, setPagination, fetchUsers]
  );

  const handleSearchChange = useCallback(
    (search: string) => {
      const currentState = useAdminUsersStore.getState();
      setFilters({ ...currentState.filters, search });
      setPagination({ ...currentState.pagination, pageIndex: 0 });
    },
    [setFilters, setPagination]
  );

  const handleRowSelectionChange = useCallback(
    (selection: RowSelectionState) => {
      setRowSelection(selection);
    },
    [setRowSelection]
  );

  const handleColumnVisibilityChange = useCallback(
    (visibility: VisibilityState) => {
      setColumnVisibility(visibility);
    },
    [setColumnVisibility]
  );

  const handleColumnFiltersChange = useCallback(
    (filters: ColumnFiltersState) => {
      setColumnFilters(filters);
    },
    [setColumnFilters]
  );

  const handleExpandedChange = useCallback(
    (expanded: ExpandedState) => {
      setExpanded(expanded);
    },
    [setExpanded]
  );

  const blockUser = useCallback(
    async (id: string, data: BlockUserInput) => {
      try {
        const user = await adminUsersApi.blockUser(id, data);
        updateUserInStore(user);
        toast.success("Usuario bloqueado correctamente");
        closeDialog();
        return user;
      } catch (error) {
        const message = error instanceof Error ? error.message : "Error al bloquear usuario";
        toast.error(message);
        throw error;
      }
    },
    [updateUserInStore, closeDialog]
  );

  const unblockUser = useCallback(
    async (id: string) => {
      try {
        const user = await adminUsersApi.unblockUser(id);
        updateUserInStore(user);
        toast.success("Usuario desbloqueado correctamente");
        return user;
      } catch (error) {
        const message = error instanceof Error ? error.message : "Error al desbloquear usuario";
        toast.error(message);
        throw error;
      }
    },
    [updateUserInStore]
  );

  const deleteUser = useCallback(
    async (id: string) => {
      try {
        const user = await adminUsersApi.deleteUser(id);
        updateUserInStore(user);
        toast.success("Usuario eliminado correctamente");
        closeDialog();
        return user;
      } catch (error) {
        const message = error instanceof Error ? error.message : "Error al eliminar usuario";
        toast.error(message);
        throw error;
      }
    },
    [updateUserInStore, closeDialog]
  );

  const restoreUser = useCallback(
    async (id: string) => {
      try {
        const user = await adminUsersApi.restoreUser(id);
        updateUserInStore(user);
        toast.success("Usuario restaurado correctamente");
        return user;
      } catch (error) {
        const message = error instanceof Error ? error.message : "Error al restaurar usuario";
        toast.error(message);
        throw error;
      }
    },
    [updateUserInStore]
  );

  const permanentDeleteUser = useCallback(
    async (id: string) => {
      try {
        await adminUsersApi.permanentDeleteUser(id);
        removeUser(id);
        toast.success("Usuario eliminado permanentemente");
      } catch (error) {
        const message = error instanceof Error ? error.message : "Error al eliminar usuario";
        toast.error(message);
        throw error;
      }
    },
    [removeUser]
  );

  const bulkDeleteUsers = useCallback(
    async (ids: string[]) => {
      try {
        const updatedUsers = await Promise.all(ids.map((id) => adminUsersApi.deleteUser(id)));
        bulkUpdateUsers(updatedUsers);
        toast.success(`${ids.length} usuarios eliminados correctamente`);
        closeDialog();
      } catch (error) {
        const message = error instanceof Error ? error.message : "Error al eliminar usuarios";
        toast.error(message);
        throw error;
      }
    },
    [bulkUpdateUsers, closeDialog]
  );

  const changeRole = useCallback(
    async (id: string, role: "USER" | "ADMIN") => {
      try {
        const user = await adminUsersApi.changeRole(id, role);
        updateUserInStore(user);
        toast.success(`Rol actualizado a ${role}`);
        closeDialog();
        return user;
      } catch (error) {
        const message = error instanceof Error ? error.message : "Error al cambiar rol";
        toast.error(message);
        throw error;
      }
    },
    [updateUserInStore, closeDialog]
  );

  const unlockAccount = useCallback(
    async (id: string) => {
      try {
        const user = await adminUsersApi.unlockAccount(id);
        updateUserInStore(user);
        toast.success("Cuenta desbloqueada correctamente");
        return user;
      } catch (error) {
        const message = error instanceof Error ? error.message : "Error al desbloquear cuenta";
        toast.error(message);
        throw error;
      }
    },
    [updateUserInStore]
  );

  const updateUser = useCallback(
    async (id: string, data: UpdateUserInput) => {
      try {
        const user = await adminUsersApi.updateUser(id, data);
        updateUserInStore(user);
        toast.success("Usuario actualizado correctamente");
        closeDialog();
        return user;
      } catch (error) {
        const message = error instanceof Error ? error.message : "Error al actualizar usuario";
        toast.error(message);
        throw error;
      }
    },
    [updateUserInStore, closeDialog]
  );

  const revokeAllSessions = useCallback(async (id: string) => {
    try {
      const result = await adminUsersApi.revokeAllSessions(id);
      toast.success(`${result.count} sesiones revocadas`);
      return result;
    } catch (error) {
      const message = error instanceof Error ? error.message : "Error al revocar sesiones";
      toast.error(message);
      throw error;
    }
  }, []);

  const handleRefresh = useCallback(() => {
    startTransition(() => {
      fetchUsers();
      fetchStats();
    });
  }, [fetchUsers, fetchStats]);

  const selectedCount = useMemo(
    () => Object.keys(rowSelection).filter((k) => rowSelection[k]).length,
    [rowSelection]
  );

  return {
    // Data
    users,
    stats,
    selectedUser,

    // Table state
    pagination,
    filters,
    sorting,
    rowSelection,
    columnVisibility,
    columnFilters,
    expanded,

    // UI state
    activeDialog,
    isLoading,
    isPending,
    isInitialized,

    // Data fetching
    fetchUsers,
    fetchStats,
    handleRefresh,

    // Table handlers
    handlePaginationChange,
    handleSortingChange,
    handleFiltersChange,
    handleSearchChange,
    handleRowSelectionChange,
    handleColumnVisibilityChange,
    handleColumnFiltersChange,
    handleExpandedChange,

    // Selection
    setSelectedUser,
    getSelectedUsers,
    clearSelection,
    selectAll,
    toggleRowSelection,
    selectedCount,

    // Dialog
    openDialog,
    closeDialog,

    // User actions
    blockUser,
    unblockUser,
    deleteUser,
    restoreUser,
    permanentDeleteUser,
    bulkDeleteUsers,
    changeRole,
    unlockAccount,
    updateUser,
    revokeAllSessions,
  };
}

import { create } from "zustand";
import type {
  SortingState,
  RowSelectionState,
  VisibilityState,
  ColumnFiltersState,
  ExpandedState,
} from "@tanstack/react-table";
import type { AdminUser, AdminUserFilters, AdminUserStats } from "../types/admin-users.types";

type DialogType = "block" | "delete" | "role" | "edit" | "bulkAction" | null;

interface PaginationState {
  pageIndex: number;
  pageSize: number;
  totalRows: number;
  totalPages: number;
}

interface AdminUsersState {
  // Data
  users: AdminUser[];
  stats: AdminUserStats | null;
  selectedUser: AdminUser | null;

  // Table State
  pagination: PaginationState;
  filters: AdminUserFilters;
  sorting: SortingState;
  rowSelection: RowSelectionState;
  columnVisibility: VisibilityState;
  columnFilters: ColumnFiltersState;
  expanded: ExpandedState;

  // UI State
  activeDialog: DialogType;
  isLoading: boolean;
  isInitialized: boolean;
}

interface AdminUsersActions {
  // Data actions
  setUsers: (users: AdminUser[]) => void;
  setStats: (stats: AdminUserStats) => void;
  setSelectedUser: (user: AdminUser | null) => void;
  updateUser: (user: AdminUser) => void;
  bulkUpdateUsers: (users: AdminUser[]) => void;
  removeUser: (id: string) => void;
  bulkRemoveUsers: (ids: string[]) => void;

  // Table state actions
  setPagination: (pagination: PaginationState) => void;
  setFilters: (filters: AdminUserFilters) => void;
  setSorting: (sorting: SortingState) => void;
  setRowSelection: (selection: RowSelectionState) => void;
  setColumnVisibility: (visibility: VisibilityState) => void;
  setColumnFilters: (filters: ColumnFiltersState) => void;
  setExpanded: (expanded: ExpandedState) => void;

  // UI actions
  setActiveDialog: (dialog: DialogType) => void;
  openDialog: (dialog: DialogType, user?: AdminUser) => void;
  closeDialog: () => void;
  setIsLoading: (isLoading: boolean) => void;
  setIsInitialized: (isInitialized: boolean) => void;

  // Selection helpers
  getSelectedUsers: () => AdminUser[];
  clearSelection: () => void;
  selectAll: () => void;
  toggleRowSelection: (id: string) => void;

  // Reset
  reset: () => void;
}

const initialState: AdminUsersState = {
  // Data
  users: [],
  stats: null,
  selectedUser: null,

  // Table State
  pagination: {
    pageIndex: 0,
    pageSize: 10,
    totalRows: 0,
    totalPages: 0,
  },
  filters: {
    search: "",
    role: "ALL",
    status: "ALL",
    emailVerified: "ALL",
    twoFactor: "ALL",
  },
  sorting: [{ id: "createdAt", desc: true }],
  rowSelection: {},
  columnVisibility: {},
  columnFilters: [],
  expanded: {},

  // UI State
  activeDialog: null,
  isLoading: false,
  isInitialized: false,
};

export const useAdminUsersStore = create<AdminUsersState & AdminUsersActions>((set, get) => ({
  ...initialState,

  // Data actions
  setUsers: (users) => set({ users }),

  setStats: (stats) => set({ stats }),

  setSelectedUser: (selectedUser) => set({ selectedUser }),

  updateUser: (user) =>
    set((state) => ({
      users: state.users.map((u) => (u.id === user.id ? user : u)),
      selectedUser: state.selectedUser?.id === user.id ? user : state.selectedUser,
    })),

  bulkUpdateUsers: (users) =>
    set((state) => {
      const userMap = new Map(users.map((u) => [u.id, u]));
      return {
        users: state.users.map((u) => userMap.get(u.id) ?? u),
        selectedUser: state.selectedUser && userMap.has(state.selectedUser.id)
          ? userMap.get(state.selectedUser.id) ?? state.selectedUser
          : state.selectedUser,
        rowSelection: {},
      };
    }),

  removeUser: (id) =>
    set((state) => {
      const newSelection = { ...state.rowSelection };
      delete newSelection[id];
      return {
        users: state.users.filter((u) => u.id !== id),
        selectedUser: state.selectedUser?.id === id ? null : state.selectedUser,
        rowSelection: newSelection,
        pagination: {
          ...state.pagination,
          totalRows: state.pagination.totalRows - 1,
        },
      };
    }),

  bulkRemoveUsers: (ids) =>
    set((state) => {
      const idsSet = new Set(ids);
      const newSelection = { ...state.rowSelection };
      ids.forEach((id) => delete newSelection[id]);
      return {
        users: state.users.filter((u) => !idsSet.has(u.id)),
        selectedUser: state.selectedUser && idsSet.has(state.selectedUser.id) ? null : state.selectedUser,
        rowSelection: newSelection,
        pagination: {
          ...state.pagination,
          totalRows: state.pagination.totalRows - ids.length,
        },
      };
    }),

  // Table state actions
  setPagination: (pagination) => set({ pagination }),

  setFilters: (filters) => set({ filters }),

  setSorting: (sorting) => set({ sorting }),

  setRowSelection: (rowSelection) => set({ rowSelection }),

  setColumnVisibility: (columnVisibility) => set({ columnVisibility }),

  setColumnFilters: (columnFilters) => set({ columnFilters }),

  setExpanded: (expanded) => set({ expanded }),

  // UI actions
  setActiveDialog: (activeDialog) => set({ activeDialog }),

  openDialog: (dialog, user) =>
    set({
      activeDialog: dialog,
      selectedUser: user ?? null,
    }),

  closeDialog: () =>
    set({
      activeDialog: null,
      selectedUser: null,
    }),

  setIsLoading: (isLoading) => set({ isLoading }),

  setIsInitialized: (isInitialized) => set({ isInitialized }),

  // Selection helpers
  getSelectedUsers: () => {
    const state = get();
    const selectedIds = Object.keys(state.rowSelection).filter(
      (key) => state.rowSelection[key]
    );
    return state.users.filter((user) => selectedIds.includes(user.id));
  },

  clearSelection: () => set({ rowSelection: {} }),

  selectAll: () =>
    set((state) => ({
      rowSelection: state.users.reduce<RowSelectionState>((acc, user) => {
        acc[user.id] = true;
        return acc;
      }, {}),
    })),

  toggleRowSelection: (id) =>
    set((state) => ({
      rowSelection: {
        ...state.rowSelection,
        [id]: !state.rowSelection[id],
      },
    })),

  reset: () => set(initialState),
}));

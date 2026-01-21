"use client";

import { useCallback, useRef, useTransition } from "react";
import { create } from "zustand";
import type {
  SortingState,
  RowSelectionState,
  VisibilityState,
  ExpandedState,
} from "@tanstack/react-table";

export interface DataTableState<TData, TFilters = Record<string, unknown>> {
  // Data
  data: TData[];
  selectedItem: TData | null;

  // Table State
  pagination: {
    pageIndex: number;
    pageSize: number;
    totalRows: number;
    totalPages: number;
  };
  filters: TFilters;
  sorting: SortingState;
  rowSelection: RowSelectionState;
  columnVisibility: VisibilityState;
  expanded: ExpandedState;

  // UI State
  activeModal: string | null;
  activeSheet: string | null;
  isLoading: boolean;
  isInitialized: boolean;
}

export interface DataTableActions<TData, TFilters> {
  // Data
  setData: (data: TData[]) => void;
  setSelectedItem: (item: TData | null) => void;
  updateItem: (id: string, item: TData) => void;
  removeItem: (id: string) => void;

  // Table State
  setPagination: (pagination: Partial<DataTableState<TData, TFilters>["pagination"]>) => void;
  setFilters: (filters: Partial<TFilters>) => void;
  setSorting: (sorting: SortingState) => void;
  setRowSelection: (selection: RowSelectionState) => void;
  setColumnVisibility: (visibility: VisibilityState) => void;
  setExpanded: (expanded: ExpandedState) => void;

  // UI
  openModal: (modalId: string, item?: TData) => void;
  closeModal: () => void;
  openSheet: (sheetId: string) => void;
  closeSheet: () => void;
  setIsLoading: (loading: boolean) => void;
  setIsInitialized: (initialized: boolean) => void;

  // Selection helpers
  getSelectedItems: () => TData[];
  clearSelection: () => void;

  // Reset
  reset: () => void;
}

export type DataTableStore<TData, TFilters = Record<string, unknown>> =
  DataTableState<TData, TFilters> & DataTableActions<TData, TFilters>;

export function createDataTableStore<TData extends { id: string }, TFilters = Record<string, unknown>>(
  initialFilters: TFilters,
  initialSorting: SortingState = []
) {
  const initialState: DataTableState<TData, TFilters> = {
    data: [],
    selectedItem: null,
    pagination: {
      pageIndex: 0,
      pageSize: 10,
      totalRows: 0,
      totalPages: 0,
    },
    filters: initialFilters,
    sorting: initialSorting,
    rowSelection: {},
    columnVisibility: {},
    expanded: {},
    activeModal: null,
    activeSheet: null,
    isLoading: false,
    isInitialized: false,
  };

  return create<DataTableStore<TData, TFilters>>((set, get) => ({
    ...initialState,

    setData: (data) => set({ data }),
    setSelectedItem: (selectedItem) => set({ selectedItem }),

    updateItem: (id, item) =>
      set((state) => ({
        data: state.data.map((d) => (d.id === id ? item : d)),
        selectedItem: state.selectedItem?.id === id ? item : state.selectedItem,
      })),

    removeItem: (id) =>
      set((state) => {
        const newSelection = { ...state.rowSelection };
        delete newSelection[id];
        return {
          data: state.data.filter((d) => d.id !== id),
          selectedItem: state.selectedItem?.id === id ? null : state.selectedItem,
          rowSelection: newSelection,
          pagination: {
            ...state.pagination,
            totalRows: state.pagination.totalRows - 1,
          },
        };
      }),

    setPagination: (pagination) =>
      set((state) => ({
        pagination: { ...state.pagination, ...pagination },
      })),

    setFilters: (filters) =>
      set((state) => ({
        filters: { ...state.filters, ...filters } as TFilters,
      })),

    setSorting: (sorting) => set({ sorting }),
    setRowSelection: (rowSelection) => set({ rowSelection }),
    setColumnVisibility: (columnVisibility) => set({ columnVisibility }),
    setExpanded: (expanded) => set({ expanded }),

    openModal: (activeModal, item) =>
      set({
        activeModal,
        selectedItem: item ?? null,
      }),

    closeModal: () =>
      set({
        activeModal: null,
        selectedItem: null,
      }),

    openSheet: (activeSheet) => set({ activeSheet }),
    closeSheet: () => set({ activeSheet: null }),

    setIsLoading: (isLoading) => set({ isLoading }),
    setIsInitialized: (isInitialized) => set({ isInitialized }),

    getSelectedItems: () => {
      const state = get();
      const selectedIds = Object.keys(state.rowSelection).filter(
        (key) => state.rowSelection[key]
      );
      return state.data.filter((item) => selectedIds.includes(item.id));
    },

    clearSelection: () => set({ rowSelection: {} }),

    reset: () => set(initialState),
  }));
}

export interface UseDataTableOptions<TData extends { id: string }, TFilters> {
  store: ReturnType<typeof createDataTableStore<TData, TFilters>>;
  fetchData: (params: {
    page: number;
    limit: number;
    filters: TFilters;
    sorting: SortingState;
  }) => Promise<{
    data: TData[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  }>;
  getRowId?: (row: TData) => string;
}

export function useDataTableActions<TData extends { id: string }, TFilters>(
  options: UseDataTableOptions<TData, TFilters>
) {
  const { store, fetchData, getRowId = (row) => row.id } = options;
  const [isPending, startTransition] = useTransition();
  const abortControllerRef = useRef<AbortController | null>(null);

  const state = store();

  const fetch = useCallback(async () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();

    state.setIsLoading(true);

    try {
      const currentState = store.getState();
      const response = await fetchData({
        page: currentState.pagination.pageIndex + 1,
        limit: currentState.pagination.pageSize,
        filters: currentState.filters,
        sorting: currentState.sorting,
      });

      state.setData(response.data);
      state.setPagination({
        pageIndex: response.pagination.page - 1,
        pageSize: response.pagination.limit,
        totalRows: response.pagination.total,
        totalPages: response.pagination.totalPages,
      });

      if (!currentState.isInitialized) {
        state.setIsInitialized(true);
      }
    } catch (error) {
      if (error instanceof Error && error.name !== "AbortError") {
        throw error;
      }
    } finally {
      state.setIsLoading(false);
    }
  }, [store, fetchData, state]);

  const handlePaginationChange = useCallback(
    (newPagination: { pageIndex: number; pageSize: number }) => {
      state.setPagination(newPagination);
      startTransition(() => {
        fetch();
      });
    },
    [state, fetch]
  );

  const handleSortingChange = useCallback(
    (newSorting: SortingState) => {
      state.setSorting(newSorting);
      startTransition(() => {
        fetch();
      });
    },
    [state, fetch]
  );

  const handleFiltersChange = useCallback(
    (newFilters: Partial<TFilters>) => {
      state.setFilters(newFilters);
      state.setPagination({ pageIndex: 0 });
      startTransition(() => {
        fetch();
      });
    },
    [state, fetch]
  );

  const handleSearchChange = useCallback(
    (search: string) => {
      state.setFilters({ search } as unknown as Partial<TFilters>);
      state.setPagination({ pageIndex: 0 });
      startTransition(() => {
        fetch();
      });
    },
    [state, fetch]
  );

  const handleRefresh = useCallback(() => {
    startTransition(() => {
      fetch();
    });
  }, [fetch]);

  return {
    // State
    ...state,
    isPending,

    // Actions
    fetch,
    handlePaginationChange,
    handleSortingChange,
    handleFiltersChange,
    handleSearchChange,
    handleRefresh,
    getRowId,
  };
}

import { create } from "zustand";
import type {
  DemoProduct,
  DemoProductFilters,
  DemoProductStats,
  DialogType,
} from "../types/demo-products.types";
import type { SortingState, ColumnVisibilityState } from "@/components/ui/custom-datatable";

interface DemoProductsState {
  products: DemoProduct[];
  stats: DemoProductStats | null;
  isLoading: boolean;
  isPending: boolean;
  isInitialized: boolean;
  error: string | null;

  // Filters
  filters: DemoProductFilters;

  // Table state
  rowSelection: Record<string, boolean>;
  expanded: Record<string, boolean>;
  sorting: SortingState[];
  columnVisibility: ColumnVisibilityState;

  // Pagination
  pagination: {
    pageIndex: number;
    pageSize: number;
    totalRows: number;
    totalPages: number;
  };

  // Dialog state
  activeDialog: DialogType;
  selectedProduct: DemoProduct | null;
}

interface DemoProductsActions {
  setProducts: (products: DemoProduct[]) => void;
  addProduct: (product: DemoProduct) => void;
  updateProduct: (id: string, data: Partial<DemoProduct>) => void;
  removeProduct: (id: string) => void;

  setStats: (stats: DemoProductStats) => void;
  setLoading: (loading: boolean) => void;
  setPending: (pending: boolean) => void;
  setInitialized: (initialized: boolean) => void;
  setError: (error: string | null) => void;

  setFilters: (filters: Partial<DemoProductFilters>) => void;
  resetFilters: () => void;

  setRowSelection: (selection: Record<string, boolean>) => void;
  setExpanded: (expanded: Record<string, boolean>) => void;
  setSorting: (sorting: SortingState[]) => void;
  setColumnVisibility: (visibility: ColumnVisibilityState) => void;

  setPagination: (pagination: Partial<DemoProductsState["pagination"]>) => void;

  openDialog: (type: DialogType, product?: DemoProduct) => void;
  closeDialog: () => void;

  getSelectedProducts: () => DemoProduct[];
  clearSelection: () => void;

  reset: () => void;
}

const initialFilters: DemoProductFilters = {
  search: "",
  status: "all",
  category: "all",
  minPrice: null,
  maxPrice: null,
};

const initialPagination = {
  pageIndex: 0,
  pageSize: 10,
  totalRows: 0,
  totalPages: 0,
};

const initialState: DemoProductsState = {
  products: [],
  stats: null,
  isLoading: false,
  isPending: false,
  isInitialized: false,
  error: null,
  filters: initialFilters,
  rowSelection: {},
  expanded: {},
  sorting: [],
  columnVisibility: {},
  pagination: initialPagination,
  activeDialog: null,
  selectedProduct: null,
};

export const useDemoProductsStore = create<DemoProductsState & DemoProductsActions>(
  (set, get) => ({
    ...initialState,

    setProducts: (products) => set({ products }),

    addProduct: (product) =>
      set((state) => ({
        products: [product, ...state.products],
        pagination: {
          ...state.pagination,
          totalRows: state.pagination.totalRows + 1,
        },
      })),

    updateProduct: (id, data) =>
      set((state) => ({
        products: state.products.map((p) =>
          p.id === id ? { ...p, ...data, updatedAt: new Date() } : p
        ),
      })),

    removeProduct: (id) =>
      set((state) => ({
        products: state.products.filter((p) => p.id !== id),
        pagination: {
          ...state.pagination,
          totalRows: Math.max(0, state.pagination.totalRows - 1),
        },
        rowSelection: Object.fromEntries(
          Object.entries(state.rowSelection).filter(([key]) => key !== id)
        ),
      })),

    setStats: (stats) => set({ stats }),
    setLoading: (isLoading) => set({ isLoading }),
    setPending: (isPending) => set({ isPending }),
    setInitialized: (isInitialized) => set({ isInitialized }),
    setError: (error) => set({ error }),

    setFilters: (filters) =>
      set((state) => ({
        filters: { ...state.filters, ...filters },
        pagination: { ...state.pagination, pageIndex: 0 },
      })),

    resetFilters: () =>
      set({
        filters: initialFilters,
        pagination: { ...initialPagination },
      }),

    setRowSelection: (rowSelection) => set({ rowSelection }),
    setExpanded: (expanded) => set({ expanded }),
    setSorting: (sorting) => set({ sorting }),
    setColumnVisibility: (columnVisibility) => set({ columnVisibility }),

    setPagination: (pagination) =>
      set((state) => ({
        pagination: { ...state.pagination, ...pagination },
      })),

    openDialog: (type, product) =>
      set({
        activeDialog: type,
        selectedProduct: product ?? null,
      }),

    closeDialog: () =>
      set({
        activeDialog: null,
        selectedProduct: null,
      }),

    getSelectedProducts: () => {
      const { products, rowSelection } = get();
      return products.filter((p) => rowSelection[p.id]);
    },

    clearSelection: () => set({ rowSelection: {} }),

    reset: () => set(initialState),
  })
);

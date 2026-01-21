import type { ReactNode } from "react";
import type { ColumnDef, SortingState, PaginationState, RowSelectionState } from "@tanstack/react-table";

export interface DataTableHeaderButton {
  label?: string;
  icon?: ReactNode;
  component?: ReactNode;
  onClick?: () => void;
  variant?: "default" | "outline" | "ghost" | "destructive";
  permission?: string;
}

export interface DataTableHeaderAction {
  type: "button" | "dropdown";
  icon?: ReactNode;
  label?: string;
  onClick?: () => void;
  children?: ReactNode;
}

export interface DataTableHeaderConfig {
  title: string;
  description?: string;
  buttons?: DataTableHeaderButton[];
  search?: {
    placeholder?: string;
    onSearch: (value: string) => void;
    disabled?: boolean;
  };
  actions?: DataTableHeaderAction[];
}

export interface DataTablePaginationConfig {
  pageIndex: number;
  pageSize: number;
  totalRows: number;
  totalPages?: number;
  pageSizeOptions?: number[];
  onPaginationChange: (pagination: PaginationState) => void;
  showPageNumbers?: boolean;
  showFirstLast?: boolean;
}

export interface DataTableSortingConfig {
  sorting: SortingState;
  onSortingChange: (sorting: SortingState) => void;
  manualSorting?: boolean;
}

export interface DataTableSelectionConfig {
  enabled?: boolean;
  mode?: "single" | "multiple";
  showCheckbox?: boolean;
  selectOnRowClick?: boolean;
  rowSelection?: RowSelectionState;
  onRowSelectionChange?: (selection: RowSelectionState) => void;
  onSelectionChange?: (selectedIds: string[]) => void;
  onRowSelect?: (row: unknown) => void;
}

export interface DataTableFilterConfig {
  globalFilter?: string;
  onGlobalFilterChange?: (value: string) => void;
  placeholder?: string;
}

export interface DataTableExportConfig {
  enabled?: boolean;
  formats?: ("csv" | "json" | "xlsx")[];
  filename?: string;
  onExport?: (format: string, data: unknown[]) => void;
}

export interface DataTableExpansionConfig<TData> {
  enabled?: boolean;
  expandOnClick?: boolean;
  renderContent?: (row: TData) => ReactNode;
}

export interface DataTableStyleConfig {
  striped?: boolean;
  hover?: boolean;
  stickyHeader?: boolean;
  density?: "compact" | "default" | "comfortable";
  borderStyle?: "default" | "none" | "horizontal" | "vertical" | "all";
  maxHeight?: number | string;
}

export interface DataTableModalConfig {
  id: string;
  component: ReactNode;
}

export interface DataTableSheetConfig {
  id: string;
  component: ReactNode;
}

export interface DataTableScaffoldConfig<TData> {
  header?: DataTableHeaderConfig;
  columns: ColumnDef<TData>[];
  data: TData[];

  pagination?: DataTablePaginationConfig;
  sorting?: DataTableSortingConfig;
  selection?: DataTableSelectionConfig;
  filter?: DataTableFilterConfig;
  expansion?: DataTableExpansionConfig<TData>;
  export?: DataTableExportConfig;

  style?: DataTableStyleConfig;

  isLoading?: boolean;
  isPending?: boolean;
  emptyMessage?: string;
  emptyIcon?: ReactNode;

  getRowId?: (row: TData) => string;
  onRowClick?: (row: TData) => void;
  onRowDoubleClick?: (row: TData) => void;

  toolbar?: ReactNode;
  headerActions?: ReactNode;
  bulkActions?: (selectedRows: TData[]) => ReactNode;

  modals?: DataTableModalConfig[];
  sheets?: DataTableSheetConfig[];
}

export interface UseDataTableActionsOptions<TData> {
  fetchData: () => Promise<void>;
  onSearch?: (value: string) => void;
  onPageChange?: (page: number, pageSize: number) => void;
  onSortChange?: (sorting: SortingState) => void;
  onSelectionChange?: (selectedRows: TData[]) => void;
  onRefresh?: () => void;
}

import type {
  ColumnDef,
  SortingState,
  ColumnFiltersState,
  VisibilityState,
  PaginationState,
  RowSelectionState,
  ExpandedState,
  ColumnPinningState,
  ColumnSizingState,
  ColumnOrderState,
  GroupingState,
  Table,
  Header,
  Row,
  Cell,
} from "@tanstack/react-table";
import type { ReactNode } from "react";

export type ColumnAlignment = "left" | "center" | "right";

export type ColumnPinning = "left" | "right" | false;

export interface DataTableColumnMeta {
  align?: ColumnAlignment;
  pinned?: ColumnPinning;
  width?: number | string;
  minWidth?: number;
  maxWidth?: number;
  headerClassName?: string;
  cellClassName?: string;
  editable?: boolean;
  sticky?: boolean;
  resizable?: boolean;
  draggable?: boolean;
}

export type DataTableColumn<TData, TValue = unknown> = ColumnDef<TData, TValue> & {
  meta?: DataTableColumnMeta;
};

export interface PaginationConfig {
  pageIndex: number;
  pageSize: number;
  pageSizeOptions?: number[];
  totalRows?: number;
  totalPages?: number;
  onPaginationChange?: (pagination: PaginationState) => void;
  manualPagination?: boolean;
  showPageNumbers?: boolean;
  showFirstLast?: boolean;
}

export type BuiltInFilterFn =
  | "includesString"
  | "includesStringSensitive"
  | "equalsString"
  | "arrIncludes"
  | "arrIncludesAll"
  | "arrIncludesSome"
  | "equals"
  | "weakEquals"
  | "inNumberRange";

export interface FilterConfig {
  globalFilter?: string;
  onGlobalFilterChange?: (value: string) => void;
  columnFilters?: ColumnFiltersState;
  onColumnFiltersChange?: (filters: ColumnFiltersState) => void;
  globalFilterFn?: BuiltInFilterFn;
  filterPlaceholder?: string;
  enableColumnFilters?: boolean;
  debounceMs?: number;
  showFilterCount?: boolean;
}

export interface SortingConfig {
  sorting?: SortingState;
  onSortingChange?: (sorting: SortingState) => void;
  enableSorting?: boolean;
  enableMultiSort?: boolean;
  manualSorting?: boolean;
  maxMultiSortColCount?: number;
}

export type SelectionMode = "single" | "multiple";

export interface SelectionConfig {
  rowSelection?: RowSelectionState;
  onRowSelectionChange?: (selection: RowSelectionState) => void;
  enableRowSelection?: boolean | ((row: Row<unknown>) => boolean);
  enableMultiRowSelection?: boolean;
  enableSubRowSelection?: boolean;
  selectAllMode?: "all" | "page";
  /** Selection mode: 'single' allows only one row, 'multiple' allows many */
  selectionMode?: SelectionMode;
  /** Show checkbox column for selection (default: true for multiple, false for single) */
  showCheckbox?: boolean;
  /** Select row on click (useful for single selection without checkbox) */
  selectOnRowClick?: boolean;
  /** Callback when a row is selected (useful for single selection) */
  onRowSelect?: (row: unknown) => void;
}

export interface ColumnVisibilityConfig {
  columnVisibility?: VisibilityState;
  onColumnVisibilityChange?: (visibility: VisibilityState) => void;
  enableColumnVisibility?: boolean;
  hiddenColumns?: string[];
}

export interface ColumnPinningConfig {
  columnPinning?: ColumnPinningState;
  onColumnPinningChange?: (pinning: ColumnPinningState) => void;
  enableColumnPinning?: boolean;
}

export interface ColumnSizingConfig {
  columnSizing?: ColumnSizingState;
  onColumnSizingChange?: (sizing: ColumnSizingState) => void;
  enableColumnResizing?: boolean;
  columnResizeMode?: "onChange" | "onEnd";
  defaultColumnSize?: number;
  defaultColumnMinSize?: number;
  defaultColumnMaxSize?: number;
}

export interface ColumnOrderConfig {
  columnOrder?: ColumnOrderState;
  onColumnOrderChange?: (order: ColumnOrderState) => void;
  enableColumnOrdering?: boolean;
}

export interface RowExpansionConfig<TData> {
  expanded?: ExpandedState;
  onExpandedChange?: (expanded: ExpandedState) => void;
  enableExpanding?: boolean;
  enableExpandAll?: boolean;
  autoResetExpanded?: boolean;
  getRowCanExpand?: (row: Row<TData>) => boolean;
  renderSubComponent?: (props: { row: Row<TData> }) => ReactNode;
  expandOnClick?: boolean;
}

export interface GroupingConfig {
  grouping?: GroupingState;
  onGroupingChange?: (grouping: GroupingState) => void;
  enableGrouping?: boolean;
  manualGrouping?: boolean;
  aggregationFns?: Record<string, (values: unknown[]) => unknown>;
}

export interface CellEditConfig<TData> {
  enableCellEdit?: boolean;
  onCellEdit?: (rowId: string, columnId: string, value: unknown, row: TData) => void | Promise<void>;
  editingCell?: { rowId: string; columnId: string } | null;
  onEditingCellChange?: (cell: { rowId: string; columnId: string } | null) => void;
  editMode?: "click" | "doubleClick";
  validateCell?: (rowId: string, columnId: string, value: unknown) => boolean | string;
}

export interface VirtualizationConfig {
  enableVirtualization?: boolean;
  estimateSize?: number;
  overscan?: number;
}

export interface ExportConfig {
  enableExport?: boolean;
  exportFormats?: ("csv" | "json" | "xlsx")[];
  onExport?: (format: string, data: unknown[]) => void;
  exportFilename?: string;
}

export interface DataTableProps<TData> {
  data: TData[];
  columns: DataTableColumn<TData>[];

  // Core features
  pagination?: PaginationConfig;
  filter?: FilterConfig;
  sorting?: SortingConfig;
  selection?: SelectionConfig;
  columnVisibility?: ColumnVisibilityConfig;
  cellEdit?: CellEditConfig<TData>;

  // Advanced features
  expansion?: RowExpansionConfig<TData>;
  columnPinning?: ColumnPinningConfig;
  columnSizing?: ColumnSizingConfig;
  columnOrder?: ColumnOrderConfig;
  grouping?: GroupingConfig;
  virtualization?: VirtualizationConfig;
  exportConfig?: ExportConfig;

  // UI states
  isLoading?: boolean;
  isPending?: boolean;
  emptyMessage?: string;
  emptyIcon?: ReactNode;
  loadingMessage?: string;

  // Styling
  enableStriped?: boolean;
  enableHover?: boolean;
  stickyHeader?: boolean;
  stickyFooter?: boolean;
  maxHeight?: number | string;
  minHeight?: number | string;
  borderStyle?: "default" | "none" | "horizontal" | "vertical" | "all";
  density?: "compact" | "default" | "comfortable";

  className?: string;
  containerClassName?: string;
  headerClassName?: string;
  bodyClassName?: string;
  rowClassName?: string | ((row: TData, index: number) => string);
  cellClassName?: string | ((cell: Cell<TData, unknown>) => string);

  // Interactions
  onRowClick?: (row: TData, event: React.MouseEvent) => void;
  onRowDoubleClick?: (row: TData, event: React.MouseEvent) => void;
  onRowContextMenu?: (row: TData, event: React.MouseEvent) => void;
  onCellClick?: (cell: Cell<TData, unknown>, event: React.MouseEvent) => void;
  getRowId?: (row: TData, index: number) => string;
  getRowClassName?: (row: TData, index: number) => string;

  // Custom slots
  toolbar?: ReactNode;
  footer?: ReactNode;
  headerActions?: ReactNode;
  bulkActions?: (selectedRows: TData[]) => ReactNode;
  emptyState?: ReactNode;
  loadingState?: ReactNode;
}

export interface DataTableSkeletonProps {
  columns?: number;
  rows?: number;
  showPagination?: boolean;
  showSearch?: boolean;
  showToolbar?: boolean;
  density?: "compact" | "default" | "comfortable";
  className?: string;
}

export interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  globalFilter: string;
  onGlobalFilterChange: (value: string) => void;
  filterPlaceholder?: string;
  enableColumnVisibility?: boolean;
  enableExport?: boolean;
  exportFormats?: ("csv" | "json" | "xlsx")[];
  onExport?: (format: "csv" | "json" | "xlsx") => void;
  isPending?: boolean;
  toolbar?: ReactNode;
  headerActions?: ReactNode;
  selectedCount?: number;
  bulkActions?: ReactNode;
}

export interface DataTableHeaderProps<TData> {
  table: Table<TData>;
  stickyHeader?: boolean;
  enableColumnResizing?: boolean;
  enableColumnOrdering?: boolean;
  headerClassName?: string;
}

export interface DataTableHeaderCellProps<TData> {
  header: Header<TData, unknown>;
  enableColumnResizing?: boolean;
  enableColumnOrdering?: boolean;
}

export interface DataTableBodyProps<TData> {
  table: Table<TData>;
  columns: ColumnDef<TData>[];
  isLoading?: boolean;
  isPending?: boolean;
  emptyMessage?: string;
  emptyIcon?: ReactNode;
  emptyState?: ReactNode;
  loadingState?: ReactNode;
  enableStriped?: boolean;
  enableHover?: boolean;
  density?: "compact" | "default" | "comfortable";
  onRowClick?: (row: TData, event: React.MouseEvent) => void;
  onRowDoubleClick?: (row: TData, event: React.MouseEvent) => void;
  onRowContextMenu?: (row: TData, event: React.MouseEvent) => void;
  pageSize: number;
  cellEdit?: CellEditConfig<TData>;
  expansion?: RowExpansionConfig<TData>;
  rowClassName?: string | ((row: TData, index: number) => string);
  bodyClassName?: string;
  selection?: SelectionConfig;
}

export interface DataTableRowProps<TData> {
  row: Row<TData>;
  rowIndex: number;
  enableStriped?: boolean;
  enableHover?: boolean;
  density?: "compact" | "default" | "comfortable";
  onRowClick?: (row: TData, event: React.MouseEvent) => void;
  onRowDoubleClick?: (row: TData, event: React.MouseEvent) => void;
  onRowContextMenu?: (row: TData, event: React.MouseEvent) => void;
  isPending?: boolean;
  cellEdit?: CellEditConfig<TData>;
  expansion?: RowExpansionConfig<TData>;
  rowClassName?: string;
  selection?: SelectionConfig;
}

export interface DataTableCellProps<TData> {
  cell: Cell<TData, unknown>;
  cellEdit?: CellEditConfig<TData>;
  row: Row<TData>;
  density?: "compact" | "default" | "comfortable";
}

export interface DataTablePaginationProps<TData> {
  table: Table<TData>;
  pageSizeOptions: number[];
  totalRows: number;
  totalPages: number;
  enableRowSelection?: boolean;
  isPending?: boolean;
  showPageNumbers?: boolean;
  showFirstLast?: boolean;
  selectedCount?: number;
}

export interface DataTableContextValue<TData> {
  table: Table<TData>;
  isPending: boolean;
  density: "compact" | "default" | "comfortable";
}

export type DataTableRef<TData> = {
  table: Table<TData>;
  scrollToRow: (index: number) => void;
  scrollToTop: () => void;
  exportData: (format: "csv" | "json" | "xlsx") => void;
  resetFilters: () => void;
  resetSorting: () => void;
  resetSelection: () => void;
  selectAllRows: () => void;
  clearAllRows: () => void;
};

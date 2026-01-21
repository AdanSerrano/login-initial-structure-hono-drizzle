"use client";

import {
  memo,
  useMemo,
  useCallback,
  useRef,
  useDeferredValue,
  useTransition,
  forwardRef,
  useImperativeHandle,
} from "react";
import {
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getExpandedRowModel,
  useReactTable,
  type ColumnDef,
  type SortingState,
  type ColumnFiltersState,
  type VisibilityState,
  type PaginationState,
  type RowSelectionState,
  type ExpandedState,
  type ColumnPinningState,
  type ColumnSizingState,
  type ColumnOrderState,
  type Updater,
} from "@tanstack/react-table";
import { ChevronDown, ChevronRight } from "lucide-react";

import { cn } from "@/lib/utils";
import { Table } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";

import { DataTableToolbar } from "./components/data-table-toolbar";
import { DataTableHeader } from "./components/data-table-header";
import { DataTableBody } from "./components/data-table-body";
import { DataTablePagination } from "./components/data-table-pagination";
import { DEFAULT_PAGE_SIZE_OPTIONS } from "./utils";
import type { DataTableProps, DataTableColumnMeta, DataTableRef } from "./types";

interface TableState {
  sorting: SortingState;
  columnFilters: ColumnFiltersState;
  columnVisibility: VisibilityState;
  rowSelection: RowSelectionState;
  pagination: PaginationState;
  globalFilter: string;
  expanded: ExpandedState;
  columnPinning: ColumnPinningState;
  columnSizing: ColumnSizingState;
  columnOrder: ColumnOrderState;
}

function useTableState<TData>(props: DataTableProps<TData>): {
  state: TableState;
  stateRef: React.MutableRefObject<TableState>;
  handlers: {
    onSortingChange: (updater: Updater<SortingState>) => void;
    onColumnFiltersChange: (updater: Updater<ColumnFiltersState>) => void;
    onColumnVisibilityChange: (updater: Updater<VisibilityState>) => void;
    onRowSelectionChange: (updater: Updater<RowSelectionState>) => void;
    onPaginationChange: (updater: Updater<PaginationState>) => void;
    onGlobalFilterChange: (value: string) => void;
    onExpandedChange: (updater: Updater<ExpandedState>) => void;
    onColumnPinningChange: (updater: Updater<ColumnPinningState>) => void;
    onColumnSizingChange: (updater: Updater<ColumnSizingState>) => void;
    onColumnOrderChange: (updater: Updater<ColumnOrderState>) => void;
  };
  isPending: boolean;
} {
  const {
    pagination,
    filter,
    sorting: sortingConfig,
    selection,
    columnVisibility: columnVisibilityConfig,
    expansion,
    columnPinning: columnPinningConfig,
    columnSizing: columnSizingConfig,
    columnOrder: columnOrderConfig,
  } = props;
  const [isPending, startTransition] = useTransition();

  const stateRef = useRef<TableState>({
    sorting: sortingConfig?.sorting || [],
    columnFilters: filter?.columnFilters || [],
    columnVisibility: columnVisibilityConfig?.columnVisibility || {},
    rowSelection: selection?.rowSelection || {},
    pagination: {
      pageIndex: pagination?.pageIndex || 0,
      pageSize: pagination?.pageSize || 10,
    },
    globalFilter: filter?.globalFilter || "",
    expanded: expansion?.expanded || {},
    columnPinning: columnPinningConfig?.columnPinning || { left: [], right: [] },
    columnSizing: columnSizingConfig?.columnSizing || {},
    columnOrder: columnOrderConfig?.columnOrder || [],
  });

  const state: TableState = {
    sorting: sortingConfig?.sorting ?? stateRef.current.sorting,
    columnFilters: filter?.columnFilters ?? stateRef.current.columnFilters,
    columnVisibility: columnVisibilityConfig?.columnVisibility ?? stateRef.current.columnVisibility,
    rowSelection: selection?.rowSelection ?? stateRef.current.rowSelection,
    pagination: pagination?.manualPagination
      ? { pageIndex: pagination.pageIndex, pageSize: pagination.pageSize }
      : stateRef.current.pagination,
    globalFilter: filter?.globalFilter ?? stateRef.current.globalFilter,
    expanded: expansion?.expanded ?? stateRef.current.expanded,
    columnPinning: columnPinningConfig?.columnPinning ?? stateRef.current.columnPinning,
    columnSizing: columnSizingConfig?.columnSizing ?? stateRef.current.columnSizing,
    columnOrder: columnOrderConfig?.columnOrder ?? stateRef.current.columnOrder,
  };

  // Store all callbacks in refs to avoid re-creating handlers on each render
  const callbacksRef = useRef({
    onSortingChange: sortingConfig?.onSortingChange,
    onColumnFiltersChange: filter?.onColumnFiltersChange,
    onColumnVisibilityChange: columnVisibilityConfig?.onColumnVisibilityChange,
    onRowSelectionChange: selection?.onRowSelectionChange,
    onPaginationChange: pagination?.onPaginationChange,
    onGlobalFilterChange: filter?.onGlobalFilterChange,
    onExpandedChange: expansion?.onExpandedChange,
    onColumnPinningChange: columnPinningConfig?.onColumnPinningChange,
    onColumnSizingChange: columnSizingConfig?.onColumnSizingChange,
    onColumnOrderChange: columnOrderConfig?.onColumnOrderChange,
  });

  // Update refs on each render
  callbacksRef.current = {
    onSortingChange: sortingConfig?.onSortingChange,
    onColumnFiltersChange: filter?.onColumnFiltersChange,
    onColumnVisibilityChange: columnVisibilityConfig?.onColumnVisibilityChange,
    onRowSelectionChange: selection?.onRowSelectionChange,
    onPaginationChange: pagination?.onPaginationChange,
    onGlobalFilterChange: filter?.onGlobalFilterChange,
    onExpandedChange: expansion?.onExpandedChange,
    onColumnPinningChange: columnPinningConfig?.onColumnPinningChange,
    onColumnSizingChange: columnSizingConfig?.onColumnSizingChange,
    onColumnOrderChange: columnOrderConfig?.onColumnOrderChange,
  };

  const handleSortingChange = useCallback(
    (updater: Updater<SortingState>) => {
      const newValue = typeof updater === "function" ? updater(stateRef.current.sorting) : updater;
      stateRef.current.sorting = newValue;
      if (callbacksRef.current.onSortingChange) {
        startTransition(() => {
          callbacksRef.current.onSortingChange!(newValue);
        });
      }
    },
    []
  );

  const handleColumnFiltersChange = useCallback(
    (updater: Updater<ColumnFiltersState>) => {
      const newValue = typeof updater === "function" ? updater(stateRef.current.columnFilters) : updater;
      stateRef.current.columnFilters = newValue;
      if (callbacksRef.current.onColumnFiltersChange) {
        startTransition(() => {
          callbacksRef.current.onColumnFiltersChange!(newValue);
        });
      }
    },
    []
  );

  const handleColumnVisibilityChange = useCallback(
    (updater: Updater<VisibilityState>) => {
      const newValue = typeof updater === "function" ? updater(stateRef.current.columnVisibility) : updater;
      stateRef.current.columnVisibility = newValue;
      callbacksRef.current.onColumnVisibilityChange?.(newValue);
    },
    []
  );

  const handleRowSelectionChange = useCallback(
    (updater: Updater<RowSelectionState>) => {
      const newValue = typeof updater === "function" ? updater(stateRef.current.rowSelection) : updater;
      stateRef.current.rowSelection = newValue;
      callbacksRef.current.onRowSelectionChange?.(newValue);
    },
    []
  );

  const handlePaginationChange = useCallback(
    (updater: Updater<PaginationState>) => {
      const newValue = typeof updater === "function" ? updater(stateRef.current.pagination) : updater;
      stateRef.current.pagination = newValue;
      if (callbacksRef.current.onPaginationChange) {
        startTransition(() => {
          callbacksRef.current.onPaginationChange!(newValue);
        });
      }
    },
    []
  );

  const handleGlobalFilterChange = useCallback(
    (value: string) => {
      stateRef.current.globalFilter = value;
      if (callbacksRef.current.onGlobalFilterChange) {
        startTransition(() => {
          callbacksRef.current.onGlobalFilterChange!(value);
        });
      }
    },
    []
  );

  const handleExpandedChange = useCallback(
    (updater: Updater<ExpandedState>) => {
      const newValue = typeof updater === "function" ? updater(stateRef.current.expanded) : updater;
      stateRef.current.expanded = newValue;
      callbacksRef.current.onExpandedChange?.(newValue);
    },
    []
  );

  const handleColumnPinningChange = useCallback(
    (updater: Updater<ColumnPinningState>) => {
      const newValue = typeof updater === "function" ? updater(stateRef.current.columnPinning) : updater;
      stateRef.current.columnPinning = newValue;
      callbacksRef.current.onColumnPinningChange?.(newValue);
    },
    []
  );

  const handleColumnSizingChange = useCallback(
    (updater: Updater<ColumnSizingState>) => {
      const newValue = typeof updater === "function" ? updater(stateRef.current.columnSizing) : updater;
      stateRef.current.columnSizing = newValue;
      callbacksRef.current.onColumnSizingChange?.(newValue);
    },
    []
  );

  const handleColumnOrderChange = useCallback(
    (updater: Updater<ColumnOrderState>) => {
      const newValue = typeof updater === "function" ? updater(stateRef.current.columnOrder) : updater;
      stateRef.current.columnOrder = newValue;
      callbacksRef.current.onColumnOrderChange?.(newValue);
    },
    []
  );

  return {
    state,
    stateRef,
    handlers: {
      onSortingChange: handleSortingChange,
      onColumnFiltersChange: handleColumnFiltersChange,
      onColumnVisibilityChange: handleColumnVisibilityChange,
      onRowSelectionChange: handleRowSelectionChange,
      onPaginationChange: handlePaginationChange,
      onGlobalFilterChange: handleGlobalFilterChange,
      onExpandedChange: handleExpandedChange,
      onColumnPinningChange: handleColumnPinningChange,
      onColumnSizingChange: handleColumnSizingChange,
      onColumnOrderChange: handleColumnOrderChange,
    },
    isPending,
  };
}

function DynamicDataTableScaffoldInner<TData>(
  {
    data,
    columns,
    pagination,
    filter,
    sorting: sortingConfig,
    selection,
    columnVisibility: columnVisibilityConfig,
    expansion,
    columnPinning: columnPinningConfig,
    columnSizing: columnSizingConfig,
    columnOrder: columnOrderConfig,
    cellEdit,
    exportConfig,
    isLoading = false,
    isPending: externalIsPending = false,
    emptyMessage = "No hay datos disponibles",
    emptyIcon,
    emptyState,
    loadingState,
    enableStriped = false,
    enableHover = true,
    stickyHeader = false,
    maxHeight,
    minHeight,
    density = "default",
    borderStyle = "default",
    className,
    containerClassName,
    headerClassName,
    bodyClassName,
    rowClassName,
    onRowClick,
    onRowDoubleClick,
    onRowContextMenu,
    getRowId,
    toolbar,
    footer,
    headerActions,
    bulkActions,
  }: DataTableProps<TData>,
  ref: React.ForwardedRef<DataTableRef<TData>>
) {
  const tableContainerRef = useRef<HTMLDivElement>(null);

  const { state, handlers, isPending: internalIsPending } = useTableState({
    data,
    columns,
    pagination,
    filter,
    sorting: sortingConfig,
    selection,
    columnVisibility: columnVisibilityConfig,
    expansion,
    columnPinning: columnPinningConfig,
    columnSizing: columnSizingConfig,
    columnOrder: columnOrderConfig,
  });

  const isPending = externalIsPending || internalIsPending;

  const deferredData = useDeferredValue(data);
  const isDataStale = deferredData !== data;

  const expanderColumn: ColumnDef<TData> | null = useMemo(
    () =>
      expansion?.enableExpanding && expansion?.renderSubComponent
        ? {
            id: "expander",
            header: () => null,
            cell: ({ row }) => {
              // If getRowCanExpand is provided, use it; otherwise all rows can expand when renderSubComponent exists
              const canExpand = expansion.getRowCanExpand
                ? expansion.getRowCanExpand(row)
                : true;
              if (!canExpand) return null;
              return (
                <div className="flex items-center justify-center">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0 m-0"
                    onClick={(e) => {
                      e.stopPropagation();
                      row.toggleExpanded();
                    }}
                  >
                    {row.getIsExpanded() ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              );
            },
            enableSorting: false,
            enableHiding: false,
            meta: {
              width: 36,
              minWidth: 36,
              maxWidth: 36,
              pinned: "left",
              align: "center",
              headerClassName: "!px-1 !py-0",
              cellClassName: "!px-1 !py-0",
            } as DataTableColumnMeta,
          }
        : null,
    [expansion?.enableExpanding, expansion?.renderSubComponent, expansion?.getRowCanExpand]
  );

  const selectionMode = selection?.selectionMode ?? (selection?.enableMultiRowSelection === false ? "single" : "multiple");
  const showCheckbox = selection?.showCheckbox ?? (selectionMode === "multiple");

  const selectionColumn: ColumnDef<TData> | null = useMemo(
    () =>
      selection?.enableRowSelection
        ? {
            id: "select",
            header: ({ table }) =>
              showCheckbox && selectionMode === "multiple" ? (
                <div
                  className="flex items-center justify-center"
                  onClick={(e) => e.stopPropagation()}
                  onDoubleClick={(e) => e.stopPropagation()}
                  data-stop-propagation="true"
                >
                  <Checkbox
                    checked={
                      table.getIsAllPageRowsSelected() ||
                      (table.getIsSomePageRowsSelected() && "indeterminate")
                    }
                    onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                    aria-label="Seleccionar todo"
                  />
                </div>
              ) : null,
            cell: ({ row }) => {
              const isSelected = row.getIsSelected();
              if (!showCheckbox) return null;

              return (
                <div
                  className="flex items-center justify-center"
                  onClick={(e) => e.stopPropagation()}
                  onDoubleClick={(e) => e.stopPropagation()}
                  data-stop-propagation="true"
                >
                  {selectionMode === "multiple" ? (
                    <Checkbox
                      checked={isSelected}
                      onCheckedChange={(value) => {
                        const newValue = !!value;
                        if (newValue !== isSelected) {
                          row.toggleSelected(newValue);
                        }
                      }}
                      aria-label="Seleccionar fila"
                    />
                  ) : (
                    <div
                      className={cn(
                        "h-4 w-4 rounded-full border-2 transition-colors cursor-pointer bg-black  ",
                        isSelected
                          ? "border-primary bg-primary"
                          : "border-muted-foreground/50"
                      )}
                      onClick={() => {
                        if (!isSelected) {
                          row.toggleSelected(true);
                        }
                      }}
                    >
                      {isSelected && (
                        <div className="h-full w-full flex items-center justify-center">
                          <div className="h-1.5 w-1.5 rounded-full bg-primary-foreground" />
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            },
            enableSorting: false,
            enableHiding: false,
            meta: {
              width: 40,
              minWidth: 40,
              maxWidth: 40,
              pinned: "left",
              align: "center",
              headerClassName: "!px-2 !py-0",
              cellClassName: "!px-2 !py-0",
            } as DataTableColumnMeta,
          }
        : null,
    [selection?.enableRowSelection, showCheckbox, selectionMode]
  );

  const tableColumns = useMemo(() => {
    const cols: ColumnDef<TData>[] = [];
    // Selection column goes first (leftmost)
    if (selectionColumn) cols.push(selectionColumn);
    // Expander column goes after selection
    if (expanderColumn) cols.push(expanderColumn);
    cols.push(...(columns as ColumnDef<TData>[]));
    return cols;
  }, [columns, selectionColumn, expanderColumn]);

  const tableOptions = useMemo(
    () => {
      const isMultiSelection = selectionMode === "multiple";
      const enableMultiRowSelection = selection?.enableMultiRowSelection ?? isMultiSelection;

      return {
        enableRowSelection: selection?.enableRowSelection ?? false,
        enableMultiRowSelection,
        enableSubRowSelection: selection?.enableSubRowSelection ?? enableMultiRowSelection,
        enableSorting: sortingConfig?.enableSorting ?? true,
        enableMultiSort: sortingConfig?.enableMultiSort ?? false,
        maxMultiSortColCount: sortingConfig?.maxMultiSortColCount,
        manualSorting: sortingConfig?.manualSorting ?? false,
        manualPagination: pagination?.manualPagination ?? false,
        pageCount: pagination?.totalPages,
        globalFilterFn: filter?.globalFilterFn ?? ("includesString" as const),
        enableExpanding: expansion?.enableExpanding ?? false,
        enableColumnPinning: columnPinningConfig?.enableColumnPinning ?? false,
        enableColumnResizing: columnSizingConfig?.enableColumnResizing ?? false,
        columnResizeMode: columnSizingConfig?.columnResizeMode ?? "onChange",
        defaultColumn: {
          size: columnSizingConfig?.defaultColumnSize ?? 150,
          minSize: columnSizingConfig?.defaultColumnMinSize ?? 50,
          maxSize: columnSizingConfig?.defaultColumnMaxSize ?? 500,
        },
      };
    },
    [
      selectionMode,
      selection?.enableRowSelection,
      selection?.enableMultiRowSelection,
      selection?.enableSubRowSelection,
      sortingConfig?.enableSorting,
      sortingConfig?.enableMultiSort,
      sortingConfig?.maxMultiSortColCount,
      sortingConfig?.manualSorting,
      pagination?.manualPagination,
      pagination?.totalPages,
      filter?.globalFilterFn,
      expansion?.enableExpanding,
      columnPinningConfig?.enableColumnPinning,
      columnSizingConfig?.enableColumnResizing,
      columnSizingConfig?.columnResizeMode,
      columnSizingConfig?.defaultColumnSize,
      columnSizingConfig?.defaultColumnMinSize,
      columnSizingConfig?.defaultColumnMaxSize,
    ]
  );

  const table = useReactTable({
    data: deferredData,
    columns: tableColumns,
    state: {
      sorting: state.sorting,
      columnFilters: state.columnFilters,
      columnVisibility: state.columnVisibility,
      rowSelection: state.rowSelection,
      pagination: state.pagination,
      globalFilter: state.globalFilter,
      expanded: state.expanded,
      columnPinning: state.columnPinning,
      columnSizing: state.columnSizing,
      ...(state.columnOrder.length > 0 && { columnOrder: state.columnOrder }),
    },
    ...tableOptions,
    onSortingChange: handlers.onSortingChange,
    onColumnFiltersChange: handlers.onColumnFiltersChange,
    onColumnVisibilityChange: handlers.onColumnVisibilityChange,
    onRowSelectionChange: handlers.onRowSelectionChange,
    onPaginationChange: handlers.onPaginationChange,
    onGlobalFilterChange: handlers.onGlobalFilterChange,
    onExpandedChange: handlers.onExpandedChange,
    onColumnPinningChange: handlers.onColumnPinningChange,
    onColumnSizingChange: handlers.onColumnSizingChange,
    onColumnOrderChange: handlers.onColumnOrderChange,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: pagination?.manualPagination ? undefined : getPaginationRowModel(),
    getExpandedRowModel: expansion?.enableExpanding ? getExpandedRowModel() : undefined,
    getRowId,
    // When renderSubComponent exists but no getRowCanExpand is provided, all rows can expand
    getRowCanExpand: expansion?.getRowCanExpand ?? (expansion?.renderSubComponent ? () => true : undefined),
  });

  const exportData = useCallback(
    (format: "csv" | "json" | "xlsx") => {
      const rows = table.getFilteredRowModel().rows;
      const exportedData = rows.map((row) => row.original);

      if (exportConfig?.onExport) {
        exportConfig.onExport(format, exportedData);
        return;
      }

      if (format === "json") {
        const blob = new Blob([JSON.stringify(exportedData, null, 2)], {
          type: "application/json",
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${exportConfig?.exportFilename || "export"}.json`;
        a.click();
        URL.revokeObjectURL(url);
      } else if (format === "csv") {
        const headers = table
          .getAllColumns()
          .filter((col) => col.getCanHide())
          .map((col) => col.id);
        const csvContent = [
          headers.join(","),
          ...rows.map((row) =>
            headers.map((header) => {
              const value = row.getValue(header);
              return typeof value === "string" ? `"${value}"` : value;
            }).join(",")
          ),
        ].join("\n");
        const blob = new Blob([csvContent], { type: "text/csv" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${exportConfig?.exportFilename || "export"}.csv`;
        a.click();
        URL.revokeObjectURL(url);
      }
    },
    [table, exportConfig]
  );

  useImperativeHandle(
    ref,
    () => ({
      table,
      scrollToRow: (index: number) => {
        const container = tableContainerRef.current;
        if (container) {
          const rowHeight = density === "compact" ? 36 : density === "comfortable" ? 56 : 48;
          container.scrollTop = index * rowHeight;
        }
      },
      scrollToTop: () => {
        tableContainerRef.current?.scrollTo({ top: 0, behavior: "smooth" });
      },
      exportData,
      resetFilters: () => {
        table.resetColumnFilters();
        table.resetGlobalFilter();
      },
      resetSorting: () => {
        table.resetSorting();
      },
      resetSelection: () => {
        table.resetRowSelection();
      },
      selectAllRows: () => {
        table.toggleAllRowsSelected(true);
      },
      clearAllRows: () => {
        table.toggleAllRowsSelected(false);
      },
    }),
    [table, density, exportData]
  );

  const pageSizeOptions = useMemo(
    () => pagination?.pageSizeOptions || DEFAULT_PAGE_SIZE_OPTIONS,
    [pagination?.pageSizeOptions]
  );

  const totalRows = pagination?.totalRows ?? table.getFilteredRowModel().rows.length;
  const totalPages = pagination?.totalPages ?? table.getPageCount();
  const selectedCount = Object.keys(state.rowSelection).filter((k) => state.rowSelection[k]).length;

  const showToolbar = filter || columnVisibilityConfig?.enableColumnVisibility || toolbar || exportConfig?.enableExport;

  const containerStyle = useMemo(
    () => ({
      ...(maxHeight ? { maxHeight } : {}),
      ...(minHeight ? { minHeight } : {}),
      overflow: "auto" as const,
    }),
    [maxHeight, minHeight]
  );

  const densityClasses = {
    compact: "text-xs",
    default: "text-sm",
    comfortable: "text-base",
  };

  const borderClasses = {
    default: "border",
    none: "",
    horizontal: "border-y",
    vertical: "border-x",
    all: "border divide-x divide-y",
  };

  const selectedRows = useMemo(() => {
    if (!bulkActions || selectedCount === 0) return [];
    return table.getSelectedRowModel().rows.map((row) => row.original);
  }, [bulkActions, selectedCount, table]);

  return (
    <div className={cn("flex flex-col gap-4", densityClasses[density], containerClassName)}>
      {showToolbar && (
        <DataTableToolbar
          table={table}
          globalFilter={state.globalFilter}
          onGlobalFilterChange={handlers.onGlobalFilterChange}
          filterPlaceholder={filter?.filterPlaceholder}
          enableColumnVisibility={columnVisibilityConfig?.enableColumnVisibility}
          enableExport={exportConfig?.enableExport}
          exportFormats={exportConfig?.exportFormats}
          onExport={exportData}
          isPending={isPending || isDataStale}
          toolbar={toolbar}
          headerActions={headerActions}
          selectedCount={selectedCount}
          bulkActions={selectedCount > 0 && bulkActions ? bulkActions(selectedRows) : undefined}
        />
      )}

      <div
        ref={tableContainerRef}
        className={cn(
          "rounded-md overflow-hidden transition-opacity",
          borderClasses[borderStyle],
          (isPending || isDataStale) && "opacity-80",
          className
        )}
        style={containerStyle}
      >
        <Table>
          <DataTableHeader
            table={table}
            stickyHeader={stickyHeader}
            enableColumnResizing={columnSizingConfig?.enableColumnResizing}
            enableColumnOrdering={columnOrderConfig?.enableColumnOrdering}
            headerClassName={headerClassName}
          />
          <DataTableBody
            table={table}
            columns={tableColumns}
            isLoading={isLoading}
            isPending={isPending || isDataStale}
            emptyMessage={emptyMessage}
            emptyIcon={emptyIcon}
            emptyState={emptyState}
            loadingState={loadingState}
            enableStriped={enableStriped}
            enableHover={enableHover}
            density={density}
            onRowClick={onRowClick}
            onRowDoubleClick={onRowDoubleClick}
            onRowContextMenu={onRowContextMenu}
            pageSize={state.pagination.pageSize}
            cellEdit={cellEdit}
            expansion={expansion}
            rowClassName={rowClassName}
            bodyClassName={bodyClassName}
            selection={selection}
          />
        </Table>
      </div>

      {pagination && (
        <DataTablePagination
          table={table}
          pageSizeOptions={pageSizeOptions}
          totalRows={totalRows}
          totalPages={totalPages}
          enableRowSelection={!!selection?.enableRowSelection}
          isPending={isPending || isDataStale}
          showPageNumbers={pagination.showPageNumbers}
          showFirstLast={pagination.showFirstLast}
          selectedCount={selectedCount}
        />
      )}

      {footer}
    </div>
  );
}

const DynamicDataTableScaffoldWithRef = forwardRef(DynamicDataTableScaffoldInner) as <TData>(
  props: DataTableProps<TData> & { ref?: React.ForwardedRef<DataTableRef<TData>> }
) => React.ReactElement;

export const DynamicDataTableScaffold = memo(
  DynamicDataTableScaffoldWithRef
) as typeof DynamicDataTableScaffoldWithRef;

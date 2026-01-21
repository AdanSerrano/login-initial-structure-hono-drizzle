"use client";

import { forwardRef, useImperativeHandle, useRef, useMemo, useState, useCallback } from "react";
import { toast } from "sonner";

import { cn } from "@/lib/utils";
import { Table } from "@/components/ui/table";

import { CustomTableHeader } from "./components/table-header";
import { CustomTableBody } from "./components/table-body";
import { CustomTablePagination } from "./components/table-pagination";
import { CustomTableToolbar } from "./components/table-toolbar";
import { useDataTableState } from "./hooks/use-datatable-state";
import { useFullscreen } from "./hooks/use-fullscreen";
import { useCopyClipboard } from "./hooks/use-copy-clipboard";
import { usePrint } from "./hooks/use-print";
import type {
  CustomDataTableProps,
  CustomDataTableRef,
  DensityType,
  ExportFormat,
  ColumnVisibilityState,
} from "./types";

function CustomDataTableInner<TData>(
  props: CustomDataTableProps<TData>,
  ref: React.ForwardedRef<CustomDataTableRef<TData>>
) {
  const {
    data,
    columns,
    getRowId,
    selection,
    expansion,
    pagination,
    sorting,
    filter,
    columnVisibility,
    style,
    export: exportConfig,
    isLoading,
    isPending,
    emptyMessage,
    emptyIcon,
    onRowClick,
    onRowDoubleClick,
    onRowContextMenu,
    toolbar,
    toolbarConfig,
    headerActions,
    bulkActions,
    footer,
    className,
    containerClassName,
    headerClassName,
    bodyClassName,
    rowClassName,
    paginationClassName,
    toolbarClassName,
    copy: copyConfig,
    print: printConfig,
    fullscreen: fullscreenConfig,
  } = props;

  const tableRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Internal density state - toolbar changes this, initial value from style.density
  const [internalDensity, setInternalDensity] = useState<DensityType>(
    style?.density ?? "default"
  );

  // Use internal density (controlled by toolbar)
  const currentDensity = internalDensity;

  // Fullscreen hook
  const {
    isFullscreen,
    toggleFullscreen,
  } = useFullscreen({
    enabled: fullscreenConfig?.enabled ?? false,
    config: fullscreenConfig,
    containerRef: containerRef as React.RefObject<HTMLDivElement>,
  });

  const {
    toggleRowSelection,
    selectAllRows,
    clearSelection,
    isRowSelected,
    isAllSelected,
    isSomeSelected,
    selectedCount,
    getSelectedRows,
    toggleRowExpansion,
    expandAllRows,
    collapseAllRows,
    isRowExpanded,
    toggleSort,
    getSortDirection,
    goToPage,
    setPageSize,
    setGlobalFilter,
    processedData,
  } = useDataTableState(props);

  // Filter visible columns
  const visibleColumns = useMemo(() => {
    if (!columnVisibility?.enabled) return columns;
    return columns.filter((col) => {
      const isVisible = columnVisibility.columnVisibility[col.id];
      // If visibility is not set, default to visible (unless defaultHidden)
      if (isVisible === undefined) return !col.defaultHidden;
      return isVisible;
    });
  }, [columns, columnVisibility]);

  // Handle export
  const handleExport = useCallback(
    (format: ExportFormat) => {
      exportConfig?.onExport?.(format, processedData);
    },
    [exportConfig, processedData]
  );

  // Handle density change
  const handleDensityChange = useCallback((density: DensityType) => {
    setInternalDensity(density);
  }, []);

  // Handle refresh
  const handleRefresh = useCallback(() => {
    toolbarConfig?.onRefresh?.();
  }, [toolbarConfig]);

  // Copy hook
  const {
    copyAll,
    isCopyEnabled,
  } = useCopyClipboard({
    enabled: copyConfig?.enabled ?? false,
    config: copyConfig,
    data: processedData,
    columns: visibleColumns,
    selectedRows: selection?.selectedRows
      ? new Set(Object.keys(selection.selectedRows).filter((k) => selection.selectedRows[k]))
      : undefined,
    getRowId,
  });

  // Print hook
  const {
    printAll,
    isPrintEnabled,
  } = usePrint({
    enabled: printConfig?.enabled ?? false,
    config: printConfig,
    data: processedData,
    columns: visibleColumns,
    title: printConfig?.title,
    style,
  });

  // Handle copy
  const handleCopy = useCallback(async () => {
    const success = await copyAll();
    if (success) {
      toast.success("Datos copiados al portapapeles");
    } else {
      toast.error("Error al copiar datos");
    }
  }, [copyAll]);

  // Handle print
  const handlePrint = useCallback(() => {
    printAll();
  }, [printAll]);

  // Ref methods
  useImperativeHandle(
    ref,
    () => ({
      scrollToRow: (index: number) => {
        const row = tableRef.current?.querySelector(`[data-row-index="${index}"]`);
        row?.scrollIntoView({ behavior: "smooth", block: "center" });
      },
      scrollToTop: () => {
        tableRef.current?.scrollTo({ top: 0, behavior: "smooth" });
      },
      scrollToBottom: () => {
        if (tableRef.current) {
          tableRef.current.scrollTo({
            top: tableRef.current.scrollHeight,
            behavior: "smooth",
          });
        }
      },
      exportData: (format: ExportFormat) => {
        exportConfig?.onExport?.(format, processedData);
      },
      resetFilters: () => {
        setGlobalFilter("");
      },
      setGlobalFilter,
      resetSorting: () => {
        sorting?.onSortingChange?.([]);
      },
      setSorting: (newSorting) => {
        sorting?.onSortingChange?.(newSorting);
      },
      selectAll: selectAllRows,
      clearSelection,
      selectRows: (rowIds: string[]) => {
        const newSelection: Record<string, boolean> = {};
        rowIds.forEach((id) => {
          newSelection[id] = true;
        });
        selection?.onSelectionChange?.(newSelection);
      },
      toggleRowSelection,
      getSelectedRows,
      getSelectedRowIds: () => {
        return Object.keys(selection?.selectedRows ?? {}).filter(
          (id) => selection?.selectedRows[id]
        );
      },
      expandAll: expandAllRows,
      collapseAll: collapseAllRows,
      expandRows: (rowIds: string[]) => {
        const newExpansion: Record<string, boolean> = {};
        rowIds.forEach((id) => {
          newExpansion[id] = true;
        });
        expansion?.onExpansionChange?.(newExpansion);
      },
      toggleRowExpansion,
      setColumnVisibility: (visibility: ColumnVisibilityState) => {
        columnVisibility?.onColumnVisibilityChange?.(visibility);
      },
      toggleColumnVisibility: (columnId: string) => {
        if (!columnVisibility) return;
        const current = columnVisibility.columnVisibility[columnId] ?? true;
        columnVisibility.onColumnVisibilityChange?.({
          ...columnVisibility.columnVisibility,
          [columnId]: !current,
        });
      },
      showAllColumns: () => {
        const allVisible: ColumnVisibilityState = {};
        columns.forEach((col) => {
          allVisible[col.id] = true;
        });
        columnVisibility?.onColumnVisibilityChange?.(allVisible);
      },
      hideColumn: (columnId: string) => {
        columnVisibility?.onColumnVisibilityChange?.({
          ...columnVisibility.columnVisibility,
          [columnId]: false,
        });
      },
      getVisibleColumns: () => visibleColumns.map((col) => col.id),
      goToPage,
      goToFirstPage: () => goToPage(0),
      goToLastPage: () => goToPage((pagination?.totalPages ?? 1) - 1),
      nextPage: () => goToPage((pagination?.pageIndex ?? 0) + 1),
      previousPage: () => goToPage(Math.max(0, (pagination?.pageIndex ?? 0) - 1)),
      setPageSize,
      getVisibleData: () => processedData,
      getFilteredData: () => processedData,
      getAllData: () => data,
      getRowById: (id: string) => data.find((row) => getRowId(row) === id),
      focusTable: () => tableRef.current?.focus(),
      focusRow: (index: number) => {
        const row = tableRef.current?.querySelector(
          `[data-row-index="${index}"]`
        ) as HTMLElement;
        row?.focus();
      },
    }),
    [
      data,
      processedData,
      columns,
      visibleColumns,
      exportConfig,
      setGlobalFilter,
      sorting,
      selection,
      expansion,
      pagination,
      columnVisibility,
      selectAllRows,
      clearSelection,
      toggleRowSelection,
      expandAllRows,
      collapseAllRows,
      toggleRowExpansion,
      getSelectedRows,
      goToPage,
      setPageSize,
      getRowId,
    ]
  );

  // Calculate max height style
  const containerStyle = useMemo(() => {
    const styles: React.CSSProperties = {};
    if (style?.maxHeight) styles.maxHeight = style.maxHeight;
    if (style?.minHeight) styles.minHeight = style.minHeight;
    return styles;
  }, [style?.maxHeight, style?.minHeight]);

  // Get bulk actions content
  const bulkActionsContent = useMemo(() => {
    if (!bulkActions || selectedCount === 0) return null;
    return bulkActions(getSelectedRows());
  }, [bulkActions, selectedCount, getSelectedRows]);

  // Show expander column
  const showExpander = expansion?.enabled ?? false;

  // Determine if toolbar should show
  const showToolbar =
    toolbarConfig?.show !== false &&
    (filter ||
      exportConfig?.enabled ||
      headerActions ||
      toolbar ||
      toolbarConfig?.showColumnVisibility ||
      toolbarConfig?.showDensityToggle ||
      toolbarConfig?.showRefresh ||
      toolbarConfig?.showCopy ||
      toolbarConfig?.showPrint ||
      toolbarConfig?.showFullscreen);

  // Merge style with current density
  const effectiveStyle = useMemo(() => {
    return {
      ...style,
      density: currentDensity,
    };
  }, [style, currentDensity]);

  return (
    <div
      ref={containerRef}
      className={cn(
        "w-full",
        isFullscreen && "fixed inset-0 z-50 bg-background p-4 overflow-auto",
        className
      )}
    >
      {/* Toolbar */}
      {showToolbar && (
        <>
          {toolbar ?? (
            <CustomTableToolbar
              filter={filter}
              exportConfig={exportConfig}
              onExport={handleExport}
              columnVisibility={columnVisibility}
              columns={columns}
              selectedCount={selectedCount}
              totalRows={pagination?.totalRows ?? data.length}
              bulkActions={bulkActionsContent}
              headerActions={headerActions}
              onClearSelection={clearSelection}
              toolbarConfig={toolbarConfig}
              density={currentDensity}
              onDensityChange={handleDensityChange}
              onRefresh={toolbarConfig?.onRefresh ? handleRefresh : undefined}
              isRefreshing={isPending}
              onCopy={isCopyEnabled ? handleCopy : undefined}
              isCopyEnabled={isCopyEnabled}
              onPrint={isPrintEnabled ? handlePrint : undefined}
              isPrintEnabled={isPrintEnabled}
              isFullscreen={isFullscreen}
              onToggleFullscreen={fullscreenConfig?.enabled ? toggleFullscreen : undefined}
              isFullscreenEnabled={fullscreenConfig?.enabled ?? false}
              className={toolbarClassName}
            />
          )}
        </>
      )}

      {/* Table */}
      <div
        ref={tableRef}
        className={cn(
          "relative overflow-auto rounded-md border",
          containerClassName
        )}
        style={containerStyle}
        tabIndex={0}
      >
        <Table>
          <CustomTableHeader
            columns={visibleColumns}
            selection={selection}
            showExpander={showExpander}
            sorting={sorting?.sorting}
            onSort={toggleSort}
            getSortDirection={getSortDirection}
            isAllSelected={isAllSelected}
            isSomeSelected={isSomeSelected}
            onSelectAll={selectAllRows}
            onClearSelection={clearSelection}
            stickyHeader={style?.stickyHeader}
            className={headerClassName}
          />
          <CustomTableBody
            data={processedData}
            columns={visibleColumns}
            getRowId={getRowId}
            selection={selection}
            expansion={expansion}
            style={effectiveStyle}
            isLoading={isLoading}
            isPending={isPending}
            emptyMessage={emptyMessage}
            emptyIcon={emptyIcon}
            isRowSelected={isRowSelected}
            isRowExpanded={isRowExpanded}
            onToggleSelection={toggleRowSelection}
            onToggleExpansion={toggleRowExpansion}
            onRowClick={onRowClick}
            onRowDoubleClick={onRowDoubleClick}
            onRowContextMenu={onRowContextMenu}
            rowClassName={rowClassName}
            pageSize={pagination?.pageSize ?? 10}
            className={bodyClassName}
          />
        </Table>
      </div>

      {/* Pagination */}
      {pagination && (
        <CustomTablePagination
          pagination={pagination}
          selectedCount={selectedCount}
          totalRows={pagination.totalRows}
          className={paginationClassName}
        />
      )}

      {/* Footer */}
      {footer}
    </div>
  );
}

// Create a typed forwardRef component
export const CustomDataTable = forwardRef(CustomDataTableInner) as <TData>(
  props: CustomDataTableProps<TData> & { ref?: React.ForwardedRef<CustomDataTableRef<TData>> }
) => React.ReactElement;

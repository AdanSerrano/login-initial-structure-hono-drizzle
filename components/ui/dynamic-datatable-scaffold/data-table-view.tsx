"use client";

import type { Row } from "@tanstack/react-table";
import { DynamicDataTableScaffold } from "./dynamic-datatable-scaffold";
import type { DataTableScaffoldConfig } from "./config.types";

interface DataTableViewProps<TData> {
  config: DataTableScaffoldConfig<TData>;
  onRowClick?: (row: TData) => void;
  onRowDoubleClick?: (row: TData) => void;
}

export function DataTableView<TData>({
  config,
  onRowClick,
  onRowDoubleClick,
}: DataTableViewProps<TData>) {
  const {
    columns,
    data,
    pagination,
    sorting,
    selection,
    filter,
    expansion,
    export: exportConfig,
    style,
    isLoading,
    isPending,
    emptyMessage,
    emptyIcon,
    getRowId,
    toolbar,
    headerActions,
    bulkActions,
  } = config;

  return (
    <DynamicDataTableScaffold
      data={data}
      columns={columns}
      isLoading={isLoading}
      isPending={isPending}
      pagination={
        pagination
          ? {
              pageIndex: pagination.pageIndex,
              pageSize: pagination.pageSize,
              totalRows: pagination.totalRows,
              totalPages: pagination.totalPages,
              pageSizeOptions: pagination.pageSizeOptions,
              manualPagination: true,
              onPaginationChange: pagination.onPaginationChange,
              showPageNumbers: pagination.showPageNumbers,
              showFirstLast: pagination.showFirstLast,
            }
          : undefined
      }
      sorting={
        sorting
          ? {
              sorting: sorting.sorting,
              manualSorting: sorting.manualSorting ?? true,
              onSortingChange: sorting.onSortingChange,
            }
          : undefined
      }
      selection={
        selection?.enabled
          ? {
              enableRowSelection: true,
              selectionMode: selection.mode ?? "multiple",
              showCheckbox: selection.showCheckbox ?? true,
              selectOnRowClick: selection.selectOnRowClick ?? false,
              rowSelection: selection.rowSelection ?? {},
              onRowSelectionChange: selection.onRowSelectionChange,
              onRowSelect: selection.onRowSelect,
            }
          : undefined
      }
      filter={
        filter
          ? {
              globalFilter: filter.globalFilter,
              onGlobalFilterChange: filter.onGlobalFilterChange,
              filterPlaceholder: filter.placeholder,
            }
          : undefined
      }
      expansion={
        expansion?.enabled
          ? {
              enableExpanding: true,
              expandOnClick: expansion.expandOnClick ?? false,
              renderSubComponent: expansion.renderContent
                ? ({ row }: { row: Row<TData> }) => expansion.renderContent!(row.original)
                : undefined,
            }
          : undefined
      }
      exportConfig={
        exportConfig?.enabled
          ? {
              enableExport: true,
              exportFormats: exportConfig.formats,
              exportFilename: exportConfig.filename,
              onExport: exportConfig.onExport,
            }
          : undefined
      }
      columnSizing={{
        enableColumnResizing: true,
        columnResizeMode: "onChange",
        defaultColumnSize: 150,
        defaultColumnMinSize: 50,
        defaultColumnMaxSize: 500,
      }}
      enableStriped={style?.striped}
      enableHover={style?.hover}
      stickyHeader={style?.stickyHeader}
      density={style?.density}
      borderStyle={style?.borderStyle}
      maxHeight={style?.maxHeight}
      emptyMessage={emptyMessage}
      emptyIcon={emptyIcon}
      getRowId={getRowId as (row: TData, index: number) => string}
      toolbar={toolbar}
      headerActions={headerActions}
      bulkActions={bulkActions}
      onRowClick={onRowClick}
      onRowDoubleClick={onRowDoubleClick}
    />
  );
}

"use client";

import { memo, useCallback, useMemo } from "react";
import { flexRender, type Header as TanstackHeader } from "@tanstack/react-table";
import { ArrowUpDown, ArrowUp, ArrowDown, GripVertical } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { TableHeader, TableHead, TableRow } from "@/components/ui/table";

import { getColumnMeta, getAlignmentClass, getColumnStyle, getPinnedClass } from "../utils";
import type { DataTableHeaderProps, DataTableHeaderCellProps, DataTableColumnMeta } from "../types";

// Memoized resizer component
function ColumnResizerInner<TData>({
  header,
}: {
  header: TanstackHeader<TData, unknown>;
}) {
  const isResizing = header.column.getIsResizing();
  const resizeHandler = header.getResizeHandler();

  return (
    <div
      onMouseDown={resizeHandler}
      onTouchStart={resizeHandler}
      className={cn(
        "absolute right-0 top-0 h-full w-1 cursor-col-resize select-none touch-none",
        "hover:bg-primary/50 active:bg-primary",
        isResizing && "bg-primary"
      )}
    />
  );
}

const ColumnResizer = memo(ColumnResizerInner) as typeof ColumnResizerInner;

// Header cell - NOT memoized to ensure checkbox state updates correctly
function DataTableHeaderCellComponent<TData>({
  header,
  enableColumnResizing = false,
  enableColumnOrdering = false,
}: DataTableHeaderCellProps<TData>) {
  const meta = getColumnMeta(header.column) as DataTableColumnMeta;
  const canSort = header.column.getCanSort();
  const sortDirection = header.column.getIsSorted();
  const sortIndex = header.column.getSortIndex();

  const handleSort = useCallback(() => {
    header.column.toggleSorting();
  }, [header.column]);

  const colStyle = useMemo(
    () => ({
      ...getColumnStyle(meta),
      width: header.getSize(),
      position: "relative" as const,
    }),
    [meta, header]
  );

  const headClassName = useMemo(
    () =>
      cn(
        getAlignmentClass(meta.align),
        getPinnedClass(meta.pinned, true),
        meta.headerClassName
      ),
    [meta.align, meta.pinned, meta.headerClassName]
  );

  if (header.isPlaceholder) {
    return <TableHead className={headClassName} style={colStyle} />;
  }

  const headerContent = (
    <>
      {enableColumnOrdering && meta.draggable !== false && (
        <GripVertical className="h-4 w-4 text-muted-foreground/50 cursor-grab" />
      )}
      {flexRender(header.column.columnDef.header, header.getContext())}
      {canSort && (
        <span className="flex items-center">
          {sortDirection === "asc" ? (
            <ArrowUp className="h-4 w-4" />
          ) : sortDirection === "desc" ? (
            <ArrowDown className="h-4 w-4" />
          ) : (
            <ArrowUpDown className="h-4 w-4 opacity-50" />
          )}
          {sortIndex > -1 && (
            <span className="ml-0.5 text-xs text-muted-foreground">{sortIndex + 1}</span>
          )}
        </span>
      )}
    </>
  );

  const buttonClassName = useMemo(
    () =>
      cn(
        "-ml-3 h-8 gap-1",
        meta.align === "center" && "mx-auto",
        meta.align === "right" && "-mr-3 ml-auto"
      ),
    [meta.align]
  );

  if (canSort) {
    return (
      <TableHead className={headClassName} style={colStyle}>
        <Button
          variant="ghost"
          size="sm"
          className={buttonClassName}
          onClick={handleSort}
        >
          {headerContent}
        </Button>
        {enableColumnResizing && meta.resizable !== false && <ColumnResizer header={header} />}
      </TableHead>
    );
  }

  return (
    <TableHead className={headClassName} style={colStyle}>
      <div className="flex items-center gap-1">{headerContent}</div>
      {enableColumnResizing && meta.resizable !== false && <ColumnResizer header={header} />}
    </TableHead>
  );
}

// Main header component - NOT memoized to ensure selection state updates
function DataTableHeaderComponent<TData>({
  table,
  stickyHeader = false,
  enableColumnResizing = false,
  enableColumnOrdering = false,
  headerClassName,
}: DataTableHeaderProps<TData>) {
  const headerGroups = table.getHeaderGroups();

  const tableHeaderClassName = useMemo(
    () =>
      cn(
        stickyHeader && "sticky top-0 z-20 bg-background shadow-sm",
        headerClassName
      ),
    [stickyHeader, headerClassName]
  );

  return (
    <TableHeader className={tableHeaderClassName}>
      {headerGroups.map((headerGroup) => (
        <TableRow key={headerGroup.id} className="hover:bg-transparent">
          {headerGroup.headers.map((header) => (
            <DataTableHeaderCellComponent
              key={header.id}
              header={header}
              enableColumnResizing={enableColumnResizing}
              enableColumnOrdering={enableColumnOrdering}
            />
          ))}
        </TableRow>
      ))}
    </TableHeader>
  );
}

export function DataTableHeader<TData>(props: DataTableHeaderProps<TData>) {
  return <DataTableHeaderComponent {...props} />;
}

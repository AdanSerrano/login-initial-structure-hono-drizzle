"use client";

import { memo, useCallback, useRef, useTransition, Fragment, useMemo } from "react";
import { flexRender, type Row, type Cell } from "@tanstack/react-table";

import { cn } from "@/lib/utils";
import { TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";

import { getColumnMeta, getAlignmentClass, getColumnStyle, getPinnedClass } from "../utils";
import type {
  DataTableBodyProps,
  DataTableRowProps,
  DataTableCellProps,
  DataTableColumnMeta,
} from "../types";

const CLICK_DELAY_MS = 200;

const densityPadding = {
  compact: "py-1 px-2",
  default: "py-2 px-3",
  comfortable: "py-3 px-4",
} as const;

const densityHeight = {
  compact: "h-8",
  default: "h-12",
  comfortable: "h-16",
} as const;

// Memoized cell component - only re-renders when cell value or edit state changes
function DataTableCellInner<TData>({
  cell,
  cellEdit,
  row,
  density = "default",
}: DataTableCellProps<TData>) {
  const meta = getColumnMeta(cell.column) as DataTableColumnMeta;
  const inputRef = useRef<HTMLInputElement>(null);
  const [isPending, startTransition] = useTransition();

  const isEditing =
    cellEdit?.editingCell?.rowId === row.id &&
    cellEdit?.editingCell?.columnId === cell.column.id;

  const canEdit = cellEdit?.enableCellEdit && meta.editable;
  const editMode = cellEdit?.editMode ?? "doubleClick";

  const handleEdit = useCallback(() => {
    if (canEdit && cellEdit?.onEditingCellChange) {
      cellEdit.onEditingCellChange({ rowId: row.id, columnId: cell.column.id });
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  }, [canEdit, cellEdit, row.id, cell.column.id]);

  const handleBlur = useCallback(() => {
    if (cellEdit?.onEditingCellChange) {
      cellEdit.onEditingCellChange(null);
    }
  }, [cellEdit]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter" && cellEdit?.onCellEdit) {
        const value = (e.target as HTMLInputElement).value;

        if (cellEdit.validateCell) {
          const validation = cellEdit.validateCell(row.id, cell.column.id, value);
          if (validation !== true) {
            return;
          }
        }

        startTransition(() => {
          cellEdit.onCellEdit?.(row.id, cell.column.id, value, row.original);
        });
        cellEdit.onEditingCellChange?.(null);
      } else if (e.key === "Escape") {
        cellEdit?.onEditingCellChange?.(null);
      }
    },
    [cellEdit, row.id, cell.column.id, row.original]
  );

  const cellStyle = useMemo(() => getColumnStyle(meta), [meta]);

  const cellClassName = useMemo(
    () =>
      cn(
        densityPadding[density],
        getAlignmentClass(meta.align),
        getPinnedClass(meta.pinned),
        meta.cellClassName,
        canEdit && "cursor-pointer hover:bg-muted/50",
        isPending && "opacity-50"
      ),
    [density, meta.align, meta.pinned, meta.cellClassName, canEdit, isPending]
  );

  return (
    <TableCell
      className={cellClassName}
      style={cellStyle}
      onClick={editMode === "click" ? handleEdit : undefined}
      onDoubleClick={editMode === "doubleClick" ? handleEdit : undefined}
    >
      {isEditing ? (
        <Input
          ref={inputRef}
          defaultValue={cell.getValue() as string}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          className="h-7 w-full"
          autoFocus
        />
      ) : (
        flexRender(cell.column.columnDef.cell, cell.getContext())
      )}
    </TableCell>
  );
}

const DataTableCellComponent = memo(DataTableCellInner) as typeof DataTableCellInner;

// Row component - intentionally NOT memoized with custom comparison
// TanStack Table manages row identity and React handles reconciliation efficiently
function DataTableRowComponent<TData>({
  row,
  rowIndex,
  enableStriped = false,
  enableHover = true,
  density = "default",
  onRowClick,
  onRowDoubleClick,
  onRowContextMenu,
  isPending = false,
  cellEdit,
  expansion,
  rowClassName,
  selection,
}: DataTableRowProps<TData>) {
  const clickTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const clickCountRef = useRef(0);

  const selectionMode = selection?.selectionMode ?? (selection?.enableMultiRowSelection === false ? "single" : "multiple");
  const selectOnRowClick = selection?.selectOnRowClick ?? false;

  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      const target = e.target as HTMLElement;
      const isInteractiveElement =
        target.closest("button") ||
        target.closest("[role='checkbox']") ||
        target.closest("[role='menuitem']") ||
        target.closest("[data-radix-collection-item]") ||
        target.closest("input") ||
        target.closest("a") ||
        target.closest("[data-stop-propagation]");

      if (isInteractiveElement) {
        return;
      }

      clickCountRef.current += 1;

      if (clickCountRef.current === 1) {
        clickTimeoutRef.current = setTimeout(() => {
          if (clickCountRef.current === 1) {
            if (expansion?.expandOnClick && row.getCanExpand()) {
              row.toggleExpanded();
            }

            if (selectOnRowClick && selection?.enableRowSelection) {
              if (selectionMode === "single") {
                row.toggleSelected(true);
              } else {
                row.toggleSelected();
              }
              selection?.onRowSelect?.(row.original);
            }

            onRowClick?.(row.original, e);
          }
          clickCountRef.current = 0;
        }, CLICK_DELAY_MS);
      } else if (clickCountRef.current === 2) {
        if (clickTimeoutRef.current) {
          clearTimeout(clickTimeoutRef.current);
          clickTimeoutRef.current = null;
        }
        clickCountRef.current = 0;
        onRowDoubleClick?.(row.original, e);
      }
    },
    [onRowClick, onRowDoubleClick, row, expansion?.expandOnClick, selectOnRowClick, selection, selectionMode]
  );

  const handleContextMenu = useCallback(
    (e: React.MouseEvent) => {
      const target = e.target as HTMLElement;
      const isInteractiveElement =
        target.closest("button") ||
        target.closest("[role='checkbox']") ||
        target.closest("[role='menuitem']") ||
        target.closest("[data-radix-collection-item]") ||
        target.closest("input") ||
        target.closest("a") ||
        target.closest("[data-stop-propagation]");

      if (isInteractiveElement) {
        return;
      }

      if (onRowContextMenu) {
        e.preventDefault();
        onRowContextMenu(row.original, e);
      }
    },
    [onRowContextMenu, row.original]
  );

  const visibleCells = row.getVisibleCells();
  const isExpanded = row.getIsExpanded();
  const isSelected = row.getIsSelected();

  const hasRowInteraction = !!(onRowClick || onRowDoubleClick || expansion?.expandOnClick || selectOnRowClick);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        if (expansion?.expandOnClick && row.getCanExpand()) {
          row.toggleExpanded();
        }

        if (selectOnRowClick && selection?.enableRowSelection) {
          if (selectionMode === "single") {
            row.toggleSelected(true);
          } else {
            row.toggleSelected();
          }
          selection?.onRowSelect?.(row.original);
        }

        onRowClick?.(row.original, e as unknown as React.MouseEvent);
      }
    },
    [row, expansion?.expandOnClick, onRowClick, selectOnRowClick, selection, selectionMode]
  );

  const rowClassNameComputed = useMemo(
    () =>
      cn(
        densityHeight[density],
        hasRowInteraction && "cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-inset",
        enableHover && "hover:bg-muted/50",
        enableStriped && rowIndex % 2 === 1 && "bg-muted/30",
        isPending && "opacity-60 pointer-events-none",
        isSelected && "bg-primary/5",
        rowClassName
      ),
    [density, hasRowInteraction, enableHover, enableStriped, rowIndex, isPending, isSelected, rowClassName]
  );

  return (
    <Fragment>
      <TableRow
        data-state={isSelected && "selected"}
        data-row-index={rowIndex}
        tabIndex={hasRowInteraction ? 0 : undefined}
        role={hasRowInteraction ? "button" : undefined}
        aria-expanded={expansion?.enableExpanding ? isExpanded : undefined}
        aria-selected={isSelected}
        className={rowClassNameComputed}
        onClick={hasRowInteraction ? handleClick : undefined}
        onKeyDown={hasRowInteraction ? handleKeyDown : undefined}
        onContextMenu={onRowContextMenu ? handleContextMenu : undefined}
      >
        {visibleCells.map((cell) => (
          <DataTableCellComponent
            key={cell.id}
            cell={cell}
            row={row}
            cellEdit={cellEdit}
            density={density}
          />
        ))}
      </TableRow>

      {isExpanded && expansion?.renderSubComponent && (
        <TableRow className="bg-muted/20">
          <TableCell colSpan={visibleCells.length} className="p-0">
            <div className="px-4 py-3">{expansion.renderSubComponent({ row })}</div>
          </TableCell>
        </TableRow>
      )}
    </Fragment>
  );
}

// Memoized skeleton rows - static content, rarely changes
const SkeletonRows = memo(function SkeletonRows({
  pageSize,
  columnsCount,
  density = "default",
}: {
  pageSize: number;
  columnsCount: number;
  density?: "compact" | "default" | "comfortable";
}) {
  const skeletonHeight = density === "compact" ? "h-3" : density === "comfortable" ? "h-5" : "h-4";

  const skeletonRows = useMemo(
    () =>
      Array.from({ length: pageSize }).map((_, index) => (
        <TableRow key={`skeleton-${index}`} className={densityHeight[density]}>
          {Array.from({ length: columnsCount }).map((_, colIndex) => (
            <TableCell key={`skeleton-${index}-${colIndex}`} className={densityPadding[density]}>
              <Skeleton className={cn(skeletonHeight, "w-full")} />
            </TableCell>
          ))}
        </TableRow>
      )),
    [pageSize, columnsCount, density, skeletonHeight]
  );

  return <>{skeletonRows}</>;
});

// Memoized empty row - static content
const EmptyRow = memo(function EmptyRow({
  columnsCount,
  emptyMessage,
  emptyIcon,
  emptyState,
}: {
  columnsCount: number;
  emptyMessage: string;
  emptyIcon?: React.ReactNode;
  emptyState?: React.ReactNode;
}) {
  if (emptyState) {
    return (
      <TableRow>
        <TableCell colSpan={columnsCount} className="h-48">
          {emptyState}
        </TableCell>
      </TableRow>
    );
  }

  return (
    <TableRow>
      <TableCell colSpan={columnsCount} className="h-32 text-center">
        <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground">
          {emptyIcon}
          <span>{emptyMessage}</span>
        </div>
      </TableCell>
    </TableRow>
  );
});

// Memoized loading overlay - static content
const LoadingOverlay = memo(function LoadingOverlay({
  columnsCount,
  loadingState,
}: {
  columnsCount: number;
  loadingState?: React.ReactNode;
}) {
  if (loadingState) {
    return (
      <TableRow>
        <TableCell colSpan={columnsCount} className="h-48">
          {loadingState}
        </TableCell>
      </TableRow>
    );
  }

  return null;
});

function DataTableBodyComponent<TData>({
  table,
  columns,
  isLoading = false,
  isPending = false,
  emptyMessage = "No hay datos disponibles",
  emptyIcon,
  emptyState,
  loadingState,
  enableStriped = false,
  enableHover = true,
  density = "default",
  onRowClick,
  onRowDoubleClick,
  onRowContextMenu,
  pageSize,
  cellEdit,
  expansion,
  rowClassName,
  bodyClassName,
  selection,
}: DataTableBodyProps<TData>) {
  const rows = table.getRowModel().rows;
  const hasRows = rows && rows.length > 0;

  const getRowClassNameValue = useCallback(
    (row: TData, index: number): string | undefined => {
      if (!rowClassName) return undefined;
      if (typeof rowClassName === "function") {
        return rowClassName(row, index);
      }
      return rowClassName;
    },
    [rowClassName]
  );

  // Memoize stable props that don't change often
  const stableRowProps = useMemo(
    () => ({
      enableStriped,
      enableHover,
      density,
      onRowClick,
      onRowDoubleClick,
      onRowContextMenu,
      cellEdit,
      expansion,
      selection,
    }),
    [enableStriped, enableHover, density, onRowClick, onRowDoubleClick, onRowContextMenu, cellEdit, expansion, selection]
  );

  return (
    <TableBody className={bodyClassName}>
      {isLoading ? (
        loadingState ? (
          <LoadingOverlay columnsCount={columns.length} loadingState={loadingState} />
        ) : (
          <SkeletonRows pageSize={pageSize} columnsCount={columns.length} density={density} />
        )
      ) : hasRows ? (
        rows.map((row, rowIndex) => (
          <DataTableRowComponent
            key={row.id}
            row={row}
            rowIndex={rowIndex}
            isPending={isPending}
            rowClassName={getRowClassNameValue(row.original, rowIndex)}
            {...stableRowProps}
          />
        ))
      ) : (
        <EmptyRow
          columnsCount={columns.length}
          emptyMessage={emptyMessage}
          emptyIcon={emptyIcon}
          emptyState={emptyState}
        />
      )}
    </TableBody>
  );
}

export const DataTableBody = memo(DataTableBodyComponent) as typeof DataTableBodyComponent;

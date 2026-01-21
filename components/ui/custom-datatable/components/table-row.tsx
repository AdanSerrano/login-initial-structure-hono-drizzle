"use client";

import { memo, useCallback, useRef, Fragment } from "react";
import { ChevronRight, ChevronDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { TableCell, TableRow } from "@/components/ui/table";

import type { CustomColumnDef, SelectionConfig, ExpansionConfig, StyleConfig } from "../types";

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

interface TableRowProps<TData> {
  row: TData;
  rowId: string;
  rowIndex: number;
  columns: CustomColumnDef<TData>[];
  selection?: SelectionConfig<TData>;
  expansion?: ExpansionConfig<TData>;
  style?: StyleConfig;
  isSelected: boolean;
  isExpanded: boolean;
  onToggleSelection: (rowId: string) => void;
  onToggleExpansion: (rowId: string) => void;
  onRowClick?: (row: TData, event: React.MouseEvent) => void;
  onRowDoubleClick?: (row: TData, event: React.MouseEvent) => void;
  onRowContextMenu?: (row: TData, event: React.MouseEvent) => void;
  isPending?: boolean;
  rowClassName?: string;
}

function TableRowInner<TData>({
  row,
  rowId,
  rowIndex,
  columns,
  selection,
  expansion,
  style,
  isSelected,
  isExpanded,
  onToggleSelection,
  onToggleExpansion,
  onRowClick,
  onRowDoubleClick,
  onRowContextMenu,
  isPending,
  rowClassName,
}: TableRowProps<TData>) {
  const clickTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const clickCountRef = useRef(0);

  const density = style?.density ?? "default";
  const enableHover = style?.hover ?? true;
  const enableStriped = style?.striped ?? false;

  const canExpand = expansion?.enabled
    ? expansion.canExpand
      ? expansion.canExpand(row)
      : true
    : false;

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

      if (isInteractiveElement) return;

      clickCountRef.current += 1;

      if (clickCountRef.current === 1) {
        clickTimeoutRef.current = setTimeout(() => {
          if (clickCountRef.current === 1) {
            // Single click
            if (expansion?.expandOnClick && canExpand) {
              onToggleExpansion(rowId);
            }

            if (selection?.selectOnRowClick && selection.enabled) {
              onToggleSelection(rowId);
              selection.onRowSelect?.(row);
            }

            onRowClick?.(row, e);
          }
          clickCountRef.current = 0;
        }, CLICK_DELAY_MS);
      } else if (clickCountRef.current === 2) {
        // Double click
        if (clickTimeoutRef.current) {
          clearTimeout(clickTimeoutRef.current);
          clickTimeoutRef.current = null;
        }
        clickCountRef.current = 0;
        onRowDoubleClick?.(row, e);
      }
    },
    [
      row,
      rowId,
      canExpand,
      expansion?.expandOnClick,
      selection?.selectOnRowClick,
      selection?.enabled,
      selection?.onRowSelect,
      onToggleExpansion,
      onToggleSelection,
      onRowClick,
      onRowDoubleClick,
    ]
  );

  const handleContextMenu = useCallback(
    (e: React.MouseEvent) => {
      if (onRowContextMenu) {
        e.preventDefault();
        onRowContextMenu(row, e);
      }
    },
    [row, onRowContextMenu]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        if (expansion?.expandOnClick && canExpand) {
          onToggleExpansion(rowId);
        }
        if (selection?.selectOnRowClick && selection.enabled) {
          onToggleSelection(rowId);
        }
      }
    },
    [
      rowId,
      canExpand,
      expansion?.expandOnClick,
      selection?.selectOnRowClick,
      selection?.enabled,
      onToggleExpansion,
      onToggleSelection,
    ]
  );

  const hasRowInteraction = !!(
    onRowClick ||
    onRowDoubleClick ||
    expansion?.expandOnClick ||
    selection?.selectOnRowClick
  );

  return (
    <Fragment>
      <TableRow
        data-state={isSelected && "selected"}
        data-row-index={rowIndex}
        tabIndex={hasRowInteraction ? 0 : undefined}
        role={hasRowInteraction ? "button" : undefined}
        aria-expanded={expansion?.enabled ? isExpanded : undefined}
        aria-selected={isSelected}
        className={cn(
          densityHeight[density],
          hasRowInteraction &&
            "cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-inset",
          enableHover && "hover:bg-muted/50",
          enableStriped && rowIndex % 2 === 1 && "bg-muted/30",
          isPending && "opacity-60 pointer-events-none",
          isSelected && "bg-primary/5",
          rowClassName
        )}
        onClick={hasRowInteraction ? handleClick : undefined}
        onKeyDown={hasRowInteraction ? handleKeyDown : undefined}
        onContextMenu={onRowContextMenu ? handleContextMenu : undefined}
      >
        {/* Selection cell */}
        {selection?.enabled && selection.showCheckbox && (
          <TableCell
            className="!px-2 !py-0 sticky left-0 z-10 bg-background"
            style={{ width: 40, minWidth: 40, maxWidth: 40 }}
          >
            <div
              className="flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}
              data-stop-propagation="true"
            >
              {selection.mode === "multiple" ? (
                <Checkbox
                  checked={isSelected}
                  onCheckedChange={() => onToggleSelection(rowId)}
                  aria-label="Seleccionar fila"
                />
              ) : (
                <div
                  className={cn(
                    "h-4 w-4 rounded-full border-2 transition-colors cursor-pointer",
                    isSelected
                      ? "border-primary bg-primary"
                      : "border-muted-foreground/50"
                  )}
                  onClick={() => onToggleSelection(rowId)}
                >
                  {isSelected && (
                    <div className="h-full w-full flex items-center justify-center">
                      <div className="h-1.5 w-1.5 rounded-full bg-primary-foreground" />
                    </div>
                  )}
                </div>
              )}
            </div>
          </TableCell>
        )}

        {/* Expander cell */}
        {expansion?.enabled && (
          <TableCell
            className={cn(
              "!px-1 !py-0 sticky z-10 bg-background",
              selection?.enabled && selection.showCheckbox ? "left-10" : "left-0"
            )}
            style={{ width: 36, minWidth: 36, maxWidth: 36 }}
          >
            {canExpand && (
              <div className="flex items-center justify-center">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0"
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleExpansion(rowId);
                  }}
                >
                  {isExpanded ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </Button>
              </div>
            )}
          </TableCell>
        )}

        {/* Data cells */}
        {columns.map((column) => {
          const cellStyle: React.CSSProperties = {};
          if (column.width) {
            cellStyle.width =
              typeof column.width === "number" ? `${column.width}px` : column.width;
          }
          if (column.minWidth) cellStyle.minWidth = `${column.minWidth}px`;
          if (column.maxWidth) cellStyle.maxWidth = `${column.maxWidth}px`;

          const alignClass =
            column.align === "center"
              ? "text-center"
              : column.align === "right"
              ? "text-right"
              : "text-left";

          const pinnedClass = column.pinned
            ? cn(
                "sticky z-10 bg-background",
                column.pinned === "left"
                  ? "left-0 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]"
                  : "right-0 shadow-[-2px_0_5px_-2px_rgba(0,0,0,0.1)]"
              )
            : "";

          return (
            <TableCell
              key={column.id}
              className={cn(
                densityPadding[density],
                alignClass,
                pinnedClass,
                column.cellClassName
              )}
              style={cellStyle}
            >
              {column.cell({
                row,
                rowIndex,
                isSelected,
                isExpanded,
              })}
            </TableCell>
          );
        })}
      </TableRow>

      {/* Expanded content */}
      {isExpanded && expansion?.renderContent && (
        <TableRow className="bg-muted/20">
          <TableCell
            colSpan={
              columns.length +
              (selection?.enabled && selection.showCheckbox ? 1 : 0) +
              (expansion?.enabled ? 1 : 0)
            }
            className="p-0"
          >
            <div className="px-4 py-3">{expansion.renderContent(row)}</div>
          </TableCell>
        </TableRow>
      )}
    </Fragment>
  );
}

// Custom comparison for memo - only re-render when these values change
function arePropsEqual<TData>(
  prevProps: TableRowProps<TData>,
  nextProps: TableRowProps<TData>
): boolean {
  return (
    prevProps.rowId === nextProps.rowId &&
    prevProps.rowIndex === nextProps.rowIndex &&
    prevProps.isSelected === nextProps.isSelected &&
    prevProps.isExpanded === nextProps.isExpanded &&
    prevProps.isPending === nextProps.isPending &&
    prevProps.rowClassName === nextProps.rowClassName &&
    prevProps.row === nextProps.row &&
    prevProps.style?.density === nextProps.style?.density &&
    prevProps.style?.striped === nextProps.style?.striped &&
    prevProps.style?.hover === nextProps.style?.hover &&
    // Selection config - needed for click handlers
    prevProps.selection?.enabled === nextProps.selection?.enabled &&
    prevProps.selection?.mode === nextProps.selection?.mode &&
    prevProps.selection?.selectOnRowClick === nextProps.selection?.selectOnRowClick &&
    prevProps.selection?.showCheckbox === nextProps.selection?.showCheckbox &&
    // Expansion config - needed for click handlers
    prevProps.expansion?.enabled === nextProps.expansion?.enabled &&
    prevProps.expansion?.expandOnClick === nextProps.expansion?.expandOnClick &&
    // Callbacks - compare by reference (should be stable)
    prevProps.onToggleSelection === nextProps.onToggleSelection &&
    prevProps.onToggleExpansion === nextProps.onToggleExpansion &&
    prevProps.onRowClick === nextProps.onRowClick &&
    prevProps.onRowDoubleClick === nextProps.onRowDoubleClick
  );
}

export const CustomTableRow = memo(TableRowInner, arePropsEqual) as typeof TableRowInner;

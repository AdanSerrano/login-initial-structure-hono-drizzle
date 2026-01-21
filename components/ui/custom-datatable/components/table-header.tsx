"use client";

import { memo, useCallback } from "react";
import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { TableHeader, TableHead, TableRow } from "@/components/ui/table";

import type { CustomColumnDef, SelectionConfig, SortingState } from "../types";

interface TableHeaderProps<TData> {
  columns: CustomColumnDef<TData>[];
  selection?: SelectionConfig<TData>;
  showExpander?: boolean;
  sorting?: SortingState[];
  onSort?: (columnId: string) => void;
  getSortDirection?: (columnId: string) => "asc" | "desc" | false;
  isAllSelected?: boolean;
  isSomeSelected?: boolean;
  onSelectAll?: () => void;
  onClearSelection?: () => void;
  stickyHeader?: boolean;
  className?: string;
}

function TableHeaderInner<TData>({
  columns,
  selection,
  showExpander,
  onSort,
  getSortDirection,
  isAllSelected,
  isSomeSelected,
  onSelectAll,
  onClearSelection,
  stickyHeader,
  className,
}: TableHeaderProps<TData>) {
  const handleSelectAll = useCallback(() => {
    if (isAllSelected) {
      onClearSelection?.();
    } else {
      onSelectAll?.();
    }
  }, [isAllSelected, onSelectAll, onClearSelection]);

  return (
    <TableHeader
      className={cn(
        stickyHeader && "sticky top-0 z-20 bg-background shadow-sm",
        className
      )}
    >
      <TableRow className="hover:bg-transparent">
        {/* Selection column */}
        {selection?.enabled && selection.showCheckbox && (
          <TableHead
            className="!px-2 !py-0 w-10 sticky left-0 z-10 bg-background"
            style={{ width: 40, minWidth: 40, maxWidth: 40 }}
          >
            {selection.mode === "multiple" && (
              <div
                className="flex items-center justify-center"
                onClick={(e) => e.stopPropagation()}
              >
                <Checkbox
                  checked={isAllSelected || (isSomeSelected && "indeterminate")}
                  onCheckedChange={handleSelectAll}
                  aria-label="Seleccionar todo"
                />
              </div>
            )}
          </TableHead>
        )}

        {/* Expander column */}
        {showExpander && (
          <TableHead
            className={cn(
              "!px-1 !py-0 w-9 sticky z-10 bg-background",
              selection?.enabled && selection.showCheckbox ? "left-10" : "left-0"
            )}
            style={{ width: 36, minWidth: 36, maxWidth: 36 }}
          />
        )}

        {/* Data columns */}
        {columns.map((column) => {
          const sortDirection = getSortDirection?.(column.id);
          const canSort = column.enableSorting !== false;

          const style: React.CSSProperties = {};
          if (column.width) {
            style.width = typeof column.width === "number" ? `${column.width}px` : column.width;
          }
          if (column.minWidth) style.minWidth = `${column.minWidth}px`;
          if (column.maxWidth) style.maxWidth = `${column.maxWidth}px`;

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

          const headerContent =
            typeof column.header === "function"
              ? column.header({ sortDirection })
              : column.header;

          return (
            <TableHead
              key={column.id}
              className={cn(alignClass, pinnedClass, column.headerClassName)}
              style={style}
            >
              {canSort ? (
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn(
                    "-ml-3 h-8 gap-1",
                    column.align === "center" && "mx-auto",
                    column.align === "right" && "-mr-3 ml-auto"
                  )}
                  onClick={() => onSort?.(column.id)}
                >
                  {headerContent}
                  <span className="flex items-center">
                    {sortDirection === "asc" ? (
                      <ArrowUp className="h-4 w-4" />
                    ) : sortDirection === "desc" ? (
                      <ArrowDown className="h-4 w-4" />
                    ) : (
                      <ArrowUpDown className="h-4 w-4 opacity-50" />
                    )}
                  </span>
                </Button>
              ) : (
                <div className="flex items-center gap-1">{headerContent}</div>
              )}
            </TableHead>
          );
        })}
      </TableRow>
    </TableHeader>
  );
}

export const CustomTableHeader = memo(TableHeaderInner) as typeof TableHeaderInner;

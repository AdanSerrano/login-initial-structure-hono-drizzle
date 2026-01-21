"use client";

import { memo, useMemo } from "react";

import { cn } from "@/lib/utils";
import { TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";

import { CustomTableRow } from "./table-row";
import type {
  CustomColumnDef,
  SelectionConfig,
  ExpansionConfig,
  StyleConfig,
} from "../types";

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

interface TableBodyProps<TData> {
  data: TData[];
  columns: CustomColumnDef<TData>[];
  getRowId: (row: TData) => string;
  selection?: SelectionConfig<TData>;
  expansion?: ExpansionConfig<TData>;
  style?: StyleConfig;
  isLoading?: boolean;
  isPending?: boolean;
  emptyMessage?: string;
  emptyIcon?: React.ReactNode;
  isRowSelected: (rowId: string) => boolean;
  isRowExpanded: (rowId: string) => boolean;
  onToggleSelection: (rowId: string) => void;
  onToggleExpansion: (rowId: string) => void;
  onRowClick?: (row: TData, event: React.MouseEvent) => void;
  onRowDoubleClick?: (row: TData, event: React.MouseEvent) => void;
  onRowContextMenu?: (row: TData, event: React.MouseEvent) => void;
  rowClassName?: string | ((row: TData, index: number) => string);
  pageSize?: number;
  className?: string;
}

const SkeletonRows = memo(function SkeletonRows({
  pageSize,
  columnsCount,
  hasSelection,
  hasExpander,
  density = "default",
}: {
  pageSize: number;
  columnsCount: number;
  hasSelection: boolean;
  hasExpander: boolean;
  density?: "compact" | "default" | "comfortable";
}) {
  const skeletonHeight = density === "compact" ? "h-3" : density === "comfortable" ? "h-5" : "h-4";
  const totalColumns = columnsCount + (hasSelection ? 1 : 0) + (hasExpander ? 1 : 0);

  const skeletonRows = useMemo(
    () =>
      Array.from({ length: pageSize }).map((_, index) => (
        <TableRow key={`skeleton-${index}`} className={densityHeight[density]}>
          {hasSelection && (
            <TableCell className="!px-2 !py-0" style={{ width: 40 }}>
              <Skeleton className="h-4 w-4 mx-auto" />
            </TableCell>
          )}
          {hasExpander && (
            <TableCell className="!px-1 !py-0" style={{ width: 36 }}>
              <Skeleton className="h-4 w-4 mx-auto" />
            </TableCell>
          )}
          {Array.from({ length: columnsCount }).map((_, colIndex) => (
            <TableCell key={`skeleton-${index}-${colIndex}`} className={densityPadding[density]}>
              <Skeleton className={cn(skeletonHeight, "w-full")} />
            </TableCell>
          ))}
        </TableRow>
      )),
    [pageSize, columnsCount, hasSelection, hasExpander, density, skeletonHeight]
  );

  return <>{skeletonRows}</>;
});

const EmptyRow = memo(function EmptyRow({
  columnsCount,
  emptyMessage,
  emptyIcon,
}: {
  columnsCount: number;
  emptyMessage: string;
  emptyIcon?: React.ReactNode;
}) {
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

function TableBodyInner<TData>({
  data,
  columns,
  getRowId,
  selection,
  expansion,
  style,
  isLoading,
  isPending,
  emptyMessage = "No hay datos disponibles",
  emptyIcon,
  isRowSelected,
  isRowExpanded,
  onToggleSelection,
  onToggleExpansion,
  onRowClick,
  onRowDoubleClick,
  onRowContextMenu,
  rowClassName,
  pageSize = 10,
  className,
}: TableBodyProps<TData>) {
  const density = style?.density ?? "default";
  const hasRows = data && data.length > 0;
  const hasSelection = selection?.enabled && selection.showCheckbox;
  const hasExpander = expansion?.enabled;
  const totalColumns =
    columns.length + (hasSelection ? 1 : 0) + (hasExpander ? 1 : 0);

  const getRowClassNameValue = (row: TData, index: number): string | undefined => {
    if (!rowClassName) return undefined;
    if (typeof rowClassName === "function") {
      return rowClassName(row, index);
    }
    return rowClassName;
  };

  return (
    <TableBody className={className}>
      {isLoading ? (
        <SkeletonRows
          pageSize={pageSize}
          columnsCount={columns.length}
          hasSelection={!!hasSelection}
          hasExpander={!!hasExpander}
          density={density}
        />
      ) : hasRows ? (
        data.map((row, rowIndex) => {
          const rowId = getRowId(row);
          return (
            <CustomTableRow
              key={rowId}
              row={row}
              rowId={rowId}
              rowIndex={rowIndex}
              columns={columns}
              selection={selection}
              expansion={expansion}
              style={style}
              isSelected={isRowSelected(rowId)}
              isExpanded={isRowExpanded(rowId)}
              onToggleSelection={onToggleSelection}
              onToggleExpansion={onToggleExpansion}
              onRowClick={onRowClick}
              onRowDoubleClick={onRowDoubleClick}
              onRowContextMenu={onRowContextMenu}
              isPending={isPending}
              rowClassName={getRowClassNameValue(row, rowIndex)}
            />
          );
        })
      ) : (
        <EmptyRow
          columnsCount={totalColumns}
          emptyMessage={emptyMessage}
          emptyIcon={emptyIcon}
        />
      )}
    </TableBody>
  );
}

export const CustomTableBody = memo(TableBodyInner) as typeof TableBodyInner;

"use client";

import { memo, useMemo, type ReactNode } from "react";
import {
  DynamicDataTableScaffold,
  DynamicDataTableSkeleton,
  type DataTableProps as BaseDataTableProps,
  type DataTableColumn,
} from "@/components/ui/dynamic-datatable-scaffold";
import { cn } from "@/lib/utils";

export interface DataTableProps<TData> extends Omit<BaseDataTableProps<TData>, "className" | "containerClassName"> {
  variant?: "default" | "compact" | "comfortable";
  showBorder?: boolean;
  rounded?: "none" | "sm" | "md" | "lg";
  shadow?: "none" | "sm" | "md" | "lg";
  headerStyle?: "default" | "muted" | "primary";
}

const variantStyles = {
  default: "",
  compact: "[&_td]:py-1.5 [&_th]:py-2 text-sm",
  comfortable: "[&_td]:py-4 [&_th]:py-3",
};

const roundedStyles = {
  none: "rounded-none",
  sm: "rounded-sm",
  md: "rounded-md",
  lg: "rounded-lg",
};

const shadowStyles = {
  none: "",
  sm: "shadow-sm",
  md: "shadow-md",
  lg: "shadow-lg",
};

const headerStyles = {
  default: "",
  muted: "[&_thead]:bg-muted/50",
  primary: "[&_thead]:bg-primary/5",
};

function DataTableComponent<TData>({
  variant = "default",
  showBorder = true,
  rounded = "md",
  shadow = "sm",
  headerStyle = "muted",
  ...props
}: DataTableProps<TData>) {
  const tableClassName = useMemo(
    () =>
      cn(
        "transition-all duration-200",
        variantStyles[variant],
        roundedStyles[rounded],
        shadowStyles[shadow],
        headerStyles[headerStyle],
        !showBorder && "border-0"
      ),
    [variant, rounded, shadow, headerStyle, showBorder]
  );

  const containerClassName = useMemo(
    () => cn("space-y-4"),
    []
  );

  return (
    <DynamicDataTableScaffold
      {...props}
      className={tableClassName}
      containerClassName={containerClassName}
      enableStriped={props.enableStriped ?? true}
      stickyHeader={props.stickyHeader ?? true}
    />
  );
}

export const DataTable = memo(DataTableComponent) as typeof DataTableComponent;

export interface DataTableSkeletonProps {
  columns?: number;
  rows?: number;
  showPagination?: boolean;
  showSearch?: boolean;
  variant?: "default" | "compact" | "comfortable";
}

export function DataTableSkeletonWrapper({
  columns = 5,
  rows = 10,
  showPagination = true,
  showSearch = true,
}: DataTableSkeletonProps) {
  return (
    <DynamicDataTableSkeleton
      columns={columns}
      rows={rows}
      showPagination={showPagination}
      showSearch={showSearch}
    />
  );
}

export type { DataTableColumn };

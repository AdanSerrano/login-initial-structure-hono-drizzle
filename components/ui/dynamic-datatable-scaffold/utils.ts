import type { CSSProperties } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { cn } from "@/lib/utils";
import type { DataTableColumnMeta } from "./types";

export function getColumnMeta<TData>(column: { columnDef: ColumnDef<TData> }): DataTableColumnMeta {
  return (column.columnDef.meta as DataTableColumnMeta) || {};
}

export function getAlignmentClass(align?: "left" | "center" | "right"): string {
  switch (align) {
    case "center":
      return "text-center";
    case "right":
      return "text-right";
    default:
      return "text-left";
  }
}

export function getColumnStyle(meta: DataTableColumnMeta): CSSProperties {
  const style: CSSProperties = {};

  if (meta.width) {
    style.width = typeof meta.width === "number" ? `${meta.width}px` : meta.width;
  }
  if (meta.minWidth) {
    style.minWidth = `${meta.minWidth}px`;
  }
  if (meta.maxWidth) {
    style.maxWidth = `${meta.maxWidth}px`;
  }

  return style;
}

export function getPinnedClass(pinned?: "left" | "right" | false, isHeader?: boolean): string {
  if (!pinned) return "";

  const baseClass = "sticky z-10 bg-background";
  const shadowClass =
    pinned === "left"
      ? "shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]"
      : "shadow-[-2px_0_5px_-2px_rgba(0,0,0,0.1)]";
  const positionClass = pinned === "left" ? "left-0" : "right-0";
  const headerZIndex = isHeader ? "z-20" : "";

  return cn(baseClass, shadowClass, positionClass, headerZIndex);
}

export const DEFAULT_PAGE_SIZE_OPTIONS = [10, 20, 30, 50, 100];

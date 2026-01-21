"use client";

import { memo, useRef, useDeferredValue, useCallback } from "react";
import { Search, X, Columns3, Download, FileJson, FileSpreadsheet, FileText } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";

import type { DataTableToolbarProps } from "../types";

const exportIcons = {
  csv: FileText,
  json: FileJson,
  xlsx: FileSpreadsheet,
};

function DataTableToolbarComponent<TData>({
  table,
  globalFilter,
  onGlobalFilterChange,
  filterPlaceholder = "Buscar...",
  enableColumnVisibility = false,
  enableExport = false,
  exportFormats = ["csv", "json"],
  onExport,
  isPending = false,
  toolbar,
  headerActions,
  selectedCount = 0,
  bulkActions,
}: DataTableToolbarProps<TData>) {
  const inputRef = useRef<HTMLInputElement>(null);
  const deferredFilter = useDeferredValue(globalFilter);
  const isStale = deferredFilter !== globalFilter;

  const handleClear = useCallback(() => {
    onGlobalFilterChange("");
    inputRef.current?.focus();
  }, [onGlobalFilterChange]);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onGlobalFilterChange(e.target.value);
    },
    [onGlobalFilterChange]
  );

  const handleExport = useCallback(
    (format: "csv" | "json" | "xlsx") => {
      onExport?.(format);
    },
    [onExport]
  );

  const allColumns = table.getAllColumns().filter((column) => column.getCanHide());

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 items-center gap-2">
          <div className="relative w-full sm:max-w-xs">
            <Search
              className={cn(
                "absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground transition-opacity",
                (isPending || isStale) && "opacity-50"
              )}
            />
            <Input
              ref={inputRef}
              placeholder={filterPlaceholder}
              value={globalFilter}
              onChange={handleChange}
              className={cn(
                "pl-9 pr-9 transition-opacity",
                (isPending || isStale) && "opacity-70"
              )}
            />
            {globalFilter && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-1 top-1/2 h-6 w-6 -translate-y-1/2"
                onClick={handleClear}
              >
                <X className="h-3 w-3" />
                <span className="sr-only">Limpiar búsqueda</span>
              </Button>
            )}
          </div>
          {toolbar}
        </div>

        <div className="flex items-center gap-2">
          {headerActions}

          {enableExport && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                  <Download className="h-4 w-4" />
                  <span className="hidden sm:inline">Exportar</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuLabel>Formato de exportación</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {exportFormats.map((format) => {
                  const Icon = exportIcons[format];
                  return (
                    <DropdownMenuItem
                      key={format}
                      onClick={() => handleExport(format)}
                      className="gap-2"
                    >
                      <Icon className="h-4 w-4" />
                      <span className="uppercase">{format}</span>
                    </DropdownMenuItem>
                  );
                })}
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          {enableColumnVisibility && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                  <Columns3 className="h-4 w-4" />
                  <span className="hidden sm:inline">Columnas</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 max-h-[300px] overflow-auto">
                <DropdownMenuLabel>Columnas visibles</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {allColumns.map((column) => (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) => column.toggleVisibility(!!value)}
                  >
                    {typeof column.columnDef.header === "string"
                      ? column.columnDef.header
                      : column.id}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>

      {selectedCount > 0 && bulkActions && (
        <div className="flex items-center gap-3 rounded-md border bg-muted/50 px-4 py-2">
          <Badge variant="secondary" className="font-mono">
            {selectedCount} seleccionado{selectedCount > 1 ? "s" : ""}
          </Badge>
          <div className="h-4 w-px bg-border" />
          <div className="flex items-center gap-2">{bulkActions}</div>
        </div>
      )}
    </div>
  );
}

export const DataTableToolbar = memo(DataTableToolbarComponent) as typeof DataTableToolbarComponent;

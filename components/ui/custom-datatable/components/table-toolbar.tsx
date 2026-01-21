"use client";

import { memo, useCallback, useState, useEffect, useRef, useMemo } from "react";
import {
  Search,
  X,
  Download,
  Columns3,
  RefreshCw,
  FileText,
  FileJson,
  FileSpreadsheet,
  SlidersHorizontal,
  Rows3,
  Rows2,
  Square,
  Copy,
  Printer,
  Maximize,
  Minimize,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import type {
  FilterConfig,
  ExportConfig,
  ColumnVisibilityConfig,
  ToolbarConfig,
  CustomColumnDef,
  DensityType,
  ExportFormat,
} from "../types";

const exportIcons: Record<ExportFormat, React.ElementType> = {
  csv: FileText,
  json: FileJson,
  xlsx: FileSpreadsheet,
};

const densityIcons: Record<DensityType, React.ElementType> = {
  compact: Rows2,
  default: Rows3,
  comfortable: Square,
};

const densityLabels: Record<DensityType, string> = {
  compact: "Compacta",
  default: "Normal",
  comfortable: "Amplia",
};

interface TableToolbarProps<TData> {
  // Filter
  filter?: FilterConfig;

  // Export
  exportConfig?: ExportConfig<TData>;
  onExport?: (format: ExportFormat) => void;

  // Column visibility
  columnVisibility?: ColumnVisibilityConfig;
  columns?: CustomColumnDef<TData>[];

  // Selection
  selectedCount?: number;
  totalRows?: number;
  bulkActions?: React.ReactNode;
  onClearSelection?: () => void;

  // Custom actions
  headerActions?: React.ReactNode;

  // Toolbar config
  toolbarConfig?: ToolbarConfig;

  // Density
  density?: DensityType;
  onDensityChange?: (density: DensityType) => void;

  // Refresh
  onRefresh?: () => void;
  isRefreshing?: boolean;

  // Copy
  onCopy?: () => void;
  isCopyEnabled?: boolean;

  // Print
  onPrint?: () => void;
  isPrintEnabled?: boolean;

  // Fullscreen
  isFullscreen?: boolean;
  onToggleFullscreen?: () => void;
  isFullscreenEnabled?: boolean;

  // Classes
  className?: string;
}

function TableToolbarInner<TData>({
  filter,
  exportConfig,
  onExport,
  columnVisibility,
  columns = [],
  selectedCount = 0,
  totalRows = 0,
  bulkActions,
  onClearSelection,
  headerActions,
  toolbarConfig,
  density = "default",
  onDensityChange,
  onRefresh,
  isRefreshing = false,
  onCopy,
  isCopyEnabled = false,
  onPrint,
  isPrintEnabled = false,
  isFullscreen = false,
  onToggleFullscreen,
  isFullscreenEnabled = false,
  className,
}: TableToolbarProps<TData>) {
  const [localFilter, setLocalFilter] = useState(filter?.globalFilter ?? "");
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Sync with external filter value
  useEffect(() => {
    setLocalFilter(filter?.globalFilter ?? "");
  }, [filter?.globalFilter]);

  // Debounced filter change
  const handleFilterChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setLocalFilter(value);

      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }

      const debounceMs = filter?.debounceMs ?? 300;
      debounceRef.current = setTimeout(() => {
        filter?.onGlobalFilterChange?.(value);
      }, debounceMs);
    },
    [filter]
  );

  const handleClearFilter = useCallback(() => {
    setLocalFilter("");
    filter?.onGlobalFilterChange?.("");
    inputRef.current?.focus();
  }, [filter]);

  const handleExport = useCallback(
    (format: ExportFormat) => {
      onExport?.(format);
      exportConfig?.onExport?.(format, []);
    },
    [onExport, exportConfig]
  );

  const handleColumnVisibilityChange = useCallback(
    (columnId: string, visible: boolean) => {
      if (!columnVisibility) return;
      const newVisibility = {
        ...columnVisibility.columnVisibility,
        [columnId]: visible,
      };
      columnVisibility.onColumnVisibilityChange(newVisibility);
    },
    [columnVisibility]
  );

  const handleDensityChange = useCallback(
    (newDensity: DensityType) => {
      onDensityChange?.(newDensity);
    },
    [onDensityChange]
  );

  // Filter hideable columns
  const hideableColumns = useMemo(
    () => columns.filter((col) => col.enableHiding !== false),
    [columns]
  );

  const hasSelection = selectedCount > 0;
  const showSearch = toolbarConfig?.showSearch ?? true;
  const showExport = toolbarConfig?.showExport ?? exportConfig?.enabled ?? false;
  const showColumnVisibility = toolbarConfig?.showColumnVisibility ?? columnVisibility?.enabled ?? false;
  const showDensityToggle = toolbarConfig?.showDensityToggle ?? false;
  const showRefresh = toolbarConfig?.showRefresh ?? false;
  const showCopy = toolbarConfig?.showCopy ?? isCopyEnabled;
  const showPrint = toolbarConfig?.showPrint ?? isPrintEnabled;
  const showFullscreen = toolbarConfig?.showFullscreen ?? isFullscreenEnabled;

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);

  return (
    <div className={cn("flex flex-col gap-4 py-4", className)}>
      {/* Main toolbar row */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Left side: Search and custom start */}
        <div className="flex flex-1 items-center gap-2">
          {toolbarConfig?.customStart}

          {filter && showSearch && (
            <div className="relative w-full sm:max-w-xs">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                ref={inputRef}
                placeholder={filter.placeholder ?? "Buscar..."}
                value={localFilter}
                onChange={handleFilterChange}
                className="pl-9 pr-9"
              />
              {localFilter && (filter.showClearButton ?? true) && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-1 top-1/2 h-6 w-6 -translate-y-1/2"
                  onClick={handleClearFilter}
                >
                  <X className="h-3 w-3" />
                  <span className="sr-only">Limpiar búsqueda</span>
                </Button>
              )}
            </div>
          )}
        </div>

        {/* Right side: Actions */}
        <div className="flex items-center gap-2">
          {headerActions}

          {/* Fullscreen toggle */}
          {showFullscreen && onToggleFullscreen && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={onToggleFullscreen}
                    className="h-9 w-9"
                  >
                    {isFullscreen ? (
                      <Minimize className="h-4 w-4" />
                    ) : (
                      <Maximize className="h-4 w-4" />
                    )}
                    <span className="sr-only">
                      {isFullscreen ? "Salir de pantalla completa" : "Pantalla completa"}
                    </span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  {isFullscreen ? "Salir de pantalla completa" : "Pantalla completa"}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}

          {/* Copy button */}
          {showCopy && onCopy && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={onCopy}
                    className="h-9 w-9"
                  >
                    <Copy className="h-4 w-4" />
                    <span className="sr-only">Copiar datos</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Copiar datos al portapapeles</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}

          {/* Print button */}
          {showPrint && onPrint && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={onPrint}
                    className="h-9 w-9"
                  >
                    <Printer className="h-4 w-4" />
                    <span className="sr-only">Imprimir</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Imprimir tabla</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}

          {/* Refresh button */}
          {showRefresh && onRefresh && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={onRefresh}
                    disabled={isRefreshing}
                    className="h-9 w-9"
                  >
                    <RefreshCw className={cn("h-4 w-4", isRefreshing && "animate-spin")} />
                    <span className="sr-only">Actualizar</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Actualizar datos</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}

          {/* Density toggle */}
          {showDensityToggle && onDensityChange && (
            <DropdownMenu>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="icon" className="h-9 w-9">
                        <SlidersHorizontal className="h-4 w-4" />
                        <span className="sr-only">Densidad</span>
                      </Button>
                    </DropdownMenuTrigger>
                  </TooltipTrigger>
                  <TooltipContent>Densidad de filas</TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <DropdownMenuContent align="end" className="w-40">
                <DropdownMenuLabel>Densidad</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {(["compact", "default", "comfortable"] as DensityType[]).map((d) => {
                  const Icon = densityIcons[d];
                  return (
                    <DropdownMenuItem
                      key={d}
                      onClick={() => handleDensityChange(d)}
                      className={cn("gap-2", density === d && "bg-accent")}
                    >
                      <Icon className="h-4 w-4" />
                      {densityLabels[d]}
                    </DropdownMenuItem>
                  );
                })}
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          {/* Column visibility */}
          {showColumnVisibility && hideableColumns.length > 0 && (
            <DropdownMenu>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm" className="gap-2">
                        <Columns3 className="h-4 w-4" />
                        <span className="hidden sm:inline">Columnas</span>
                      </Button>
                    </DropdownMenuTrigger>
                  </TooltipTrigger>
                  <TooltipContent>Mostrar/ocultar columnas</TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <DropdownMenuContent align="end" className="w-48 max-h-[300px] overflow-auto">
                <DropdownMenuLabel>Columnas visibles</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {hideableColumns.map((column) => {
                  const isVisible = columnVisibility?.columnVisibility[column.id] !== false;
                  const isAlwaysVisible = columnVisibility?.alwaysVisibleColumns?.includes(column.id);

                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={isVisible}
                      disabled={isAlwaysVisible}
                      onCheckedChange={(checked) =>
                        handleColumnVisibilityChange(column.id, checked)
                      }
                    >
                      {typeof column.header === "string" ? column.header : column.id}
                    </DropdownMenuCheckboxItem>
                  );
                })}
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          {/* Export */}
          {showExport && (
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
                {(exportConfig?.formats ?? ["csv", "json", "xlsx"]).map((format) => {
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

          {toolbarConfig?.customEnd}
        </div>
      </div>

      {/* Bulk actions row */}
      {hasSelection && bulkActions && (
        <div className="flex items-center gap-3 rounded-md border bg-muted/50 px-4 py-2">
          <Badge variant="secondary" className="font-mono">
            {selectedCount} seleccionado{selectedCount > 1 ? "s" : ""}
          </Badge>
          <div className="h-4 w-px bg-border" />
          <div className="flex items-center gap-2">{bulkActions}</div>
          <div className="flex-1" />
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearSelection}
            className="text-muted-foreground"
          >
            Limpiar selección
          </Button>
        </div>
      )}
    </div>
  );
}

export const CustomTableToolbar = memo(TableToolbarInner) as typeof TableToolbarInner;

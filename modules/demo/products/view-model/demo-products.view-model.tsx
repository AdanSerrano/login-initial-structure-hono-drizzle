"use client";

import { useCallback, useMemo, useRef } from "react";
import { Trash2, Package, Plus } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import type {
  CustomColumnDef,
  SelectionConfig,
  ExpansionConfig,
  PaginationConfig,
  SortingConfig,
  FilterConfig,
  ColumnVisibilityConfig,
  ToolbarConfig,
  ExportConfig,
  ExportFormat,
  StyleConfig,
  CopyConfig,
  PrintConfig,
  FullscreenConfig,
} from "@/components/ui/custom-datatable";

import { useDemoProducts } from "../hooks/demo-products.hook";
import { createDemoProductsColumns } from "../components/columns/demo-products.columns";
import { DemoProductsFilters } from "../components/filters/demo-products-filters";
import type { DemoProduct, ProductStatus } from "../types/demo-products.types";

// Función estable fuera del componente
const getRowId = (row: DemoProduct) => row.id;

// Configuraciones estáticas fuera del componente
const STYLE_CONFIG: StyleConfig = {
  striped: true,
  hover: true,
  stickyHeader: true,
  density: "default",
  borderStyle: "default",
  maxHeight: 600,
};

const COPY_CONFIG: CopyConfig = {
  enabled: true,
  format: "csv",
  includeHeaders: true,
  onCopy: () => {
    toast.success("Datos copiados al portapapeles");
  },
};

const PRINT_CONFIG: PrintConfig = {
  enabled: true,
  title: "Catálogo de Productos",
  showLogo: false,
  pageSize: "A4",
  orientation: "landscape",
};

const FULLSCREEN_CONFIG: FullscreenConfig = {
  enabled: true,
  onFullscreenChange: (isFullscreen) => {
    if (isFullscreen) {
      toast.info("Modo pantalla completa activado", {
        description: "Presiona Escape para salir",
        duration: 2000,
      });
    }
  },
};

const PAGE_SIZE_OPTIONS = [5, 10, 20, 50, 100];
const EXPORT_FORMATS: ExportFormat[] = ["csv", "json", "xlsx"];
const ALWAYS_VISIBLE_COLUMNS = ["name", "actions"];

export interface DemoProductsDataTableConfig {
  data: DemoProduct[];
  columns: CustomColumnDef<DemoProduct>[];
  getRowId: (row: DemoProduct) => string;
  selection: SelectionConfig<DemoProduct>;
  expansion: ExpansionConfig<DemoProduct>;
  pagination: PaginationConfig;
  sorting: SortingConfig;
  filter: FilterConfig;
  columnVisibility: ColumnVisibilityConfig;
  toolbarConfig: ToolbarConfig;
  exportConfig: ExportConfig<DemoProduct>;
  copyConfig: CopyConfig;
  printConfig: PrintConfig;
  fullscreenConfig: FullscreenConfig;
  style: StyleConfig;
  isLoading: boolean;
  isPending: boolean;
  emptyMessage: string;
  emptyIcon: React.ReactNode;
  headerActions: React.ReactNode;
  bulkActions: (selectedRows: DemoProduct[]) => React.ReactNode;
}

export function useDemoProductsViewModel() {
  const {
    products,
    stats,
    isLoading,
    isPending,
    isInitialized,
    filters,
    rowSelection,
    expanded,
    sorting,
    columnVisibility,
    pagination,
    activeDialog,
    selectedProduct,
    fetchProducts,
    fetchStats,
    handleRefresh,
    deleteProduct,
    bulkDeleteProducts,
    changeStatus,
    handleFiltersChange,
    handleSearchChange,
    handleRowSelectionChange,
    handleExpandedChange,
    handleSortingChange,
    handleColumnVisibilityChange,
    handlePaginationChange,
    openDialog,
    closeDialog,
    getSelectedProducts,
    clearSelection,
  } = useDemoProducts();

  // Refs para callbacks estables
  const actionsRef = useRef({
    openDialog,
    changeStatus,
    getSelectedProducts,
    bulkDeleteProducts,
  });

  actionsRef.current = {
    openDialog,
    changeStatus,
    getSelectedProducts,
    bulkDeleteProducts,
  };

  // Handlers estables
  const handleDelete = useCallback(
    async (id: string) => {
      await deleteProduct(id);
    },
    [deleteProduct]
  );

  const handleChangeStatus = useCallback(async (product: DemoProduct, status: ProductStatus) => {
    await actionsRef.current.changeStatus(product.id, status);
  }, []);

  const handleBulkDelete = useCallback(async () => {
    const selected = actionsRef.current.getSelectedProducts();
    if (selected.length > 0) {
      await actionsRef.current.bulkDeleteProducts(selected.map((p) => p.id));
    }
  }, []);

  // Crear columnas con acciones
  const columns = useMemo(
    () =>
      createDemoProductsColumns({
        onView: (product) => actionsRef.current.openDialog("details", product),
        onEdit: (product) => actionsRef.current.openDialog("edit", product),
        onDelete: (product) => actionsRef.current.openDialog("delete", product),
        onChangeStatus: handleChangeStatus,
      }),
    [handleChangeStatus]
  );

  // Render expanded content (ejemplo simple)
  const renderExpandedContent = useCallback(
    (product: DemoProduct) => (
      <div className="p-4 bg-muted/30 rounded-md">
        <h4 className="font-medium mb-2">Descripción completa</h4>
        <p className="text-sm text-muted-foreground">{product.description}</p>
        <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <span className="text-muted-foreground">ID: </span>
            <span className="font-mono">{product.id}</span>
          </div>
          <div>
            <span className="text-muted-foreground">SKU: </span>
            <span className="font-mono">{product.sku}</span>
          </div>
          <div>
            <span className="text-muted-foreground">Categoría: </span>
            <span>{product.category}</span>
          </div>
          <div>
            <span className="text-muted-foreground">Valor en stock: </span>
            <span className="font-mono">
              ${(product.price * product.stock).toLocaleString("es-MX", { minimumFractionDigits: 2 })}
            </span>
          </div>
        </div>
      </div>
    ),
    []
  );

  // Selection config
  const selectionConfig: SelectionConfig<DemoProduct> = useMemo(
    () => ({
      enabled: true,
      mode: "multiple" as const,
      showCheckbox: true,
      selectedRows: rowSelection,
      onSelectionChange: handleRowSelectionChange,
      selectOnRowClick: false,
    }),
    [rowSelection, handleRowSelectionChange]
  );

  // Expansion config
  const expansionConfig: ExpansionConfig<DemoProduct> = useMemo(
    () => ({
      enabled: true,
      expandedRows: expanded,
      onExpansionChange: handleExpandedChange,
      renderContent: renderExpandedContent,
      expandOnClick: false,
    }),
    [expanded, handleExpandedChange, renderExpandedContent]
  );

  // Pagination config
  const paginationConfig: PaginationConfig = useMemo(
    () => ({
      pageIndex: pagination.pageIndex,
      pageSize: pagination.pageSize,
      totalRows: pagination.totalRows,
      totalPages: pagination.totalPages,
      pageSizeOptions: PAGE_SIZE_OPTIONS,
      onPaginationChange: (state) => handlePaginationChange(state),
      showPageNumbers: true,
      showFirstLast: true,
    }),
    [
      pagination.pageIndex,
      pagination.pageSize,
      pagination.totalRows,
      pagination.totalPages,
      handlePaginationChange,
    ]
  );

  // Sorting config
  const sortingConfig: SortingConfig = useMemo(
    () => ({
      sorting,
      onSortingChange: handleSortingChange,
      manualSorting: true,
    }),
    [sorting, handleSortingChange]
  );

  // Filter config
  const filterConfig: FilterConfig = useMemo(
    () => ({
      globalFilter: filters.search || "",
      onGlobalFilterChange: handleSearchChange,
      placeholder: "Buscar por nombre, SKU o descripción...",
    }),
    [filters.search, handleSearchChange]
  );

  // Column visibility config
  const columnVisibilityConfig: ColumnVisibilityConfig = useMemo(
    () => ({
      enabled: true,
      columnVisibility,
      onColumnVisibilityChange: handleColumnVisibilityChange,
      alwaysVisibleColumns: ALWAYS_VISIBLE_COLUMNS,
    }),
    [columnVisibility, handleColumnVisibilityChange]
  );

  // Filters component memoized
  const filtersComponent = useMemo(
    () => <DemoProductsFilters filters={filters} onFiltersChange={handleFiltersChange} />,
    [filters, handleFiltersChange]
  );

  // Toolbar config
  const toolbarConfigOptions: ToolbarConfig = useMemo(
    () => ({
      show: true,
      showSearch: true,
      showExport: true,
      showColumnVisibility: true,
      showDensityToggle: true,
      showRefresh: true,
      showCopy: true,
      showPrint: true,
      showFullscreen: true,
      onRefresh: handleRefresh,
      customStart: filtersComponent,
    }),
    [handleRefresh, filtersComponent]
  );

  // Export handler
  const handleExport = useCallback((format: ExportFormat, data: DemoProduct[]) => {
    const filename = `productos_${new Date().toISOString().split("T")[0]}`;

    const exportData = data.map((product) => ({
      id: product.id,
      nombre: product.name,
      descripcion: product.description,
      precio: product.price,
      stock: product.stock,
      categoria: product.category,
      estado: product.status,
      sku: product.sku,
    }));

    let content: string;
    let mimeType: string;
    let fileExtension: string;

    switch (format) {
      case "csv": {
        const headers = Object.keys(exportData[0] || {}).join(",");
        const rows = exportData.map((row) =>
          Object.values(row)
            .map((val) => `"${String(val).replace(/"/g, '""')}"`)
            .join(",")
        );
        content = [headers, ...rows].join("\n");
        mimeType = "text/csv;charset=utf-8;";
        fileExtension = "csv";
        break;
      }
      case "json": {
        content = JSON.stringify(exportData, null, 2);
        mimeType = "application/json;charset=utf-8;";
        fileExtension = "json";
        break;
      }
      case "xlsx": {
        const headers = Object.keys(exportData[0] || {}).join("\t");
        const rows = exportData.map((row) => Object.values(row).join("\t"));
        content = [headers, ...rows].join("\n");
        mimeType = "application/vnd.ms-excel;charset=utf-8;";
        fileExtension = "xls";
        break;
      }
      default:
        return;
    }

    const blob = new Blob(["\ufeff" + content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${filename}.${fileExtension}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast.success(`Exportación completada`, {
      description: `${data.length} productos exportados como ${format.toUpperCase()}`,
    });
  }, []);

  // Export config
  const exportConfigOptions: ExportConfig<DemoProduct> = useMemo(
    () => ({
      enabled: true,
      formats: EXPORT_FORMATS,
      filename: "productos",
      onExport: handleExport,
    }),
    [handleExport]
  );

  // Header actions
  const headerActions = useMemo(
    () => (
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" className="gap-2">
          <Package className="h-4 w-4" />
          <span className="hidden sm:inline">{pagination.totalRows} productos</span>
        </Button>
        <Button
          size="sm"
          className="gap-2"
          onClick={() => actionsRef.current.openDialog("create")}
        >
          <Plus className="h-4 w-4" />
          <span className="hidden sm:inline">Nuevo</span>
        </Button>
      </div>
    ),
    [pagination.totalRows]
  );

  // Bulk actions
  const bulkActions = useCallback(
    (selectedRows: DemoProduct[]) => (
      <>
        <Button variant="destructive" size="sm" onClick={handleBulkDelete} className="gap-2">
          <Trash2 className="h-4 w-4" />
          Eliminar ({selectedRows.length})
        </Button>
      </>
    ),
    [handleBulkDelete]
  );

  const emptyIcon = useMemo(() => <Package className="h-12 w-12 text-muted-foreground/50" />, []);

  const showLoading = isLoading && !products.length;

  // DataTable config completo
  const dataTableConfig: DemoProductsDataTableConfig = useMemo(
    () => ({
      data: products,
      columns,
      getRowId,
      selection: selectionConfig,
      expansion: expansionConfig,
      pagination: paginationConfig,
      sorting: sortingConfig,
      filter: filterConfig,
      columnVisibility: columnVisibilityConfig,
      toolbarConfig: toolbarConfigOptions,
      exportConfig: exportConfigOptions,
      copyConfig: COPY_CONFIG,
      printConfig: PRINT_CONFIG,
      fullscreenConfig: FULLSCREEN_CONFIG,
      style: STYLE_CONFIG,
      isLoading: showLoading,
      isPending,
      emptyMessage: "No se encontraron productos",
      emptyIcon,
      headerActions,
      bulkActions,
    }),
    [
      products,
      columns,
      selectionConfig,
      expansionConfig,
      paginationConfig,
      sortingConfig,
      filterConfig,
      columnVisibilityConfig,
      toolbarConfigOptions,
      exportConfigOptions,
      showLoading,
      isPending,
      emptyIcon,
      headerActions,
      bulkActions,
    ]
  );

  return {
    dataTableConfig,
    stats,
    selectedProduct,
    activeDialog,
    isLoading,
    isPending,
    isInitialized,
    fetchProducts,
    fetchStats,
    handleRefresh,
    openDialog,
    closeDialog,
    handleDelete,
    getSelectedProducts,
    clearSelection,
  };
}

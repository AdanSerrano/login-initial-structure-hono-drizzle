"use client";

import { useRef, useCallback, memo, useEffect } from "react";
import { RefreshCw } from "lucide-react";

import { Button } from "@/components/ui/button";
import { CustomDataTable } from "@/components/ui/custom-datatable";

import { useDemoProductsViewModel } from "../view-model/demo-products.view-model";
import { DemoProductsStats } from "../components/stats/demo-products-stats";
import { DemoProductsSkeleton } from "../components/skeleton/demo-products.skeleton";
import { DeleteProductDialog, ProductDetailsDialog } from "../components/dialogs";
import { useDemoProductsStore } from "../state/demo-products.state";

// Header memoizado
const DemoProductsHeader = memo(function DemoProductsHeader({
  isPending,
  onRefresh,
}: {
  isPending: boolean;
  onRefresh: () => void;
}) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Catálogo de Productos</h1>
        <p className="text-muted-foreground">
          Demo de CustomDataTable con datos ficticios y todas las funcionalidades.
        </p>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" onClick={onRefresh} disabled={isPending}>
          <RefreshCw className={`h-4 w-4 mr-2 ${isPending ? "animate-spin" : ""}`} />
          Actualizar
        </Button>
      </div>
    </div>
  );
});

// Stats section - lee directamente del store
const DemoProductsStatsSection = memo(function DemoProductsStatsSection() {
  const stats = useDemoProductsStore((state) => state.stats);
  const isLoading = useDemoProductsStore((state) => state.isLoading);

  return <DemoProductsStats stats={stats} isLoading={isLoading && !stats} />;
});

// DataTable section - aislada para prevenir re-renders
const DemoProductsDataTableSection = memo(function DemoProductsDataTableSection() {
  const {
    dataTableConfig,
    selectedProduct,
    activeDialog,
    closeDialog,
    handleDelete,
  } = useDemoProductsViewModel();

  return (
    <>
      <CustomDataTable
        data={dataTableConfig.data}
        columns={dataTableConfig.columns}
        getRowId={dataTableConfig.getRowId}
        selection={dataTableConfig.selection}
        expansion={dataTableConfig.expansion}
        pagination={dataTableConfig.pagination}
        sorting={dataTableConfig.sorting}
        filter={dataTableConfig.filter}
        columnVisibility={dataTableConfig.columnVisibility}
        toolbarConfig={dataTableConfig.toolbarConfig}
        export={dataTableConfig.exportConfig}
        copy={dataTableConfig.copyConfig}
        print={dataTableConfig.printConfig}
        fullscreen={dataTableConfig.fullscreenConfig}
        style={dataTableConfig.style}
        isLoading={dataTableConfig.isLoading}
        isPending={dataTableConfig.isPending}
        emptyMessage={dataTableConfig.emptyMessage}
        emptyIcon={dataTableConfig.emptyIcon}
        headerActions={dataTableConfig.headerActions}
        bulkActions={dataTableConfig.bulkActions}
      />

      {/* Diálogo de detalles */}
      <ProductDetailsDialog
        key={`details-${selectedProduct?.id}`}
        product={selectedProduct}
        open={activeDialog === "details"}
        onOpenChange={(open) => !open && closeDialog()}
      />

      {/* Diálogo de eliminar */}
      <DeleteProductDialog
        key={`delete-${selectedProduct?.id}`}
        product={selectedProduct}
        open={activeDialog === "delete"}
        onOpenChange={(open) => !open && closeDialog()}
        onConfirm={handleDelete}
      />
    </>
  );
});

export function DemoProductsView() {
  const initRef = useRef(false);
  const isPending = useDemoProductsStore((state) => state.isPending);
  const isInitialized = useDemoProductsStore((state) => state.isInitialized);

  const { fetchProducts, fetchStats, handleRefresh } = useDemoProductsViewModel();

  // Efecto para cargar datos cuando cambian filtros, paginación o sorting
  const filters = useDemoProductsStore((state) => state.filters);
  const pagination = useDemoProductsStore((state) => state.pagination);
  const sorting = useDemoProductsStore((state) => state.sorting);

  useEffect(() => {
    if (initRef.current) {
      fetchProducts();
    }
  }, [filters, pagination.pageIndex, pagination.pageSize, sorting, fetchProducts]);

  const initializeData = useCallback(() => {
    if (!initRef.current) {
      initRef.current = true;
      fetchProducts();
      fetchStats();
    }
  }, [fetchProducts, fetchStats]);

  if (!initRef.current) {
    initializeData();
  }

  if (!isInitialized) {
    return <DemoProductsSkeleton />;
  }

  return (
    <div className="space-y-6">
      <DemoProductsHeader isPending={isPending} onRefresh={handleRefresh} />

      <DemoProductsStatsSection />

      <DemoProductsDataTableSection />
    </div>
  );
}

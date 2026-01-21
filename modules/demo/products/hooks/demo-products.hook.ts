"use client";

import { useCallback, useTransition } from "react";
import { toast } from "sonner";

import { demoProductsApi } from "../api/demo-products.api";
import { useDemoProductsStore } from "../state/demo-products.state";
import type {
  DemoProductFilters,
  CreateProductInput,
  ProductStatus,
  DialogType,
  DemoProduct,
} from "../types/demo-products.types";
import type { SortingState, ColumnVisibilityState } from "@/components/ui/custom-datatable";

export function useDemoProducts() {
  // useTransition para manejar el estado pending de forma fluida
  const [isTransitioning, startTransition] = useTransition();

  const {
    products,
    stats,
    isLoading,
    isPending: storePending,
    isInitialized,
    error,
    filters,
    rowSelection,
    expanded,
    sorting,
    columnVisibility,
    pagination,
    activeDialog,
    selectedProduct,
    setProducts,
    addProduct,
    updateProduct,
    removeProduct,
    setStats,
    setLoading,
    setPending,
    setInitialized,
    setError,
    setFilters,
    resetFilters,
    setRowSelection,
    setExpanded,
    setSorting,
    setColumnVisibility,
    setPagination,
    openDialog,
    closeDialog,
    getSelectedProducts,
    clearSelection,
  } = useDemoProductsStore();

  // Combinar ambos estados de pending
  const isPending = isTransitioning || storePending;

  // Fetch products con useTransition
  const fetchProducts = useCallback(async () => {
    const isInitialLoad = !isInitialized;

    if (isInitialLoad) {
      setLoading(true);
    }
    setError(null);

    try {
      const result = await demoProductsApi.getProducts({
        page: pagination.pageIndex,
        pageSize: pagination.pageSize,
        filters,
        sorting,
      });

      // Envolver las actualizaciones de estado en startTransition
      // para que el loading se mantenga hasta que la UI esté lista
      startTransition(() => {
        setProducts(result.data);
        setPagination(result.pagination);
        setInitialized(true);
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Error al cargar productos";
      setError(message);
      toast.error(message);
    } finally {
      if (isInitialLoad) {
        setLoading(false);
      }
    }
  }, [
    pagination.pageIndex,
    pagination.pageSize,
    filters,
    sorting,
    isInitialized,
    setLoading,
    setError,
    setProducts,
    setPagination,
    setInitialized,
  ]);

  // Fetch stats
  const fetchStats = useCallback(async () => {
    try {
      const result = await demoProductsApi.getStats();
      startTransition(() => {
        setStats(result);
      });
    } catch (err) {
      console.error("Error fetching stats:", err);
    }
  }, [setStats]);

  // Refresh data
  const handleRefresh = useCallback(async () => {
    await Promise.all([fetchProducts(), fetchStats()]);
    toast.success("Datos actualizados");
  }, [fetchProducts, fetchStats]);

  // Create product
  const createProduct = useCallback(
    async (data: CreateProductInput) => {
      setPending(true);
      try {
        const newProduct = await demoProductsApi.createProduct(data);
        startTransition(() => {
          addProduct(newProduct);
        });
        toast.success("Producto creado exitosamente");
        closeDialog();
        fetchStats();
      } catch (err) {
        const message = err instanceof Error ? err.message : "Error al crear producto";
        toast.error(message);
        throw err;
      } finally {
        setPending(false);
      }
    },
    [addProduct, closeDialog, fetchStats, setPending]
  );

  // Update product
  const editProduct = useCallback(
    async (id: string, data: Partial<CreateProductInput>) => {
      setPending(true);
      try {
        const updated = await demoProductsApi.updateProduct(id, data);
        startTransition(() => {
          updateProduct(id, updated);
        });
        toast.success("Producto actualizado");
        closeDialog();
      } catch (err) {
        const message = err instanceof Error ? err.message : "Error al actualizar";
        toast.error(message);
        throw err;
      } finally {
        setPending(false);
      }
    },
    [updateProduct, closeDialog, setPending]
  );

  // Delete product
  const deleteProduct = useCallback(
    async (id: string) => {
      setPending(true);
      try {
        await demoProductsApi.deleteProduct(id);
        startTransition(() => {
          removeProduct(id);
        });
        toast.success("Producto eliminado");
        closeDialog();
        fetchStats();
      } catch (err) {
        const message = err instanceof Error ? err.message : "Error al eliminar";
        toast.error(message);
        throw err;
      } finally {
        setPending(false);
      }
    },
    [removeProduct, closeDialog, fetchStats, setPending]
  );

  // Bulk delete
  const bulkDeleteProducts = useCallback(
    async (ids: string[]) => {
      setPending(true);
      try {
        await demoProductsApi.bulkDelete(ids);
        startTransition(() => {
          ids.forEach((id) => removeProduct(id));
          clearSelection();
        });
        toast.success(`${ids.length} productos eliminados`);
        fetchStats();
      } catch (err) {
        const message = err instanceof Error ? err.message : "Error al eliminar";
        toast.error(message);
        throw err;
      } finally {
        setPending(false);
      }
    },
    [removeProduct, clearSelection, fetchStats, setPending]
  );

  // Change status
  const changeStatus = useCallback(
    async (id: string, status: ProductStatus) => {
      setPending(true);
      try {
        const updated = await demoProductsApi.updateStatus(id, status);
        startTransition(() => {
          updateProduct(id, updated);
        });
        toast.success("Estado actualizado");
        fetchStats();
      } catch (err) {
        const message = err instanceof Error ? err.message : "Error al cambiar estado";
        toast.error(message);
        throw err;
      } finally {
        setPending(false);
      }
    },
    [updateProduct, fetchStats, setPending]
  );

  // Handlers for table state
  const handleFiltersChange = useCallback(
    (newFilters: Partial<DemoProductFilters>) => {
      setFilters(newFilters);
    },
    [setFilters]
  );

  const handleSearchChange = useCallback(
    (search: string) => {
      setFilters({ search });
    },
    [setFilters]
  );

  const handleRowSelectionChange = useCallback(
    (selection: Record<string, boolean>) => {
      setRowSelection(selection);
    },
    [setRowSelection]
  );

  const handleExpandedChange = useCallback(
    (newExpanded: Record<string, boolean>) => {
      setExpanded(newExpanded);
    },
    [setExpanded]
  );

  const handleSortingChange = useCallback(
    (newSorting: SortingState[]) => {
      setSorting(newSorting);
    },
    [setSorting]
  );

  const handleColumnVisibilityChange = useCallback(
    (newVisibility: ColumnVisibilityState) => {
      setColumnVisibility(newVisibility);
    },
    [setColumnVisibility]
  );

  const handlePaginationChange = useCallback(
    (paginationState: { pageIndex: number; pageSize: number }) => {
      setPagination({ pageIndex: paginationState.pageIndex, pageSize: paginationState.pageSize });
    },
    [setPagination]
  );

  const handleOpenDialog = useCallback(
    (type: DialogType, product?: DemoProduct) => {
      openDialog(type, product);
    },
    [openDialog]
  );

  return {
    // Data
    products,
    stats,
    isLoading,
    isPending,
    isInitialized,
    error,

    // Filters
    filters,

    // Table state
    rowSelection,
    expanded,
    sorting,
    columnVisibility,
    pagination,

    // Dialog state
    activeDialog,
    selectedProduct,

    // Actions
    fetchProducts,
    fetchStats,
    handleRefresh,
    createProduct,
    editProduct,
    deleteProduct,
    bulkDeleteProducts,
    changeStatus,

    // Handlers
    handleFiltersChange,
    handleSearchChange,
    handleRowSelectionChange,
    handleExpandedChange,
    handleSortingChange,
    handleColumnVisibilityChange,
    handlePaginationChange,

    // Dialog
    openDialog: handleOpenDialog,
    closeDialog,

    // Selection
    getSelectedProducts,
    clearSelection,
    resetFilters,
  };
}

# CustomDataTable - Documentación Completa

> **Componente enterprise-grade para tablas de datos con todas las funcionalidades necesarias.**

---

## Tabla de Contenidos

1. [Introducción](#introducción)
2. [Características](#características)
3. [Instalación y Configuración](#instalación-y-configuración)
4. [Tipos e Interfaces](#tipos-e-interfaces)
5. [Props del Componente](#props-del-componente)
6. [Configuraciones](#configuraciones)
7. [Métodos Ref (Imperativo)](#métodos-ref-imperativo)
8. [Hooks Disponibles](#hooks-disponibles)
9. [Ejemplos de Uso](#ejemplos-de-uso)
10. [Implementación con Datos Locales](#implementación-con-datos-locales)
11. [Implementación con API/Endpoint](#implementación-con-apiendpoint)
12. [Optimización de Rendimiento](#optimización-de-rendimiento)
13. [Patrones Recomendados](#patrones-recomendados)

---

## Introducción

`CustomDataTable` es un componente de tabla de datos altamente configurable construido con:

- **React 19** - Aprovecha `useTransition` para UX fluida
- **Tailwind CSS** - Estilos modernos y responsive
- **shadcn/ui** - Componentes base accesibles
- **Lucide React** - Iconos consistentes
- **TypeScript** - Tipado completo

### Arquitectura del Componente

```
CustomDataTable (main)
├── CustomTableToolbar
│   ├── SearchInput (con debounce)
│   ├── DensityDropdown (compact/default/comfortable)
│   ├── ColumnVisibilityDropdown
│   ├── ExportDropdown (CSV/JSON/XLSX)
│   ├── Copy, Print, Refresh, Fullscreen buttons
│   └── BulkActionsBar (cuando hay filas seleccionadas)
│
├── CustomTableHeader
│   ├── SelectionHeaderCell (checkbox para seleccionar todo)
│   ├── ExpanderHeaderCell (expandir todo)
│   └── Celdas de encabezado (con indicadores de ordenamiento)
│
├── CustomTableBody
│   ├── SkeletonRows (estado de carga)
│   ├── CustomTableRow (para cada fila)
│   │   ├── SelectionCell (checkbox de fila)
│   │   ├── ExpanderCell (botón expandir fila)
│   │   ├── Celdas de datos
│   │   └── Contenido expandido (vista detallada)
│   └── EmptyRow (estado sin datos)
│
└── CustomTablePagination
    ├── Información de filas
    ├── Selector de tamaño de página
    ├── Botones First/Previous/Next/Last
    └── Botones de número de página
```

---

## Características

| Característica | Descripción |
|----------------|-------------|
| **Selección** | Single/Multiple, checkbox, click en fila |
| **Expansión** | Contenido expandible por fila |
| **Paginación** | Client-side o server-side |
| **Ordenamiento** | Multi-columna, manual/automático |
| **Filtrado** | Búsqueda global con debounce |
| **Visibilidad de Columnas** | Mostrar/ocultar columnas |
| **Redimensionado** | Arrastrar para redimensionar columnas |
| **Virtualización** | Scroll virtual para grandes datasets |
| **Navegación por Teclado** | Flechas, Enter, Delete, Escape |
| **Columnas Fijas** | Sticky left/right |
| **Persistencia** | Guardar estado en localStorage |
| **Copiar** | Texto, CSV, JSON al portapapeles |
| **Imprimir** | Layout profesional de impresión |
| **Pantalla Completa** | Expandir a viewport completo |
| **Exportar** | CSV, JSON, XLSX |
| **Densidad** | Compact, Default, Comfortable |
| **Estados de Carga** | Skeleton, overlay, pending |
| **Estado Vacío** | Mensaje personalizable |

---

## Instalación y Configuración

El componente está ubicado en:

```
components/ui/custom-datatable/
├── index.ts                        # Exportaciones públicas
├── custom-datatable.tsx            # Componente principal
├── types.ts                        # Tipos e interfaces
├── utils.ts                        # Utilidades
├── hooks/                          # Hooks del componente
│   ├── use-data-table-state.ts
│   ├── use-fullscreen.ts
│   ├── use-column-resizing.ts
│   ├── use-virtualization.ts
│   ├── use-keyboard-navigation.ts
│   ├── use-persistence.ts
│   ├── use-column-pinning.ts
│   ├── use-copy-clipboard.ts
│   └── use-print.ts
└── components/                     # Sub-componentes
    ├── toolbar/
    ├── header/
    ├── body/
    └── pagination/
```

### Importación

```typescript
import {
  CustomDataTable,
  type CustomDataTableRef,
  type CustomColumnDef,
  type SelectionConfig,
  type PaginationConfig,
  type SortingConfig,
  type SortingState,
  type ColumnVisibilityState,
  // ... más tipos
} from "@/components/ui/custom-datatable";
```

---

## Tipos e Interfaces

### CustomColumnDef<TData>

Define una columna de la tabla:

```typescript
interface CustomColumnDef<TData> {
  // Identificación
  id: string;                          // ID único de la columna
  accessorKey?: keyof TData;           // Clave de acceso a los datos

  // Renderizado
  header: string | ReactNode | ((props) => ReactNode);
  cell: (props: CellContext<TData>) => ReactNode;
  footer?: string | ReactNode | ((props) => ReactNode);

  // Ordenamiento
  enableSorting?: boolean;             // Habilitar ordenamiento
  sortingFn?: (a: TData, b: TData) => number;  // Función de ordenamiento

  // Visibilidad
  enableHiding?: boolean;              // Permitir ocultar
  defaultHidden?: boolean;             // Oculto por defecto

  // Tamaño
  width?: number | string;
  minWidth?: number;
  maxWidth?: number;
  enableResizing?: boolean;

  // Alineación
  align?: "left" | "center" | "right";

  // Fijado
  pinned?: "left" | "right" | false;

  // Estilos
  headerClassName?: string;
  cellClassName?: string;
}

// Contexto de celda
interface CellContext<TData> {
  row: TData;                          // Datos de la fila
  index: number;                       // Índice de la fila
  isSelected: boolean;                 // Si está seleccionada
  isExpanded: boolean;                 // Si está expandida
}
```

### Estados

```typescript
// Estado de ordenamiento
type SortingState = {
  id: string;       // ID de la columna
  desc: boolean;    // Descendente?
};

// Estado de paginación
type PaginationState = {
  pageIndex: number;
  pageSize: number;
};

// Estado de visibilidad de columnas
type ColumnVisibilityState = Record<string, boolean>;

// Estado de tamaño de columnas
type ColumnSizingState = Record<string, number>;
```

---

## Props del Componente

### Props Principales

```typescript
interface CustomDataTableProps<TData> {
  // === DATOS Y COLUMNAS (Requeridos) ===
  data: TData[];                       // Array de datos
  columns: CustomColumnDef<TData>[];   // Definición de columnas
  getRowId: (row: TData) => string;    // Función para obtener ID único

  // === FEATURES (Opcionales) ===
  selection?: SelectionConfig<TData>;
  expansion?: ExpansionConfig<TData>;
  pagination?: PaginationConfig;
  sorting?: SortingConfig;
  filter?: FilterConfig;
  columnVisibility?: ColumnVisibilityConfig;
  columnResizing?: ColumnResizingConfig;
  columnPinning?: ColumnPinningConfig;
  virtualization?: VirtualizationConfig;
  keyboardNavigation?: KeyboardNavigationConfig;
  persistence?: PersistenceConfig;
  copy?: CopyConfig;
  print?: PrintConfig;
  fullscreen?: FullscreenConfig;

  // === APARIENCIA ===
  style?: StyleConfig;
  export?: ExportConfig<TData>;
  isLoading?: boolean;
  isPending?: boolean;
  loadingConfig?: LoadingConfig;
  emptyMessage?: string;
  emptyIcon?: ReactNode;
  emptyState?: EmptyStateConfig;

  // === EVENT HANDLERS ===
  onRowClick?: (row: TData, event: React.MouseEvent) => void;
  onRowDoubleClick?: (row: TData, event: React.MouseEvent) => void;
  onRowContextMenu?: (row: TData, event: React.MouseEvent) => void;

  // === SLOTS PERSONALIZADOS ===
  toolbar?: ReactNode;
  toolbarConfig?: ToolbarConfig;
  headerActions?: ReactNode;
  bulkActions?: (selectedRows: TData[]) => ReactNode;
  footer?: ReactNode;
  caption?: ReactNode;

  // === CLASES CSS ===
  className?: string;
  containerClassName?: string;
  headerClassName?: string;
  bodyClassName?: string;
  footerClassName?: string;
  rowClassName?: string | ((row: TData, index: number) => string);
  toolbarClassName?: string;
  paginationClassName?: string;

  // === ACCESIBILIDAD ===
  ariaLabel?: string;
  ariaDescribedBy?: string;
}
```

---

## Configuraciones

### SelectionConfig

```typescript
interface SelectionConfig<TData> {
  enabled: boolean;
  mode: "single" | "multiple";
  showCheckbox?: boolean;
  selectedRows: Record<string, boolean>;
  onSelectionChange: (selection: Record<string, boolean>) => void;
  selectOnRowClick?: boolean;
  canSelect?: (row: TData) => boolean;
}
```

### ExpansionConfig

```typescript
interface ExpansionConfig<TData> {
  enabled: boolean;
  expandedRows: Record<string, boolean>;
  onExpansionChange: (expanded: Record<string, boolean>) => void;
  renderContent: (row: TData) => ReactNode;
  expandOnClick?: boolean;
  canExpand?: (row: TData) => boolean;
  expandAllByDefault?: boolean;
}
```

### PaginationConfig

```typescript
interface PaginationConfig {
  pageIndex: number;
  pageSize: number;
  totalRows: number;
  totalPages: number;
  pageSizeOptions?: number[];
  onPaginationChange: (pagination: PaginationState) => void;
  showPageNumbers?: boolean;
  showFirstLast?: boolean;
  showRowsInfo?: boolean;
}
```

### SortingConfig

```typescript
interface SortingConfig {
  sorting: SortingState[];
  onSortingChange: (sorting: SortingState[]) => void;
  manualSorting?: boolean;
  enableMultiSort?: boolean;
  maxMultiSortColCount?: number;
}
```

### FilterConfig

```typescript
interface FilterConfig {
  globalFilter: string;
  onGlobalFilterChange: (value: string) => void;
  placeholder?: string;
  debounceMs?: number;
  filterFn?: (row: TData, filter: string) => boolean;
  showClearButton?: boolean;
}
```

### ColumnVisibilityConfig

```typescript
interface ColumnVisibilityConfig {
  enabled: boolean;
  columnVisibility: ColumnVisibilityState;
  onColumnVisibilityChange: (visibility: ColumnVisibilityState) => void;
  alwaysVisibleColumns?: string[];
}
```

### StyleConfig

```typescript
interface StyleConfig {
  striped?: boolean;
  hover?: boolean;
  stickyHeader?: boolean;
  stickyFooter?: boolean;
  density?: "compact" | "default" | "comfortable";
  borderStyle?: "default" | "none" | "horizontal" | "vertical" | "all";
  rounded?: boolean;
  maxHeight?: number | string;
  minHeight?: number | string;
}
```

### ToolbarConfig

```typescript
interface ToolbarConfig {
  show?: boolean;
  showSearch?: boolean;
  showExport?: boolean;
  showColumnVisibility?: boolean;
  showDensityToggle?: boolean;
  showRefresh?: boolean;
  showCopy?: boolean;
  showPrint?: boolean;
  showFullscreen?: boolean;
  onRefresh?: () => void;
  customStart?: ReactNode;
  customEnd?: ReactNode;
}
```

### ExportConfig

```typescript
interface ExportConfig<TData> {
  enabled: boolean;
  formats: ExportFormat[];  // ["csv", "json", "xlsx"]
  filename?: string;
  onExport?: (format: ExportFormat, data: TData[]) => void;
  exportAllData?: boolean;
  includeHeaders?: boolean;
}
```

### CopyConfig

```typescript
interface CopyConfig {
  enabled: boolean;
  format?: "text" | "csv" | "json";
  includeHeaders?: boolean;
  onCopy?: () => void;
}
```

### PrintConfig

```typescript
interface PrintConfig {
  enabled: boolean;
  title?: string;
  showLogo?: boolean;
  pageSize?: "A4" | "letter" | "legal";
  orientation?: "portrait" | "landscape";
}
```

### FullscreenConfig

```typescript
interface FullscreenConfig {
  enabled: boolean;
  onFullscreenChange?: (isFullscreen: boolean) => void;
}
```

---

## Métodos Ref (Imperativo)

El componente expone métodos via `ref`:

```typescript
const tableRef = useRef<CustomDataTableRef<User>>(null);

// Uso
tableRef.current?.scrollToRow(5);
tableRef.current?.selectAll();
tableRef.current?.exportData("csv");
```

### Métodos Disponibles

```typescript
interface CustomDataTableRef<TData> {
  // === NAVEGACIÓN ===
  scrollToRow(index: number): void;
  scrollToTop(): void;
  scrollToBottom(): void;
  focusTable(): void;
  focusRow(index: number): void;

  // === EXPORTAR ===
  exportData(format: ExportFormat): void;

  // === FILTROS ===
  resetFilters(): void;
  setGlobalFilter(filter: string): void;

  // === ORDENAMIENTO ===
  resetSorting(): void;
  setSorting(sorting: SortingState[]): void;

  // === SELECCIÓN ===
  selectAll(): void;
  clearSelection(): void;
  selectRows(rowIds: string[]): void;
  toggleRowSelection(rowId: string): void;
  getSelectedRows(): TData[];
  getSelectedRowIds(): string[];

  // === EXPANSIÓN ===
  expandAll(): void;
  collapseAll(): void;
  expandRows(rowIds: string[]): void;
  toggleRowExpansion(rowId: string): void;

  // === VISIBILIDAD DE COLUMNAS ===
  setColumnVisibility(visibility: ColumnVisibilityState): void;
  toggleColumnVisibility(columnId: string): void;
  showAllColumns(): void;
  hideColumn(columnId: string): void;
  getVisibleColumns(): string[];

  // === PAGINACIÓN ===
  goToPage(page: number): void;
  goToFirstPage(): void;
  goToLastPage(): void;
  nextPage(): void;
  previousPage(): void;
  setPageSize(size: number): void;

  // === ACCESO A DATOS ===
  getVisibleData(): TData[];
  getFilteredData(): TData[];
  getAllData(): TData[];
  getRowById(id: string): TData | undefined;
}
```

---

## Hooks Disponibles

Para implementaciones personalizadas:

| Hook | Propósito |
|------|-----------|
| `useDataTableState` | Estado core (selección, ordenamiento, filtrado, paginación) |
| `useFullscreen` | Modo pantalla completa con soporte Escape |
| `useColumnResizing` | Arrastrar encabezados para redimensionar |
| `useVirtualization` | Scroll virtual para grandes datasets |
| `useKeyboardNavigation` | Navegación con flechas, Enter, Delete, Space |
| `usePersistence` | Guardar/cargar estado en localStorage |
| `useColumnPinning` | Columnas sticky left/right |
| `useCopyClipboard` | Copiar datos en diferentes formatos |
| `usePrint` | Generar e imprimir HTML de tabla |

---

## Ejemplos de Uso

### Uso Básico

```typescript
"use client";

import { CustomDataTable } from "@/components/ui/custom-datatable";

interface User {
  id: string;
  name: string;
  email: string;
}

const users: User[] = [
  { id: "1", name: "Juan", email: "juan@email.com" },
  { id: "2", name: "María", email: "maria@email.com" },
];

export function BasicTable() {
  return (
    <CustomDataTable
      data={users}
      columns={[
        {
          id: "name",
          accessorKey: "name",
          header: "Nombre",
          cell: ({ row }) => row.name,
        },
        {
          id: "email",
          accessorKey: "email",
          header: "Email",
          cell: ({ row }) => row.email,
        },
      ]}
      getRowId={(row) => row.id}
    />
  );
}
```

### Con Todas las Features

```typescript
"use client";

import { useState, useRef } from "react";
import {
  CustomDataTable,
  type CustomDataTableRef,
  type SortingState
} from "@/components/ui/custom-datatable";

export function FullFeaturedTable() {
  const tableRef = useRef<CustomDataTableRef<User>>(null);
  const [selectedRows, setSelectedRows] = useState<Record<string, boolean>>({});
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [sorting, setSorting] = useState<SortingState[]>([]);
  const [columnVisibility, setColumnVisibility] = useState({});
  const [globalFilter, setGlobalFilter] = useState("");

  return (
    <CustomDataTable
      ref={tableRef}
      data={users}
      columns={columns}
      getRowId={(row) => row.id}

      // Selección
      selection={{
        enabled: true,
        mode: "multiple",
        showCheckbox: true,
        selectedRows,
        onSelectionChange: setSelectedRows,
        selectOnRowClick: false,
      }}

      // Expansión
      expansion={{
        enabled: true,
        expandedRows: expanded,
        onExpansionChange: setExpanded,
        renderContent: (row) => (
          <div className="p-4">
            <h4>Detalles de {row.name}</h4>
            <p>{row.description}</p>
          </div>
        ),
      }}

      // Paginación
      pagination={{
        pageIndex: 0,
        pageSize: 10,
        totalRows: users.length,
        totalPages: Math.ceil(users.length / 10),
        pageSizeOptions: [5, 10, 20, 50],
        onPaginationChange: (p) => console.log(p),
        showPageNumbers: true,
        showFirstLast: true,
      }}

      // Ordenamiento
      sorting={{
        sorting,
        onSortingChange: setSorting,
        enableMultiSort: true,
      }}

      // Filtrado
      filter={{
        globalFilter,
        onGlobalFilterChange: setGlobalFilter,
        placeholder: "Buscar...",
        debounceMs: 300,
      }}

      // Visibilidad de columnas
      columnVisibility={{
        enabled: true,
        columnVisibility,
        onColumnVisibilityChange: setColumnVisibility,
        alwaysVisibleColumns: ["name", "actions"],
      }}

      // Toolbar
      toolbarConfig={{
        show: true,
        showSearch: true,
        showExport: true,
        showColumnVisibility: true,
        showDensityToggle: true,
        showRefresh: true,
        showCopy: true,
        showPrint: true,
        showFullscreen: true,
        onRefresh: () => fetchData(),
      }}

      // Exportar
      export={{
        enabled: true,
        formats: ["csv", "json", "xlsx"],
        filename: "usuarios",
      }}

      // Copiar
      copy={{
        enabled: true,
        format: "csv",
        includeHeaders: true,
      }}

      // Imprimir
      print={{
        enabled: true,
        title: "Lista de Usuarios",
        orientation: "landscape",
      }}

      // Pantalla completa
      fullscreen={{
        enabled: true,
      }}

      // Estilos
      style={{
        striped: true,
        hover: true,
        stickyHeader: true,
        density: "default",
        maxHeight: 600,
      }}

      // Estados
      isLoading={isLoading}
      isPending={isPending}
      emptyMessage="No se encontraron usuarios"

      // Acciones
      headerActions={<Button>Nuevo Usuario</Button>}
      bulkActions={(selected) => (
        <Button variant="destructive">
          Eliminar ({selected.length})
        </Button>
      )}
    />
  );
}
```

---

## Implementación con Datos Locales

Para implementar un DataTable con datos locales (mock/demo):

### 1. Estructura de Archivos

```
modules/{feature}/
├── types/{feature}.types.ts       # Tipos
├── api/{feature}.api.ts           # Mock API con datos
├── state/{feature}.state.ts       # Zustand store
├── hooks/{feature}.hook.ts        # Hook principal
├── view-model/{feature}.view-model.tsx
├── view/{feature}.view.tsx
└── components/
    ├── columns/{feature}.columns.tsx
    ├── skeleton/{feature}.skeleton.tsx
    └── filters/{feature}-filters.tsx
```

### 2. Mock API (api/{feature}.api.ts)

```typescript
// Datos mock
const MOCK_DATA: Product[] = [
  { id: "1", name: "Producto 1", price: 100 },
  { id: "2", name: "Producto 2", price: 200 },
  // ...
];

// Simular delay de red
const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

export const productApi = {
  async getProducts(params: {
    page: number;
    pageSize: number;
    filters: ProductFilters;
    sorting: SortingState[];
  }) {
    await delay(300); // Simular latencia

    let data = [...MOCK_DATA];

    // Filtrar
    if (params.filters.search) {
      data = data.filter((p) =>
        p.name.toLowerCase().includes(params.filters.search.toLowerCase())
      );
    }

    // Ordenar
    if (params.sorting.length > 0) {
      const { id, desc } = params.sorting[0];
      data.sort((a, b) => {
        const aVal = a[id as keyof Product];
        const bVal = b[id as keyof Product];
        return desc ? (bVal > aVal ? 1 : -1) : (aVal > bVal ? 1 : -1);
      });
    }

    // Paginar
    const total = data.length;
    const start = params.page * params.pageSize;
    const paginatedData = data.slice(start, start + params.pageSize);

    return {
      data: paginatedData,
      pagination: {
        pageIndex: params.page,
        pageSize: params.pageSize,
        totalRows: total,
        totalPages: Math.ceil(total / params.pageSize),
      },
    };
  },
};
```

### 3. Zustand Store (state/{feature}.state.ts)

```typescript
import { create } from "zustand";
import type { SortingState, ColumnVisibilityState } from "@/components/ui/custom-datatable";

interface ProductState {
  products: Product[];
  isLoading: boolean;
  isPending: boolean;
  isInitialized: boolean;
  filters: ProductFilters;
  rowSelection: Record<string, boolean>;
  expanded: Record<string, boolean>;
  sorting: SortingState[];
  columnVisibility: ColumnVisibilityState;
  pagination: {
    pageIndex: number;
    pageSize: number;
    totalRows: number;
    totalPages: number;
  };
}

interface ProductActions {
  setProducts: (products: Product[]) => void;
  setLoading: (loading: boolean) => void;
  setPending: (pending: boolean) => void;
  setInitialized: (initialized: boolean) => void;
  setFilters: (filters: Partial<ProductFilters>) => void;
  setRowSelection: (selection: Record<string, boolean>) => void;
  setExpanded: (expanded: Record<string, boolean>) => void;
  setSorting: (sorting: SortingState[]) => void;
  setColumnVisibility: (visibility: ColumnVisibilityState) => void;
  setPagination: (pagination: Partial<ProductState["pagination"]>) => void;
}

export const useProductStore = create<ProductState & ProductActions>((set) => ({
  products: [],
  isLoading: false,
  isPending: false,
  isInitialized: false,
  filters: { search: "" },
  rowSelection: {},
  expanded: {},
  sorting: [],
  columnVisibility: {},
  pagination: {
    pageIndex: 0,
    pageSize: 10,
    totalRows: 0,
    totalPages: 0,
  },

  setProducts: (products) => set({ products }),
  setLoading: (isLoading) => set({ isLoading }),
  setPending: (isPending) => set({ isPending }),
  setInitialized: (isInitialized) => set({ isInitialized }),
  setFilters: (filters) =>
    set((state) => ({
      filters: { ...state.filters, ...filters },
      pagination: { ...state.pagination, pageIndex: 0 }, // Reset al filtrar
    })),
  setRowSelection: (rowSelection) => set({ rowSelection }),
  setExpanded: (expanded) => set({ expanded }),
  setSorting: (sorting) => set({ sorting }),
  setColumnVisibility: (columnVisibility) => set({ columnVisibility }),
  setPagination: (pagination) =>
    set((state) => ({
      pagination: { ...state.pagination, ...pagination },
    })),
}));
```

### 4. Hook Principal (hooks/{feature}.hook.ts)

```typescript
"use client";

import { useCallback, useTransition } from "react";
import { toast } from "sonner";
import { productApi } from "../api/product.api";
import { useProductStore } from "../state/product.state";

export function useProducts() {
  const [isTransitioning, startTransition] = useTransition();

  const {
    products,
    isLoading,
    isPending: storePending,
    isInitialized,
    filters,
    rowSelection,
    expanded,
    sorting,
    columnVisibility,
    pagination,
    setProducts,
    setLoading,
    setPending,
    setInitialized,
    setFilters,
    setRowSelection,
    setExpanded,
    setSorting,
    setColumnVisibility,
    setPagination,
  } = useProductStore();

  // Combinar estados de pending
  const isPending = isTransitioning || storePending;

  // Fetch con useTransition para UX fluida
  const fetchProducts = useCallback(async () => {
    const isInitialLoad = !isInitialized;

    if (isInitialLoad) {
      setLoading(true);
    }

    try {
      const result = await productApi.getProducts({
        page: pagination.pageIndex,
        pageSize: pagination.pageSize,
        filters,
        sorting,
      });

      // startTransition mantiene el loading hasta que la UI esté lista
      startTransition(() => {
        setProducts(result.data);
        setPagination(result.pagination);
        setInitialized(true);
      });
    } catch (err) {
      toast.error("Error al cargar productos");
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
    setProducts,
    setPagination,
    setInitialized,
  ]);

  // Handlers para el DataTable
  const handleFiltersChange = useCallback(
    (newFilters: Partial<ProductFilters>) => {
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

  const handleSortingChange = useCallback(
    (newSorting: SortingState[]) => {
      setSorting(newSorting);
    },
    [setSorting]
  );

  const handlePaginationChange = useCallback(
    (paginationState: { pageIndex: number; pageSize: number }) => {
      setPagination(paginationState);
    },
    [setPagination]
  );

  return {
    products,
    isLoading,
    isPending,
    isInitialized,
    filters,
    rowSelection,
    expanded,
    sorting,
    columnVisibility,
    pagination,
    fetchProducts,
    handleFiltersChange,
    handleSearchChange,
    handleRowSelectionChange: setRowSelection,
    handleExpandedChange: setExpanded,
    handleSortingChange,
    handleColumnVisibilityChange: setColumnVisibility,
    handlePaginationChange,
  };
}
```

### 5. View (view/{feature}.view.tsx)

```typescript
"use client";

import { useEffect, useRef } from "react";
import { CustomDataTable } from "@/components/ui/custom-datatable";
import { useProducts } from "../hooks/product.hook";
import { ProductSkeleton } from "../components/skeleton/product.skeleton";
import { createProductColumns } from "../components/columns/product.columns";

export function ProductsView() {
  const initRef = useRef(false);

  const {
    products,
    isLoading,
    isPending,
    isInitialized,
    filters,
    rowSelection,
    expanded,
    sorting,
    columnVisibility,
    pagination,
    fetchProducts,
    handleSearchChange,
    handleRowSelectionChange,
    handleExpandedChange,
    handleSortingChange,
    handleColumnVisibilityChange,
    handlePaginationChange,
  } = useProducts();

  // Carga inicial
  useEffect(() => {
    if (!initRef.current) {
      initRef.current = true;
      fetchProducts();
    }
  }, [fetchProducts]);

  // Re-fetch cuando cambian filtros, sorting o paginación
  useEffect(() => {
    if (initRef.current && isInitialized) {
      fetchProducts();
    }
  }, [filters, sorting, pagination.pageIndex, pagination.pageSize]);

  if (!isInitialized) {
    return <ProductSkeleton />;
  }

  const columns = createProductColumns({
    onEdit: (product) => console.log("Edit", product),
    onDelete: (product) => console.log("Delete", product),
  });

  return (
    <CustomDataTable
      data={products}
      columns={columns}
      getRowId={(row) => row.id}
      selection={{
        enabled: true,
        mode: "multiple",
        showCheckbox: true,
        selectedRows: rowSelection,
        onSelectionChange: handleRowSelectionChange,
      }}
      expansion={{
        enabled: true,
        expandedRows: expanded,
        onExpansionChange: handleExpandedChange,
        renderContent: (row) => (
          <div className="p-4">
            <p>{row.description}</p>
          </div>
        ),
      }}
      pagination={{
        ...pagination,
        pageSizeOptions: [5, 10, 20, 50],
        onPaginationChange: handlePaginationChange,
        showPageNumbers: true,
        showFirstLast: true,
      }}
      sorting={{
        sorting,
        onSortingChange: handleSortingChange,
        manualSorting: true,
      }}
      filter={{
        globalFilter: filters.search || "",
        onGlobalFilterChange: handleSearchChange,
        placeholder: "Buscar productos...",
      }}
      columnVisibility={{
        enabled: true,
        columnVisibility,
        onColumnVisibilityChange: handleColumnVisibilityChange,
      }}
      style={{
        striped: true,
        hover: true,
        stickyHeader: true,
        density: "default",
        maxHeight: 600,
      }}
      toolbarConfig={{
        show: true,
        showSearch: true,
        showColumnVisibility: true,
        showDensityToggle: true,
        showRefresh: true,
        onRefresh: fetchProducts,
      }}
      isLoading={isLoading && !products.length}
      isPending={isPending}
      emptyMessage="No se encontraron productos"
    />
  );
}
```

---

## Implementación con API/Endpoint

Para conectar con un endpoint real:

### 1. API Client (api/{feature}.api.ts)

```typescript
import { apiClient } from "@/lib/axios";
import type { SortingState } from "@/components/ui/custom-datatable";
import type { Product, ProductFilters } from "../types/product.types";

interface GetProductsParams {
  page: number;
  pageSize: number;
  filters: ProductFilters;
  sorting: SortingState[];
}

interface GetProductsResponse {
  data: Product[];
  pagination: {
    pageIndex: number;
    pageSize: number;
    totalRows: number;
    totalPages: number;
  };
}

export const productApi = {
  async getProducts(params: GetProductsParams): Promise<GetProductsResponse> {
    // Construir query params
    const queryParams = new URLSearchParams();
    queryParams.set("page", String(params.page));
    queryParams.set("pageSize", String(params.pageSize));

    if (params.filters.search) {
      queryParams.set("search", params.filters.search);
    }
    if (params.filters.status) {
      queryParams.set("status", params.filters.status);
    }
    if (params.filters.category) {
      queryParams.set("category", params.filters.category);
    }

    if (params.sorting.length > 0) {
      queryParams.set("sortBy", params.sorting[0].id);
      queryParams.set("sortOrder", params.sorting[0].desc ? "desc" : "asc");
    }

    const response = await apiClient.get<GetProductsResponse>(
      `/products?${queryParams.toString()}`
    );
    return response.data;
  },

  async createProduct(data: CreateProductInput): Promise<Product> {
    const response = await apiClient.post<Product>("/products", data);
    return response.data;
  },

  async updateProduct(id: string, data: UpdateProductInput): Promise<Product> {
    const response = await apiClient.put<Product>(`/products/${id}`, data);
    return response.data;
  },

  async deleteProduct(id: string): Promise<void> {
    await apiClient.delete(`/products/${id}`);
  },
};
```

### 2. Backend Route (Hono)

```typescript
// modules/products/routes/products.routes.ts
import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { ProductController } from "../controllers/products.controller";
import { getProductsSchema } from "../validations/schema/products.schema";

const productController = new ProductController();

export const productRoutes = new Hono()
  .get("/", zValidator("query", getProductsSchema), (c) =>
    productController.getAll(c)
  )
  .get("/:id", (c) => productController.getById(c))
  .post("/", (c) => productController.create(c))
  .put("/:id", (c) => productController.update(c))
  .delete("/:id", (c) => productController.delete(c));
```

### 3. Controller

```typescript
// modules/products/controllers/products.controller.ts
import { Context } from "hono";
import { ProductService } from "../services/products.service";

export class ProductController {
  private service = new ProductService();

  async getAll(c: Context) {
    const { page, pageSize, search, status, category, sortBy, sortOrder } =
      c.req.query();

    const result = await this.service.getPaginated({
      page: Number(page) || 0,
      pageSize: Number(pageSize) || 10,
      filters: { search, status, category },
      sorting: sortBy ? [{ id: sortBy, desc: sortOrder === "desc" }] : [],
    });

    return c.json(result);
  }
}
```

### 4. Service con Paginación

```typescript
// modules/products/services/products.service.ts
import { ProductRepository } from "../repository/products.repository";
import { createPaginatedResponse } from "@/types/pagination.types";

export class ProductService {
  private repository = new ProductRepository();

  async getPaginated(params: GetProductsParams) {
    const { page, pageSize, filters, sorting } = params;
    const offset = page * pageSize;

    const [data, total] = await Promise.all([
      this.repository.findAll({
        limit: pageSize,
        offset,
        filters,
        sorting,
      }),
      this.repository.count(filters),
    ]);

    return createPaginatedResponse(data, page, pageSize, total);
  }
}
```

### 5. Repository con Drizzle

```typescript
// modules/products/repository/products.repository.ts
import { db } from "@/db";
import { productsTable } from "@/db/schema";
import { eq, like, sql, asc, desc } from "drizzle-orm";

export class ProductRepository {
  async findAll(params: {
    limit: number;
    offset: number;
    filters: ProductFilters;
    sorting: SortingState[];
  }) {
    let query = db.select().from(productsTable);

    // Filtros
    if (params.filters.search) {
      query = query.where(
        like(productsTable.name, `%${params.filters.search}%`)
      );
    }
    if (params.filters.status) {
      query = query.where(eq(productsTable.status, params.filters.status));
    }

    // Ordenamiento
    if (params.sorting.length > 0) {
      const { id, desc: isDesc } = params.sorting[0];
      const column = productsTable[id as keyof typeof productsTable];
      if (column) {
        query = query.orderBy(isDesc ? desc(column) : asc(column));
      }
    }

    // Paginación
    return query.limit(params.limit).offset(params.offset);
  }

  async count(filters: ProductFilters) {
    let query = db.select({ count: sql<number>`count(*)` }).from(productsTable);

    if (filters.search) {
      query = query.where(like(productsTable.name, `%${filters.search}%`));
    }
    if (filters.status) {
      query = query.where(eq(productsTable.status, filters.status));
    }

    const result = await query;
    return result[0].count;
  }
}
```

---

## Optimización de Rendimiento

### useTransition para UX Fluida

```typescript
const [isTransitioning, startTransition] = useTransition();

// El isPending se mantiene true hasta que React termina de renderizar
const fetchData = async () => {
  const result = await api.getData();

  startTransition(() => {
    setData(result.data);        // Estas actualizaciones son "low priority"
    setPagination(result.meta);  // React las agrupa y espera a que la UI esté lista
  });
};
```

### Memoización

```typescript
// Columnas memoizadas
const columns = useMemo(
  () => createColumns({ onEdit, onDelete }),
  [onEdit, onDelete]
);

// Configuraciones memoizadas
const selectionConfig = useMemo(
  () => ({
    enabled: true,
    selectedRows,
    onSelectionChange: handleSelectionChange,
  }),
  [selectedRows, handleSelectionChange]
);

// Handlers estables con useCallback
const handleSort = useCallback(
  (newSorting: SortingState[]) => {
    setSorting(newSorting);
  },
  [setSorting]
);
```

### useRef para Referencias Estables

```typescript
// Evita recrear funciones en cada render
const actionsRef = useRef({ openDialog, deleteItem });
actionsRef.current = { openDialog, deleteItem };

// Usar en callbacks memoizados
const handleAction = useCallback(() => {
  actionsRef.current.openDialog("create");
}, []); // Sin dependencias!
```

### Subscripciones Zustand Selectivas

```typescript
// ❌ MAL - Re-render en cualquier cambio del store
const store = useProductStore();

// ✅ BIEN - Solo re-render cuando cambia products
const products = useProductStore((state) => state.products);
const pagination = useProductStore((state) => state.pagination);
```

---

## Patrones Recomendados

### 1. Dual Loading States

```typescript
// isLoading: Carga inicial (mostrar skeleton)
// isPending: Operaciones subsecuentes (mostrar overlay)

if (isLoading && !products.length) {
  return <ProductSkeleton />;
}

// isPending se pasa al DataTable para mostrar overlay
<CustomDataTable isPending={isPending} />
```

### 2. Inicialización Controlada

```typescript
const initRef = useRef(false);

useEffect(() => {
  if (!initRef.current) {
    initRef.current = true;
    fetchProducts();
    fetchStats();
  }
}, []);

// Re-fetch solo después de inicializar
useEffect(() => {
  if (initRef.current) {
    fetchProducts();
  }
}, [filters, sorting, pagination.pageIndex]);
```

### 3. Reset de Paginación al Filtrar

```typescript
// En el store
setFilters: (filters) =>
  set((state) => ({
    filters: { ...state.filters, ...filters },
    pagination: { ...state.pagination, pageIndex: 0 }, // ← Reset
  })),
```

### 4. Componentes Memoizados por Sección

```typescript
// Cada sección se suscribe solo a lo que necesita
const StatsSection = memo(function StatsSection() {
  const stats = useStore((s) => s.stats);
  return <Stats data={stats} />;
});

const TableSection = memo(function TableSection() {
  const products = useStore((s) => s.products);
  return <DataTable data={products} />;
});

// El padre no causa re-renders innecesarios
function MainView() {
  return (
    <>
      <StatsSection />
      <TableSection />
    </>
  );
}
```

### 5. Configuración como Constantes

```typescript
// Fuera del componente para evitar recreación
const STYLE_CONFIG: StyleConfig = {
  striped: true,
  hover: true,
  stickyHeader: true,
  density: "default",
};

const PAGE_SIZE_OPTIONS = [5, 10, 20, 50, 100];

// Dentro del componente, usar directamente
<CustomDataTable style={STYLE_CONFIG} />
```

---

## Referencias

- **Componente**: `components/ui/custom-datatable/`
- **Ejemplo completo**: `modules/demo/products/`
- **Documentación shadcn/ui**: https://ui.shadcn.com/
- **Documentación Zustand**: https://zustand-demo.pmnd.rs/

---

> **Última actualización**: Enero 2026

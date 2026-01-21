"use client";

import { memo, useCallback, useMemo } from "react";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import type { DataTablePaginationProps } from "../types";

const PageSizeSelector = memo(function PageSizeSelector({
  currentPageSize,
  pageSizeOptions,
  onPageSizeChange,
  disabled,
}: {
  currentPageSize: number;
  pageSizeOptions: number[];
  onPageSizeChange: (size: number) => void;
  disabled?: boolean;
}) {
  const handleChange = useCallback(
    (value: string) => {
      onPageSizeChange(Number(value));
    },
    [onPageSizeChange]
  );

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-muted-foreground whitespace-nowrap">
        Filas por página
      </span>
      <Select
        value={String(currentPageSize)}
        onValueChange={handleChange}
        disabled={disabled}
      >
        <SelectTrigger className="w-[70px]" size="sm">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {pageSizeOptions.map((size) => (
            <SelectItem key={size} value={String(size)}>
              {size}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
});

const PageNumbers = memo(function PageNumbers({
  currentPage,
  totalPages,
  onPageChange,
  disabled,
}: {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  disabled?: boolean;
}) {
  const pages = useMemo(() => {
    const maxVisible = 5;
    const pages: (number | "ellipsis")[] = [];

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);

      if (currentPage > 3) {
        pages.push("ellipsis");
      }

      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (currentPage < totalPages - 2) {
        pages.push("ellipsis");
      }

      pages.push(totalPages);
    }

    return pages;
  }, [currentPage, totalPages]);

  return (
    <div className="flex items-center gap-1">
      {pages.map((page, index) =>
        page === "ellipsis" ? (
          <span key={`ellipsis-${index}`} className="px-2 text-muted-foreground">
            ...
          </span>
        ) : (
          <Button
            key={page}
            variant={currentPage === page ? "default" : "outline"}
            size="icon"
            className="h-8 w-8"
            onClick={() => onPageChange(page - 1)}
            disabled={disabled}
          >
            {page}
          </Button>
        )
      )}
    </div>
  );
});

const PaginationButtons = memo(function PaginationButtons({
  canPreviousPage,
  canNextPage,
  onFirstPage,
  onPreviousPage,
  onNextPage,
  onLastPage,
  disabled,
  showFirstLast = true,
}: {
  canPreviousPage: boolean;
  canNextPage: boolean;
  onFirstPage: () => void;
  onPreviousPage: () => void;
  onNextPage: () => void;
  onLastPage: () => void;
  disabled?: boolean;
  showFirstLast?: boolean;
}) {
  return (
    <div className="flex items-center gap-1">
      {showFirstLast && (
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          onClick={onFirstPage}
          disabled={!canPreviousPage || disabled}
          aria-label="Primera página"
        >
          <ChevronsLeft className="h-4 w-4" />
        </Button>
      )}
      <Button
        variant="outline"
        size="icon"
        className="h-8 w-8"
        onClick={onPreviousPage}
        disabled={!canPreviousPage || disabled}
        aria-label="Página anterior"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        className="h-8 w-8"
        onClick={onNextPage}
        disabled={!canNextPage || disabled}
        aria-label="Página siguiente"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
      {showFirstLast && (
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          onClick={onLastPage}
          disabled={!canNextPage || disabled}
          aria-label="Última página"
        >
          <ChevronsRight className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
});

function DataTablePaginationComponent<TData>({
  table,
  pageSizeOptions,
  totalRows,
  totalPages,
  enableRowSelection = false,
  isPending = false,
  showPageNumbers = false,
  showFirstLast = true,
  selectedCount: externalSelectedCount,
}: DataTablePaginationProps<TData>) {
  const state = table.getState();
  const currentPageSize = state.pagination.pageSize;
  const currentPageIndex = state.pagination.pageIndex;

  const startRow = totalRows > 0 ? currentPageIndex * currentPageSize + 1 : 0;
  const endRow = Math.min((currentPageIndex + 1) * currentPageSize, totalRows);

  const selectedCount = externalSelectedCount ?? table.getFilteredSelectedRowModel().rows.length;

  const canPreviousPage = table.getCanPreviousPage();
  const canNextPage = table.getCanNextPage();

  const handleFirstPage = useCallback(() => {
    table.setPageIndex(0);
  }, [table]);

  const handlePreviousPage = useCallback(() => {
    table.previousPage();
  }, [table]);

  const handleNextPage = useCallback(() => {
    table.nextPage();
  }, [table]);

  const handleLastPage = useCallback(() => {
    table.setPageIndex(totalPages - 1);
  }, [table, totalPages]);

  const handlePageSizeChange = useCallback(
    (size: number) => {
      table.setPageSize(size);
    },
    [table]
  );

  const handlePageChange = useCallback(
    (pageIndex: number) => {
      table.setPageIndex(pageIndex);
    },
    [table]
  );

  const pageInfo = useMemo(
    () => ({
      current: currentPageIndex + 1,
      total: totalPages || 1,
    }),
    [currentPageIndex, totalPages]
  );

  return (
    <div
      className={cn(
        "flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between transition-opacity",
        isPending && "opacity-60"
      )}
    >
      <div className="flex items-center gap-4 text-sm text-muted-foreground">
        {enableRowSelection && selectedCount > 0 && (
          <span className="font-medium text-foreground">
            {selectedCount} de {totalRows} seleccionado{selectedCount > 1 ? "s" : ""}
          </span>
        )}
        <span className="hidden sm:inline">
          {totalRows > 0 ? (
            <>
              Mostrando {startRow} - {endRow} de {totalRows} registro{totalRows > 1 ? "s" : ""}
            </>
          ) : (
            "Sin registros"
          )}
        </span>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <PageSizeSelector
          currentPageSize={currentPageSize}
          pageSizeOptions={pageSizeOptions}
          onPageSizeChange={handlePageSizeChange}
          disabled={isPending}
        />

        <div className="flex items-center gap-2">
          {showPageNumbers && totalPages > 1 ? (
            <>
              <PaginationButtons
                canPreviousPage={canPreviousPage}
                canNextPage={canNextPage}
                onFirstPage={handleFirstPage}
                onPreviousPage={handlePreviousPage}
                onNextPage={handleNextPage}
                onLastPage={handleLastPage}
                disabled={isPending}
                showFirstLast={false}
              />
              <PageNumbers
                currentPage={pageInfo.current}
                totalPages={pageInfo.total}
                onPageChange={handlePageChange}
                disabled={isPending}
              />
            </>
          ) : (
            <>
              <span className="text-sm text-muted-foreground whitespace-nowrap">
                Página {pageInfo.current} de {pageInfo.total}
              </span>
              <PaginationButtons
                canPreviousPage={canPreviousPage}
                canNextPage={canNextPage}
                onFirstPage={handleFirstPage}
                onPreviousPage={handlePreviousPage}
                onNextPage={handleNextPage}
                onLastPage={handleLastPage}
                disabled={isPending}
                showFirstLast={showFirstLast}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export const DataTablePagination = memo(
  DataTablePaginationComponent
) as typeof DataTablePaginationComponent;

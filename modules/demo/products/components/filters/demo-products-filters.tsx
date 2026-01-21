"use client";

import { memo } from "react";
import { Filter } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";

import type { DemoProductFilters, ProductStatus, ProductCategory } from "../../types/demo-products.types";

interface Props {
  filters: DemoProductFilters;
  onFiltersChange: (filters: Partial<DemoProductFilters>) => void;
}

const statusOptions: { value: ProductStatus | "all"; label: string }[] = [
  { value: "all", label: "Todos los estados" },
  { value: "active", label: "Activo" },
  { value: "inactive", label: "Inactivo" },
  { value: "discontinued", label: "Descontinuado" },
];

const categoryOptions: { value: ProductCategory | "all"; label: string }[] = [
  { value: "all", label: "Todas las categorías" },
  { value: "electronics", label: "Electrónica" },
  { value: "clothing", label: "Ropa" },
  { value: "food", label: "Alimentos" },
  { value: "books", label: "Libros" },
  { value: "other", label: "Otros" },
];

function DemoProductsFiltersComponent({ filters, onFiltersChange }: Props) {
  const activeFiltersCount = [
    filters.status !== "all",
    filters.category !== "all",
  ].filter(Boolean).length;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Filter className="h-4 w-4" />
          <span className="hidden sm:inline">Filtros</span>
          {activeFiltersCount > 0 && (
            <Badge variant="secondary" className="ml-1 h-5 w-5 p-0 flex items-center justify-center">
              {activeFiltersCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-72" align="start">
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Estado</label>
            <Select
              value={filters.status}
              onValueChange={(value) => onFiltersChange({ status: value as ProductStatus | "all" })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Categoría</label>
            <Select
              value={filters.category}
              onValueChange={(value) => onFiltersChange({ category: value as ProductCategory | "all" })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {categoryOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {activeFiltersCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="w-full"
              onClick={() => onFiltersChange({ status: "all", category: "all" })}
            >
              Limpiar filtros
            </Button>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}

export const DemoProductsFilters = memo(DemoProductsFiltersComponent);

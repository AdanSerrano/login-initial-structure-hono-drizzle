"use client";

import { format } from "date-fns";
import { es } from "date-fns/locale";
import {
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  Power,
  PowerOff,
  Archive,
  Package,
  AlertTriangle,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
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

import type { CustomColumnDef } from "@/components/ui/custom-datatable";
import type { DemoProduct, ProductStatus, ProductCategory } from "../../types/demo-products.types";

interface ColumnActions {
  onView: (product: DemoProduct) => void;
  onEdit: (product: DemoProduct) => void;
  onDelete: (product: DemoProduct) => void;
  onChangeStatus: (product: DemoProduct, status: ProductStatus) => void;
}

const statusConfig: Record<
  ProductStatus,
  { label: string; variant: "default" | "secondary" | "destructive" | "outline"; icon: React.ElementType }
> = {
  active: { label: "Activo", variant: "default", icon: Power },
  inactive: { label: "Inactivo", variant: "secondary", icon: PowerOff },
  discontinued: { label: "Descontinuado", variant: "destructive", icon: Archive },
};

const categoryLabels: Record<ProductCategory, string> = {
  electronics: "Electrónica",
  clothing: "Ropa",
  food: "Alimentos",
  books: "Libros",
  other: "Otros",
};

const categoryColors: Record<ProductCategory, string> = {
  electronics: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  clothing: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
  food: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  books: "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300",
  other: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300",
};

export function createDemoProductsColumns(actions: ColumnActions): CustomColumnDef<DemoProduct>[] {
  return [
    {
      id: "name",
      header: "Producto",
      enableSorting: true,
      enableHiding: false,
      minWidth: 250,
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-md bg-muted overflow-hidden flex-shrink-0">
            <img
              src={row.imageUrl}
              alt={row.name}
              className="h-full w-full object-cover"
              loading="lazy"
            />
          </div>
          <div className="min-w-0">
            <p className="font-medium truncate">{row.name}</p>
            <p className="text-xs text-muted-foreground truncate">{row.sku}</p>
          </div>
        </div>
      ),
    },
    {
      id: "category",
      header: "Categoría",
      enableSorting: true,
      minWidth: 120,
      cell: ({ row }) => (
        <Badge variant="outline" className={cn("font-normal", categoryColors[row.category])}>
          {categoryLabels[row.category]}
        </Badge>
      ),
    },
    {
      id: "price",
      header: "Precio",
      align: "right",
      enableSorting: true,
      minWidth: 100,
      cell: ({ row }) => (
        <span className="font-mono font-medium">
          ${row.price.toLocaleString("es-MX", { minimumFractionDigits: 2 })}
        </span>
      ),
    },
    {
      id: "stock",
      header: "Stock",
      align: "center",
      enableSorting: true,
      minWidth: 100,
      cell: ({ row }) => {
        const isLowStock = row.stock > 0 && row.stock <= 5;
        const isOutOfStock = row.stock === 0;

        return (
          <div className="flex items-center justify-center gap-1">
            {isLowStock && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <AlertTriangle className="h-4 w-4 text-amber-500" />
                  </TooltipTrigger>
                  <TooltipContent>Stock bajo</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
            <span
              className={cn(
                "font-mono",
                isOutOfStock && "text-destructive",
                isLowStock && "text-amber-600 font-medium"
              )}
            >
              {row.stock}
            </span>
          </div>
        );
      },
    },
    {
      id: "status",
      header: "Estado",
      align: "center",
      enableSorting: true,
      minWidth: 130,
      cell: ({ row }) => {
        const config = statusConfig[row.status];
        const Icon = config.icon;

        return (
          <Badge variant={config.variant} className="gap-1">
            <Icon className="h-3 w-3" />
            {config.label}
          </Badge>
        );
      },
    },
    {
      id: "updatedAt",
      header: "Actualizado",
      enableSorting: true,
      minWidth: 140,
      cell: ({ row }) => (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <span className="text-sm text-muted-foreground">
                {format(new Date(row.updatedAt), "dd MMM yyyy", { locale: es })}
              </span>
            </TooltipTrigger>
            <TooltipContent>
              {format(new Date(row.updatedAt), "dd/MM/yyyy HH:mm", { locale: es })}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ),
    },
    {
      id: "actions",
      header: "Acciones",
      align: "center",
      enableSorting: false,
      enableHiding: false,
      minWidth: 80,
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreHorizontal className="h-4 w-4" />
              <span className="sr-only">Acciones</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel>Acciones</DropdownMenuLabel>
            <DropdownMenuSeparator />

            <DropdownMenuItem onClick={() => actions.onView(row)} className="gap-2">
              <Eye className="h-4 w-4" />
              Ver detalles
            </DropdownMenuItem>

            <DropdownMenuItem onClick={() => actions.onEdit(row)} className="gap-2">
              <Edit className="h-4 w-4" />
              Editar
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            {row.status !== "active" && (
              <DropdownMenuItem
                onClick={() => actions.onChangeStatus(row, "active")}
                className="gap-2 text-green-600"
              >
                <Power className="h-4 w-4" />
                Activar
              </DropdownMenuItem>
            )}

            {row.status !== "inactive" && (
              <DropdownMenuItem
                onClick={() => actions.onChangeStatus(row, "inactive")}
                className="gap-2 text-amber-600"
              >
                <PowerOff className="h-4 w-4" />
                Desactivar
              </DropdownMenuItem>
            )}

            {row.status !== "discontinued" && (
              <DropdownMenuItem
                onClick={() => actions.onChangeStatus(row, "discontinued")}
                className="gap-2 text-gray-600"
              >
                <Archive className="h-4 w-4" />
                Descontinuar
              </DropdownMenuItem>
            )}

            <DropdownMenuSeparator />

            <DropdownMenuItem
              onClick={() => actions.onDelete(row)}
              className="gap-2 text-destructive focus:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
              Eliminar
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];
}

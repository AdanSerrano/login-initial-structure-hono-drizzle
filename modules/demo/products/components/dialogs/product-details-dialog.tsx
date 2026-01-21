"use client";

import { memo } from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Package, Calendar, Tag, DollarSign, Layers, Info } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";

import type { DemoProduct, ProductStatus, ProductCategory } from "../../types/demo-products.types";

interface Props {
  product: DemoProduct | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const statusLabels: Record<ProductStatus, { label: string; variant: "default" | "secondary" | "destructive" }> = {
  active: { label: "Activo", variant: "default" },
  inactive: { label: "Inactivo", variant: "secondary" },
  discontinued: { label: "Descontinuado", variant: "destructive" },
};

const categoryLabels: Record<ProductCategory, string> = {
  electronics: "Electrónica",
  clothing: "Ropa",
  food: "Alimentos",
  books: "Libros",
  other: "Otros",
};

function ProductDetailsDialogComponent({ product, open, onOpenChange }: Props) {
  if (!product) return null;

  const statusConfig = statusLabels[product.status];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="h-5 w-5 text-primary" />
            Detalles del producto
          </DialogTitle>
          <DialogDescription>
            Información completa del producto seleccionado
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Header con imagen */}
          <div className="flex items-start gap-4">
            <div className="h-20 w-20 rounded-lg bg-muted overflow-hidden flex-shrink-0">
              <img
                src={product.imageUrl}
                alt={product.name}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-lg">{product.name}</h3>
              <p className="text-sm text-muted-foreground mt-1">{product.description}</p>
            </div>
          </div>

          <Separator />

          {/* Info grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Tag className="h-4 w-4" />
                SKU
              </div>
              <p className="font-mono font-medium">{product.sku}</p>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Info className="h-4 w-4" />
                Estado
              </div>
              <Badge variant={statusConfig.variant}>{statusConfig.label}</Badge>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <DollarSign className="h-4 w-4" />
                Precio
              </div>
              <p className="font-mono font-medium text-lg">
                ${product.price.toLocaleString("es-MX", { minimumFractionDigits: 2 })}
              </p>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Layers className="h-4 w-4" />
                Stock
              </div>
              <p className="font-mono font-medium">{product.stock} unidades</p>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Package className="h-4 w-4" />
                Categoría
              </div>
              <p className="font-medium">{categoryLabels[product.category]}</p>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <DollarSign className="h-4 w-4" />
                Valor en stock
              </div>
              <p className="font-mono font-medium">
                ${(product.price * product.stock).toLocaleString("es-MX", { minimumFractionDigits: 2 })}
              </p>
            </div>
          </div>

          <Separator />

          {/* Fechas */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="h-4 w-4" />
                Creado
              </div>
              <p>{format(new Date(product.createdAt), "dd/MM/yyyy HH:mm", { locale: es })}</p>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="h-4 w-4" />
                Actualizado
              </div>
              <p>{format(new Date(product.updatedAt), "dd/MM/yyyy HH:mm", { locale: es })}</p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export const ProductDetailsDialog = memo(ProductDetailsDialogComponent);

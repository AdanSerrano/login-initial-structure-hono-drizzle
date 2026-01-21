"use client";

import { memo, useState, useCallback, useTransition } from "react";
import { Trash2, AlertTriangle } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";

import type { DemoProduct } from "../../types/demo-products.types";

interface Props {
  product: DemoProduct | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (id: string) => Promise<void>;
}

function DeleteProductDialogComponent({ product, open, onOpenChange, onConfirm }: Props) {
  const [isPending, startTransition] = useTransition();

  const handleConfirm = useCallback(() => {
    if (!product) return;

    startTransition(async () => {
      try {
        await onConfirm(product.id);
      } catch {
        // Error handled by hook
      }
    });
  }, [product, onConfirm]);

  if (!product) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-destructive">
            <Trash2 className="h-5 w-5" />
            Eliminar producto
          </DialogTitle>
          <DialogDescription>
            Esta acción no se puede deshacer.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Estás a punto de eliminar el producto <strong>{product.name}</strong> (SKU: {product.sku}).
              Esta acción es permanente.
            </AlertDescription>
          </Alert>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isPending}>
            Cancelar
          </Button>
          <Button variant="destructive" onClick={handleConfirm} disabled={isPending}>
            {isPending ? "Eliminando..." : "Eliminar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export const DeleteProductDialog = memo(DeleteProductDialogComponent);

import { Suspense } from "react";
import { DemoProductsView } from "@/modules/demo/products/view/demo-products.view";
import { DemoProductsSkeleton } from "@/modules/demo/products/components/skeleton/demo-products.skeleton";

export const metadata = {
  title: "Demo - Catálogo de Productos",
  description: "Demostración del componente CustomDataTable con datos ficticios",
};

export default function DemoProductsPage() {
  return (
    <div className="container mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <Suspense fallback={<DemoProductsSkeleton />}>
        <DemoProductsView />
      </Suspense>
    </div>
  );
}

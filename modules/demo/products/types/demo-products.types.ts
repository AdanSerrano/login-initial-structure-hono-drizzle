export type ProductStatus = "active" | "inactive" | "discontinued";
export type ProductCategory = "electronics" | "clothing" | "food" | "books" | "other";

export interface DemoProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: ProductCategory;
  status: ProductStatus;
  sku: string;
  imageUrl: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface DemoProductFilters {
  search: string;
  status: ProductStatus | "all";
  category: ProductCategory | "all";
  minPrice: number | null;
  maxPrice: number | null;
}

export interface DemoProductStats {
  total: number;
  active: number;
  inactive: number;
  discontinued: number;
  lowStock: number;
  totalValue: number;
}

export interface CreateProductInput {
  name: string;
  description: string;
  price: number;
  stock: number;
  category: ProductCategory;
  status: ProductStatus;
  sku: string;
  imageUrl?: string;
}

export interface UpdateProductInput extends Partial<CreateProductInput> {
  id: string;
}

export type DialogType = "create" | "edit" | "delete" | "details" | null;

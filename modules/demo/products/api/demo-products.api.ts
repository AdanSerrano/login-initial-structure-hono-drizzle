import type {
  DemoProduct,
  DemoProductFilters,
  DemoProductStats,
  ProductCategory,
  ProductStatus,
  CreateProductInput,
} from "../types/demo-products.types";
import type { SortingState } from "@/components/ui/custom-datatable";

// Datos ficticios para el demo
const MOCK_PRODUCTS: DemoProduct[] = [
  {
    id: "prod-001",
    name: "MacBook Pro 16\"",
    description: "Laptop profesional con chip M3 Pro, 18GB RAM, 512GB SSD",
    price: 2499.99,
    stock: 25,
    category: "electronics",
    status: "active",
    sku: "MBP-16-M3P-512",
    imageUrl: "https://placehold.co/100x100/1a1a2e/ffffff?text=MBP",
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-06-20"),
  },
  {
    id: "prod-002",
    name: "iPhone 15 Pro Max",
    description: "Smartphone con chip A17 Pro, 256GB, Titanio Natural",
    price: 1199.99,
    stock: 50,
    category: "electronics",
    status: "active",
    sku: "IP15PM-256-TN",
    imageUrl: "https://placehold.co/100x100/4a4a6a/ffffff?text=IP15",
    createdAt: new Date("2024-02-10"),
    updatedAt: new Date("2024-07-15"),
  },
  {
    id: "prod-003",
    name: "Camiseta Premium Algodón",
    description: "Camiseta 100% algodón orgánico, disponible en varios colores",
    price: 29.99,
    stock: 200,
    category: "clothing",
    status: "active",
    sku: "CAM-PREM-ALG",
    imageUrl: "https://placehold.co/100x100/2e7d32/ffffff?text=CAM",
    createdAt: new Date("2024-03-05"),
    updatedAt: new Date("2024-05-10"),
  },
  {
    id: "prod-004",
    name: "Jeans Slim Fit",
    description: "Pantalón vaquero corte slim, denim premium",
    price: 79.99,
    stock: 3,
    category: "clothing",
    status: "active",
    sku: "JNS-SLIM-001",
    imageUrl: "https://placehold.co/100x100/1565c0/ffffff?text=JNS",
    createdAt: new Date("2024-01-20"),
    updatedAt: new Date("2024-04-25"),
  },
  {
    id: "prod-005",
    name: "Café Gourmet Colombia 1kg",
    description: "Café de origen único, tostado medio, notas de chocolate",
    price: 24.99,
    stock: 150,
    category: "food",
    status: "active",
    sku: "CAF-COL-1KG",
    imageUrl: "https://placehold.co/100x100/6d4c41/ffffff?text=CAF",
    createdAt: new Date("2024-04-01"),
    updatedAt: new Date("2024-08-01"),
  },
  {
    id: "prod-006",
    name: "Aceite de Oliva Extra Virgen",
    description: "Aceite premium de primera prensa en frío, 500ml",
    price: 18.99,
    stock: 0,
    category: "food",
    status: "inactive",
    sku: "ACE-OLV-500",
    imageUrl: "https://placehold.co/100x100/827717/ffffff?text=ACE",
    createdAt: new Date("2024-02-28"),
    updatedAt: new Date("2024-06-30"),
  },
  {
    id: "prod-007",
    name: "Clean Code - Robert Martin",
    description: "Guía definitiva para escribir código limpio y mantenible",
    price: 45.99,
    stock: 30,
    category: "books",
    status: "active",
    sku: "BK-CLEAN-001",
    imageUrl: "https://placehold.co/100x100/5e35b1/ffffff?text=CLN",
    createdAt: new Date("2024-01-10"),
    updatedAt: new Date("2024-03-15"),
  },
  {
    id: "prod-008",
    name: "Design Patterns - GoF",
    description: "Patrones de diseño clásicos de la banda de los cuatro",
    price: 55.99,
    stock: 15,
    category: "books",
    status: "active",
    sku: "BK-DESP-001",
    imageUrl: "https://placehold.co/100x100/00695c/ffffff?text=DES",
    createdAt: new Date("2024-03-20"),
    updatedAt: new Date("2024-05-20"),
  },
  {
    id: "prod-009",
    name: "AirPods Pro 2",
    description: "Auriculares inalámbricos con cancelación de ruido activa",
    price: 249.99,
    stock: 75,
    category: "electronics",
    status: "active",
    sku: "APP2-USB-C",
    imageUrl: "https://placehold.co/100x100/37474f/ffffff?text=APP",
    createdAt: new Date("2024-05-15"),
    updatedAt: new Date("2024-07-25"),
  },
  {
    id: "prod-010",
    name: "iPad Air M2",
    description: "Tablet con chip M2, pantalla Liquid Retina 10.9\"",
    price: 799.99,
    stock: 40,
    category: "electronics",
    status: "active",
    sku: "IPA-M2-256",
    imageUrl: "https://placehold.co/100x100/0277bd/ffffff?text=IPA",
    createdAt: new Date("2024-06-01"),
    updatedAt: new Date("2024-08-10"),
  },
  {
    id: "prod-011",
    name: "Sudadera Hoodie Classic",
    description: "Sudadera con capucha, forro polar interior",
    price: 59.99,
    stock: 85,
    category: "clothing",
    status: "active",
    sku: "SUD-HOOD-CL",
    imageUrl: "https://placehold.co/100x100/455a64/ffffff?text=SUD",
    createdAt: new Date("2024-02-15"),
    updatedAt: new Date("2024-04-10"),
  },
  {
    id: "prod-012",
    name: "Monitor 4K 27\" Dell",
    description: "Monitor IPS 4K UHD, 60Hz, USB-C con carga 90W",
    price: 449.99,
    stock: 2,
    category: "electronics",
    status: "active",
    sku: "MON-DELL-4K27",
    imageUrl: "https://placehold.co/100x100/263238/ffffff?text=MON",
    createdAt: new Date("2024-04-20"),
    updatedAt: new Date("2024-06-15"),
  },
  {
    id: "prod-013",
    name: "Teclado Mecánico RGB",
    description: "Teclado mecánico switches Cherry MX Red, retroiluminado",
    price: 129.99,
    stock: 60,
    category: "electronics",
    status: "discontinued",
    sku: "TEC-MEC-RGB",
    imageUrl: "https://placehold.co/100x100/b71c1c/ffffff?text=TEC",
    createdAt: new Date("2023-10-05"),
    updatedAt: new Date("2024-01-20"),
  },
  {
    id: "prod-014",
    name: "The Pragmatic Programmer",
    description: "Guía esencial para desarrolladores de software",
    price: 49.99,
    stock: 22,
    category: "books",
    status: "active",
    sku: "BK-PRAG-002",
    imageUrl: "https://placehold.co/100x100/880e4f/ffffff?text=PRG",
    createdAt: new Date("2024-01-25"),
    updatedAt: new Date("2024-03-30"),
  },
  {
    id: "prod-015",
    name: "Chocolate Artesanal 85%",
    description: "Chocolate negro premium, cacao de Ecuador",
    price: 12.99,
    stock: 100,
    category: "food",
    status: "active",
    sku: "CHO-85-ECU",
    imageUrl: "https://placehold.co/100x100/4e342e/ffffff?text=CHO",
    createdAt: new Date("2024-05-10"),
    updatedAt: new Date("2024-07-20"),
  },
];

// Simular delay de red
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// API Mock
export const demoProductsApi = {
  getProducts: async (params: {
    page: number;
    pageSize: number;
    filters: DemoProductFilters;
    sorting: SortingState[];
  }): Promise<{
    data: DemoProduct[];
    pagination: {
      pageIndex: number;
      pageSize: number;
      totalRows: number;
      totalPages: number;
    };
  }> => {
    await delay(300); // Simular latencia (reducido para mejor UX)

    let filtered = [...MOCK_PRODUCTS];

    // Aplicar filtros
    if (params.filters.search) {
      const search = params.filters.search.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(search) ||
          p.description.toLowerCase().includes(search) ||
          p.sku.toLowerCase().includes(search)
      );
    }

    if (params.filters.status !== "all") {
      filtered = filtered.filter((p) => p.status === params.filters.status);
    }

    if (params.filters.category !== "all") {
      filtered = filtered.filter((p) => p.category === params.filters.category);
    }

    if (params.filters.minPrice !== null) {
      filtered = filtered.filter((p) => p.price >= params.filters.minPrice!);
    }

    if (params.filters.maxPrice !== null) {
      filtered = filtered.filter((p) => p.price <= params.filters.maxPrice!);
    }

    // Aplicar ordenamiento
    if (params.sorting.length > 0) {
      const { id, desc } = params.sorting[0];
      filtered.sort((a, b) => {
        const aVal = a[id as keyof DemoProduct];
        const bVal = b[id as keyof DemoProduct];

        if (aVal === null || aVal === undefined) return 1;
        if (bVal === null || bVal === undefined) return -1;

        if (typeof aVal === "string" && typeof bVal === "string") {
          return desc ? bVal.localeCompare(aVal) : aVal.localeCompare(bVal);
        }

        if (typeof aVal === "number" && typeof bVal === "number") {
          return desc ? bVal - aVal : aVal - bVal;
        }

        if (aVal instanceof Date && bVal instanceof Date) {
          return desc ? bVal.getTime() - aVal.getTime() : aVal.getTime() - bVal.getTime();
        }

        return 0;
      });
    }

    const totalRows = filtered.length;
    const totalPages = Math.ceil(totalRows / params.pageSize);

    // Aplicar paginación
    const start = params.page * params.pageSize;
    const end = start + params.pageSize;
    const paginatedData = filtered.slice(start, end);

    return {
      data: paginatedData,
      pagination: {
        pageIndex: params.page,
        pageSize: params.pageSize,
        totalRows,
        totalPages,
      },
    };
  },

  getStats: async (): Promise<DemoProductStats> => {
    await delay(500);

    const active = MOCK_PRODUCTS.filter((p) => p.status === "active").length;
    const inactive = MOCK_PRODUCTS.filter((p) => p.status === "inactive").length;
    const discontinued = MOCK_PRODUCTS.filter((p) => p.status === "discontinued").length;
    const lowStock = MOCK_PRODUCTS.filter((p) => p.stock > 0 && p.stock <= 5).length;
    const totalValue = MOCK_PRODUCTS.reduce((sum, p) => sum + p.price * p.stock, 0);

    return {
      total: MOCK_PRODUCTS.length,
      active,
      inactive,
      discontinued,
      lowStock,
      totalValue,
    };
  },

  createProduct: async (data: CreateProductInput): Promise<DemoProduct> => {
    await delay(600);

    const newProduct: DemoProduct = {
      ...data,
      id: `prod-${Date.now()}`,
      imageUrl: data.imageUrl || "https://placehold.co/100x100/666/fff?text=NEW",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    MOCK_PRODUCTS.unshift(newProduct);
    return newProduct;
  },

  updateProduct: async (id: string, data: Partial<CreateProductInput>): Promise<DemoProduct> => {
    await delay(600);

    const index = MOCK_PRODUCTS.findIndex((p) => p.id === id);
    if (index === -1) {
      throw new Error("Producto no encontrado");
    }

    MOCK_PRODUCTS[index] = {
      ...MOCK_PRODUCTS[index],
      ...data,
      updatedAt: new Date(),
    };

    return MOCK_PRODUCTS[index];
  },

  deleteProduct: async (id: string): Promise<void> => {
    await delay(400);

    const index = MOCK_PRODUCTS.findIndex((p) => p.id === id);
    if (index === -1) {
      throw new Error("Producto no encontrado");
    }

    MOCK_PRODUCTS.splice(index, 1);
  },

  bulkDelete: async (ids: string[]): Promise<void> => {
    await delay(600);

    ids.forEach((id) => {
      const index = MOCK_PRODUCTS.findIndex((p) => p.id === id);
      if (index !== -1) {
        MOCK_PRODUCTS.splice(index, 1);
      }
    });
  },

  updateStatus: async (id: string, status: ProductStatus): Promise<DemoProduct> => {
    await delay(400);

    const product = MOCK_PRODUCTS.find((p) => p.id === id);
    if (!product) {
      throw new Error("Producto no encontrado");
    }

    product.status = status;
    product.updatedAt = new Date();

    return product;
  },

  getCategories: (): ProductCategory[] => {
    return ["electronics", "clothing", "food", "books", "other"];
  },

  getStatuses: (): ProductStatus[] => {
    return ["active", "inactive", "discontinued"];
  },
};

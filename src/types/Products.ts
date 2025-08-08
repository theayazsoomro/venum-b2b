export interface Product {
  _id: string;
  name: string;
  price: number;
  originalPrice?: number;
  description: string;
  category: string;
  images: string[];
  stock: number;
  sku: string;
  status: "active" | "inactive";
  createdAt: string;
  updatedAt: string;
  imageUrl?: string;
}

export interface BackendResponse {
  status: string;
  data: {
    products: Product[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalProducts: number;
      hasNext: boolean;
      hasPrev: boolean;
    };
  };
}

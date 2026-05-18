export interface Product {
  id: string;
  name: string;
  description?: string;
  categoryId: string;
  branchId?: string;
  basePrice: number;
  image?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  parentId?: string;
  displayOrder: number;
}

export interface ProductVariant {
  id: string;
  productId: string;
  name: string;
  price: number;
  sku?: string;
}

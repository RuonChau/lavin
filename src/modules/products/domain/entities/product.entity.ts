import { ProductCurrency } from "../../infrastructure/services/product.service";

export interface Product {
  id: string;
  sku?: string;
  name: string;
  description?: string;
  category_id: string;
  branch_id?: string;
  base_price: number;
  currency?: ProductCurrency;
  sizes?: string[];
  sizeConfigs?: Record<string, { price: number }>;
  sizeImages?: Record<string, string[]>;
  image?: string;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface Category {
  id: string;
  sku?: string;
  name: string;
  description?: string;
  icon?: string;
  is_active?: boolean;
  parent_id?: string;
  display_order?: number;
}

export interface ProductVariant {
  id: string;
  product_id: string;
  name: string;
  price: number;
  sku?: string;
}

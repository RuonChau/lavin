import { ProductCurrency } from "../../infrastructure/services/product.service";
import { TEntityType, TMediaType } from "../enum/media.enum";
import { TStockStatus } from "../enum/stock-status.enum";

export interface Product {
  id: string;
  sku?: string;
  name: string;
  description?: string;
  category_id: string;
  branch_id?: string;
  base_price: number;
  currency: ProductCurrency;
  sizes?: string[];
  sizeConfigs?: Record<string, { price: number }>;
  sizeImages?: Record<string, string[]>;
  image?: string;
  is_active: boolean;
  is_featured?: boolean;
  is_draft?: boolean;
  variants?: ProductVariant[];
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
  discounted_price: string;
  final_price: string;
  price: string;
  sku: string;
  image: Image[];
  is_active: boolean;
  quantity: number;
  size: string;
  sold_count: number;
  stock_status: TStockStatus;
  variant_name: string;
}

export interface Image {
  id: string;
  entity_id: string;
  entity_type: TEntityType;
  file_url: string;
  public_id: string;
  is_primary: boolean;
  media_type: TMediaType;
}

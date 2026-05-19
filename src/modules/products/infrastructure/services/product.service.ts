import { api } from '@/shared/lib/axios';
import { Product } from '../../domain/entities/product.entity';
import { unwrapList, unwrapData } from '@/shared/lib/api-response';

export interface ProductQueryParams {
  page?: number;
  limit?: number;
}

export interface ProductInput {
  name: string;
  category_id: string;
  description?: string;
  base_price?: number;
  currency?: ProductCurrency;
  star?: number;
  is_active?: boolean;
  is_featured?: boolean;
  is_draft?: boolean;
}

export interface ProductCurrency {
  currency: string;
  locale: string;
}

export type ProductFormInput = Partial<ProductInput> & {
  categoryId?: string;
  base_price?: number;
  currency?: ProductCurrency;
  is_active?: boolean;
};

function toNumber(value: unknown, fallback = 0): number {
  const numberValue = Number(value);
  return Number.isFinite(numberValue) ? numberValue : fallback;
}

function toCurrencyPayload(value?: string | ProductCurrency): ProductCurrency | undefined {
  if (!value) return undefined;
  if (typeof value === 'object') return value;

  const normalizedCurrency = value.toUpperCase();
  const currency =
    value === '$' || normalizedCurrency === 'USD'
      ? 'USD'
      : value === '\u20ac' || normalizedCurrency === 'EUR'
        ? 'EUR'
        : 'VND';
  const locale = currency === 'VND' ? 'vi-VN' : currency === 'EUR' ? 'de-DE' : 'en-US';

  return {
    currency,
    locale,
  };
}

function toProductPayload(data: ProductFormInput): Partial<ProductInput> {
  return {
    category_id: data.category_id ?? data.categoryId,
    name: data.name,
    base_price: data.base_price ?? data.base_price,
    currency: data.currency ?? toCurrencyPayload(data.currency),
    star: data.star,
    description: data.description,
    is_active: data.is_active ?? data.is_active,
    is_featured: data.is_featured,
    is_draft: data.is_draft,
  };
}

function mapServerProduct(p: Record<string, unknown>): Product {
  const category = p.category as Record<string, unknown> | undefined;
  return {
    id: (p.id ?? p._id ?? '') as string,
    sku: (p.sku ?? '') as string,
    name: (p.name ?? '') as string,
    description: p.description as string | undefined,
    category_id: (p.category_id ?? p.category_id ?? category?.id ?? '') as string,
    base_price: toNumber(p.base_price ?? p.base_price ?? p.price),
    currency: toCurrencyPayload(p.currency as string | ProductCurrency | undefined),
    image: (p.image ?? p.thumbnail ?? '') as string | undefined,
    is_active: (p.is_active ?? p.is_active ?? true) as boolean,
    created_at: p.created_at ? new Date(p.created_at as string) : p.created_at ? new Date(p.created_at as string) : new Date(),
    updated_at: p.updated_at ? new Date(p.updated_at as string) : p.updated_at ? new Date(p.updated_at as string) : new Date(),
  };
}

export const productService = {
  getProducts: async (params?: ProductQueryParams): Promise<Product[]> => {
    const response = await api.get('/products', { params });
    const items = unwrapList<Record<string, unknown>>(response.data);
    return items.map(mapServerProduct);
  },

  getProductDetail: async (id: string): Promise<Product> => {
    const response = await api.get(`/product/${id}`);
    const data = unwrapData<Record<string, unknown>>(response.data);
    return mapServerProduct(data ?? {});
  },

  createProduct: async (data: ProductFormInput): Promise<Product> => {
    const response = await api.post('/product', toProductPayload(data));
    const result = unwrapData<Record<string, unknown>>(response.data.product);
    return mapServerProduct(result ?? {});
  },

  updateProduct: async (id: string, data: ProductFormInput): Promise<Product> => {
    const response = await api.patch(`/product/${id}`, toProductPayload(data));
    const result = unwrapData<Record<string, unknown>>(response.data);
    return mapServerProduct(result ?? {});
  },

  deleteProduct: async (id: string): Promise<void> => {
    await api.delete(`/product/${id}`);
  },

  deleteAllProducts: async (): Promise<void> => {
    await api.delete('/products');
  },
};

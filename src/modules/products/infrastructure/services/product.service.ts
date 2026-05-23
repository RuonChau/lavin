import { api } from '@/shared/lib/axios';
import { Product, ProductVariant, Image } from '../../domain/entities/product.entity';
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
  currency: ProductCurrency;
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

function toRecord(value: unknown): Record<string, unknown> | undefined {
  return value && typeof value === 'object' && !Array.isArray(value)
    ? value as Record<string, unknown>
    : undefined;
}

function toStringArray(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value
      .map((item) => String(item))
      .filter(Boolean);
  }
  if (typeof value === 'string' && value) return [value];
  return [];
}

function getVariantSizes(value: unknown): string[] {
  const variant = toRecord(value);
  return toStringArray(variant?.size ?? variant?.sizes);
}

function mapServerImage(value: unknown): Image | undefined {
  const image = toRecord(value);
  if (!image) return undefined;

  return {
    id: String(image.id ?? image._id ?? ''),
    entity_id: String(image.entity_id ?? image.entityId ?? ''),
    entity_type: String(image.entity_type ?? image.entityType ?? 'PRODUCT_VARIANT') as Image['entity_type'],
    file_url: String(image.file_url ?? image.fileUrl ?? image.url ?? image.src ?? ''),
    public_id: String(image.public_id ?? image.publicId ?? ''),
    is_primary: Boolean(image.is_primary ?? image.isPrimary ?? false),
    media_type: String(image.media_type ?? image.mediaType ?? 'IMAGE') as Image['media_type'],
  };
}

function mapServerProductVariant(value: unknown): ProductVariant | undefined {
  const variant = toRecord(value);
  if (!variant) return undefined;
  const image = mapServerImage(variant.image ?? variant.primary_image ?? variant.primaryImage);

  return {
    id: String(variant.id ?? variant._id ?? ''),
    discounted_price: String(variant.discounted_price ?? variant.discountedPrice ?? '0'),
    final_price: String(variant.final_price ?? variant.finalPrice ?? variant.price ?? '0'),
    price: String(variant.price ?? '0'),
    sku: String(variant.sku ?? ''),
    image: image ? [image] : [],
    is_active: Boolean(variant.is_active ?? variant.isActive ?? true),
    quantity: toNumber(variant.quantity),
    size: toStringArray(variant.size ?? variant.sizes)[0] ?? '',
    sold_count: toNumber(variant.sold_count ?? variant.soldCount),
    stock_status: String(variant.stock_status ?? variant.stockStatus ?? 'IN_STOCK') as ProductVariant['stock_status'],
    variant_name: String(variant.variant_name ?? variant.variantName ?? ''),
  };
}

function mapServerSizeConfigs(
  product: Record<string, unknown>,
  rawVariants: unknown[],
): Record<string, { price: number }> | undefined {
  const rawConfigs = toRecord(product.sizeConfigs ?? product.size_configs);
  if (rawConfigs) {
    return Object.entries(rawConfigs).reduce<Record<string, { price: number }>>((acc, [size, config]) => {
      const configRecord = toRecord(config);
      acc[size] = {
        price: toNumber(configRecord?.price ?? config),
      };
      return acc;
    }, {});
  }

  if (rawVariants.length === 0) return undefined;

  return rawVariants.reduce<Record<string, { price: number }>>((acc, item) => {
    const variant = toRecord(item);
    if (!variant) return acc;
    getVariantSizes(variant).forEach((size) => {
      acc[size] = { price: toNumber(variant.price) };
    });
    return acc;
  }, {});
}

function mapServerSizeImages(
  product: Record<string, unknown>,
  rawVariants: unknown[],
): Record<string, string[]> | undefined {
  const rawImages = toRecord(product.sizeImages ?? product.size_images);
  if (rawImages) {
    return Object.entries(rawImages).reduce<Record<string, string[]>>((acc, [size, images]) => {
      acc[size] = Array.isArray(images)
        ? images
            .map((image) => {
              if (typeof image === 'string') return image;
              return mapServerImage(image)?.file_url ?? '';
            })
            .filter(Boolean)
        : [];
      return acc;
    }, {});
  }

  const imagesBySize = rawVariants.reduce<Record<string, string[]>>((acc, item) => {
    const variant = toRecord(item);
    if (!variant) return acc;

    const imageUrls = [
      mapServerImage(variant.image ?? variant.primary_image ?? variant.primaryImage)?.file_url,
      ...unwrapList<unknown>(variant.images ?? variant.media ?? variant.medias)
        .map((image) => mapServerImage(image)?.file_url),
    ].filter((url): url is string => Boolean(url));

    if (imageUrls.length === 0) return acc;

    getVariantSizes(variant).forEach((size) => {
      acc[size] = Array.from(new Set([...(acc[size] ?? []), ...imageUrls]));
    });
    return acc;
  }, {});

  return Object.keys(imagesBySize).length > 0 ? imagesBySize : undefined;
}

function mapServerProduct(p: Record<string, unknown>): Product {
  const category = toRecord(p.category);
  const rawVariants = unwrapList<unknown>(p.variants ?? p.product_variants ?? p.productVariants);
  const variants = rawVariants
    .map(mapServerProductVariant)
    .filter((variant): variant is ProductVariant => Boolean(variant));
  const sizes = toStringArray(p.sizes ?? p.size);
  const resolvedSizes = sizes.length > 0
    ? sizes
    : Array.from(new Set(rawVariants.flatMap(getVariantSizes)));

  return {
    id: (p.id ?? p._id ?? '') as string,
    sku: (p.sku ?? '') as string,
    name: (p.name ?? '') as string,
    description: p.description as string | undefined,
    category_id: (p.category_id ?? p.category_id ?? category?.id ?? '') as string,
    base_price: toNumber(p.base_price ?? p.base_price ?? p.price),
    currency: toCurrencyPayload(p.currency as string | ProductCurrency | undefined) ?? { currency: 'VND', locale: 'vi-VN' },
    image: (p.image ?? p.thumbnail ?? '') as string | undefined,
    is_active: (p.is_active ?? p.is_active ?? true) as boolean,
    is_featured: (p.is_featured ?? p.isFeatured) as boolean | undefined,
    is_draft: (p.is_draft ?? p.isDraft) as boolean | undefined,
    variants,
    sizes: resolvedSizes,
    sizeConfigs: mapServerSizeConfigs(p, rawVariants),
    sizeImages: mapServerSizeImages(p, rawVariants),
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
    const product = toRecord(data?.product) ?? data;
    return mapServerProduct(product ?? {});
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

/**
 * Standard API response shape from the cafe-shop server.
 * All endpoints return { success: boolean, data?: T, message?: string, ... }
 */
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  items?: T;
  user?: T;
  product?: T;
  category?: T;
  variant?: T;
  banner?: T;
  logo?: T;
  promotion?: T;
  order?: T;
  file?: T;
  resources?: T;
  categories?: T;
  products?: T;
  productVariants?: T;
  promotions?: T;
  banners?: T;
  logos?: T;
  message?: string;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
  };
  pagination?: {
    page?: number;
    limit?: number;
    totalItems?: number;
    totalPages?: number;
    hasNextPage?: boolean;
    hasPrevPage?: boolean;
  };
}

/**
 * Paginated list response shape.
 */
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ServerPagination {
  page?: number;
  limit?: number;
  total?: number;
  totalItems?: number;
  totalPages?: number;
  hasNextPage?: boolean;
  hasPrevPage?: boolean;
}

export interface NormalizedPaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  pagination?: ServerPagination;
}

const payloadKeys = [
  'data',
  'items',
  'user',
  'product',
  'category',
  'variant',
  'banner',
  'logo',
  'promotion',
  'order',
  'file',
  'resources',
  'categories',
  'products',
  'productVariants',
  'promotions',
  'banners',
  'logos',
] as const;

function getResponsePayload<T>(response: ApiResponse<T>): T | undefined {
  for (const key of payloadKeys) {
    const value = response[key as keyof ApiResponse<T>];
    if (value !== undefined) return value as T;
  }
  return undefined;
}

/**
 * Extract the `data` field from an API response, or return the raw value
 * if the server sends the payload directly (fallback).
 */
export function unwrapData<T>(responseData: ApiResponse<T> | T): T {
  if (
    responseData !== null &&
    typeof responseData === 'object' &&
    'success' in (responseData as object)
  ) {
    const response = responseData as ApiResponse<T>;
    const payload = getResponsePayload(response);
    if (payload !== undefined) return payload as T;
  }
  return responseData as T;
}

/**
 * Extract a paginated list from an API response.
 * Handles both `{ data: { items, total } }` and `{ data: T[] }` shapes.
 */
export function unwrapList<T>(responseData: unknown): T[] {
  // Shape: { success, data: { items: T[], ... } }
  if (responseData && typeof responseData === 'object' && 'success' in (responseData as object)) {
    const response = responseData as ApiResponse<unknown>;
    const inner = getResponsePayload(response);

    if (Array.isArray(inner)) return inner as T[];
    if (inner && typeof inner === 'object' && 'items' in (inner as object)) {
      return ((inner as PaginatedResponse<T>).items ?? []) as T[];
    }
    if (inner && typeof inner === 'object' && 'data' in (inner as object)) {
      return ((inner as { data: T[] }).data ?? []) as T[];
    }
    return [];
  }
  // Shape: T[] directly
  if (Array.isArray(responseData)) return responseData as T[];
  return [];
}

export function unwrapPaginated<T>(responseData: unknown): NormalizedPaginatedResponse<T> {
  const data = unwrapList<T>(responseData);

  if (responseData && typeof responseData === 'object' && 'success' in responseData) {
    const response = responseData as ApiResponse<unknown>;
    const pagination: ServerPagination | undefined = response.pagination ?? response.meta;

    return {
      data,
      total: pagination?.totalItems ?? pagination?.total ?? data.length,
      page: pagination?.page ?? 1,
      limit: pagination?.limit ?? data.length,
      pagination,
    };
  }

  return {
    data,
    total: data.length,
    page: 1,
    limit: data.length,
  };
}

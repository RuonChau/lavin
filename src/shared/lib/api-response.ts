/**
 * Standard API response shape from the cafe-shop server.
 * All endpoints return { success: boolean, data?: T, message?: string, ... }
 */
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  items?: T;
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
    if (response.data !== undefined) return response.data as T;
    if (response.items !== undefined) return response.items as T;
    if (response.categories !== undefined) return response.categories as T;
    if (response.products !== undefined) return response.products as T;
    if (response.productVariants !== undefined) return response.productVariants as T;
    if (response.promotions !== undefined) return response.promotions as T;
    if (response.banners !== undefined) return response.banners as T;
    if (response.logos !== undefined) return response.logos as T;
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
    const inner =
      response.data ??
      response.items ??
      response.categories ??
      response.products ??
      response.productVariants ??
      response.promotions ??
      response.banners ??
      response.logos;

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

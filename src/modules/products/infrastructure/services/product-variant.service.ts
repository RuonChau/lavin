import { api } from '@/shared/lib/axios';

export interface ProductVariantInput {
  product_id: string;
  product_name: string;
  size: string;
  images: string[];
  price: number;
  discounted_price?: number;
  final_price: number;
  sold_count?: number;
  stock_status?: string;
  expiration_date?: string;
  is_unlimited?: boolean;
  is_active: boolean;
}

export const productVariantService = {
  getProductVariants: async (params?: { page?: number; limit?: number }): Promise<any[]> => {
    const response = await api.get('/product-variants', { params });
    return response.data;
  },
  
  getVariantDetail: async (id: string): Promise<any> => {
    const response = await api.get(`/product-variant/${id}`);
    return response.data;
  },
  
  createVariant: async (data: ProductVariantInput): Promise<any> => {
    const response = await api.post('/product-variant', data);
    return response.data;
  },
  
  updateVariant: async (id: string, data: ProductVariantInput): Promise<any> => {
    const response = await api.patch(`/product-variant/${id}`, data);
    return response.data;
  },
  
  deleteVariant: async (id: string): Promise<void> => {
    await api.delete(`/product-variant/${id}`);
  },
  
  deleteAllVariants: async (): Promise<void> => {
    await api.delete('/product-variants');
  }
};

import { api } from '@/shared/lib/axios';
import { unwrapData, unwrapList } from '@/shared/lib/api-response';

export interface ProductVariantInput {
  product_id: string;
  variant_name: string;
  size: string[];
  // images: File[];
  price: number;
  discounted_price: number;
  quantity: number;
  stock_status: string;
  is_active: boolean;
  imagesBySize?: Record<string, File[]>;

}

export interface ProductVariant extends ProductVariantInput {
  id?: string;
}

export const productVariantService = {
  createVariant: async (data: ProductVariantInput): Promise<ProductVariant> => {
    const formData = new FormData();

    formData.append("product_id", data.product_id);
    formData.append("variant_name", String(data.variant_name));
    formData.append("price", String(data.price));
    formData.append("stock_status", String(data.stock_status));

    data.size.forEach((size) => {
      formData.append("size", size);
    });

    if (data.discounted_price !== undefined) {
      formData.append("discounted_price", String(data.discounted_price));
    }

    if (data.quantity !== undefined) {
      formData.append("quantity", String(data.quantity));
    }

    if (data.is_active !== undefined) {
      formData.append("is_active", String(data.is_active));
    }

    // Tên field "images" phải khớp với multer bên BE
    const imageGroups = data.size.map((size) => {
      const files = data.imagesBySize?.[size] ?? [];

      files.forEach((file) => {
        formData.append("images", file);
      });

      return {
        size,
        count: files.length,
      };
    });
    formData.append("image_groups", JSON.stringify(imageGroups));

    
    const response = await api.post("/product-variant", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return unwrapData<ProductVariant>(response.data);
  },


  updateVariant: async (id: string, data: FormData | ProductVariantInput): Promise<ProductVariant> => {
    const headers = data instanceof FormData ? { "Content-Type": "multipart/form-data" } : undefined;
    const response = await api.patch(`/product-variant/${id}`, data, { headers });
    return unwrapData<ProductVariant>(response.data);
  },

  // get all variants with pagination
  getProductVariants: async (params?: { page?: number; limit?: number }): Promise<ProductVariant[]> => {
    const response = await api.get('/product-variants', { params });
    return unwrapList<ProductVariant>(response.data);
  },

  
  getVariantDetail: async (id: string): Promise<ProductVariant> => {
    const response = await api.get(`/product-variant/${id}`);
    return unwrapData<ProductVariant>(response.data);
  },
  
  deleteVariant: async (id: string): Promise<void> => {
    await api.delete(`/product-variant/${id}`);
  },
  
  deleteAllVariants: async (): Promise<void> => {
    await api.delete('/product-variants');
  }
};

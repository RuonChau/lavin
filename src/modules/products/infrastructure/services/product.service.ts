import { api } from '@/shared/lib/axios';
import { Product } from '../../domain/entities/product.entity';

export interface ProductQueryParams {
  page?: number;
  limit?: number;
}

export interface ProductInput {
  name: string;
  category_id: string;
  voucher_id?: string;
  description?: string;
  star?: number;
  is_active: boolean;
  is_featured: boolean;
  id_draft?: string;
  currency: {
    currency: string;
    locale: string;
  };
}

export const productService = {
  getProducts: async (params?: ProductQueryParams): Promise<Product[]> => {
    // Mocking products for BrewGlass ERP concept
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          {
            id: 'prod-1',
            name: 'Phê La Latte',
            description: 'Sự kết hợp hoàn hảo giữa espresso và sữa tươi.',
            categoryId: 'cat-1',
            basePrice: 65000,
            image: 'https://picsum.photos/seed/coffee1/200/200',
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date()
          },
          {
            id: 'prod-2',
            name: 'Espresso Arabica',
            description: 'Đậm đà hương vị cà phê hạt Arabica cao cấp.',
            categoryId: 'cat-1',
            basePrice: 45000,
            image: 'https://picsum.photos/seed/coffee2/200/200',
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date()
          },
          {
            id: 'prod-3',
            name: 'Matcha Latte',
            description: 'Matcha Nhật Bản hòa quyện cùng sữa tươi béo ngậy.',
            categoryId: 'cat-2',
            basePrice: 55000,
            image: 'https://picsum.photos/seed/coffee3/200/200',
            isActive: false,
            createdAt: new Date(),
            updatedAt: new Date()
          },
          {
            id: 'prod-4',
            name: 'Caramel Macchiato',
            description: 'Vị ngọt của caramel kết hợp cùng cà phê sữa.',
            categoryId: 'cat-1',
            basePrice: 60000,
            image: 'https://picsum.photos/seed/coffee4/200/200',
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date()
          },
          {
            id: 'prod-5',
            name: 'Trà Đào Cam Sả',
            description: 'Thanh mát giải nhiệt mùa hè.',
            categoryId: 'cat-3',
            basePrice: 50000,
            image: 'https://picsum.photos/seed/coffee5/200/200',
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date()
          }
        ]);
      }, 500);
    });
  },
  
  getProductDetail: async (id: string): Promise<Product> => {
    const response = await api.get<Product>(`/product/${id}`);
    return response.data;
  },
  
  createProduct: async (data: ProductInput): Promise<Product> => {
    const response = await api.post<Product>('/product', data);
    return response.data;
  },
  
  updateProduct: async (id: string, data: ProductInput): Promise<Product> => {
    const response = await api.patch<Product>(`/product/${id}`, data);
    return response.data;
  },
  
  deleteProduct: async (id: string): Promise<void> => {
    await api.delete(`/product/${id}`);
  },
  
  deleteAllProducts: async (): Promise<void> => {
    await api.delete('/products');
  }
};

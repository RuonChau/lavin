import { api } from '@/shared/lib/axios';
import { Category } from '../../domain/entities/product.entity';

export const categoryService = {
  getCategories: async (): Promise<Category[]> => {
    // Mocking categories
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          { id: 'cat-1', name: 'Cà phê', description: 'Các món cà phê pha máy và pha phin', displayOrder: 0 },
          { id: 'cat-1-1', name: 'Cà phê máy', parentId: 'cat-1', displayOrder: 0 },
          { id: 'cat-1-2', name: 'Cà phê phin', parentId: 'cat-1', displayOrder: 1 },
          { id: 'cat-2', name: 'Trà & Đá xay', description: 'Các loại trà trái cây và matcha', displayOrder: 1 },
          { id: 'cat-2-1', name: 'Trà trái cây', parentId: 'cat-2', displayOrder: 0 },
          { id: 'cat-2-2', name: 'Matcha', parentId: 'cat-2', displayOrder: 1 },
          { id: 'cat-3', name: 'Bánh & Dessert', description: 'Các loại bánh ngọt ăn kèm', displayOrder: 2 },
          { id: 'cat-4', name: 'Đồ đóng chai', description: 'Cà phê đóng chai mang về', displayOrder: 3 }
        ]);
      }, 300);
    });
  },
  
  getCategoryDetail: async (id: string): Promise<Category> => {
    const response = await api.get<Category>(`/category/${id}`);
    return response.data;
  },
  
  createCategory: async (data: Partial<Category>): Promise<Category> => {
    const response = await api.post<Category>('/category', data);
    return response.data;
  },
  
  updateCategory: async (id: string, data: Partial<Category>): Promise<Category> => {
    const response = await api.patch<Category>(`/category/${id}`, data);
    return response.data;
  },
  
  deleteCategory: async (id: string): Promise<void> => {
    await api.delete(`/category/${id}`);
  },
  
  deleteAllCategories: async (): Promise<void> => {
    await api.delete('/categories');
  }
};

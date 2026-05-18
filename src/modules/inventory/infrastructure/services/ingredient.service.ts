import { api } from '@/shared/lib/axios';

export interface IngredientInput {
  name: string;
  unit: string;
  min_stock_level: number;
}

export const ingredientService = {
  getIngredients: async (params?: { page?: number; limit?: number }): Promise<any[]> => {
    const response = await api.get('/ingredients', { params });
    return response.data;
  },
  
  getIngredientDetail: async (id: string): Promise<any> => {
    const response = await api.get(`/ingredient/${id}`);
    return response.data;
  },
  
  createIngredient: async (data: IngredientInput): Promise<any> => {
    const response = await api.post('/ingredient', data);
    return response.data;
  },
  
  updateIngredient: async (id: string, data: Partial<IngredientInput>): Promise<any> => {
    const response = await api.patch(`/ingredient/${id}`, data);
    return response.data;
  },
  
  deleteIngredient: async (id: string): Promise<void> => {
    await api.delete(`/ingredient/${id}`);
  }
};

import { api } from '@/shared/lib/axios';
import { unwrapData, unwrapList } from '@/shared/lib/api-response';

export interface IngredientInput {
  name: string;
  unit: string;
  min_stock_level: number;
}

export const ingredientService = {
  getIngredients: async (params?: { page?: number; limit?: number }): Promise<any[]> => {
    const response = await api.get('/ingredients', { params });
    return unwrapList(response.data);
  },
  
  getIngredientDetail: async (id: string): Promise<any> => {
    const response = await api.get(`/ingredient/${id}`);
    return unwrapData(response.data);
  },
  
  createIngredient: async (data: IngredientInput): Promise<any> => {
    const response = await api.post('/ingredient', data);
    return unwrapData(response.data);
  },
  
  updateIngredient: async (id: string, data: Partial<IngredientInput>): Promise<any> => {
    const response = await api.patch(`/ingredient/${id}`, data);
    return unwrapData(response.data);
  },
  
  deleteIngredient: async (id: string): Promise<void> => {
    await api.delete(`/ingredient/${id}`);
  }
};

import { api } from '@/shared/lib/axios';
import { unwrapData, unwrapList } from '@/shared/lib/api-response';

export interface RecipeInput {
  variant_id: string;
  ingredient_id: string;
  quantity: number;
}

export const recipeService = {
  getRecipes: async (params?: { page?: number; limit?: number }): Promise<any[]> => {
    const response = await api.get('/recipes', { params });
    return unwrapList(response.data);
  },
  
  getRecipeDetail: async (id: string): Promise<any> => {
    const response = await api.get(`/recipe/${id}`);
    return unwrapData(response.data);
  },
  
  createRecipe: async (data: RecipeInput): Promise<any> => {
    const response = await api.post('/recipe', data);
    return unwrapData(response.data);
  },
  
  updateRecipe: async (id: string, data: RecipeInput): Promise<any> => {
    const response = await api.patch(`/recipe/${id}`, data);
    return unwrapData(response.data);
  },
  
  deleteRecipe: async (id: string): Promise<void> => {
    await api.delete(`/recipe/${id}`);
  }
};

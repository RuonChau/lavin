import { api } from '@/shared/lib/axios';
import { unwrapData, unwrapList } from '@/shared/lib/api-response';

export interface ToppingOptionInput {
  option_name: string;
  additional_price: number;
  is_active: boolean;
}

export const toppingOptionService = {
  getToppingOptions: async (params?: { page?: number; limit?: number }): Promise<any[]> => {
    const response = await api.get('/topping-options', { params });
    return unwrapList(response.data);
  },
  
  getToppingOptionDetail: async (id: string): Promise<any> => {
    const response = await api.get(`/topping-option/${id}`);
    return unwrapData(response.data);
  },
  
  createToppingOption: async (data: ToppingOptionInput): Promise<any> => {
    const response = await api.post('/topping-option', data);
    return unwrapData(response.data);
  },
  
  updateToppingOption: async (id: string, data: ToppingOptionInput): Promise<any> => {
    const response = await api.patch(`/topping-option/${id}`, data);
    return unwrapData(response.data);
  },
  
  deleteToppingOption: async (id: string): Promise<void> => {
    await api.delete(`/topping-option/${id}`);
  }
};

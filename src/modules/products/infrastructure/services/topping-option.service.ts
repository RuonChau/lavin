import { api } from '@/shared/lib/axios';

export interface ToppingOptionInput {
  option_name: string;
  additional_price: number;
  is_active: boolean;
}

export const toppingOptionService = {
  getToppingOptions: async (params?: { page?: number; limit?: number }): Promise<any[]> => {
    const response = await api.get('/topping-options', { params });
    return response.data;
  },
  
  getToppingOptionDetail: async (id: string): Promise<any> => {
    const response = await api.get(`/topping-option/${id}`);
    return response.data;
  },
  
  createToppingOption: async (data: ToppingOptionInput): Promise<any> => {
    const response = await api.post('/topping-option', data);
    return response.data;
  },
  
  updateToppingOption: async (id: string, data: ToppingOptionInput): Promise<any> => {
    const response = await api.patch(`/topping-option/${id}`, data);
    return response.data;
  },
  
  deleteToppingOption: async (id: string): Promise<void> => {
    await api.delete(`/topping-option/${id}`);
  }
};

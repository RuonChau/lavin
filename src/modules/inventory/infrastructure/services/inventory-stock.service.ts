import { api } from '@/shared/lib/axios';
import { unwrapData, unwrapList } from '@/shared/lib/api-response';

export interface InventoryStockInput {
  branch_id: string;
  ingredient_id: string;
  current_quantity: number;
  reserved_quantity: number;
  available_quantity: number;
  last_updated: string;
}

export const inventoryStockService = {
  getInventoryStocks: async (params?: { page?: number; limit?: number }): Promise<any[]> => {
    const response = await api.get('/inventory-stocks', { params });
    return unwrapList(response.data);
  },
  
  getInventoryStockDetail: async (id: string): Promise<any> => {
    const response = await api.get(`/inventory-stock/${id}`);
    return unwrapData(response.data);
  },
  
  createInventoryStock: async (data: InventoryStockInput): Promise<any> => {
    const response = await api.post('/inventory-stock', data);
    return unwrapData(response.data);
  },
  
  updateInventoryStock: async (id: string, data: InventoryStockInput): Promise<any> => {
    const response = await api.patch(`/inventory-stock/${id}`, data);
    return unwrapData(response.data);
  },
  
  deleteInventoryStock: async (id: string): Promise<void> => {
    await api.delete(`/inventory-stock/${id}`);
  }
};

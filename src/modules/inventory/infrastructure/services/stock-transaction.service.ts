import { api } from '@/shared/lib/axios';
import { unwrapData, unwrapList } from '@/shared/lib/api-response';

export interface StockTransactionInput {
  ingredient_id: string;
  branch_id: string;
  type: string;
  quantity: number;
  before_quantity: number;
  after_quantity: number;
  reference_type: string;
  reference_id: string;
  note?: string;
}

export const stockTransactionService = {
  getStockTransactions: async (params?: { page?: number; limit?: number }): Promise<any[]> => {
    const response = await api.get('/stock-transactions', { params });
    return unwrapList(response.data);
  },
  
  getStockTransactionDetail: async (id: string): Promise<any> => {
    const response = await api.get(`/stock-transaction/${id}`);
    return unwrapData(response.data);
  },
  
  createStockTransaction: async (data: StockTransactionInput): Promise<any> => {
    const response = await api.post('/stock-transaction', data);
    return unwrapData(response.data);
  },
  
  updateStockTransaction: async (id: string, data: StockTransactionInput): Promise<any> => {
    const response = await api.patch(`/stock-transaction/${id}`, data);
    return unwrapData(response.data);
  },
  
  deleteStockTransaction: async (id: string): Promise<void> => {
    await api.delete(`/stock-transaction/${id}`);
  }
};

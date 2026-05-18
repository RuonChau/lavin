import { api } from '@/shared/lib/axios';

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
    return response.data;
  },
  
  getStockTransactionDetail: async (id: string): Promise<any> => {
    const response = await api.get(`/stock-transaction/${id}`);
    return response.data;
  },
  
  createStockTransaction: async (data: StockTransactionInput): Promise<any> => {
    const response = await api.post('/stock-transaction', data);
    return response.data;
  },
  
  updateStockTransaction: async (id: string, data: StockTransactionInput): Promise<any> => {
    const response = await api.patch(`/stock-transaction/${id}`, data);
    return response.data;
  },
  
  deleteStockTransaction: async (id: string): Promise<void> => {
    await api.delete(`/stock-transaction/${id}`);
  }
};

import { api } from '@/shared/lib/axios';

export interface OrderInput {
  items: any[];
  note?: string;
  payment_method: string;
  voucher_code?: string;
  branch_id: string;
  customer_id?: string;
}

export const orderService = {
  getOrders: async (params?: { page?: number; limit?: number }): Promise<any[]> => {
    const response = await api.get('/orders', { params });
    return response.data;
  },
  
  getOrderHistory: async (params?: { page?: number; limit?: number }): Promise<any[]> => {
    const response = await api.get('/orders/history', { params });
    return response.data;
  },
  
  getOrderDetail: async (id: string): Promise<any> => {
    const response = await api.get(`/order/${id}`);
    return response.data;
  },
  
  createOrder: async (data: OrderInput): Promise<any> => {
    const response = await api.post('/order', data);
    return response.data;
  },
  
  updateOrderStatus: async (id: string, data: any): Promise<any> => {
    const response = await api.patch(`/order/${id}/status`, data);
    return response.data;
  },
  
  cancelOrder: async (id: string): Promise<void> => {
    await api.patch(`/order/${id}/cancel`);
  }
};

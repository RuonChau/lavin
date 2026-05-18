import { api } from '@/shared/lib/axios';

export interface CustomerInput {
  name: string;
  phone_number: string;
  email: string;
  loyalty_points?: number;
}

export const customerService = {
  getCustomers: async (params?: { page?: number; limit?: number }): Promise<any[]> => {
    const response = await api.get('/customers', { params });
    return response.data;
  },
  
  getCustomerDetail: async (id: string): Promise<any> => {
    const response = await api.get(`/customer/${id}`);
    return response.data;
  },
  
  createCustomer: async (data: CustomerInput): Promise<any> => {
    const response = await api.post('/customer', data);
    return response.data;
  },
  
  updateCustomer: async (id: string, data: CustomerInput): Promise<any> => {
    const response = await api.patch(`/customer/${id}`, data);
    return response.data;
  },
  
  deleteCustomer: async (id: string): Promise<void> => {
    await api.delete(`/customer/${id}`);
  }
};

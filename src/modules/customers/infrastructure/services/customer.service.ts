import { api } from '@/shared/lib/axios';
import { unwrapData, unwrapPaginated } from '@/shared/lib/api-response';

export interface CustomerTier {
  id: string;
  name: string;
  min_points: number;
  benefits: string[];
  color: string | null;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email: string;
  loyalty_points: number;
  total_spent?: number;
  tier?: CustomerTier | null;
  created_at?: string;
  updated_at?: string;
}

export interface CustomerInput {
  name: string;
  phone: string;
  email: string;
  loyalty_points?: number;
}

export interface PaginatedCustomers {
  success: boolean;
  data: Customer[];
  total: number;
  page: number;
  limit: number;
}

export const customerService = {
  getCustomers: async (params?: { page?: number; limit?: number }): Promise<PaginatedCustomers> => {
    const response = await api.get<PaginatedCustomers>('/customers', { params });
    const paginated = unwrapPaginated<Customer>(response.data);
    return {
      success: true,
      data: paginated.data,
      total: paginated.total,
      page: paginated.page,
      limit: paginated.limit,
    };
  },

  getCustomerDetail: async (id: string): Promise<Customer> => {
    const response = await api.get<{ success: boolean; data: Customer }>(`/customer/${id}`);
    return unwrapData<Customer>(response.data);
  },

  createCustomer: async (data: CustomerInput): Promise<Customer> => {
    const response = await api.post<{ success: boolean; data: Customer }>('/customer', data);
    return unwrapData<Customer>(response.data);
  },

  updateCustomer: async (id: string, data: CustomerInput): Promise<Customer> => {
    const response = await api.patch<{ success: boolean; data: Customer }>(`/customer/${id}`, data);
    return unwrapData<Customer>(response.data);
  },

  deleteCustomer: async (id: string): Promise<void> => {
    await api.delete(`/customer/${id}`);
  }
};

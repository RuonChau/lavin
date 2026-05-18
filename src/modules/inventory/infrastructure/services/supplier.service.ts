import { api } from '@/shared/lib/axios';

export interface SupplierInput {
  supplier_name: string;
  contact_person: string;
  phone: string;
  email: string;
  address: string;
  tax_code: string;
  is_active: boolean;
  note?: string;
}

export const supplierService = {
  getSuppliers: async (params?: { page?: number; limit?: number }): Promise<any[]> => {
    const response = await api.get('/suppliers', { params });
    return response.data;
  },
  
  getSupplierDetail: async (id: string): Promise<any> => {
    const response = await api.get(`/supplier/${id}`);
    return response.data;
  },
  
  createSupplier: async (data: SupplierInput): Promise<any> => {
    const response = await api.post('/supplier', data);
    return response.data;
  },
  
  updateSupplier: async (id: string, data: SupplierInput): Promise<any> => {
    const response = await api.patch(`/supplier/${id}`, data);
    return response.data;
  },
  
  deleteSupplier: async (id: string): Promise<void> => {
    await api.delete(`/supplier/${id}`);
  }
};

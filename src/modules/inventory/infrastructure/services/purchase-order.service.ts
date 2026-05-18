import { api } from '@/shared/lib/axios';

export interface PurchaseOrderInput {
  po_code: string;
  supplier_id: string;
  branch_id: string;
  created_by: string;
  order_date: string;
  received_date?: string;
  total_value: number;
  status: string;
  note?: string;
}

export const purchaseOrderService = {
  getPurchaseOrders: async (params?: { page?: number; limit?: number }): Promise<any[]> => {
    const response = await api.get('/purchase-orders', { params });
    return response.data;
  },
  
  getPurchaseOrderDetail: async (id: string): Promise<any> => {
    const response = await api.get(`/purchase-order/${id}`);
    return response.data;
  },
  
  createPurchaseOrder: async (data: PurchaseOrderInput): Promise<any> => {
    const response = await api.post('/purchase-order', data);
    return response.data;
  },
  
  updatePurchaseOrder: async (id: string, data: PurchaseOrderInput): Promise<any> => {
    const response = await api.patch(`/purchase-order/${id}`, data);
    return response.data;
  },
  
  deletePurchaseOrder: async (id: string): Promise<void> => {
    await api.delete(`/purchase-order/${id}`);
  }
};

import { api } from '@/shared/lib/axios';
import { unwrapData, unwrapList } from '@/shared/lib/api-response';

export interface VoucherInput {
  name: string;
  code?: string;
  discount_type: "PERCENTAGE" | "FIXED_AMOUNT" | "BUY_X_GET_Y";
  discount_value: number;
  promotion_scope: "ORDER" | "PRODUCT" | "VARIANT" | "CATEGORY" | "BRANCH";
  min_order_value?: number;
  max_discount_amount?: number;
  usage_limit?: number;
  start_at?: string;
  end_at?: string;
  is_active?: boolean;
  description?: string;
  targets?: {
    branch_ids?: string[];
  };
}

export const voucherService = {
  getVouchers: async (params?: { page?: number; limit?: number }): Promise<Record<string, unknown>[]> => {
    const response = await api.get('/promotions', { params });
    return unwrapList<Record<string, unknown>>(response.data);
  },
  
  getVoucherDetail: async (id: string): Promise<Record<string, unknown>> => {
    const response = await api.get(`/promotion/${id}`);
    return unwrapData<Record<string, unknown>>(response.data);
  },
  
  createVoucher: async (data: VoucherInput): Promise<Record<string, unknown>> => {
    const response = await api.post('/promotion', data);
    return unwrapData<Record<string, unknown>>(response.data);
  },
  
  updateVoucher: async (id: string, data: Partial<VoucherInput>): Promise<Record<string, unknown>> => {
    const response = await api.patch(`/promotion/${id}`, data);
    return unwrapData<Record<string, unknown>>(response.data);
  },
  
  deleteVoucher: async (id: string): Promise<void> => {
    await api.delete(`/promotion/${id}`);
  }
};

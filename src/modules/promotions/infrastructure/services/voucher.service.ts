import { api } from '@/shared/lib/axios';

export interface VoucherInput {
  promo_name: string;
  promo_code: string;
  discount_type?: "PERCENT" | "FIXED";
  discount_value: number;
  min_order_value: number;
  max_discount_value?: number;
  usage_limit?: number;
  start_date?: string;
  end_date?: string;
  is_active?: boolean;
}

export const voucherService = {
  getVouchers: async (params?: { page?: number; limit?: number }): Promise<any[]> => {
    const response = await api.get('/vouchers', { params });
    return response.data;
  },
  
  getVoucherDetail: async (id: string): Promise<any> => {
    const response = await api.get(`/voucher/${id}`);
    return response.data;
  },
  
  createVoucher: async (data: VoucherInput): Promise<any> => {
    const response = await api.post('/voucher', data);
    return response.data;
  },
  
  updateVoucher: async (id: string, data: VoucherInput): Promise<any> => {
    const response = await api.patch(`/voucher/${id}`, data);
    return response.data;
  },
  
  deleteVouchers: async (): Promise<void> => {
    await api.delete('/vouchers');
  },
  
  deleteVoucher: async (id: string): Promise<void> => {
    await api.delete(`/voucher/${id}`);
  }
};

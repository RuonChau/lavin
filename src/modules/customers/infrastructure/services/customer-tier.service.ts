import { api } from '@/shared/lib/axios';
import { unwrapData, unwrapList } from '@/shared/lib/api-response';

export interface CustomerTierItem {
  id: string;
  name: string;
  min_points: number;
  benefits: string[];
  color: string | null;
  display_order: number;
}

export interface CustomerTierInput {
  name: string;
  min_points: number;
  benefits?: string[];
  color?: string;
  display_order?: number;
}

export const customerTierService = {
  getTiers: async (): Promise<CustomerTierItem[]> => {
    const response = await api.get('/customer-tiers');
    return unwrapList<CustomerTierItem>(response.data);
  },

  createTier: async (data: CustomerTierInput): Promise<CustomerTierItem> => {
    const response = await api.post('/customer-tier', data);
    return unwrapData<CustomerTierItem>(response.data);
  },

  updateTier: async (id: string, data: Partial<CustomerTierInput>): Promise<CustomerTierItem> => {
    const response = await api.patch(`/customer-tier/${id}`, data);
    return unwrapData<CustomerTierItem>(response.data);
  },

  deleteTier: async (id: string): Promise<void> => {
    await api.delete(`/customer-tier/${id}`);
  },
};

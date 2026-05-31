import { api } from '@/shared/lib/axios';
import { Branch } from '../../domain/entities/branch.entity';
import { unwrapData, unwrapList } from '@/shared/lib/api-response';

export interface BranchQueryParams {
  page?: number;
  limit?: number;
}

export const branchService = {
  getBranches: async (params?: BranchQueryParams): Promise<Branch[]> => {
    const response = await api.get<{ success: boolean; data: Branch[] }>('/branchs', { params });
    return unwrapList<Branch>(response.data);
  },

  getBranchDetail: async (id: string): Promise<Branch> => {
    const response = await api.get<{ success: boolean; data: Branch }>(`/branch/${id}`);
    return unwrapData<Branch>(response.data);
  },

  createBranch: async (data: { name: string; address: string; phone: string; is_active: boolean; is_warehouse?: boolean; is_headquarter?: boolean }): Promise<Branch> => {
    const response = await api.post<{ success: boolean; data: Branch }>('/branch', data);
    return unwrapData<Branch>(response.data);
  },

  updateBranch: async (id: string, data: { name: string; address: string; phone: string; is_active: boolean; is_warehouse?: boolean; is_headquarter?: boolean }): Promise<Branch> => {
    const response = await api.patch<{ success: boolean; data: Branch }>(`/branch/${id}`, data);
    return unwrapData<Branch>(response.data);
  },

  deleteBranch: async (id: string): Promise<void> => {
    await api.delete(`/branch/${id}`);
  }
};

import { api } from '@/shared/lib/axios';
import { Branch } from '../../domain/entities/branch.entity';

export interface BranchQueryParams {
  page?: number;
  limit?: number;
}

export const branchService = {
  getBranches: async (params?: BranchQueryParams): Promise<Branch[]> => {
    const response = await api.get<{ success: boolean; data: Branch[] }>('/branchs', { params });
    return response.data.data || [];
  },
  
  getBranchDetail: async (id: string): Promise<Branch> => {
    const response = await api.get<{ success: boolean; data: Branch }>(`/branch/${id}`);
    return response.data.data;
  },
  
  createBranch: async (data: { name: string; address: string; phone_number: string; is_active: boolean }): Promise<Branch> => {
    const response = await api.post<{ success: boolean; data: Branch }>('/branch', data);
    return response.data.data;
  },
  
  updateBranch: async (id: string, data: { name: string; address: string; phone_number: string; is_active: boolean }): Promise<Branch> => {
    const response = await api.patch<{ success: boolean; data: Branch }>(`/branch/${id}`, data);
    return response.data.data;
  },
  
  deleteBranch: async (id: string): Promise<void> => {
    await api.delete(`/branch/${id}`);
  }
};

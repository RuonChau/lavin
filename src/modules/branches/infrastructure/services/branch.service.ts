import { api } from '@/shared/lib/axios';
import { Branch } from '../../domain/entities/branch.entity';

export interface BranchQueryParams {
  page?: number;
  limit?: number;
}

export const branchService = {
  getBranches: async (params?: BranchQueryParams): Promise<Branch[]> => {
    const response = await api.get<Branch[]>('/branchs', { params });
    return response.data;
  },
  
  getBranchDetail: async (id: string): Promise<Branch> => {
    const response = await api.get<Branch>(`/branch/${id}`);
    return response.data;
  },
  
  createBranch: async (data: { name: string; address: string; phone_number: string; is_active: boolean }): Promise<Branch> => {
    const response = await api.post<Branch>('/branch', data);
    return response.data;
  },
  
  updateBranch: async (id: string, data: { name: string; address: string; phone_number: string; is_active: boolean }): Promise<Branch> => {
    const response = await api.patch<Branch>(`/branch/${id}`, data);
    return response.data;
  },
  
  deleteBranch: async (id: string): Promise<void> => {
    await api.delete(`/branch/${id}`);
  }
};

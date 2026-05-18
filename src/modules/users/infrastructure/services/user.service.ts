import { api } from '@/shared/lib/axios';

export interface UserUpdateInput {
  email: string;
  phone: string;
  username: string;
  role_id: string;
  branch_id?: string;
}

export const userService = {
  getUsers: async (params?: { page?: number; limit?: number }): Promise<any[]> => {
    const response = await api.get('/users', { params });
    return response.data;
  },
  
  getUserDetail: async (id: string): Promise<any> => {
    const response = await api.get(`/user/${id}`);
    return response.data;
  },
  
  updateUser: async (id: string, data: UserUpdateInput): Promise<any> => {
    const response = await api.patch(`/user/${id}`, data);
    return response.data;
  },
  
  deleteUsers: async (): Promise<void> => {
    await api.delete('/users');
  },
  
  deleteUser: async (id: string): Promise<void> => {
    await api.delete(`/user/${id}`);
  }
};

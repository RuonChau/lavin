import { api } from '@/shared/lib/axios';

export interface UserUpdateInput {
  email: string;
  phone: string;
  username: string;
  role_id: string;
  branch_id?: string;
}

export interface UserItem {
  id: string;
  username: string;
  email: string;
  phone: string;
  branch_id?: string;
  branch?: { id: string; name: string };
}

export const userService = {
  getUsers: async (params?: { page?: number; limit?: number; name?: string }): Promise<UserItem[]> => {
    const response = await api.get<{ success: boolean; data: UserItem[]; total: number }>('/users', { params });
    return response.data?.data ?? [];
  },

  getUserDetail: async (id: string): Promise<UserItem | null> => {
    try {
      const response = await api.get<{ success: boolean; user: UserItem }>(`/user/${id}`);
      return response.data?.user ?? null;
    } catch {
      return null;
    }
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


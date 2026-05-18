import { api } from '@/shared/lib/axios';

export interface TimekeepingInput {
  employee_id: string;
  check_in: string;
  check_out?: string;
  total_hours?: number;
  status: string;
}

export const timekeepingService = {
  getTimekeepings: async (params?: { page?: number; limit?: number }): Promise<any[]> => {
    const response = await api.get('/timekeepings', { params });
    return response.data;
  },
  
  getTimekeepingDetail: async (id: string): Promise<any> => {
    const response = await api.get(`/timekeeping/${id}`);
    return response.data;
  },
  
  createTimekeeping: async (data: TimekeepingInput): Promise<any> => {
    const response = await api.post('/timekeeping', data);
    return response.data;
  },
  
  updateTimekeeping: async (id: string, data: TimekeepingInput): Promise<any> => {
    const response = await api.patch(`/timekeeping/${id}`, data);
    return response.data;
  },
  
  deleteTimekeeping: async (id: string): Promise<void> => {
    await api.delete(`/timekeeping/${id}`);
  }
};

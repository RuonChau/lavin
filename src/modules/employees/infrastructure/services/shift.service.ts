import { api } from '@/shared/lib/axios';

export interface ShiftInput {
  shift_name: string;
  start_time: string;
  end_time: string;
}

export const shiftService = {
  getShifts: async (params?: { page?: number; limit?: number }): Promise<any[]> => {
    const response = await api.get('/shifts', { params });
    return response.data;
  },
  
  getShiftDetail: async (id: string): Promise<any> => {
    const response = await api.get(`/shift/${id}`);
    return response.data;
  },
  
  createShift: async (data: ShiftInput): Promise<any> => {
    const response = await api.post('/shift', data);
    return response.data;
  },
  
  updateShift: async (id: string, data: ShiftInput): Promise<any> => {
    const response = await api.patch(`/shift/${id}`, data);
    return response.data;
  },
  
  deleteShift: async (id: string): Promise<void> => {
    await api.delete(`/shift/${id}`);
  }
};

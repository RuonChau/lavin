import { api } from '@/shared/lib/axios';
import { unwrapData, unwrapList } from '@/shared/lib/api-response';

export interface ShiftInput {
  shift_name: string;
  start_time: string;
  end_time: string;
}

export interface ShiftItem extends ShiftInput {
  id: string;
}

export const shiftService = {
  getShifts: async (params?: { page?: number; limit?: number }): Promise<ShiftItem[]> => {
    const response = await api.get('/shifts', { params });
    return unwrapList<ShiftItem>(response.data);
  },
  
  getShiftDetail: async (id: string): Promise<any> => {
    const response = await api.get(`/shift/${id}`);
    return unwrapData(response.data);
  },
  
  createShift: async (data: ShiftInput): Promise<any> => {
    const response = await api.post('/shift', data);
    return unwrapData(response.data);
  },
  
  updateShift: async (id: string, data: ShiftInput): Promise<any> => {
    const response = await api.patch(`/shift/${id}`, data);
    return unwrapData(response.data);
  },
  
  deleteShift: async (id: string): Promise<void> => {
    await api.delete(`/shift/${id}`);
  }
};

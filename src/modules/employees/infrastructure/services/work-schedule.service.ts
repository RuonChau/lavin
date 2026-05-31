import { api } from '@/shared/lib/axios';
import { unwrapData, unwrapList } from '@/shared/lib/api-response';

export interface WorkScheduleInput {
  employee_id: string;
  branch_id: string;
  shift_id: string;
  work_date: string;
}

export const workScheduleService = {
  getWorkSchedules: async (params?: { page?: number; limit?: number }): Promise<any[]> => {
    const response = await api.get('/work-schedules', { params });
    return unwrapList(response.data);
  },
  
  getWorkScheduleDetail: async (id: string): Promise<any> => {
    const response = await api.get(`/work-schedule/${id}`);
    return unwrapData(response.data);
  },
  
  createWorkSchedule: async (data: WorkScheduleInput): Promise<any> => {
    const response = await api.post('/work-schedule', data);
    return unwrapData(response.data);
  },
  
  updateWorkSchedule: async (id: string, data: WorkScheduleInput): Promise<any> => {
    const response = await api.patch(`/work-schedule/${id}`, data);
    return unwrapData(response.data);
  },
  
  deleteWorkSchedule: async (id: string): Promise<void> => {
    await api.delete(`/work-schedule/${id}`);
  }
};

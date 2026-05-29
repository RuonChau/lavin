import { api } from '@/shared/lib/axios';
import { IEmployeeEntity } from '../../domain/entities/employee.entity';

export interface EmployeeCreateInput {
  user_id?: string;
  full_name?: string;
  position: string;
  base_salary: number;
  hire_date: string;
  phone?: string;
  branch_id?: string;
}

export interface EmployeeUpdateInput {
  position?: string;
  base_salary?: number;
  hire_date?: string;
  full_name?: string;
  phone?: string;
  branch_id?: string;
  user_id?: string;
}

export interface EmployeeListResponse {
  data: IEmployeeEntity[];
  total: number;
  page: number;
  limit: number;
}

export const employeeService = {
  getAll: async (page = 1, limit = 10): Promise<EmployeeListResponse> => {
    const res = await api.get<{ success: boolean; data: IEmployeeEntity[]; total: number; page: number; limit: number }>(
      '/employees',
      { params: { page, limit } }
    );
    return {
      data: res.data.data,
      total: res.data.total,
      page: res.data.page,
      limit: res.data.limit,
    };
  },

  getEmployeeDetail: async (id: string): Promise<IEmployeeEntity | null> => {
    try {
      const res = await api.get<{ success: boolean; data: IEmployeeEntity }>(`/employee/${id}`);
      return res.data.data;
    } catch {
      return null;
    }
  },

  createEmployee: async (data: EmployeeCreateInput): Promise<IEmployeeEntity> => {
    const res = await api.post<{ success: boolean; data: IEmployeeEntity }>('/employee', data);
    return res.data.data;
  },

  updateEmployee: async (id: string, data: EmployeeUpdateInput): Promise<IEmployeeEntity> => {
    const res = await api.patch<{ success: boolean; data: IEmployeeEntity }>(`/employee/${id}`, data);
    return res.data.data;
  },

  deleteEmployee: async (id: string): Promise<void> => {
    await api.delete(`/employee/${id}`);
  },
};


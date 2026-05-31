import { api } from '@/shared/lib/axios';
import { IEmployeeEntity } from '../../domain/entities/employee.entity';
import { unwrapData, unwrapPaginated } from '@/shared/lib/api-response';

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
    const paginated = unwrapPaginated<IEmployeeEntity>(res.data);
    return {
      data: paginated.data,
      total: paginated.total,
      page: paginated.page,
      limit: paginated.limit,
    };
  },

  getEmployeeDetail: async (id: string): Promise<IEmployeeEntity | null> => {
    try {
      const res = await api.get<{ success: boolean; data: IEmployeeEntity }>(`/employee/${id}`);
      return unwrapData<IEmployeeEntity>(res.data);
    } catch {
      return null;
    }
  },

  createEmployee: async (data: EmployeeCreateInput): Promise<IEmployeeEntity> => {
    const res = await api.post<{ success: boolean; data: IEmployeeEntity }>('/employee', data);
    return unwrapData<IEmployeeEntity>(res.data);
  },

  updateEmployee: async (id: string, data: EmployeeUpdateInput): Promise<IEmployeeEntity> => {
    const res = await api.patch<{ success: boolean; data: IEmployeeEntity }>(`/employee/${id}`, data);
    return unwrapData<IEmployeeEntity>(res.data);
  },

  deleteEmployee: async (id: string): Promise<void> => {
    await api.delete(`/employee/${id}`);
  },
};

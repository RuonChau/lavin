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
  status?: 'ACTIVE' | 'INACTIVE';
}

export interface EmployeeAccountCredentials {
  username: string;
  password: string;
}

export interface EmployeeCreateResponse extends IEmployeeEntity {
  /** Thông tin đăng nhập của tài khoản vừa tạo tự động */
  account?: EmployeeAccountCredentials;
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

  /** Tạo nhân viên. Nếu không liên kết user_id, server tạo luôn tài khoản và trả về `account` (chỉ một lần). */
  createEmployee: async (data: EmployeeCreateInput): Promise<EmployeeCreateResponse> => {
    const res = await api.post<{ success: boolean; data: EmployeeCreateResponse }>('/employee', data);
    return unwrapData<EmployeeCreateResponse>(res.data);
  },

  updateEmployee: async (id: string, data: EmployeeUpdateInput): Promise<IEmployeeEntity> => {
    const res = await api.patch<{ success: boolean; data: IEmployeeEntity }>(`/employee/${id}`, data);
    return unwrapData<IEmployeeEntity>(res.data);
  },

  deleteEmployee: async (id: string): Promise<void> => {
    await api.delete(`/employee/${id}`);
  },

  /** Reset mật khẩu tài khoản nhân viên. Bỏ trống password để server sinh mật khẩu tạm. */
  resetPassword: async (id: string, password?: string): Promise<EmployeeAccountCredentials> => {
    const res = await api.post<{ success: boolean; data: EmployeeAccountCredentials }>(
      `/employee/${id}/account/reset-password`,
      { password: password || undefined }
    );
    return unwrapData<EmployeeAccountCredentials>(res.data);
  },
};

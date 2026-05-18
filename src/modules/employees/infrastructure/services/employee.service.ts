import { api } from '@/shared/lib/axios';

export interface EmployeeInput {
  user_id: string;
  position: string;
  base_salary: number;
  hire_date: string;
}

export const employeeService = {
  getEmployees: async (params?: { page?: number; limit?: number }): Promise<any[]> => {
    const response = await api.get('/employees', { params });
    return response.data;
  },
  
  getEmployeeDetail: async (id: string): Promise<any> => {
    const response = await api.get(`/employee/${id}`);
    return response.data;
  },
  
  createEmployee: async (data: EmployeeInput): Promise<any> => {
    const response = await api.post('/employee', data);
    return response.data;
  },
  
  updateEmployee: async (id: string, data: EmployeeInput): Promise<any> => {
    const response = await api.patch(`/employee/${id}`, data);
    return response.data;
  },
  
  deleteEmployee: async (id: string): Promise<void> => {
    await api.delete(`/employee/${id}`);
  }
};

import { IEmployeeEntity } from "../../domain/entities/employee.entity";
import { CreateEmployeeDTO, UpdateEmployeeDTO } from "../dto/employee.dto";

/** Shape dùng để hiển thị trên table */
export interface Employee {
  key: string;
  id: string;
  employee_code: string;
  name: string;
  role: string;
  email: string;
  phone: string;
  status: 'ACTIVE' | 'INACTIVE';
  hire_date: string;
  branch: string;
  base_salary: number;
}

/** Response pagination từ server */
export interface EmployeePaginatedResponse {
  data: IEmployeeEntity[];
  total: number;
  page: number;
  limit: number;
}

export interface EmployeeInterface {
  createEmployee(data: CreateEmployeeDTO): Promise<IEmployeeEntity>;
  updateEmployee(data: UpdateEmployeeDTO): Promise<IEmployeeEntity>;
  getDetailEmployee(id: string): Promise<IEmployeeEntity | null>;
  getEmployees(page?: number, limit?: number): Promise<EmployeePaginatedResponse>;
  deleteEmployee(id: string): Promise<void>;
}

/** Helper: map IEmployeeEntity từ server → Employee hiển thị trên table */
export function mapEmployeeToDisplay(e: IEmployeeEntity): Employee {
  // Ưu tiên tên từ user account; fallback sang full_name khi không có tài khoản liên kết
  const displayName = e.user?.username ?? e.full_name ?? '—';
  return {
    key: e.id,
    id: e.id,
    employee_code: e.employee_code,
    name: displayName,
    role: e.position,
    email: e.user?.email ?? '—',
    phone: e.user?.phone ?? e.phone ?? '—',
    status: 'ACTIVE',
    hire_date: e.hire_date
      ? new Date(e.hire_date).toLocaleDateString('vi-VN')
      : '—',
    branch: e.user?.branch?.name ?? e.branch?.name ?? '—',
    base_salary: e.base_salary,
  };
}

import { Employee } from "../application/interfaces/employee.interfaces";

export const employees: Employee[] = [
  { key: '1', id: 'mock-1', employee_code: 'LV-001', name: 'Nguyễn Văn An', role: 'BARISTA', email: 'an.nv@brewglass.vn', phone: '0901 234 567', status: 'ACTIVE', hire_date: '12/01/2024', branch: 'Quận 1', base_salary: 8000000 },
  { key: '2', id: 'mock-2', employee_code: 'LV-002', name: 'Trần Thị Bình', role: 'SERVER', email: 'binh.tt@brewglass.vn', phone: '0902 345 678', status: 'ACTIVE', hire_date: '15/02/2024', branch: 'Quận 3', base_salary: 7500000 },
  { key: '3', id: 'mock-3', employee_code: 'LV-003', name: 'Lê Minh Chiến', role: 'STORE_MANAGER', email: 'chien.lm@brewglass.vn', phone: '0903 456 789', status: 'ACTIVE', hire_date: '01/01/2024', branch: 'Quận 1', base_salary: 15000000 },
  { key: '4', id: 'mock-4', employee_code: 'LV-004', name: 'Phạm Hồng Đào', role: 'BARISTA', email: 'dao.ph@brewglass.vn', phone: '0904 567 890', status: 'ACTIVE', hire_date: '20/03/2024', branch: 'Tân Bình', base_salary: 8000000 },
  { key: '5', id: 'mock-5', employee_code: 'LV-005', name: 'Hoàng Quốc Việt', role: 'CASHIER', email: 'viet.hq@brewglass.vn', phone: '0905 678 901', status: 'INACTIVE', hire_date: '10/05/2024', branch: 'Quận 1', base_salary: 7000000 },
];
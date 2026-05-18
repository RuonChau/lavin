import { IPaginatedData } from "@/modules/common/application/dto/pagination.dto";
import { IEmployeeEntity } from "../../domain/entities/employee.entity";
import { CreateEmployeeDTO, UpdateEmployeeDTO } from "../dto/employee.dto";



export interface Employee {
  key: string;
  id: string;
  name: string;
  role: string;
  email: string;
  phone: string;
  status: 'ACTIVE' | 'INACTIVE';
  joinDate: string;
  branch: string;
  type: string;
}

export interface EmployeeInterface {
  createEmployee(data: CreateEmployeeDTO): Promise<IEmployeeEntity>;
  updateEmployee(data: UpdateEmployeeDTO): Promise<IEmployeeEntity>;
  getDetailEmployee(id: string): Promise<IEmployeeEntity | null>;
  getEmployees(page?: number, limit?: number): Promise<IPaginatedData<IEmployeeEntity>>;
  deleteEmployee(id: string): Promise<void>;
}


import axiosClient from "@/shared/lib/axios";
import { CreateEmployeeDTO, UpdateEmployeeDTO } from "../../application/dto/employee.dto";
import { IEmployeeEntity } from "../../domain/entities/employee.entity";
import { IPaginatedData } from "@/modules/common/application/dto/pagination.dto";
import { EmployeeInterface } from "../../application/interfaces/employee.interfaces";


export class EmployeeRepositoryImpl implements EmployeeInterface {
  async createEmployee(data: CreateEmployeeDTO): Promise<IEmployeeEntity> {
    const res = await axiosClient.post<{employee: IEmployeeEntity}>("/employee", data);
    return res.data.employee
  }

  async updateEmployee(data: UpdateEmployeeDTO): Promise<IEmployeeEntity> {
    const res = await axiosClient.patch<IEmployeeEntity>(`/employee/${data.id}`, data);
    return res.data;
  }

  // all Employee
  async getEmployees(page: number = 1, limit: number = 10): Promise<IPaginatedData<IEmployeeEntity>> {
    try {
      const res = await axiosClient.get<IPaginatedData<IEmployeeEntity>>("/employees", {
        params: { page, limit },
      });
      return res.data;
    } catch {
      return {
        success: false,
        data: [],
        pagination: {
          page,
          limit,
          totalItems: 0,
          totalPages: 0,
          hasNextPage: false,
          hasPrevPage: false,
        }
      };
    }
  }

  async deleteEmployee(id: string): Promise<void> {
    await axiosClient.delete(`/employee/${id}`);
  }


  // get detail product
  async getDetailEmployee(id: string): Promise<IEmployeeEntity | null> {
    try {
      const res = await axiosClient.get<IEmployeeEntity>(`/employee/${id}`);
      return res.data;
    } catch {
      return null;
    }
  }

}

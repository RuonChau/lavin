import axiosClient from "@/shared/lib/axios";
import { CreateEmployeeDTO, UpdateEmployeeDTO } from "../../application/dto/employee.dto";
import { IEmployeeEntity } from "../../domain/entities/employee.entity";
import { EmployeeInterface, EmployeePaginatedResponse } from "../../application/interfaces/employee.interfaces";

export class EmployeeRepositoryImpl implements EmployeeInterface {
  async createEmployee(data: CreateEmployeeDTO): Promise<IEmployeeEntity> {
    const res = await axiosClient.post<{ success: boolean; data: IEmployeeEntity }>("/employee", data);
    return res.data.data;
  }

  async updateEmployee(data: UpdateEmployeeDTO): Promise<IEmployeeEntity> {
    const res = await axiosClient.patch<{ success: boolean; data: IEmployeeEntity }>(`/employee/${data.id}`, data);
    return res.data.data;
  }

  async getEmployees(page: number = 1, limit: number = 10): Promise<EmployeePaginatedResponse> {
    const res = await axiosClient.get<{ success: boolean; data: IEmployeeEntity[]; total: number; page: number; limit: number }>(
      "/employees",
      { params: { page, limit } }
    );
    return {
      data: res.data.data,
      total: res.data.total,
      page: res.data.page,
      limit: res.data.limit,
    };
  }

  async deleteEmployee(id: string): Promise<void> {
    await axiosClient.delete(`/employee/${id}`);
  }

  async getDetailEmployee(id: string): Promise<IEmployeeEntity | null> {
    try {
      const res = await axiosClient.get<{ success: boolean; data: IEmployeeEntity }>(`/employee/${id}`);
      return res.data.data;
    } catch {
      return null;
    }
  }
}

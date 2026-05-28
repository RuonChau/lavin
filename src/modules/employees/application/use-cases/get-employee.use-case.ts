import { IEmployeeEntity } from "../../domain/entities/employee.entity";
import { EmployeeInterface, EmployeePaginatedResponse } from "../interfaces/employee.interfaces";

export class GetEmployeeUseCase {
  constructor(private employeeRepo: EmployeeInterface) {}

  async execute(page?: number, limit?: number): Promise<EmployeePaginatedResponse> {
    return this.employeeRepo.getEmployees(page, limit);
  }
}

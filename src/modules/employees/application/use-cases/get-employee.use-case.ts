import { IPaginatedData } from "@/modules/common/application/dto/pagination.dto";
import { IEmployeeEntity } from "../../domain/entities/employee.entity";
import { EmployeeInterface } from "../interfaces/employee.interfaces";

export class GetEmployeeUseCase {
  constructor(private employeeRepo: EmployeeInterface) {}

  async execute(page?: number, limit?: number): Promise<IPaginatedData<IEmployeeEntity>> {
    return this.employeeRepo.getEmployees(page, limit);
  }
}

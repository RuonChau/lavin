export interface IEmployeeBranch {
  id: string;
  name: string;
}

export interface IEmployeeUser {
  id: string;
  username: string;
  email: string;
  phone: string;
  branch_id?: string;
  branch?: IEmployeeBranch;
}

export interface IEmployeeEntity {
  id: string;
  employee_code: string;
  position: string;
  base_salary: number;
  hire_date?: string;
  full_name?: string;
  user_id?: string;
  user?: IEmployeeUser;
  phone?: string;
  branch_id?: string;
  branch?: IEmployeeBranch;
  createdAt: string;
  updatedAt: string;
}

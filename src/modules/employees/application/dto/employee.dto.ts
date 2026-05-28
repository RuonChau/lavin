import z from "zod";



export class CreateEmployeeDTO {
  constructor(
    public user_id: string,
    public position: string,
    public base_salary: number,
    public hire_date: string,
  ) { }
}

export class UpdateEmployeeDTO {
  constructor(
    public id: string,
    public user_id: string,
    public position: string,
    public base_salary: number,
    public hire_date: string,
  ) { }
}

export const employeeSchema = z.object({
  user_id: z.string().min(1, "Vui lòng chọn tài khoản nhân viên"),
  position: z.string().min(1, "Vui lòng chọn chức vụ"),
  base_salary: z
    .number()
    .min(0, "Mức lương không được âm"),
  hire_date: z.string().min(1, "Vui lòng chọn ngày bắt đầu làm việc"),
});

export type EmployeeFormValues = z.infer<typeof employeeSchema>;

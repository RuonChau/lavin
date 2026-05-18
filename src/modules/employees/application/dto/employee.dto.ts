import z from "zod";



export class CreateEmployeeDTO {
  constructor(
    public fullName: string,
    public email: string,
    public phoneNumber: string,
    public department: string,
    public position: string,
    public salary: number,
    public avatar?: string,
    public fileCV?: string,
    public createdAt?: string,
    public updatedAt?: string,
  ) { }
}

export class UpdateEmployeeDTO extends CreateEmployeeDTO {
  constructor(
    public id: string,
    fullName: string,
    email: string,
    phoneNumber: string,
    department: string,
    position: string,
    salary: number,
    avatar?: string,
    fileCV?: string,
    createdAt?: string,
    updatedAt?: string,
  ) {
    super(fullName, email, phoneNumber, department, position, salary, avatar, fileCV, createdAt, updatedAt);
  }
}

export const employeeSchema = z.object({
  fullName: z.string().min(1, "Họ tên không được để trống").min(2, "Họ tên phải có ít nhất 2 ký tự"),
  email: z.string().min(1, "Email không được để trống").email("Email không hợp lệ"),
  phoneNumber: z
    .string()
    .min(1, "Số điện thoại không được để trống")
    .regex(/^[0-9+\-\s()]{9,20}$/, "Số điện thoại không hợp lệ"),
  department: z.string().min(1, "Phòng ban không được để trống"),
  position: z.string().min(1, "Chức vụ không được để trống"),
  salary: z
    .number("Mức lương phải là số")
    .min(0, "Mức lương không được âm"),
  avatar: z.string().optional(),
  fileCV: z.string().optional(),
});

export type EmployeeFormValues = z.infer<typeof employeeSchema>;

import { EUserRole } from "@/shared/constants/roles";
export interface User {
  id: string;
  name: string;
  email: string;
  role: EUserRole;
  /** Các chi nhánh nhân sự đang làm việc/quản lý */
  branchIds: string[];
  createdAt: Date;
  updatedAt: Date;
}

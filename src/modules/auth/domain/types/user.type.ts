import { EUserRole } from "@/shared/constants/roles";
export interface User {
  id: string;
  name: string;
  email: string;
  role: EUserRole;
  createdAt: Date;
  updatedAt: Date;
}

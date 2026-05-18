import type { TPermissionValues } from "../domain/enum/permission-key.enum";

export interface IRolePermission {
  key: string;
  role: string;
  description: string;
  permissions: Record<TPermissionValues, boolean>;
}


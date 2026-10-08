import type { TDataScope, TPermissionAction, TPermissionValues } from "../domain/enum/permission-key.enum";

export type TCrudPermission = Record<TPermissionAction, boolean>;
export type TRolePermissionMatrix = Record<TPermissionValues, TCrudPermission>;

export interface IRolePermission {
  key: string;
  role: string;
  description: string;
  /** `branch`: chỉ thấy và thao tác dữ liệu thuộc chi nhánh nhân sự đang quản lý */
  dataScope: TDataScope;
  permissions: TRolePermissionMatrix;
}

/** Mỗi trang trong dashboard có một permission key riêng */
export enum EPermissionKeyEnum {
  DASHBOARD = 'dashboard',
  ORDERS = 'orders',
  CUSTOMERS = 'customers',
  PRODUCTS = 'products',
  FORMULAS = 'formulas',
  INVENTORY = 'inventory',
  PURCHASES = 'purchases',
  BRANCHES = 'branches',
  TABLES = 'tables',
  EMPLOYEES = 'employees',
  PROMOTIONS = 'promotions',
  REPORTS = 'reports',
  SETTINGS = 'settings',
}

export const PermissionKeys = Object.values(EPermissionKeyEnum); // Array of permission keys
export type TPermissionKey = keyof typeof EPermissionKeyEnum;
export type TPermissionValues = `${EPermissionKeyEnum}`;

/** Các thao tác CRUD trên một trang — `view` là quyền được vào trang */
export enum EPermissionActionEnum {
  VIEW = 'view',
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
}

export const PermissionActions = Object.values(EPermissionActionEnum);
export type TPermissionAction = `${EPermissionActionEnum}`;

/** Phạm vi dữ liệu: toàn hệ thống hoặc chỉ các chi nhánh nhân sự đang quản lý */
export type TDataScope = 'all' | 'branch';

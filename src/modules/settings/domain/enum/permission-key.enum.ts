export enum EPermissionKeyEnum {
  DASHBOARD = 'dashboard',
  PRODUCTS = 'products',
  ORDERS = 'orders',
  PROMOTIONS = 'promotions',
  REPORTS = 'reports',
  EMPLOYEES = 'employees',
  SETTINGS = 'settings',
}

export const PermissionKeys = Object.values(EPermissionKeyEnum); // Array of permission keys
export type TPermissionKey = keyof typeof EPermissionKeyEnum;
export type TPermissionValues = 'dashboard' | 'products' | 'orders' | 'promotions' | 'reports' | 'employees' | 'settings';
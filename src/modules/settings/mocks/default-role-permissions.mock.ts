import { PermissionKeys, type TPermissionValues } from "../domain/enum/permission-key.enum";
import type { IRolePermission, TCrudPermission, TRolePermissionMatrix } from "../types/role-permission.type";

/** `crud('vcu')` → được xem, thêm, sửa; không được xóa */
const crud = (flags = ''): TCrudPermission => ({
  view: flags.includes('v'),
  create: flags.includes('c'),
  update: flags.includes('u'),
  delete: flags.includes('d'),
});

/** Trang nào không khai báo thì không có quyền */
const matrix = (pages: Partial<Record<TPermissionValues, string>>): TRolePermissionMatrix =>
  PermissionKeys.reduce((acc, page) => {
    acc[page] = crud(pages[page]);
    return acc;
  }, {} as TRolePermissionMatrix);

const fullAccess = matrix(Object.fromEntries(PermissionKeys.map((page) => [page, 'vcud'])));

export const defaultRolePermissions: IRolePermission[] = [
  {
    key: 'owner',
    role: 'Owner',
    description: 'Toàn quyền hệ thống',
    dataScope: 'all',
    permissions: fullAccess,
  },
  {
    key: 'admin',
    role: 'Admin',
    description: 'Quản trị vận hành chuỗi',
    dataScope: 'all',
    permissions: fullAccess,
  },
  {
    key: 'area-manager',
    role: 'Area Manager',
    description: 'Giám sát nhiều chi nhánh',
    dataScope: 'all',
    permissions: matrix({
      dashboard: 'v', orders: 'vcud', customers: 'vcud', products: 'vcud', formulas: 'vcud',
      inventory: 'vcud', purchases: 'vcud', branches: 'vcud', tables: 'vcud', employees: 'vcud',
      promotions: 'vcud', reports: 'v',
    }),
  },
  {
    key: 'store-manager',
    role: 'Store Manager',
    description: 'Quản lý chi nhánh',
    dataScope: 'all',
    permissions: matrix({
      dashboard: 'v', orders: 'vcud', customers: 'vcud', products: 'vcud', formulas: 'vcud',
      inventory: 'vcud', purchases: 'vcud', branches: 'v', tables: 'vcud', employees: 'vcud',
      promotions: 'vcud', reports: 'v',
    }),
  },
  {
    key: 'shift-leader',
    role: 'Shift Leader',
    description: 'Quản lý ca làm việc tại chi nhánh phụ trách',
    dataScope: 'branch',
    permissions: matrix({
      orders: 'vcu', products: 'vu', tables: 'vcud', employees: 'vcu', promotions: 'vcud',
    }),
  },
  {
    key: 'staff',
    role: 'Staff',
    description: 'Nhân viên pha chế/phục vụ',
    dataScope: 'all',
    permissions: matrix({ orders: 'vcu' }),
  },
  {
    key: 'cashier',
    role: 'Cashier',
    description: 'Thu ngân tại quầy',
    dataScope: 'all',
    permissions: matrix({ dashboard: 'v', orders: 'vcu', customers: 'vcu', promotions: 'v' }),
  },
];

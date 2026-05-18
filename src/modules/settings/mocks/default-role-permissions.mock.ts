import { IRolePermission } from "../types/role-permission.type";

export const defaultRolePermissions: IRolePermission[] = [
  {
    key: 'owner',
    role: 'Owner',
    description: 'Toàn quyền hệ thống',
    permissions: { dashboard: true, products: true, orders: true, promotions: true, reports: true, employees: true, settings: true },
  },
  {
    key: 'admin',
    role: 'Admin',
    description: 'Quản trị vận hành chuỗi',
    permissions: { dashboard: true, products: true, orders: true, promotions: true, reports: true, employees: true, settings: true },
  },
  {
    key: 'area-manager',
    role: 'Area Manager',
    description: 'Giám sát nhiều chi nhánh',
    permissions: { dashboard: true, products: true, orders: true, promotions: true, reports: true, employees: true, settings: false },
  },
  {
    key: 'store-manager',
    role: 'Store Manager',
    description: 'Quản lý chi nhánh',
    permissions: { dashboard: true, products: true, orders: true, promotions: false, reports: true, employees: true, settings: false },
  },
  {
    key: 'staff',
    role: 'Staff',
    description: 'Nhân viên pha chế/phục vụ',
    permissions: { dashboard: false, products: false, orders: true, promotions: false, reports: false, employees: false, settings: false },
  },
  {
    key: 'cashier',
    role: 'Cashier',
    description: 'Thu ngân tại quầy',
    permissions: { dashboard: true, products: false, orders: true, promotions: true, reports: false, employees: false, settings: false },
  },
];
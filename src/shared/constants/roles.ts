// export const ROLES = ['OWNER', 'Admin', 'Area Manager', 'Store Manager', 'Staff', 'Cashier'] as const;
export const ROLES = ['OWNER', 'ADMIN', 'PURCHASING', 'ACCOUNTANT', 'AREA_MANAGER', 'STORE_MANAGER', 'SHIFT_LEADER', 'CASHIER', 'SERVER', 'BARISTA'] as const;

export type AppRole = (typeof ROLES)[number];

export enum EUserRole {
  // Level 1: Staff
  BARISTA = 'Pha chế', // Nhân viên pha chế.
  SERVER = 'Phục vụ', // Nhân viên phục vụ.
  CASHIER = 'Thu ngân', // Nhân viên thu ngân.

  // Level 2: Management
  SHIFT_LEADER = 'Quản lý ca', // Quản lý ca.
  STORE_MANAGER = 'Quản lý chi nhánh', // Quản lý chi nhánh.
  AREA_MANAGER = 'Quản lý khu vực', // Quản lý khu vực.

  // Level 3: Office & Admin
  ACCOUNTANT = 'Kế toán', // Kế toán.
  PURCHASING = 'Mua hàng', // Mua hàng.
  ADMIN = 'Quản trị viên', // Quản trị viên.
  OWNER = 'Chủ sở hữu' // Chủ sở hữu.
}


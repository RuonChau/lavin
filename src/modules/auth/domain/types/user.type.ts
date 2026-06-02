
export enum EUserRole {
  // Level 1: Staff
  BARISTA = 'BARISTA', // Nhân viên pha chế.
  SERVER = 'SERVER', // Nhân viên phục vụ.
  CASHIER = 'CASHIER', // Nhân viên thu ngân.

  // Level 2: Management
  SHIFT_LEADER = 'SHIFT_LEADER', // Quản lý ca.
  STORE_MANAGER = 'STORE_MANAGER', // Quản lý chi nhánh.
  AREA_MANAGER = 'AREA_MANAGER', // Quản lý khu vực.

  // Level 3: Office & Admin
  ACCOUNTANT = 'ACCOUNTANT', // Kế toán.
  PURCHASING = 'PURCHASING', // Mua hàng.
  ADMIN = 'ADMIN', // Quản trị viên.
  OWNER = 'OWNER' // Chủ sở hữu.
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: EUserRole;
  createdAt: Date;
  updatedAt: Date;
}

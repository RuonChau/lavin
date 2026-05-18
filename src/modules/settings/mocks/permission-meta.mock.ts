import { TPermissionValues } from "../domain/enum/permission-key.enum";

export const permissionMeta: Array<{ key: TPermissionValues; label: string }> = [
  { key: 'dashboard', label: 'Xem dashboard' },
  { key: 'products', label: 'Quản lý sản phẩm' },
  { key: 'orders', label: 'Quản lý đơn hàng' },
  { key: 'promotions', label: 'Quản lý khuyến mãi' },
  { key: 'reports', label: 'Xem báo cáo' },
  { key: 'employees', label: 'Quản lý nhân sự' },
  { key: 'settings', label: 'Cài đặt hệ thống' },
];
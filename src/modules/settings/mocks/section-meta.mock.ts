import { Bell, Building2, CreditCard, LockKeyhole, Paintbrush, ShieldCheck, Store } from 'lucide-react';
import type { ElementType } from 'react';
import { ESectionKeyEnum, type TSectionValues } from '../domain/enum/section-key.enum';

export const sectionMeta: Array<{ key: TSectionValues; label: string; icon: ElementType; description: string }> = [
  { key: ESectionKeyEnum.BUSINESS, label: 'Thông tin doanh nghiệp', icon: Building2, description: 'Thương hiệu, liên hệ và pháp lý' },
  { key: ESectionKeyEnum.OPERATIONS, label: 'Chi nhánh & vận hành', icon: Store, description: 'Giờ mở cửa, tiền tệ và đơn online' },
  { key: ESectionKeyEnum.SECURITY, label: 'Tài khoản & bảo mật', icon: LockKeyhole, description: 'Admin, mật khẩu, 2FA và phiên' },
  { key: ESectionKeyEnum.PERMISSIONS, label: 'Phân quyền', icon: ShieldCheck, description: 'Vai trò và quyền truy cập hệ thống' },
  { key: ESectionKeyEnum.PAYMENT, label: 'Thanh toán', icon: CreditCard, description: 'Tiền mặt, QR, ví điện tử và thẻ' },
  { key: ESectionKeyEnum.NOTIFICATIONS, label: 'Thông báo', icon: Bell, description: 'Email, SMS, push và cảnh báo' },
  { key: ESectionKeyEnum.APPEARANCE, label: 'Giao diện', icon: Paintbrush, description: 'Theme, màu, mật độ và animation' },
];
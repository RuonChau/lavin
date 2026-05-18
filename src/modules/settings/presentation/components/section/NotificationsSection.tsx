import { Bell } from "lucide-react";
import { SwitchCard } from "../card/SwitchCard";
import { SectionTitle } from "./SectionTitle";
import { PremiumPanel } from "./PremiumPanel";

export function NotificationsSection({ dirty, onReset }: { dirty: boolean; onReset: () => void }) {
  return (
    <PremiumPanel>
      <SectionTitle icon={Bell} title="Thông báo" description="Kiểm soát kênh gửi thông báo và các cảnh báo vận hành quan trọng." dirty={dirty} onReset={onReset} />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        <SwitchCard name={['notifications', 'emailNotification']} title="Email notification" description="Gửi email tới quản lý và chủ quán." />
        <SwitchCard name={['notifications', 'smsNotification']} title="SMS notification" description="Tin nhắn cho cảnh báo khẩn cấp." />
        <SwitchCard name={['notifications', 'pushNotification']} title="Push notification" description="Thông báo trên app quản trị." />
        <SwitchCard name={['notifications', 'newOrderAlert']} title="Thông báo đơn hàng mới" description="Báo ngay khi có đơn online/POS." />
        <SwitchCard name={['notifications', 'lowStockAlert']} title="Thông báo tồn kho thấp" description="Cảnh báo nguyên liệu dưới định mức." />
        <SwitchCard name={['notifications', 'dailyRevenueAlert']} title="Thông báo doanh thu cuối ngày" description="Tổng hợp doanh thu sau khi đóng ca." />
        <SwitchCard name={['notifications', 'promotionExpiryAlert']} title="Thông báo khuyến mãi sắp hết hạn" description="Nhắc chiến dịch còn ít ngày/quota." />
      </div>
    </PremiumPanel>
  );
}

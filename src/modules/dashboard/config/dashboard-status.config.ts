import type { DashboardStatusMeta } from '../types/dashboard-status.type';

export const orderStatusMap: Record<string, DashboardStatusMeta> = {
  completed: { label: 'Hoàn tất', className: 'bg-[#21B57D]/10 text-[#21B57D]' },
  preparing: { label: 'Đang pha chế', className: 'bg-[#C9822B]/10 text-[#C9822B]' },
  ready: { label: 'Sẵn sàng', className: 'bg-[#0FA7A0]/10 text-[#0FA7A0]' },
  cancelled: { label: 'Đã hủy', className: 'bg-[#D95F76]/10 text-[#D95F76]' },
  pending: { label: 'Chờ xử lý', className: 'bg-[#8B5E3C]/10 text-[#8B5E3C]' },
};

export const paymentStatusMap: Record<string, string> = {
  paid: 'Đã thanh toán',
  unpaid: 'Chưa thanh toán',
  refunded: 'Hoàn tiền',
};

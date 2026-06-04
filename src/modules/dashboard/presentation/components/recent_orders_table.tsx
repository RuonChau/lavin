import { MoreVertical } from 'lucide-react';
import type { RecentOrdersTableProps } from '../../types/dashboard-component-props.type';
import { orderStatusMap } from '../../config/dashboard-status.config';
import { formatPayment, maskPhone } from '../../utils/dashboard-formatters';
import { GlassCard } from '@/shared/components/GlassCard';
import { cn } from '@/shared/utils/cn';
import { formatCurrency } from '@/shared/utils/format-currency';
import { formatDate } from '@/shared/utils/format-date';

export function RecentOrdersTable({ orders, generatedAt }: RecentOrdersTableProps) {
  return (
    <GlassCard className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-text-primary">Đơn hàng gần đây</h3>
          <p className="text-xs font-semibold text-text-muted">
            Cập nhật lúc {formatDate(generatedAt, 'HH:mm DD/MM/YYYY')}
          </p>
        </div>
        <button className="rounded-xl p-2 text-text-muted transition-all hover:bg-white/40">
          <MoreVertical size={20} />
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-primary-soft/20 text-xs font-bold uppercase tracking-widest text-text-muted">
              <th className="px-2 pb-4">Mã đơn</th>
              <th className="px-2 pb-4">Khách hàng</th>
              <th className="px-2 pb-4">Chi nhánh</th>
              <th className="px-2 pb-4">Thanh toán</th>
              <th className="px-2 pb-4">Trạng thái</th>
              <th className="px-2 pb-4">Tổng tiền</th>
            </tr>
          </thead>
          <tbody className="text-sm text-text-secondary">
            {orders.length > 0 ? (
              orders.map((order) => {
                const status = orderStatusMap[order.status] ?? orderStatusMap.pending;

                return (
                  <tr key={order.id} className="border-b border-primary-soft/10 transition-colors hover:bg-white/40">
                    <td className="px-2 py-4 font-mono text-text-primary">#{order.orderNumber}</td>
                    <td className="px-2 py-4">
                      <div className="font-semibold text-text-primary">{order.customerName}</div>
                      <div className="text-[11px] text-text-muted">
                        {maskPhone(order.customerPhone) || formatDate(order.createdAt, 'HH:mm')}
                      </div>
                    </td>
                    <td className="px-2 py-4 text-xs">{order.branchName}</td>
                    <td className="px-2 py-4">
                      <span className="rounded-full bg-aqua/10 px-2 py-0.5 text-[10px] font-bold text-aqua">
                        {formatPayment(order.paymentMethod, order.paymentStatus)}
                      </span>
                    </td>
                    <td className="px-2 py-4">
                      <span className={cn('rounded-full px-3 py-1 text-[11px] font-bold', status.className)}>
                        {status.label}
                      </span>
                    </td>
                    <td className="px-2 py-4 font-bold text-text-primary">{formatCurrency(order.totalAmount)}</td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={6} className="py-10 text-center text-sm font-semibold text-text-muted">
                  Chưa có đơn hàng để hiển thị.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </GlassCard>
  );
}

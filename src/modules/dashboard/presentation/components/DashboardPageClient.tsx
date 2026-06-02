'use client';

import { ReactNode } from 'react';
import {
  AlertTriangle,
  ArrowDownRight,
  ArrowUpRight,
  Box,
  MoreVertical,
  RefreshCcw,
  ShoppingCart,
  TrendingUp,
  Users,
} from 'lucide-react';
import { useAuth } from '@/modules/auth/presentation/hooks/use-auth';
import { useDashboardOverview } from '@/modules/dashboard/presentation/hooks/useDashboardOverview';
import { GlassCard } from '@/shared/components/GlassCard';
import { cn } from '@/shared/utils/cn';
import { formatCurrency } from '@/shared/utils/format-currency';
import { formatDate } from '@/shared/utils/format-date';

type Trend = 'up' | 'down' | 'neutral';

const orderStatusMap: Record<string, { label: string; className: string }> = {
  completed: { label: 'Hoàn tất', className: 'bg-[#21B57D]/10 text-[#21B57D]' },
  preparing: { label: 'Đang pha chế', className: 'bg-[#C9822B]/10 text-[#C9822B]' },
  ready: { label: 'Sẵn sàng', className: 'bg-[#0FA7A0]/10 text-[#0FA7A0]' },
  cancelled: { label: 'Đã hủy', className: 'bg-[#D95F76]/10 text-[#D95F76]' },
  pending: { label: 'Chờ xử lý', className: 'bg-[#8B5E3C]/10 text-[#8B5E3C]' },
};

const paymentStatusMap: Record<string, string> = {
  paid: 'Đã thanh toán',
  unpaid: 'Chưa thanh toán',
  refunded: 'Hoàn tiền',
};

export default function DashboardPage() {
  const { user } = useAuth();
  const { data, isLoading, isError, isFetching, refetch } = useDashboardOverview();
  const stats = data?.stats;

  return (
    <div className="space-y-8 pb-12">
      <header className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <h1 className="text-[28px] font-bold text-text-primary tracking-tight">
            Xin chào, {user?.name ?? 'Quản trị viên'}
          </h1>
          <p className="text-text-secondary">
            Đây là báo cáo tổng quan của chuỗi BrewGlass hôm nay.
          </p>
        </div>

        <button
          type="button"
          onClick={() => refetch()}
          className="inline-flex h-10 w-fit items-center gap-2 rounded-xl border border-primary-soft/30 bg-white/60 px-4 text-sm font-bold text-text-secondary transition-all hover:bg-white"
        >
          <RefreshCcw size={16} className={cn(isFetching && 'animate-spin')} />
          Tải lại
        </button>
      </header>

      {isLoading ? (
        <DashboardSkeleton />
      ) : isError || !data || !stats ? (
        <GlassCard className="p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-berry/10 text-berry">
                <AlertTriangle size={20} />
              </div>
              <div>
                <h3 className="font-bold text-text-primary">Không thể tải dữ liệu tổng quan</h3>
                <p className="mt-1 text-sm text-text-secondary">
                  API dashboard hoặc các API tổng hợp đang chưa phản hồi. Hãy thử tải lại.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => refetch()}
              className="h-10 rounded-xl bg-primary px-4 text-sm font-bold text-white transition-all hover:bg-[#6F4A31]"
            >
              Thử lại
            </button>
          </div>
        </GlassCard>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            <KPIStatCard
              title="Doanh thu hôm nay"
              value={formatCurrency(stats.todayRevenue)}
              change={formatPercentChange(stats.revenueChangePercent)}
              trend={getTrend(stats.revenueChangePercent)}
              icon={<TrendingUp size={20} />}
            />
            <KPIStatCard
              title="Số đơn hàng"
              value={stats.todayOrders.toLocaleString('vi-VN')}
              change={formatPercentChange(stats.orderChangePercent)}
              trend={getTrend(stats.orderChangePercent)}
              icon={<ShoppingCart size={20} />}
            />
            <KPIStatCard
              title="Tồn kho cảnh báo"
              value={stats.inventoryWarnings.toLocaleString('vi-VN')}
              change={formatSignedNumber(stats.inventoryWarningsChange)}
              trend={getInverseTrend(stats.inventoryWarningsChange)}
              icon={<Box size={20} />}
              variant="warning"
            />
            <KPIStatCard
              title="Nhân viên đang trực"
              value={stats.activeEmployees.toLocaleString('vi-VN')}
              change={formatSignedNumber(stats.activeEmployeesChange)}
              trend={getTrend(stats.activeEmployeesChange)}
              icon={<Users size={20} />}
            />
          </div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <GlassCard className="p-6">
                <div className="mb-6 flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-text-primary">Đơn hàng gần đây</h3>
                    <p className="text-xs font-semibold text-text-muted">
                      Cập nhật lúc {formatDate(data.generatedAt, 'HH:mm DD/MM/YYYY')}
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
                      {data.recentOrders.length > 0 ? (
                        data.recentOrders.map((order) => {
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
            </div>

            <div className="space-y-6">
              <GlassCard className="p-6">
                <h3 className="mb-6 text-lg font-bold text-text-primary">Top món bán chạy</h3>
                <div className="space-y-5">
                  {data.topProducts.length > 0 ? (
                    data.topProducts.map((item, index) => (
                      <div key={item.id || item.name} className="group flex cursor-pointer items-center gap-4">
                        <div
                          className="relative flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-primary/10 bg-cover bg-center text-sm font-black text-primary shadow-sm transition-transform group-hover:scale-105"
                          style={item.image ? { backgroundImage: `url(${item.image})` } : undefined}
                          aria-label={item.name}
                        >
                          {item.image ? (
                            <span className="sr-only">{item.name}</span>
                          ) : (
                            <span>{index + 1}</span>
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <h4 className="truncate text-sm font-bold text-text-primary">{item.name}</h4>
                          <p className="text-xs text-text-muted">{item.sold.toLocaleString('vi-VN')} đơn</p>
                        </div>
                        <div className="text-sm font-bold text-primary">{formatCurrency(item.price || item.revenue)}</div>
                      </div>
                    ))
                  ) : (
                    <p className="rounded-2xl bg-white/45 p-4 text-sm font-semibold text-text-muted">
                      Chưa có dữ liệu sản phẩm bán chạy.
                    </p>
                  )}
                </div>
              </GlassCard>

              <GlassCard className="border-primary/20 bg-primary/10 p-6">
                <h3 className="mb-4 text-sm font-bold uppercase tracking-widest text-primary">Mẹo vận hành</h3>
                <p className="text-sm leading-relaxed text-text-secondary">{data.operationTip}</p>
              </GlassCard>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function KPIStatCard({
  title,
  value,
  change,
  trend,
  icon,
  variant = 'default',
}: {
  title: string;
  value: string;
  change: string;
  trend: Trend;
  icon: ReactNode;
  variant?: 'default' | 'warning';
}) {
  return (
    <GlassCard className="p-5">
      <div className="mb-4 flex items-start justify-between">
        <div
          className={cn(
            'flex h-10 w-10 items-center justify-center rounded-2xl border',
            variant === 'warning'
              ? 'border-caramel/20 bg-caramel/10 text-caramel'
              : 'border-primary/20 bg-primary/10 text-primary',
          )}
        >
          {icon}
        </div>
        <div
          className={cn(
            'flex items-center gap-1 rounded-full px-2 py-1 text-xs font-bold',
            trend === 'up' && 'bg-mint/10 text-mint',
            trend === 'down' && 'bg-berry/10 text-berry',
            trend === 'neutral' && 'bg-primary/10 text-primary',
          )}
        >
          {trend === 'up' && <ArrowUpRight size={14} />}
          {trend === 'down' && <ArrowDownRight size={14} />}
          {change}
        </div>
      </div>

      <p className="text-xs font-bold uppercase tracking-widest text-text-muted">{title}</p>
      <h3 className="mt-1 text-[28px] font-bold tracking-tight text-text-primary">{value}</h3>
    </GlassCard>
  );
}

function DashboardSkeleton() {
  return (
    <>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <GlassCard key={index} className="p-5">
            <div className="mb-5 flex items-center justify-between">
              <div className="h-10 w-10 animate-pulse rounded-2xl bg-white/60" />
              <div className="h-6 w-16 animate-pulse rounded-full bg-white/60" />
            </div>
            <div className="h-3 w-28 animate-pulse rounded-full bg-white/60" />
            <div className="mt-3 h-8 w-36 animate-pulse rounded-full bg-white/60" />
          </GlassCard>
        ))}
      </div>
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <GlassCard className="h-80 p-6 lg:col-span-2">
          <div className="h-full animate-pulse rounded-2xl bg-white/45" />
        </GlassCard>
        <GlassCard className="h-80 p-6">
          <div className="h-full animate-pulse rounded-2xl bg-white/45" />
        </GlassCard>
      </div>
    </>
  );
}

function getTrend(value: number): Trend {
  if (value > 0) return 'up';
  if (value < 0) return 'down';
  return 'neutral';
}

function getInverseTrend(value: number): Trend {
  if (value > 0) return 'down';
  if (value < 0) return 'up';
  return 'neutral';
}

function formatPercentChange(value: number): string {
  if (value === 0) return '0%';
  return `${value > 0 ? '+' : ''}${value.toLocaleString('vi-VN')}%`;
}

function formatSignedNumber(value: number): string {
  if (value === 0) return '0';
  return `${value > 0 ? '+' : ''}${value.toLocaleString('vi-VN')}`;
}

function maskPhone(phone?: string): string {
  if (!phone) return '';
  if (phone.length < 7) return phone;
  return `${phone.slice(0, 4)}***${phone.slice(-3)}`;
}

function formatPayment(method: string, paymentStatus: string): string {
  const normalizedMethod = method ? method.toUpperCase() : 'COD';
  return paymentStatusMap[paymentStatus] ?? normalizedMethod;
}

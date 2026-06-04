import { Box, ShoppingCart, TrendingUp, Users } from 'lucide-react';
import type { DashboardKpiGridProps } from '../../types/dashboard-component-props.type';
import {
  formatPercentChange,
  formatSignedNumber,
  getInverseTrend,
  getTrend,
} from '../../utils/dashboard-formatters';
import { formatCurrency } from '@/shared/utils/format-currency';
import { KPIStatCard } from './kpi_stat_card';

export function DashboardKpiGrid({ stats }: DashboardKpiGridProps) {
  return (
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
  );
}

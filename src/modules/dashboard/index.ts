export { default as DashboardPageClient } from './presentation/components/DashboardPageClient';
export { useDashboardOverview } from './presentation/hooks/useDashboardOverview';
export { dashboardService } from './infrastructure/services/dashboard.service';
export type {
  DashboardKpiStats,
  DashboardOverview,
  DashboardRecentOrder,
  DashboardTopProduct,
  DashboardTrend,
} from './domain/entities/dashboard-overview.entity';

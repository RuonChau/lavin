export { default as DashboardPageClient } from './presentation/components/dashboard_page_client';
export { useDashboardOverview } from './presentation/hooks/useDashboardOverview';
export { dashboardService } from './infrastructure/services/dashboard.service';
export type {
  DashboardKpiStats,
  DashboardOverview,
  DashboardRecentOrder,
  DashboardTopProduct,
  DashboardTrend,
} from './domain/entities/dashboard-overview.entity';

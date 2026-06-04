import type {
  DashboardKpiStats,
  DashboardRecentOrder,
  DashboardTopProduct,
} from '../domain/entities/dashboard-overview.entity';

export interface DashboardHeaderProps {
  userName?: string | null;
  isFetching: boolean;
  onRefresh: () => void;
}

export interface DashboardErrorStateProps {
  onRetry: () => void;
}

export interface DashboardKpiGridProps {
  stats: DashboardKpiStats;
}

export interface RecentOrdersTableProps {
  orders: DashboardRecentOrder[];
  generatedAt: string;
}

export interface TopProductsListProps {
  products: DashboardTopProduct[];
}

export interface OperationTipCardProps {
  tip: string;
}

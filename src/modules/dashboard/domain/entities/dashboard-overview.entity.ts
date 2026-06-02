export type DashboardTrend = 'up' | 'down' | 'neutral';

export interface DashboardKpiStats {
  todayRevenue: number;
  revenueChangePercent: number;
  todayOrders: number;
  orderChangePercent: number;
  inventoryWarnings: number;
  inventoryWarningsChange: number;
  activeEmployees: number;
  activeEmployeesChange: number;
}

export interface DashboardRecentOrder {
  id: string;
  orderNumber: string;
  customerName: string;
  customerPhone?: string;
  branchName: string;
  paymentMethod: string;
  paymentStatus: string;
  status: string;
  totalAmount: number;
  createdAt: string;
}

export interface DashboardTopProduct {
  id: string;
  name: string;
  sold: number;
  revenue: number;
  price: number;
  image?: string;
}

export interface DashboardOverview {
  stats: DashboardKpiStats;
  recentOrders: DashboardRecentOrder[];
  topProducts: DashboardTopProduct[];
  operationTip: string;
  generatedAt: string;
  source: 'dashboard-api' | 'aggregated-api';
}

import { api } from '@/shared/lib/axios';
import { unwrapData } from '@/shared/lib/api-response';

export interface ReportParams {
  branchId?: string;
  categoryId?: string;
  from_date?: string;
  to_date?: string;
  range?: string;
}

export interface ReportData {
  dailyReports: Array<{
    key: string;
    date: string;
    revenue: number;
    orders: number;
    completedOrders: number;
    canceledOrders: number;
    newCustomers: number;
    aov: number;
    growth: number;
  }>;
  topProducts: Array<{
    name: string;
    category: string;
    sold: number;
    revenue: number;
    growth: number;
  }>;
  branchRevenue: Array<{
    branch: string;
    branchId: string;
    revenue: number;
    orders: number;
    growth: number;
  }>;
  orderStatus: Array<{
    name: string;
    value: number;
    color: string;
  }>;
  insights: Array<{
    title: string;
    value: string;
    description: string;
    icon: string;
    tag: string;
    color: string;
  }>;
  totals: {
    todayRevenue: number;
    todayRevenueGrowth: number;
    totalOrders: number;
    totalOrdersGrowth: number;
    aov: number;
    aovGrowth: number;
    cancelRate: number;
    cancelRateGrowth: number;
    bestProduct: { name: string; category: string; sold: number; revenue: number; growth: number } | null;
    bestBranch: { branch: string; branchId: string; revenue: number; orders: number; growth: number } | null;
  };
}

export const reportService = {
  getReportData: async (params?: ReportParams): Promise<ReportData> => {
    const response = await api.get('/reports', { params });
    return unwrapData<ReportData>(response.data);
  },
};

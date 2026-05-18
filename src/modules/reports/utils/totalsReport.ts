import type { IDailyReport } from "../types/daily-report.type";

interface ReportProductSummary {
  name: string;
  sold: number;
}

interface BranchRevenueSummary {
  branch: string;
  revenue: number;
}

export function calculateReportTotals(
  visibleReports: IDailyReport[],
  visibleProducts: ReportProductSummary[],
  visibleBranchRevenue: BranchRevenueSummary[],
) {
  const today = visibleReports.at(-1);
  const totalOrders = visibleReports.reduce((sum, item) => sum + item.orders, 0);
  const canceledOrders = visibleReports.reduce((sum, item) => sum + item.canceledOrders, 0);
  const totalRevenue = visibleReports.reduce((sum, item) => sum + item.revenue, 0);
  const bestProduct = visibleProducts.at(-1);
  const bestBranch = [...visibleBranchRevenue].sort((a, b) => b.revenue - a.revenue)[0];

  return {
    todayRevenue: today?.revenue ?? 0,
    totalOrders,
    aov: totalOrders ? Math.round(totalRevenue / totalOrders) : 0,
    cancelRate: totalOrders ? (canceledOrders / totalOrders) * 100 : 0,
    bestProduct,
    bestBranch,
  };
}

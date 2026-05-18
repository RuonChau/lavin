import { AlertTriangle, CircleDollarSign, Coffee, ReceiptText, ShoppingBag, Store } from "lucide-react";
import { IKpiCardItem } from "../types/kpi-card-item.type";
import { formatVndReport } from "../utils/formatVndReport";

export const kpiCards = (totals: any): IKpiCardItem[] => [
  {
    label: 'Doanh thu hôm nay',
    value: formatVndReport(totals.todayRevenue),
    sub: 'So với cùng kỳ hôm qua',
    growth: 12.4,
    icon: CircleDollarSign,
    color: 'bg-primary text-white',
  },
  {
    label: 'Tổng đơn hàng',
    value: totals.totalOrders.toLocaleString('vi-VN'),
    sub: 'Trong khoảng thời gian chọn',
    growth: 8.7,
    icon: ReceiptText,
    color: 'bg-aqua text-white',
  },
  {
    label: 'Giá trị đơn trung bình',
    value: formatVndReport(totals.aov),
    sub: 'AOV toàn chuỗi',
    growth: 3.2,
    icon: ShoppingBag,
    color: 'bg-emerald-500 text-white',
  },
  {
    label: 'Tỷ lệ hủy đơn',
    value: `${totals.cancelRate.toFixed(1)}%`,
    sub: 'Mục tiêu dưới 3%',
    growth: -0.6,
    icon: AlertTriangle,
    color: 'bg-berry text-white',
  },
  {
    label: 'Sản phẩm bán chạy nhất',
    value: totals.bestProduct?.name ?? 'Chưa có dữ liệu',
    sub: totals.bestProduct ? `${totals.bestProduct.sold.toLocaleString('vi-VN')} ly/phần đã bán` : 'Chọn danh mục khác',
    icon: Coffee,
    color: 'bg-caramel text-white',
  },
  {
    label: 'Chi nhánh doanh thu cao nhất',
    value: totals.bestBranch ? `LaVin ${totals.bestBranch.branch}` : 'Chưa có dữ liệu',
    sub: totals.bestBranch ? formatVndReport(totals.bestBranch.revenue) : 'Chọn chi nhánh khác',
    icon: Store,
    color: 'bg-slate-700 text-white',
  },
];

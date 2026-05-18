import { Clock, TrendingUp, Truck, User } from "lucide-react";

export const StatsSummary = [
  { label: 'TỔNG CHI PHÍ THÁNG', value: '₫125.4M', change: '+8.2% so với tháng trước', icon: TrendingUp, color: 'bg-primary' },
  { label: 'ĐANG CHỜ DUYỆT', value: '08', change: '5 đơn cần xử lý gấp', icon: Clock, color: 'bg-amber-500' },
  { label: 'ĐANG GIAO HÀNG', value: '03', change: 'Dự kiến nhập kho hôm nay', icon: Truck, color: 'bg-blue-500' },
  { label: 'NHÀ CUNG CẤP', value: '24', change: 'Vừa thêm 2 NCC mới', icon: User, color: 'bg-green-500' },
]
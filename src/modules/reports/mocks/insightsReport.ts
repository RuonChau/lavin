import { AlertTriangle, CalendarDays, PackageCheck, Target, TrendingUp } from "lucide-react";

export const InsightsReport = [
  {
    title: 'Khung giờ bán chạy nhất',
    value: '08:00 - 10:00',
    description: 'Tập trung 31% đơn take-away và combo sáng.',
    icon: CalendarDays,
    tag: 'Cao điểm sáng',
    color: 'text-aqua bg-aqua/10 border-aqua/20',
  },
  {
    title: 'Danh mục tăng trưởng tốt nhất',
    value: 'Trà trái cây',
    description: 'Tăng 21.4% nhờ voucher TEA2GET1 và thời tiết nóng.',
    icon: TrendingUp,
    tag: '+21.4%',
    color: 'text-emerald-600 bg-emerald-50 border-emerald-200',
  },
  {
    title: 'Sản phẩm cần đẩy mạnh',
    value: 'Tiramisu Matcha',
    description: 'Doanh số thấp sau ra mắt, nên bundle với đồ uống lạnh.',
    icon: Target,
    tag: 'Cần action',
    color: 'text-amber-600 bg-amber-50 border-amber-200',
  },
  {
    title: 'Chi nhánh cần chú ý',
    value: 'LaVin Tân Bình',
    description: 'Doanh thu giảm 3.8%, tỷ lệ hủy cao hơn trung bình chuỗi.',
    icon: AlertTriangle,
    tag: '-3.8%',
    color: 'text-berry bg-berry/10 border-berry/20',
  },
  {
    title: 'Gợi ý hành động',
    value: 'Tối ưu ca sáng',
    description: 'Tăng 1 barista khung 08:00 - 10:00 tại Nguyễn Huệ và Thảo Điền.',
    icon: PackageCheck,
    tag: 'Vận hành',
    color: 'text-primary bg-primary/10 border-primary/20',
  },
];

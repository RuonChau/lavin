import { Beaker, BookOpenText, Calculator, Timer } from "lucide-react";

export const StatsOverview = [
  { label: 'TỔNG CÔNG THỨC', value: '142', change: '+3 tháng này', icon: BookOpenText, color: 'bg-primary' },
  { label: 'CHI PHÍ TB / MÓN', value: '₫18.500', change: '-520 so với hôm qua', icon: Calculator, color: 'bg-amber-500', negative: true },
  { label: 'NGUYÊN LIỆU ĐANG DÙNG', value: '48', change: '8 loại có biến động giá', icon: Beaker, color: 'bg-blue-500' },
  { label: 'CẬP NHẬT GẦN ĐÂY', value: '12', change: 'vừa mới đây', icon: Timer, color: 'bg-green-500' },
]
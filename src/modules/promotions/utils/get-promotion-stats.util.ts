// src/modules/promotions/utils/get-promotion-stats.util.ts

import type { LucideIcon } from 'lucide-react';
import {
  CalendarClock,
  ChartNoAxesColumnIncreasing,
  CirclePause,
  CirclePlay,
  Gift,
} from 'lucide-react';

import type { IPromotion } from '@/modules/promotions/types/promotion.type';
import { isEndingSoon } from './promotion-date.util';

export type PromotionStatItem = {
  label: string;
  value: string;
  sub: string;
  icon: LucideIcon;
  color: string;
};

export function getPromotionStats(
  promotions: IPromotion[],
): PromotionStatItem[] {
  const totalUsage = promotions.reduce(
    (sum, promotion) => sum + promotion.usedCount,
    0,
  );

  return [
    {
      label: 'Tổng khuyến mãi',
      value: promotions.length.toString(),
      sub: 'Toàn bộ chương trình',
      icon: Gift,
      color: 'bg-primary text-white',
    },
    {
      label: 'Đang hoạt động',
      value: promotions
        .filter((item) => item.status === 'ACTIVE')
        .length.toString(),
      sub: 'Có thể áp dụng ngay',
      icon: CirclePlay,
      color: 'bg-emerald-500 text-white',
    },
    {
      label: 'Sắp hết hạn',
      value: promotions.filter(isEndingSoon).length.toString(),
      sub: 'Cần theo dõi ngân sách',
      icon: CalendarClock,
      color: 'bg-amber-500 text-white',
    },
    {
      label: 'Đã tạm dừng',
      value: promotions
        .filter((item) => item.status === 'PAUSED')
        .length.toString(),
      sub: 'Chờ kích hoạt lại',
      icon: CirclePause,
      color: 'bg-orange-500 text-white',
    },
    {
      label: 'Tổng lượt sử dụng',
      value: totalUsage.toLocaleString('vi-VN'),
      sub: 'Từ mock data hiện tại',
      icon: ChartNoAxesColumnIncreasing,
      color: 'bg-aqua text-white',
    },
  ];
}
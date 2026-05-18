// src/modules/promotions/utils/promotion-date.util.ts

import dayjs from 'dayjs';

import type { IPromotion } from '@/modules/promotions/types/promotion.type';

export function isEndingSoon(promotion: IPromotion) {
  const today = dayjs();
  const endDate = dayjs(promotion.endDate);

  return (
    promotion.status === 'ACTIVE' &&
    endDate.diff(today, 'day') <= 7 &&
    endDate.diff(today, 'day') >= 0
  );
}
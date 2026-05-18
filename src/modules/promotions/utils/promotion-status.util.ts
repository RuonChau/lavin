// src/modules/promotions/config/promotion-status.config.ts

import type { TPromotionStatus } from '@/modules/promotions/types/promotion.type';

export const getPromotionStatus = (status: TPromotionStatus) => {
  switch (status) {
    case 'ACTIVE':
      return {
        label: 'Đang hoạt động',
        color: 'green',
      };

    case 'UPCOMING':
      return {
        label: 'Sắp diễn ra',
        color: 'blue',
      };

    case 'EXPIRED':
      return {
        label: 'Đã hết hạn',
        color: 'default',
      };

    case 'PAUSED':
      return {
        label: 'Tạm dừng',
        color: 'orange',
      };

    default:
      return {
        label: status,
        color: 'default',
      };
  }
};
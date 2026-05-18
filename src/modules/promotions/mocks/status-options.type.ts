import { TPromotionStatus } from "../types/promotion.type";

export const StatusOptions: { value: TPromotionStatus; label: string }[] = [
  { value: 'ACTIVE', label: 'Đang hoạt động' },
  { value: 'UPCOMING', label: 'Sắp diễn ra' },
  { value: 'EXPIRED', label: 'Đã hết hạn' },
  { value: 'PAUSED', label: 'Tạm dừng' },
];
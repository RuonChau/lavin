import { UsageHistory } from "./usage-history.type";

export type TPromotionType = 'PERCENTAGE' | 'FIXED_AMOUNT' | 'BUY_X_GET_Y' | 'FREESHIP' | 'COMBO';
export type TPromotionStatus = 'ACTIVE' | 'UPCOMING' | 'EXPIRED' | 'PAUSED';
export type TPromotionScope = 'ALL_ORDER' | 'CATEGORY' | 'PRODUCT' | 'BRANCH';


export interface IPromotion {
  id: string;
  name: string;
  code: string;
  type: TPromotionType;
  discountValue: number;
  minimumOrderValue: number;
  maxUsage: number;
  usedCount: number;
  scope: TPromotionScope;
  appliedTargets: string[];
  startDate: string;
  endDate: string;
  status: TPromotionStatus;
  description: string;
  isActive: boolean;
  impactedRevenue: number;
  conversionRate?: number;
  usageHistory: UsageHistory[];
}
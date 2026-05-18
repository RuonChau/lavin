import { formatCurrency } from "@/shared/utils/format-currency";
import { IPromotion, TPromotionScope, TPromotionType } from "../types/promotion.type";
import { PromotionTypeOptions } from "../mocks/promotion-type-options.mock";
import { ScopeOptions } from "../mocks/scope-options.type";
// const formatCurrency = (value: number) => `${value.toLocaleString('vi-VN')} đ`;

export const getDiscountDisplay = (promotion: Pick<IPromotion, 'type' | 'discountValue'>) => {
  if (promotion.type === 'PERCENTAGE') return `${promotion.discountValue}%`;
  if (promotion.type === 'FREESHIP') return `Tối đa ${formatCurrency(promotion.discountValue)}`;
  if (promotion.type === 'BUY_X_GET_Y') return 'Tặng 1 sản phẩm';
  return formatCurrency(promotion.discountValue);
};

export const getTypeLabel = (type: TPromotionType) => PromotionTypeOptions.find((option) => option.value === type)?.label ?? type;

export const getScopeLabel = (scope: TPromotionScope) => ScopeOptions.find((option) => option.value === scope)?.label ?? scope;


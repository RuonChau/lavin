import { BadgePercent, Gift, PackageCheck, Truck, WalletCards } from "lucide-react";
import { TPromotionType } from "../types/promotion.type";

export const PromotionTypeOptions: { value: TPromotionType; label: string; icon: React.ElementType }[] = [
  { value: 'PERCENTAGE', label: 'Giảm theo %', icon: BadgePercent },
  { value: 'FIXED_AMOUNT', label: 'Giảm số tiền cố định', icon: WalletCards },
  { value: 'BUY_X_GET_Y', label: 'Mua X tặng Y', icon: Gift },
  { value: 'FREESHIP', label: 'Freeship', icon: Truck },
  { value: 'COMBO', label: 'Combo', icon: PackageCheck },
];

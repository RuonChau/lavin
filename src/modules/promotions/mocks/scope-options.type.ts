import { Gift, PackageCheck, Store, TagIcon } from "lucide-react";
import { TPromotionScope } from "../types/promotion.type";

export const ScopeOptions: { value: TPromotionScope; label: string; icon: React.ElementType }[] = [
  { value: 'ALL_ORDER', label: 'Toàn đơn hàng', icon: TagIcon },
  { value: 'CATEGORY', label: 'Theo danh mục', icon: PackageCheck },
  { value: 'PRODUCT', label: 'Theo sản phẩm', icon: Gift },
  { value: 'BRANCH', label: 'Theo chi nhánh', icon: Store },
];
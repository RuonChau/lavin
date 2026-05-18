import { OrderStatus } from "../domain/entities/order.entity";
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  Coffee,
  ShoppingBag,
  XCircle,
} from 'lucide-react';

export const getStatusConfig = (status: OrderStatus) => {
  switch (status) {
    case OrderStatus.PENDING:
      return { label: 'Chờ xử lý', color: 'bg-amber-100 text-amber-600', icon: Clock };
    case OrderStatus.PREPARING:
      return { label: 'Đang pha chế', color: 'bg-blue-100 text-blue-600', icon: Coffee };
    case OrderStatus.READY:
      return { label: 'Chờ lấy hàng', color: 'bg-indigo-100 text-indigo-600', icon: ShoppingBag };
    case OrderStatus.COMPLETED:
      return { label: 'Hoàn thành', color: 'bg-green-100 text-green-600', icon: CheckCircle2 };
    case OrderStatus.CANCELLED:
      return { label: 'Đã hủy', color: 'bg-red-100 text-red-600', icon: XCircle };
    default:
      return { label: status, color: 'bg-slate-100 text-slate-600', icon: AlertCircle };
  }
};
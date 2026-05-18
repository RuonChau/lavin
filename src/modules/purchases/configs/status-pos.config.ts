import { CheckCircle2, Clock, Truck, XCircle } from "lucide-react";
 
export const STATUS_CONFIG = {
  PENDING: { label: 'Chờ duyệt', color: 'bg-amber-50 text-amber-600 border-amber-100', icon: Clock },
  SHIPPING: { label: 'Đang giao', color: 'bg-blue-50 text-blue-600 border-blue-100', icon: Truck },
  COMPLETED: { label: 'Đã hoàn thành', color: 'bg-green-50 text-green-600 border-green-100', icon: CheckCircle2 },
  CANCELLED: { label: 'Đã hủy', color: 'bg-red-50 text-red-600 border-red-100', icon: XCircle },
};

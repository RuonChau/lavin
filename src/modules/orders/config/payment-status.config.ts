// src/modules/orders/config/payment-status.config.ts

import { PaymentStatus } from "../domain/entities/order.entity";


export const getPaymentStatusConfig = (status: PaymentStatus) => {
  switch (status) {
    case PaymentStatus.PAID:
      return {
        label: 'Đã thanh toán',
        color: 'text-green-600',
      };

    case PaymentStatus.UNPAID:
      return {
        label: 'Chưa thanh toán',
        color: 'text-amber-600',
      };

    case PaymentStatus.REFUNDED:
      return {
        label: 'Đã hoàn tiền',
        color: 'text-red-600',
      };

    default:
      return {
        label: status,
        color: 'text-slate-600',
      };
  }
};
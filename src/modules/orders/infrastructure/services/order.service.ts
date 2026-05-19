import { api } from '@/shared/lib/axios';
import { unwrapData, unwrapList } from '@/shared/lib/api-response';
import { Order, OrderItem, OrderStatus, PaymentStatus } from '../../domain/entities/order.entity';

export interface OrderInput {
  items: Array<{
    product_variant_id: string;
    quantity: number;
    note?: string;
  }>;
  note?: string;
  payment_method: string;
  promotion_code?: string;
  branch_id: string;
  customer_id?: string;
}

export interface OrderStatusInput {
  order_status?: 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  payment_status?: 'PENDING' | 'PAID' | 'CANCELLED' | 'REFUNDED';
  note?: string;
}

function toNumber(value: unknown, fallback = 0): number {
  const numberValue = Number(value);
  return Number.isFinite(numberValue) ? numberValue : fallback;
}

function normalizeOrderStatus(value: unknown): OrderStatus {
  switch (String(value ?? '').toUpperCase()) {
    case 'PENDING':
      return OrderStatus.PENDING;
    case 'PROCESSING':
      return OrderStatus.PREPARING;
    case 'SHIPPED':
      return OrderStatus.READY;
    case 'DELIVERED':
      return OrderStatus.COMPLETED;
    case 'CANCELLED':
      return OrderStatus.CANCELLED;
    default:
      return OrderStatus.PENDING;
  }
}

function normalizePaymentStatus(value: unknown): PaymentStatus {
  switch (String(value ?? '').toUpperCase()) {
    case 'PAID':
      return PaymentStatus.PAID;
    case 'REFUNDED':
    case 'CANCELLED':
      return PaymentStatus.REFUNDED;
    case 'PENDING':
    default:
      return PaymentStatus.UNPAID;
  }
}

function mapServerOrderItem(item: Record<string, unknown>, index: number): OrderItem {
  const product = item.product as Record<string, unknown> | undefined;
  const variant = item.product_variant as Record<string, unknown> | undefined;

  return {
    id: String(item.id ?? item.order_item_id ?? index),
    productId: String(item.product_id ?? product?.id ?? variant?.product_id ?? ''),
    productName: String(item.product_name ?? product?.name ?? variant?.variant_name ?? 'San pham'),
    quantity: toNumber(item.quantity, 1),
    price: toNumber(item.price ?? item.unit_price ?? variant?.price),
    size: item.size ? String(item.size) : undefined,
    note: item.note ? String(item.note) : undefined,
    image: item.image ? String(item.image) : undefined,
  };
}

function mapServerOrder(order: Record<string, unknown>): Order {
  const customer = order.customer as Record<string, unknown> | undefined;
  const items = Array.isArray(order.items)
    ? (order.items as Record<string, unknown>[]).map(mapServerOrderItem)
    : Array.isArray(order.order_items)
      ? (order.order_items as Record<string, unknown>[]).map(mapServerOrderItem)
      : [];

  return {
    id: String(order.id ?? order._id ?? ''),
    orderNumber: String(order.order_code ?? order.orderNumber ?? order.code ?? order.id ?? ''),
    customerId: order.customer_id ? String(order.customer_id) : undefined,
    customerName: String(order.customer_name ?? customer?.name ?? customer?.phone_number ?? 'Khach vang lai'),
    items,
    totalAmount: toNumber(order.total_amount ?? order.totalAmount ?? order.final_amount ?? order.total),
    status: normalizeOrderStatus(order.order_status ?? order.status),
    paymentStatus: normalizePaymentStatus(order.payment_status),
    paymentMethod: String(order.payment_method ?? ''),
    createdAt: String(order.created_at ?? order.createdAt ?? new Date().toISOString()),
    updatedAt: String(order.updated_at ?? order.updatedAt ?? new Date().toISOString()),
    tableNumber: order.table_number ? String(order.table_number) : undefined,
    type: String(order.order_type ?? order.type ?? 'take-away') as Order['type'],
  };
}

export const orderService = {
  getOrders: async (params?: { page?: number; limit?: number }): Promise<Order[]> => {
    const response = await api.get('/orders', { params });
    return unwrapList<Record<string, unknown>>(response.data).map(mapServerOrder);
  },
  
  getOrderHistory: async (params?: { page?: number; limit?: number }): Promise<Order[]> => {
    const response = await api.get('/orders/history', { params });
    return unwrapList<Record<string, unknown>>(response.data).map(mapServerOrder);
  },
  
  getOrderDetail: async (id: string): Promise<Order> => {
    const response = await api.get(`/order/${id}`);
    return mapServerOrder(unwrapData<Record<string, unknown>>(response.data) ?? {});
  },
  
  createOrder: async (data: OrderInput): Promise<Order> => {
    const response = await api.post('/order', data);
    return mapServerOrder(unwrapData<Record<string, unknown>>(response.data) ?? {});
  },
  
  updateOrderStatus: async (id: string, data: OrderStatusInput): Promise<Order> => {
    const response = await api.patch(`/order/${id}/status`, data);
    return mapServerOrder(unwrapData<Record<string, unknown>>(response.data) ?? {});
  },
  
  cancelOrder: async (id: string): Promise<void> => {
    await api.patch(`/order/${id}/cancel`);
  }
};

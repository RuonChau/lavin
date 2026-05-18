import { OrderStatus } from "../domain/entities/order.entity";

export type OrderFilterStatus = OrderStatus | 'all';

export type FilterOrdersParams<TOrder extends {
  orderNumber: string;
  customerName?: string | null;
  status: OrderStatus;
}> = {
  orders: TOrder[];
  searchTerm: string;
  statusFilter: OrderFilterStatus;
};
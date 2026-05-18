import { OrderStatus } from "../domain/entities/order.entity";
import { FilterOrdersParams } from "../types/order.type";


export function filterOrders<TOrder extends {
  orderNumber: string;
  customerName?: string | null;
  status: OrderStatus;
}>({
  orders,
  searchTerm,
  statusFilter,
}: FilterOrdersParams<TOrder>) {
  const searchValue = searchTerm.trim().toLowerCase();

  return orders.filter((order) => {
    const matchesSearch =
      !searchValue ||
      order.orderNumber.toLowerCase().includes(searchValue) ||
      order.customerName?.toLowerCase().includes(searchValue);

    const matchesStatus =
      statusFilter === 'all' || order.status === statusFilter;

    return matchesSearch && matchesStatus;
  });
}
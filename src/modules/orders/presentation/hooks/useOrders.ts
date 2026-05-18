import { useState, useEffect } from 'react';
import { Order, OrderStatus, PaymentStatus } from '../../domain/entities/order.entity';

const MOCK_ORDERS: Order[] = [
  {
    id: '1',
    orderNumber: 'ORD-001',
    customerName: 'Nguyễn Văn A',
    items: [
      { id: 'i1', productId: 'p1', productName: 'Phê La Latte', quantity: 2, price: 65000, size: 'L' },
      { id: 'i2', productId: 'p2', productName: 'Bánh Mì Muối Ớt', quantity: 1, price: 35000 }
    ],
    totalAmount: 165000,
    status: OrderStatus.COMPLETED,
    paymentStatus: PaymentStatus.PAID,
    paymentMethod: 'Tiền mặt',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    type: 'dine-in',
    tableNumber: '04'
  },
  {
    id: '2',
    orderNumber: 'ORD-002',
    customerName: 'Lê Thị B',
    items: [
      { id: 'i3', productId: 'p3', productName: 'Matcha Latte', quantity: 1, price: 55000, size: 'M' }
    ],
    totalAmount: 55000,
    status: OrderStatus.PREPARING,
    paymentStatus: PaymentStatus.UNPAID,
    paymentMethod: 'Chuyển khoản',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    type: 'take-away'
  },
  {
    id: '3',
    orderNumber: 'ORD-003',
    customerName: 'Trần Văn C',
    items: [
      { id: 'i4', productId: 'p4', productName: 'Espresso Arabica', quantity: 3, price: 45000, size: 'S' }
    ],
    totalAmount: 135000,
    status: OrderStatus.PENDING,
    paymentStatus: PaymentStatus.UNPAID,
    paymentMethod: 'Momo',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    type: 'delivery'
  }
];

export function useOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setOrders(MOCK_ORDERS);
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  return {
    orders,
    isLoading,
    refreshOrders: () => setIsLoading(true)
  };
}

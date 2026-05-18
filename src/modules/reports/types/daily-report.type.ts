
export interface IDailyReport {
  key: string;
  date: string;
  revenue: number;
  orders: number;
  completedOrders: number;
  canceledOrders: number;
  newCustomers: number;
  aov: number;
  growth: number;
}
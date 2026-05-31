'use client';

import { GlassCard } from "@/shared/components/GlassCard";
import { Search, ShoppingBag, Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { orderService } from "@/modules/orders/infrastructure/services/order.service";
import { useState } from "react";

export default function HistoryTab() {
  const [searchTerm, setSearchTerm] = useState("");

  const { data: orders = [], isLoading } = useQuery({
    queryKey: ["orders-history-list"],
    queryFn: () => orderService.getOrders({ limit: 100 }), // fetch recent 100 orders
    staleTime: 1000 * 60 * 2, // 2 minutes stale time
  });

  // Filter orders based on order number or customer name
  const filteredOrders = orders.filter((order) => {
    if (!searchTerm) return true;
    const q = searchTerm.toLowerCase();
    return (
      order.orderNumber.toLowerCase().includes(q) ||
      (order.customerName && order.customerName.toLowerCase().includes(q))
    );
  });

  return (
    <GlassCard className="p-8" radius="4xl">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-primary-soft" size={18} />
          <input
            type="text"
            placeholder="Tìm theo mã đơn, tên khách hàng..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white/60 border border-primary-soft/20 rounded-2xl py-3.5 pl-12 pr-4 text-sm font-medium focus:outline-none focus:border-primary/40 focus:bg-white transition-all shadow-sm h-12"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 text-primary-soft gap-3">
          <Loader2 size={36} className="animate-spin" />
          <p className="text-sm font-bold">Đang tải lịch sử giao dịch...</p>
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="flex flex-col items-center py-16">
          <div className="w-16 h-16 rounded-3xl bg-white/60 flex items-center justify-center text-text-muted/40 mb-4 border border-primary-soft/10">
            <ShoppingBag size={32} />
          </div>
          <p className="text-sm font-bold text-text-muted">Chưa tìm thấy giao dịch nào</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => {
            const totalItemsCount = order.items.reduce((acc, curr) => acc + curr.quantity, 0);
            const pointsEarned = Math.floor(order.totalAmount / 10000); // 1 point per 10k VND

            return (
              <div
                key={order.id}
                className="flex flex-col md:flex-row md:items-center justify-between p-5 bg-white/40 border border-primary-soft/20 hover:border-primary/30 rounded-3xl shadow-sm transition-all group cursor-pointer"
              >
                <div className="flex items-center gap-5">
                  <div className="w-12 h-12 rounded-2xl bg-[#FFFAF4] flex items-center justify-center text-primary shadow-sm border border-primary-soft/20">
                    <ShoppingBag size={20} />
                  </div>
                  <div>
                    <p className="font-bold text-text-primary text-base group-hover:text-primary transition-colors">
                      {order.customerName}
                    </p>
                    <div className="flex items-center gap-3 mt-1.5">
                      <span className="text-[10px] font-black uppercase text-primary tracking-widest bg-primary/10 px-2 py-0.5 rounded-lg">
                        {order.orderNumber.slice(-8)}
                      </span>
                      <span className="text-[11px] font-bold text-text-muted">
                        {new Date(order.createdAt).toLocaleString("vi-VN")}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-8 mt-4 md:mt-0">
                  <div className="text-right">
                    <p className="text-[10px] font-black text-[#968271] uppercase tracking-widest mb-1">Số lượng</p>
                    <p className="font-bold text-text-primary">{totalItemsCount} món</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-black text-[#968271] uppercase tracking-widest mb-1">Tổng tiền</p>
                    <p className="font-bold text-primary">{order.totalAmount.toLocaleString()} ₫</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-black text-[#968271] uppercase tracking-widest mb-1">Điểm nhận</p>
                    <p className="font-black text-text-primary tag-green bg-green-50 px-2 py-1 rounded-lg">
                      +{pointsEarned}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </GlassCard>
  );
}

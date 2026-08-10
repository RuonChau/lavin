import { FilterChipsHistory } from "@/modules/purchases/mocks/filter-chips-history.mock";
import { STATUS_CONFIG } from "@/modules/purchases/configs/status-pos.config";
import { SupplierHistoryModalProps } from "@/modules/purchases/types/SupplierHistoryModalProps";
import { AntdModalShell } from "@/shared/ui/antd-modal-shell";
import { cn } from "@/shared/utils/cn";
import { motion } from "framer-motion";
import { ArrowRight, Check, Copy, FileText, History, X } from "lucide-react";
import { useMemo, useState } from "react";

export default function SupplierHistoryModal({ supplier, orders = [], onClose, onViewOrder }: SupplierHistoryModalProps) {
  const [timeFilter, setTimeFilter] = useState('30DAYS');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(text);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const supplierOrders = useMemo(() => {
    if (!supplier) return [];
    const cutoffDays = timeFilter === '7DAYS' ? 7 : timeFilter === '30DAYS' ? 30 : null;
    const cutoff = cutoffDays ? Date.now() - cutoffDays * 24 * 60 * 60 * 1000 : null;

    return orders
      .filter((o: any) => o.supplierId === supplier.id)
      .filter((o: any) => !cutoff || new Date(o.orderDate).getTime() >= cutoff)
      .sort((a: any, b: any) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime());
  }, [orders, supplier, timeFilter]);

  if (!supplier) return null;

  return (
    <AntdModalShell open={!!supplier} onClose={onClose} width={512} zIndex={1500} maskColor="rgba(0, 0, 0, 0.4)">
      <div className="relative h-[90vh] max-h-[90vh] overflow-hidden bg-[#FCF9F6] shadow-2xl border border-primary-soft/20 rounded-4xl">
        {/* Sidebar Header */}
        <div className="p-8 border-b border-primary-soft/10 bg-white/60">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group">
                <History size={24} className="group-hover:-rotate-45 transition-transform" />
              </div>
              <div>
                <h2 className="text-xl font-black text-text-primary">Lịch sử nhà cung cấp</h2>
                <p className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] mt-0.5">{supplier.name}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-3 text-text-muted hover:bg-[#FFFAF4] rounded-2xl transition-all"
            >
              <X size={24} />
            </button>
          </div>

          {/* Filter Chips */}
          <div className="flex items-center gap-2 p-1 bg-white/80 rounded-2xl border border-primary-soft/20">
            {FilterChipsHistory.map((f) => (
              <button
                key={f.id}
                onClick={() => setTimeFilter(f.id)}
                className={cn(
                  "px-4 py-2 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all flex-1",
                  timeFilter === f.id
                    ? "bg-white text-primary shadow-sm"
                    : "text-text-muted hover:bg-white/40"
                )}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Timeline Content */}
        <div className="p-8 h-[calc(100%-180px)] overflow-y-auto custom-scrollbar">
          <div className="relative space-y-12">
            {/* Vertical Line */}
            <div className="absolute left-5.25 top-2 bottom-2 w-0.5 bg-linear-to-b from-primary/30 via-primary-soft/20 to-transparent" />

            {supplierOrders.map((order: any, idx: number) => {
              const config = STATUS_CONFIG[order.status as keyof typeof STATUS_CONFIG];
              const Icon = config?.icon || FileText;
              return (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  key={order.dbId}
                  className="relative pl-14 group"
                >
                  {/* Timeline Dot/Icon */}
                  <div className={cn(
                    "absolute left-0 top-0 w-11 h-11 rounded-2xl z-10 flex items-center justify-center border-2 border-white shadow-md transition-transform group-hover:scale-110",
                    config?.color || "bg-gray-50 text-gray-600"
                  )}>
                    <Icon size={18} />
                  </div>

                  {/* Content Card */}
                  <div className="bg-white/60 border border-primary-soft/20 rounded-3xl p-5 hover:border-primary/30 hover:bg-white transition-all shadow-sm group-hover:shadow-md">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="text-[10px] font-black text-primary uppercase tracking-widest">{order.date}</p>
                        <h4 className="text-sm font-black text-text-primary mt-1">{config?.label || order.status}</h4>
                      </div>
                      <span className="text-[10px] font-black text-text-muted bg-[#FFFAF4] px-2 py-1 rounded-lg">
                        ₫{order.total.toLocaleString('vi-VN')}
                      </span>
                    </div>

                    <p className="text-xs text-text-muted leading-relaxed mb-3">{order.itemsCount} mặt hàng · Nhập tại {order.branch}</p>

                    <div className="flex items-center justify-between pt-3 border-t border-primary-soft/20">
                      <button
                        onClick={() => copyToClipboard(order.id)}
                        className="text-[10px] font-bold text-text-muted flex items-center gap-1 hover:text-primary transition-all group/copy"
                      >
                        <FileText size={12} /> {order.id}
                        {copiedId === order.id ? (
                          <Check size={10} className="text-green-500 animate-in zoom-in duration-300" />
                        ) : (
                          <Copy size={10} className="opacity-0 group-hover/copy:opacity-100 transition-opacity" />
                        )}
                      </button>
                      <button
                        onClick={() => onViewOrder?.(order.id)}
                        className="text-[10px] font-black text-primary uppercase tracking-widest hover:underline flex items-center gap-1 group/btn"
                      >
                        Xem đơn <ArrowRight size={10} className="group-hover/btn:translate-x-1 transition-transform" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Empty State placeholder */}
          {supplierOrders.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-primary-soft/60">
              <History size={48} className="mb-4 opacity-20" />
              <p className="text-sm font-bold">Chưa có hoạt động nào trong khoảng thời gian này</p>
            </div>
          )}
        </div>

        {/* Footer Info */}
        <div className="absolute bottom-0 left-0 right-0 p-8 border-t border-primary-soft/20 bg-white/80 backdrop-blur-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] font-black text-[#968271] uppercase tracking-widest mb-1">Hiệu suất cung ứng</p>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
                  <span className="text-xs font-black text-text-primary">98% Đúng hạn</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
                  <span className="text-xs font-black text-text-primary">4.8 Sao</span>
                </div>
              </div>
            </div>
            <button className="px-6 py-3 rounded-2xl bg-primary-soft border border-primary-soft/30 text-[10px] font-black text-text-secondary uppercase tracking-widest transition-all hover:bg-white hover:shadow-sm">
              Xuất sao kê
            </button>
          </div>
        </div>
      </div>
    </AntdModalShell>
  );
}

import { STATUS_CONFIG } from "@/modules/purchases/configs/status-pos.config";
import { ViewPurchaseOrderModalProps } from "@/modules/purchases/types/ViewPurchaseOrderModalProps";
import { GlassCard } from "@/shared/components/GlassCard";
import { AntdModalShell } from "@/shared/ui/antd-modal-shell";
import { cn } from "@/shared/utils/cn";
import { Calendar, FileDown, FileText, Package, Store, User, X } from "lucide-react";

export default function ViewPurchaseOrderModal({ order, onClose }: ViewPurchaseOrderModalProps) {
  if (!order) return null;

  const StatusIcon = STATUS_CONFIG[order.status as keyof typeof STATUS_CONFIG]?.icon || FileText;

  return (
    <AntdModalShell open={!!order} onClose={onClose} width={672} zIndex={1500} maskColor="rgba(0, 0, 0, 0.4)">
      <GlassCard className="overflow-hidden" radius="4xl">
        <div className="p-8 border-b border-primary-soft/20 bg-white/60 flex items-center justify-between">
          <div className="flex items-center gap-5">
            <div className="w-14 h-14 rounded-3xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
              <FileText size={28} />
            </div>
            <div>
              <h2 className="text-2xl font-black text-text-primary tracking-tight">{order.id}</h2>
              <div className={cn(
                "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider border mt-1",
                STATUS_CONFIG[order.status as keyof typeof STATUS_CONFIG]?.color || "bg-gray-50 text-gray-600 border-gray-100"
              )}>
                <StatusIcon size={10} strokeWidth={3} />
                {STATUS_CONFIG[order.status as keyof typeof STATUS_CONFIG]?.label || order.status}
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <button className="p-3 text-text-secondary bg-white/60 hover:bg-white rounded-2xl transition-all border border-primary-soft/20">
              <FileDown size={20} />
            </button>
            <button onClick={onClose} className="p-3 text-text-secondary hover:bg-white/60 rounded-2xl transition-all">
              <X size={24} />
            </button>
          </div>
        </div>

        <div className="p-8 bg-white/40 grid grid-cols-2 gap-y-8 gap-x-12">
          <div>
            <label className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] block mb-2">Nhà cung cấp</label>
            <p className="text-sm font-bold text-text-primary">{order.supplier}</p>
          </div>
          <div>
            <label className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] block mb-2">Ngày lập đơn</label>
            <div className="flex items-center gap-2 text-sm font-bold text-text-primary">
              <Calendar size={14} className="text-primary" />
              {order.date}
            </div>
          </div>
          <div>
            <label className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] block mb-2">Người lập đơn</label>
            <div className="flex items-center gap-2 text-sm font-bold text-text-primary">
              <User size={14} className="text-primary" />
              Quản trị viên
            </div>
          </div>
          <div>
            <label className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] block mb-2">Kho nhập hàng</label>
            <div className="flex items-center gap-2 text-sm font-bold text-text-primary">
              <Store size={14} className="text-primary" />
              {order.branch}
            </div>
          </div>
          {order.note && (
            <div className="col-span-2">
              <label className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] block mb-2">Ghi chú</label>
              <p className="text-xs font-semibold text-text-primary bg-primary-soft/40 border border-primary-soft/20 p-4 rounded-2xl">{order.note}</p>
            </div>
          )}
        </div>

        <div className="px-8 py-6 bg-[#FFFAF4]/30 border-y border-primary-soft/10">
          <h4 className="text-[10px] font-black text-text-primary uppercase tracking-[0.2em] mb-4">Danh sách mặt hàng ({order.itemsCount})</h4>
          {order.items?.length > 0 ? (
            <div className="space-y-3 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
              {order.items.map((item: any) => (
                <div key={item.id} className="flex items-center gap-4 bg-white/60 border border-primary-soft/10 rounded-3xl p-4">
                  <div className="w-10 h-10 rounded-2xl bg-primary/5 flex items-center justify-center text-primary">
                    <Package size={18} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-text-primary">{item.name}</p>
                    <p className="text-[10px] text-text-muted font-bold uppercase tracking-widest">{item.sku}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-black text-text-primary">{item.quantity} {item.unit} x ₫{item.price.toLocaleString('vi-VN')}</p>
                    <p className="text-sm font-black text-primary">₫{(item.quantity * item.price).toLocaleString('vi-VN')}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs font-bold text-text-muted py-6 text-center">Đơn hàng chưa có chi tiết mặt hàng.</p>
          )}
        </div>

        <div className="p-8 border-t border-primary-soft/20 bg-white/40 flex items-center justify-between">
          <div className="flex flex-col">
            <p className="text-[10px] font-black text-text-muted uppercase tracking-widest">Tổng giá trị đơn hàng</p>
            <p className="text-3xl font-black text-primary">₫{order.total.toLocaleString('vi-VN')}</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-10 py-4 rounded-2xl bg-white border border-primary-soft/30 text-sm font-black text-text-secondary transition-all hover:bg-gray-50"
            >
              Đóng
            </button>
            <button className="px-10 py-4 rounded-2xl bg-primary text-white text-sm font-black shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] active:scale-95">
              In đơn nhập
            </button>
          </div>
        </div>
      </GlassCard>
    </AntdModalShell>
  );
}

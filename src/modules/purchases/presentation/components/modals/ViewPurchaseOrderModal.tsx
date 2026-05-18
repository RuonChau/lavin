import { STATUS_CONFIG } from "@/modules/employees/config/status.config";
import { ItemOrderList } from "@/modules/purchases/mocks/item-order-list.mock";
import { ViewPurchaseOrderModalProps } from "@/modules/purchases/types/ViewPurchaseOrderModalProps";
import { GlassCard } from "@/shared/components/GlassCard";
import { cn } from "@/shared/utils/cn";
import { AnimatePresence, motion } from "framer-motion";
import { Calendar, FileDown, FileText, Package, Store, User, X } from "lucide-react";
// import { motion, AnimatePresence } from 'motion/react';


export default function ViewPurchaseOrderModal({ order, onClose }: ViewPurchaseOrderModalProps) {
  if (!order) return null;

  return (
    <AnimatePresence>
      <motion.div
        key="backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 z-[150] bg-black/40 backdrop-blur-md"
      />

      <div key="modal-container" className="fixed inset-0 z-[151] flex items-center justify-center p-4 pointer-events-none">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 50 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 50 }}
          className="w-full max-w-2xl pointer-events-auto"
        >
          <GlassCard className="overflow-hidden" radius="4xl">
            <div className="p-8 border-b border-[#D8B894]/20 bg-white/60 flex items-center justify-between">
              <div className="flex items-center gap-5">
                <div className="w-14 h-14 rounded-[24px] bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                  <FileText size={28} />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-[#2A1E17] tracking-tight">{order.id}</h2>
                  <div className={cn(
                    "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider border mt-1",
                    STATUS_CONFIG[order.status as keyof typeof STATUS_CONFIG].color
                  )}>
                    {STATUS_CONFIG[order.status as keyof typeof STATUS_CONFIG].label}
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="p-3 text-[#6F5A4A] bg-white/60 hover:bg-white rounded-2xl transition-all border border-[#D8B894]/20">
                  <FileDown size={20} />
                </button>
                <button onClick={onClose} className="p-3 text-[#9A8677] hover:bg-white/60 rounded-2xl transition-all">
                  <X size={24} />
                </button>
              </div>
            </div>

            <div className="p-8 bg-white/40 grid grid-cols-2 gap-y-8 gap-x-12">
               <div>
                  <label className="text-[10px] font-black text-[#968271] uppercase tracking-[0.2em] block mb-2">Nhà cung cấp</label>
                  <p className="text-sm font-bold text-[#2A1E17]">{order.supplier}</p>
               </div>
               <div>
                  <label className="text-[10px] font-black text-[#968271] uppercase tracking-[0.2em] block mb-2">Ngày dự kiến nhận</label>
                  <div className="flex items-center gap-2 text-sm font-bold text-[#2A1E17]">
                    <Calendar size={14} className="text-primary" />
                    {order.expectedDate}
                  </div>
               </div>
               <div>
                  <label className="text-[10px] font-black text-[#968271] uppercase tracking-[0.2em] block mb-2">Người tạo</label>
                  <div className="flex items-center gap-2 text-sm font-bold text-[#2A1E17]">
                    <User size={14} className="text-primary" />
                    {order.creator}
                  </div>
               </div>
               <div>
                  <label className="text-[10px] font-black text-[#968271] uppercase tracking-[0.2em] block mb-2">Kho nhập hàng</label>
                  <div className="flex items-center gap-2 text-sm font-bold text-[#2A1E17]">
                    <Store size={14} className="text-primary" />
                    {order.branch}
                  </div>
               </div>
            </div>

            <div className="px-8 py-6 bg-[#FFFAF4]/30 border-y border-[#D8B894]/10">
               <h4 className="text-[10px] font-black text-[#2A1E17] uppercase tracking-[0.2em] mb-4">Danh sách mặt hàng ({order.itemsCount})</h4>
               <div className="space-y-3 max-h-[240px] overflow-y-auto pr-2 custom-scrollbar">
                  {/* Item List placeholder - In practice fetch from API or pass data */}
                  {ItemOrderList.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-4 bg-white/60 border border-[#D8B894]/10 rounded-3xl p-4">
                      <div className="w-10 h-10 rounded-2xl bg-primary/5 flex items-center justify-center text-primary">
                        <Package size={18} />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-bold text-[#2A1E17]">{item.name}</p>
                        <p className="text-[10px] text-[#968271] font-bold uppercase tracking-widest">{item.sku}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs font-black text-[#2A1E17]">{item.qty} x ₫{item.price.toLocaleString('vi-VN')}</p>
                        <p className="text-sm font-black text-primary">₫{(item.qty * item.price).toLocaleString('vi-VN')}</p>
                      </div>
                    </div>
                  ))}
               </div>
            </div>

            <div className="p-8 border-t border-[#D8B894]/20 bg-white/40 flex items-center justify-between">
               <div className="flex flex-col">
                  <p className="text-[10px] font-black text-[#9A8677] uppercase tracking-widest">Tổng giá trị đơn hàng</p>
                  <p className="text-3xl font-black text-primary">₫{order.total.toLocaleString('vi-VN')}</p>
               </div>
               <div className="flex gap-3">
                  <button 
                    onClick={onClose}
                    className="px-10 py-4 rounded-2xl bg-white border border-[#D8B894]/30 text-sm font-black text-[#6F5A4A] transition-all hover:bg-gray-50"
                  >
                    Đóng
                  </button>
                  <button className="px-10 py-4 rounded-2xl bg-primary text-white text-sm font-black shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] active:scale-95">
                    In đơn nhập
                  </button>
               </div>
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

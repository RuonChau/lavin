import { history } from "@/modules/customers/mocks/history.mock";
import { FilterChipsHistory } from "@/modules/purchases/mocks/filter-chips-history.mock";
import { HistorySuppiler } from "@/modules/purchases/mocks/history.mock";
import { SupplierHistoryModalProps } from "@/modules/purchases/types/SupplierHistoryModalProps";
import { cn } from "@/shared/utils/cn";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Check, Copy, FileText, History, X } from "lucide-react";
import { useState } from "react";

export default function SupplierHistoryModal({ supplier, onClose, onViewOrder }: SupplierHistoryModalProps) {
  const [timeFilter, setTimeFilter] = useState('30DAYS');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(text);
    setTimeout(() => setCopiedId(null), 2000);
  };

 

  if (!supplier) return null;

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

      <div key="modal-container" className="fixed inset-0 z-[151] flex items-center justify-end pointer-events-none">
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="w-full max-w-lg h-full bg-[#FCF9F6] shadow-2xl pointer-events-auto border-l border-[#D8B894]/20"
        >
          {/* Sidebar Header */}
          <div className="p-8 border-b border-[#D8B894]/10 bg-white/60">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group">
                  <History size={24} className="group-hover:rotate-[-45deg] transition-transform" />
                </div>
                <div>
                  <h2 className="text-xl font-black text-[#2A1E17]">Lịch sử nhà cung cấp</h2>
                  <p className="text-[10px] font-black text-[#9A8677] uppercase tracking-[0.2em] mt-0.5">{supplier.name}</p>
                </div>
              </div>
              <button 
                onClick={onClose}
                className="p-3 text-[#9A8677] hover:bg-[#FFFAF4] rounded-2xl transition-all"
              >
                <X size={24} />
              </button>
            </div>

            {/* Filter Chips */}
            <div className="flex items-center gap-2 p-1 bg-[#FFFAF4]/80 rounded-2xl border border-[#D8B894]/20">
               {FilterChipsHistory.map((f) => (
                 <button
                   key={f.id}
                   onClick={() => setTimeFilter(f.id)}
                   className={cn(
                     "px-4 py-2 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all flex-1",
                     timeFilter === f.id 
                       ? "bg-white text-primary shadow-sm" 
                       : "text-[#9A8677] hover:bg-white/40"
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
              <div className="absolute left-[21px] top-2 bottom-2 w-0.5 bg-gradient-to-b from-primary/30 via-[#D8B894]/20 to-transparent" />

              {HistorySuppiler.map((event, idx) => (
                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  key={event.id} 
                  className="relative pl-14 group"
                >
                  {/* Timeline Dot/Icon */}
                  <div className={cn(
                    "absolute left-0 top-0 w-11 h-11 rounded-2xl z-10 flex items-center justify-center border-2 border-white shadow-md transition-transform group-hover:scale-110",
                    event.color
                  )}>
                    <event.icon size={18} />
                  </div>

                  {/* Content Card */}
                  <div className="bg-white/60 border border-[#D8B894]/20 rounded-3xl p-5 hover:border-primary/30 hover:bg-white transition-all shadow-sm group-hover:shadow-md">
                    <div className="flex items-start justify-between mb-2">
                       <div>
                         <p className="text-[10px] font-black text-primary uppercase tracking-widest">{event.date}</p>
                         <h4 className="text-sm font-black text-[#2A1E17] mt-1">{event.title}</h4>
                       </div>
                       <span className="text-[10px] font-black text-[#9A8677] bg-[#FFFAF4] px-2 py-1 rounded-lg">
                         {event.time}
                       </span>
                    </div>
                    
                    <p className="text-xs text-[#6F5A4A] leading-relaxed mb-3">{event.desc}</p>
                    
                    <div className="flex items-center justify-between pt-3 border-t border-[#D8B894]/10">
                       <button 
                         onClick={() => copyToClipboard(event.orderId)}
                         className="text-[10px] font-bold text-[#9A8677] flex items-center gap-1 hover:text-primary transition-all group/copy"
                       >
                         <FileText size={12} /> {event.orderId}
                         {copiedId === event.orderId ? (
                           <Check size={10} className="text-green-500 animate-in zoom-in duration-300" />
                         ) : (
                           <Copy size={10} className="opacity-0 group-hover/copy:opacity-100 transition-opacity" />
                         )}
                       </button>
                       <button 
                         onClick={() => onViewOrder?.(event.orderId)}
                         className="text-[10px] font-black text-primary uppercase tracking-widest hover:underline flex items-center gap-1 group/btn"
                       >
                         Xem đơn <ArrowRight size={10} className="group-hover/btn:translate-x-1 transition-transform" />
                       </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Empty State placeholder */}
            {history.length === 0 && (
              <div className="flex flex-col items-center justify-center py-20 text-[#D8B894]/60">
                <History size={48} className="mb-4 opacity-20" />
                <p className="text-sm font-bold">Chưa có hoạt động nào trong khoảng thời gian này</p>
              </div>
            )}
          </div>

          {/* Footer Info */}
          <div className="absolute bottom-0 left-0 right-0 p-8 border-t border-[#D8B894]/20 bg-white/80 backdrop-blur-md">
             <div className="flex items-center justify-between">
                <div>
                   <p className="text-[10px] font-black text-[#968271] uppercase tracking-widest mb-1">Hiệu suất cung ứng</p>
                   <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1.5">
                        <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
                        <span className="text-xs font-black text-[#2A1E17]">98% Đúng hạn</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
                        <span className="text-xs font-black text-[#2A1E17]">4.8 Sao</span>
                      </div>
                   </div>
                </div>
                <button className="px-6 py-3 rounded-2xl bg-[#FFFAF4] border border-[#D8B894]/30 text-[10px] font-black text-[#6F5A4A] uppercase tracking-widest transition-all hover:bg-white hover:shadow-sm">
                  Xuất sao kê
                </button>
             </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

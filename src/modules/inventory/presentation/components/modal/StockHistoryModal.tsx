'use client';

import { motion, AnimatePresence } from 'motion/react';
import { X, History, User, Clock, ArrowUpRight, ArrowDownRight, Package } from 'lucide-react';
import { GlassCard } from '@/shared/components/GlassCard';
import { Material, StockAdjustment } from '../../../domain/entities/material.entity';
import { cn } from '@/shared/utils/cn';
import { useMaterialHistory } from '../../hooks/useInventory';

interface StockHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  material: Material | null;
}

export function StockHistoryModal({ isOpen, onClose, material }: StockHistoryModalProps) {
  const { data: history, isLoading } = useMaterialHistory(material?.id || null);

  if (!material) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[130] bg-black/20 backdrop-blur-sm"
          />

          <div className="fixed inset-0 z-[131] flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="w-full max-w-2xl pointer-events-auto"
            >
              <GlassCard className="relative overflow-hidden flex flex-col max-h-[85vh]" radius="4xl">
                {/* Header */}
                <div className="p-6 border-b border-[#D8B894]/20 bg-white/40 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                      <History size={24} />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-[#2A1E17]">Lịch sử điều chuyển</h2>
                      <p className="text-xs text-[#9A8677] font-bold uppercase tracking-wider">{material.name} • {material.sku}</p>
                    </div>
                  </div>
                  <button 
                    onClick={onClose}
                    className="p-2.5 text-[#9A8677] hover:bg-white/60 rounded-xl transition-all"
                  >
                    <X size={20} />
                  </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6">
                  {isLoading ? (
                    <div className="py-24 flex flex-col items-center justify-center">
                       <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4" />
                       <p className="text-sm font-bold text-[#9A8677]">Đang tải lịch sử...</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                        {history?.map((log: StockAdjustment) => (
                        <motion.div 
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.1 }}
                          key={`material-history-${log.id}`} 
                          className="p-5 rounded-3xl bg-white/60 border border-[#D8B894]/10 hover:border-primary/20 transition-all flex items-start gap-4"
                        >
                          <div className={cn(
                            "w-10 h-10 rounded-2xl flex items-center justify-center shrink-0",
                            log.type === 'INCREASE' ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"
                          )}>
                             {log.type === 'INCREASE' ? <ArrowUpRight size={20} /> : <ArrowDownRight size={20} />}
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                               <p className="text-sm font-black text-[#2A1E17]">
                                 {log.type === 'INCREASE' ? 'Nhập kho' : 'Xuất kho'}: 
                                 <span className={cn("ml-1", log.type === 'INCREASE' ? "text-green-600" : "text-red-500")}>
                                   {log.type === 'INCREASE' ? '+' : '-'}{log.quantity} {material.unit}
                                 </span>
                               </p>
                               <span className="text-[10px] font-bold text-[#9A8677] flex items-center gap-1">
                                 <Clock size={10} /> {new Date(log.timestamp).toLocaleString('vi-VN')}
                               </span>
                            </div>
                            <p className="text-xs text-[#6F5A4A] font-medium leading-relaxed">{log.reason}</p>
                            
                            <div className="mt-3 pt-3 border-t border-[#D8B894]/10 flex items-center gap-4 text-[10px] font-bold text-[#9A8677]">
                               <div className="flex items-center gap-1.5">
                                  <User size={12} className="text-primary" /> {log.user}
                               </div>
                               <div className="flex items-center gap-1.5">
                                  <Package size={12} className="text-[#D8B894]" /> ID: {log.id}
                               </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}

                      {(!history || history.length === 0) && (
                        <div className="py-20 flex flex-col items-center justify-center text-center">
                           <History size={48} className="text-[#D8B894] opacity-20 mb-4" />
                           <p className="text-base font-bold text-[#2A1E17]">Chưa có lịch sử biến động</p>
                           <p className="text-sm text-[#9A8677] mt-1">Các giao dịch xuất nhập kho sẽ được hiển thị tại đây.</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-[#D8B894]/20 bg-[#FFFAF4]/40 flex justify-end">
                   <button 
                     onClick={onClose}
                     className="px-8 py-2.5 rounded-2xl bg-white border border-[#D8B894]/30 text-sm font-bold text-[#6F5A4A] transition-all hover:shadow-md"
                   >
                     Đóng
                   </button>
                </div>
              </GlassCard>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}

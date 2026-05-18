'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Save, Loader2, ArrowUpRight, ArrowDownRight, AlertTriangle, History } from 'lucide-react';
import { GlassCard } from '@/shared/components/GlassCard';
import { Material } from '../../../domain/entities/material.entity';
import { cn } from '@/shared/utils/cn';

interface StockAdjustmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  material: Material | null;
  onSave: (newStock: number) => Promise<void>;
  onViewHistory?: (material: Material) => void;
  isSubmitting?: boolean;
}

export function StockAdjustmentModal({ 
  isOpen, 
  onClose, 
  material, 
  onSave, 
  onViewHistory,
  isSubmitting 
}: StockAdjustmentModalProps) {
  const [adjustment, setAdjustment] = useState(0);
  const [type, setType] = useState<'INCREASE' | 'DECREASE'>('INCREASE');
  const [reason, setReason] = useState('');

  if (!material) return null;

  const finalStock = type === 'INCREASE' 
    ? material.currentStock + adjustment 
    : Math.max(0, material.currentStock - adjustment);

  const handleSave = async () => {
    if (adjustment <= 0) return;
    await onSave(finalStock);
    setAdjustment(0);
    setReason('');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[120] bg-black/20 backdrop-blur-sm"
          />

          <div className="fixed inset-0 z-[121] flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="w-full max-w-md pointer-events-auto"
            >
              <GlassCard className="relative p-8" radius="4xl">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <h2 className="text-xl font-bold text-[#2A1E17]">Điều chỉnh tồn kho</h2>
                    {onViewHistory && material && (
                      <button 
                        onClick={() => onViewHistory(material)}
                        className="p-2 text-primary hover:bg-primary/5 rounded-xl transition-all border border-transparent hover:border-primary/10 flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider"
                      >
                        <History size={14} />
                        Lịch sử
                      </button>
                    )}
                  </div>
                  <button onClick={onClose} className="p-2 text-[#9A8677] hover:bg-white/60 rounded-xl transition-all">
                    <X size={20} />
                  </button>
                </div>

                <div className="space-y-6">
                  {/* Material Info */}
                  <div className="p-4 rounded-2xl bg-[#FFFAF4] border border-[#D8B894]/20 flex justify-between items-center">
                    <div>
                      <p className="text-xs font-bold text-[#9A8677] uppercase">Nguyên liệu</p>
                      <p className="text-sm font-bold text-[#2A1E17]">{material.name}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-bold text-[#9A8677] uppercase">Hiện tại</p>
                      <p className="text-sm font-black text-primary">{material.currentStock} {material.unit}</p>
                    </div>
                  </div>

                  {/* Adjustment Controls */}
                  <div className="grid grid-cols-2 gap-3">
                    <button 
                      onClick={() => setType('INCREASE')}
                      className={cn(
                        "flex items-center justify-center gap-2 py-3 rounded-2xl border-2 transition-all font-bold text-sm",
                        type === 'INCREASE' 
                          ? "bg-green-50 border-green-500 text-green-600" 
                          : "bg-white/40 border-[#D8B894]/20 text-[#9A8677]"
                      )}
                    >
                      <ArrowUpRight size={18} /> Nhập kho
                    </button>
                    <button 
                      onClick={() => setType('DECREASE')}
                      className={cn(
                        "flex items-center justify-center gap-2 py-3 rounded-2xl border-2 transition-all font-bold text-sm",
                        type === 'DECREASE' 
                          ? "bg-red-50 border-red-500 text-red-600" 
                          : "bg-white/40 border-[#D8B894]/20 text-[#9A8677]"
                      )}
                    >
                      <ArrowDownRight size={18} /> Xuất kho
                    </button>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="text-[10px] font-bold text-[#9A8677] uppercase tracking-widest block mb-2 px-1">Số lượng thay đổi ({material.unit})</label>
                      <input 
                        type="number"
                        value={adjustment}
                        onChange={(e) => setAdjustment(Math.max(0, Number(e.target.value)))}
                        className="w-full bg-white rounded-xl border border-[#D8B894]/20 px-4 py-3 text-lg font-black text-[#2A1E17] focus:outline-none focus:border-primary shadow-inner"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-[#9A8677] uppercase tracking-widest block mb-2 px-1">Lý do điều chỉnh</label>
                      <textarea 
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        placeholder="VD: Kiểm kho định kỳ, Hàng lỗi..."
                        className="w-full bg-white rounded-xl border border-[#D8B894]/20 px-4 py-3 text-sm font-medium text-[#2A1E17] focus:outline-none focus:border-primary shadow-inner min-h-[80px]"
                      />
                    </div>
                  </div>

                  {/* Summary */}
                  <div className="p-4 rounded-2xl bg-primary/5 border border-primary/20 flex justify-between items-center">
                    <span className="text-sm font-bold text-[#6F5A4A]">Tồn kho dự kiến:</span>
                    <div className="flex items-center gap-2">
                       <span className={cn(
                         "text-lg font-black",
                         finalStock < material.minStock ? "text-red-500" : "text-primary"
                       )}>
                         {finalStock} {material.unit}
                       </span>
                       {finalStock < material.minStock && (
                         <div className="text-red-500" title="Dưới định mức tối thiểu">
                            <AlertTriangle size={16} />
                         </div>
                       )}
                    </div>
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button 
                      onClick={onClose}
                      className="flex-1 py-3 rounded-2xl bg-white border border-[#D8B894]/30 text-sm font-bold text-[#6F5A4A] transition-all active:scale-95"
                    >
                      Hủy
                    </button>
                    <button 
                      onClick={handleSave}
                      disabled={isSubmitting || adjustment <= 0}
                      className="flex-[2] py-3 rounded-2xl bg-primary text-white text-sm font-bold shadow-lg shadow-primary/20 hover:bg-[#5B3A29] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                      Xác nhận điều chỉnh
                    </button>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}

'use client';

import { motion } from 'motion/react';
import { X, History, User, Clock, ArrowUpRight, ArrowDownRight, Package } from 'lucide-react';
import { GlassCard } from '@/shared/components/GlassCard';
import { Material, StockAdjustment } from '../../../domain/entities/material.entity';
import { cn } from '@/shared/utils/cn';
import { useMaterialHistory } from '../../hooks/useInventory';
import { AntdModalShell } from '@/shared/ui/antd-modal-shell';

interface StockHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  material: Material | null;
}

export function StockHistoryModal({ isOpen, onClose, material }: StockHistoryModalProps) {
  const { data: history, isLoading } = useMaterialHistory(material?.id || null);

  if (!material) return null;

  return (
    <AntdModalShell open={isOpen} onClose={onClose} width={672} zIndex={1300}>
      <GlassCard className="relative overflow-hidden flex flex-col max-h-[85vh]" radius="4xl">
        {/* Header */}
        <div className="p-6 border-b border-primary-soft/20 bg-white/40 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
              <History size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-text-primary">Lịch sử điều chuyển</h2>
              <p className="text-xs text-text-muted font-bold uppercase tracking-wider">{material.name} • {material.sku}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2.5 text-text-muted hover:bg-white/60 rounded-xl transition-all"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {isLoading ? (
            <div className="py-24 flex flex-col items-center justify-center">
              <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4" />
              <p className="text-sm font-bold text-text-muted">Đang tải lịch sử...</p>
            </div>
          ) : (
            <div className="space-y-4">
              {history?.map((log: StockAdjustment) => (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  key={`material-history-${log.id}`}
                  className="p-5 rounded-3xl bg-white/60 border border-primary-soft/10 hover:border-primary/20 transition-all flex items-start gap-4"
                >
                  <div className={cn(
                    "w-10 h-10 rounded-2xl flex items-center justify-center shrink-0",
                    log.type === 'INCREASE' ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"
                  )}>
                    {log.type === 'INCREASE' ? <ArrowUpRight size={20} /> : <ArrowDownRight size={20} />}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm font-black text-text-primary">
                        {log.type === 'INCREASE' ? 'Nhập kho' : 'Xuất kho'}:
                        <span className={cn("ml-1", log.type === 'INCREASE' ? "text-green-600" : "text-red-500")}>
                          {log.type === 'INCREASE' ? '+' : '-'}{log.quantity} {material.unit}
                        </span>
                      </p>
                      <span className="text-[10px] font-bold text-text-muted flex items-center gap-1">
                        <Clock size={10} /> {new Date(log.timestamp).toLocaleString('vi-VN')}
                      </span>
                    </div>
                    <p className="text-xs text-text-secondary font-medium leading-relaxed">{log.reason}</p>

                    <div className="mt-3 pt-3 border-t border-primary-soft/10 flex items-center gap-4 text-[10px] font-bold text-text-muted">
                      <div className="flex items-center gap-1.5">
                        <User size={12} className="text-primary" /> {log.user}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Package size={12} className="text-primary-soft" /> ID: {log.id}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}

              {(!history || history.length === 0) && (
                <div className="py-20 flex flex-col items-center justify-center text-center">
                  <History size={48} className="text-primary-soft opacity-20 mb-4" />
                  <p className="text-base font-bold text-text-primary">Chưa có lịch sử biến động</p>
                  <p className="text-sm text-text-muted mt-1">Các giao dịch xuất nhập kho sẽ được hiển thị tại đây.</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-primary-soft/20 bg-[#FFFAF4]/40 flex justify-end">
          <button
            onClick={onClose}
            className="px-8 py-2.5 rounded-2xl bg-white border border-primary-soft/30 text-sm font-bold text-text-secondary transition-all hover:shadow-md"
          >
            Đóng
          </button>
        </div>
      </GlassCard>
    </AntdModalShell>
  );
}

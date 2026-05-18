'use client';

import { motion, AnimatePresence } from 'motion/react';
import { X, AlertTriangle, Trash2, Loader2, XCircle } from 'lucide-react';
import { GlassCard } from '@/shared/components/GlassCard';
import { Order } from '@/modules/orders/domain/entities/order.entity';

interface CancelOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: Order | null;
  onConfirm: () => void;
  isSubmitting?: boolean;
}

export function CancelOrderModal({ isOpen, onClose, order, onConfirm, isSubmitting }: CancelOrderModalProps) {
  if (!order) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[100] bg-black/20 backdrop-blur-sm"
          />

          <div className="fixed inset-0 z-[101] flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="w-full max-w-sm pointer-events-auto"
            >
              <GlassCard className="relative overflow-hidden p-8 text-center" radius="4xl">
                <div className="flex flex-col items-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center text-red-500 shadow-inner border border-red-100">
                    <XCircle size={32} />
                  </div>

                  <div className="space-y-1.5">
                    <h2 className="text-xl font-bold text-[#2A1E17]">Hủy đơn hàng này?</h2>
                    <p className="text-sm text-[#6F5A4A]">Bạn có chắc chắn muốn hủy đơn hàng <span className="font-bold">{order.orderNumber}</span>? Hành động này sẽ được ghi lại trong lịch sử hệ thống.</p>
                  </div>

                  <div className="w-full space-y-3 pt-4">
                    <button
                      onClick={onConfirm}
                      disabled={isSubmitting}
                      className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-red-500 text-white text-sm font-bold shadow-lg shadow-red-200 hover:bg-red-600 transition-all disabled:opacity-70"
                    >
                      {isSubmitting ? (
                        <Loader2 size={18} className="animate-spin" />
                      ) : (
                        <Trash2 size={18} />
                      )}
                      Xác nhận hủy đơn
                    </button>
                    <button
                      onClick={onClose}
                      className="w-full px-6 py-3 rounded-2xl border border-[#D8B894]/30 text-sm font-bold text-[#6F5A4A] hover:bg-white/60 transition-all"
                    >
                      Quay lại
                    </button>
                  </div>
                </div>

                <button 
                  onClick={onClose}
                  className="absolute top-4 right-4 p-2 text-[#9A8677] hover:bg-white/60 rounded-xl transition-all"
                >
                  <X size={20} />
                </button>
              </GlassCard>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}

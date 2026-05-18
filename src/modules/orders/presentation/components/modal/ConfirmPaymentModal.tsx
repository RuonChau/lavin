'use client';

import { motion, AnimatePresence } from 'motion/react';
import { X, CreditCard, CheckCircle2, Loader2, DollarSign } from 'lucide-react';
import { GlassCard } from '@/shared/components/GlassCard';
import { Order } from '@/modules/orders/domain/entities/order.entity';

interface ConfirmPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: Order | null;
  onConfirm: () => void;
  isSubmitting?: boolean;
}

export function ConfirmPaymentModal({ isOpen, onClose, order, onConfirm, isSubmitting }: ConfirmPaymentModalProps) {
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
              className="w-full max-w-md pointer-events-auto"
            >
              <GlassCard className="relative overflow-hidden p-8" radius="4xl">
                <div className="flex flex-col items-center text-center space-y-6">
                  {/* Payment Icon */}
                  <div className="w-20 h-20 rounded-[32px] bg-green-50 flex items-center justify-center text-green-500 shadow-inner border border-green-100">
                    <CreditCard size={40} />
                  </div>

                  <div className="space-y-2">
                    <h2 className="text-2xl font-bold text-[#2A1E17]">Xác nhận thanh toán</h2>
                    <p className="text-sm text-[#6F5A4A]">Vui lòng kiểm tra kỹ số tiền khách thanh toán trước khi hệ thống ghi nhận doanh thu.</p>
                  </div>

                  {/* Order Summary Box */}
                  <div className="w-full p-6 rounded-3xl bg-[#FFFAF4]/60 border border-[#D8B894]/20 space-y-3">
                    <div className="flex justify-between items-center text-xs font-bold text-[#9A8677] uppercase tracking-widest">
                       <span>Mã đơn hàng</span>
                       <span className="text-[#2A1E17]">{order.orderNumber}</span>
                    </div>
                    <div className="flex justify-between items-center text-xs font-bold text-[#9A8677] uppercase tracking-widest">
                       <span>Phương thức</span>
                       <span className="text-[#2A1E17]">{order.paymentMethod}</span>
                    </div>
                    <div className="pt-3 border-t border-[#D8B894]/10 flex justify-between items-end">
                       <span className="text-xs font-bold text-[#9A8677] uppercase tracking-widest">Tổng thanh toán</span>
                       <span className="text-2xl font-black text-primary">₫{order.totalAmount.toLocaleString('vi-VN')}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col w-full gap-3 pt-2">
                    <button
                      onClick={onConfirm}
                      disabled={isSubmitting}
                      className="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-2xl bg-green-500 text-white text-sm font-bold shadow-lg shadow-green-200 hover:bg-green-600 transition-all disabled:opacity-70"
                    >
                      {isSubmitting ? (
                        <Loader2 size={18} className="animate-spin" />
                      ) : (
                        <CheckCircle2 size={18} />
                      )}
                      Xác nhận đã thu tiền
                    </button>
                    <button
                      onClick={onClose}
                      disabled={isSubmitting}
                      className="w-full px-6 py-4 rounded-2xl border border-[#D8B894]/30 text-sm font-bold text-[#6F5A4A] hover:bg-white/60 transition-all font-medium"
                    >
                      Hủy bỏ
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

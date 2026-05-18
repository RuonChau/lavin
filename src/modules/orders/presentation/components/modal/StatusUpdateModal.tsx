'use client';

import { motion, AnimatePresence } from 'motion/react';
import { X, Coffee, Check, Loader2, Sparkles } from 'lucide-react';
import { GlassCard } from '@/shared/components/GlassCard';
import { Order } from '@/modules/orders/domain/entities/order.entity';

interface StatusUpdateModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: Order | null;
  onConfirm: () => void;
  isSubmitting?: boolean;
  title: string;
  description: string;
  icon?: React.ReactNode;
}

export function StatusUpdateModal({ 
  isOpen, 
  onClose, 
  order, 
  onConfirm, 
  isSubmitting,
  title,
  description,
  icon
}: StatusUpdateModalProps) {
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
                  <div className="w-16 h-16 rounded-3xl bg-primary/10 flex items-center justify-center text-primary shadow-sm border border-primary/20">
                    {icon || <Coffee size={28} />}
                  </div>

                  <div className="space-y-1.5">
                    <h2 className="text-xl font-bold text-[#2A1E17]">{title}</h2>
                    <p className="text-sm text-[#6F5A4A] leading-relaxed">{description}</p>
                  </div>

                  <div className="w-full grid grid-cols-2 gap-3 pt-4">
                    <button
                      onClick={onClose}
                      className="px-6 py-2.5 rounded-2xl border border-[#D8B894]/30 text-sm font-bold text-[#6F5A4A] hover:bg-white/60 transition-all"
                    >
                      Hủy
                    </button>
                    <button
                      onClick={onConfirm}
                      disabled={isSubmitting}
                      className="flex items-center justify-center gap-2 px-6 py-2.5 rounded-2xl bg-[#8B5E3C] text-white text-sm font-bold shadow-lg shadow-[#8B5E3C]/20 hover:bg-[#5B3A29] transition-all disabled:opacity-70"
                    >
                      {isSubmitting ? (
                        <Loader2 size={16} className="animate-spin" />
                      ) : (
                        <Check size={16} />
                      )}
                      Xác nhận
                    </button>
                  </div>
                </div>

                <button 
                  onClick={onClose}
                  className="absolute top-4 right-4 p-2 text-[#9A8677] hover:bg-white/60 rounded-xl transition-all"
                >
                  <X size={18} />
                </button>
              </GlassCard>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}

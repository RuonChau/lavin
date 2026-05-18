'use client';

import { motion, AnimatePresence } from 'motion/react';
import { X, AlertTriangle, Trash2, Loader2 } from 'lucide-react';
import { GlassCard } from '@/shared/components/GlassCard';
import { DeleteProductModalProps } from '@/modules/products/types/delete-product-modal-props.type';



export function DeleteProductModal({ isOpen, onClose, product, onConfirm, isDeleting }: DeleteProductModalProps) {
  if (!product) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[100] bg-black/20 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <div className="fixed inset-0 z-[101] flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="w-full max-w-md pointer-events-auto"
            >
              <GlassCard className="relative overflow-hidden p-8" radius="4xl">
                <div className="flex flex-col items-center text-center space-y-4">
                  {/* Warning Icon */}
                  <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center text-red-500 shadow-inner border border-red-100">
                    <AlertTriangle size={32} />
                  </div>

                  <div className="space-y-2">
                    <h2 className="text-xl font-bold text-[#2A1E17]">Xác nhận xóa?</h2>
                    <p className="text-sm text-[#6F5A4A] leading-relaxed">
                      Bạn có chắc chắn muốn xóa sản phẩm <span className="font-bold text-red-500">"{product.name}"</span>? 
                      Hành động này không thể hoàn tác và sẽ gỡ bỏ sản phẩm khỏi thực đơn.
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col w-full gap-3 pt-4">
                    <button
                      onClick={onConfirm}
                      disabled={isDeleting}
                      className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-red-500 text-white text-sm font-bold shadow-lg shadow-red-200 hover:bg-red-600 transition-all disabled:opacity-70"
                    >
                      {isDeleting ? (
                        <Loader2 size={18} className="animate-spin" />
                      ) : (
                        <Trash2 size={18} />
                      )}
                      Xác nhận xóa vĩnh viễn
                    </button>
                    <button
                      onClick={onClose}
                      disabled={isDeleting}
                      className="w-full px-6 py-3 rounded-2xl border border-[#D8B894]/30 text-sm font-bold text-[#6F5A4A] hover:bg-white/60 transition-all"
                    >
                      Hủy bỏ
                    </button>
                  </div>
                </div>

                {/* Close Button */}
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

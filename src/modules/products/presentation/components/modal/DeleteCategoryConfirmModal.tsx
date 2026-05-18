'use client';

import { motion, AnimatePresence } from 'motion/react';
import { X, AlertTriangle, Trash2, Loader2 } from 'lucide-react';
import { GlassCard } from '@/shared/components/GlassCard';
import { DeleteCategoryConfirmModalProps } from '@/modules/products/types/delete-category-confirm-modal-props.type';



export function DeleteCategoryConfirmModal({ 
  isOpen, 
  onClose, 
  category, 
  onConfirm, 
  isDeleting 
}: DeleteCategoryConfirmModalProps) {
  if (!category) return null;

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
            className="fixed inset-0 z-[200] bg-black/40 backdrop-blur-md"
          />

          {/* Modal Container */}
          <div className="fixed inset-0 z-[201] flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="w-full max-w-sm pointer-events-auto"
            >
              <GlassCard className="relative overflow-hidden p-8 text-center shadow-[0_32px_64px_rgba(220,38,38,0.15)]" radius="4xl">
                <div className="flex flex-col items-center space-y-4">
                  {/* Warning Icon */}
                  <div className="w-16 h-16 rounded-3xl bg-red-50 flex items-center justify-center text-red-500 shadow-inner border border-red-100">
                    <AlertTriangle size={32} />
                  </div>

                  <div className="space-y-1.5">
                    <h2 className="text-xl font-bold text-[#2A1E17]">Xóa danh mục này?</h2>
                    <p className="text-sm text-[#6F5A4A] leading-relaxed">
                      Bạn có chắc muốn xóa <span className="font-bold text-red-500">"{category.name}"</span>? 
                      Hành động này có thể ảnh hưởng đến các sản phẩm thuộc danh mục này.
                    </p>
                  </div>

                  <div className="w-full space-y-3 pt-4">
                    <button
                      onClick={onConfirm}
                      disabled={isDeleting}
                      className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-red-500 text-white text-sm font-bold shadow-lg shadow-red-200 hover:bg-red-600 transition-all disabled:opacity-70 active:scale-[0.98]"
                    >
                      {isDeleting ? (
                        <Loader2 size={18} className="animate-spin" />
                      ) : (
                        <Trash2 size={18} />
                      )}
                      Xác nhận xóa
                    </button>
                    <button
                      onClick={onClose}
                      disabled={isDeleting}
                      className="w-full px-6 py-3 rounded-2xl border border-[#D8B894]/30 text-sm font-bold text-[#6F5A4A] hover:bg-white/60 transition-all active:scale-[0.98]"
                    >
                      Quay lại
                    </button>
                  </div>
                </div>

                {/* Close Button */}
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

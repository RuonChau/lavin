'use client';

import { X, AlertTriangle, Trash2, Loader2 } from 'lucide-react';
import { GlassCard } from '@/shared/components/GlassCard';
import { DeleteCategoryConfirmModalProps } from '@/modules/products/types/delete-category-confirm-modal-props.type';
import { AntdModalShell } from '@/shared/ui/antd-modal-shell';



export function DeleteCategoryConfirmModal({
  isOpen,
  onClose,
  category,
  onConfirm,
  isDeleting
}: DeleteCategoryConfirmModalProps) {
  if (!category) return null;

  return (
    <AntdModalShell open={isOpen} onClose={onClose} width={384} zIndex={1200} maskColor="rgba(0, 0, 0, 0.4)">
      <GlassCard className="relative overflow-hidden p-8 text-center shadow-[0_32px_64px_rgba(220,38,38,0.15)]" radius="4xl">
        <div className="flex flex-col items-center space-y-4">
          {/* Warning Icon */}
          <div className="w-16 h-16 rounded-3xl bg-red-50 flex items-center justify-center text-red-500 shadow-inner border border-red-100">
            <AlertTriangle size={32} />
          </div>

          <div className="space-y-1.5">
            <h2 className="text-xl font-bold text-text-primary">Xóa danh mục này?</h2>
            <p className="text-sm text-text-secondary leading-relaxed">
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
              className="w-full px-6 py-3 rounded-2xl border border-primary-soft/30 text-sm font-bold text-text-secondary hover:bg-white/60 transition-all active:scale-[0.98]"
            >
              Quay lại
            </button>
          </div>
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-text-muted hover:bg-white/60 rounded-xl transition-all"
        >
          <X size={18} />
        </button>
      </GlassCard>
    </AntdModalShell>
  );
}

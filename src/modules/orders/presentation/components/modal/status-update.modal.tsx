'use client';

import { X, Coffee, Check, Loader2 } from 'lucide-react';
import { GlassCard } from '@/shared/components/GlassCard';
import { Order } from '@/modules/orders/domain/entities/order.entity';
import { AntdModalShell } from '@/shared/ui/antd-modal-shell';

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
    <AntdModalShell open={isOpen} onClose={onClose} width={384} zIndex={1000}>
      <GlassCard className="relative overflow-hidden p-8 text-center" radius="4xl">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-16 h-16 rounded-3xl bg-primary/10 flex items-center justify-center text-primary shadow-sm border border-primary/20">
            {icon || <Coffee size={28} />}
          </div>

          <div className="space-y-1.5">
            <h2 className="text-xl font-bold text-text-primary">{title}</h2>
            <p className="text-sm text-text-secondary leading-relaxed">{description}</p>
          </div>

          <div className="w-full grid grid-cols-2 gap-3 pt-4">
            <button
              onClick={onClose}
              className="px-6 py-2.5 rounded-2xl border border-primary-soft/30 text-sm font-bold text-text-secondary hover:bg-white/60 transition-all"
            >
              Hủy
            </button>
            <button
              onClick={onConfirm}
              disabled={isSubmitting}
              className="flex items-center justify-center gap-2 px-6 py-2.5 rounded-2xl bg-primary text-white text-sm font-bold shadow-lg shadow-primary/20 hover:bg-primary-deep transition-all disabled:opacity-70"
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
          className="absolute top-4 right-4 p-2 text-text-muted hover:bg-white/60 rounded-xl transition-all"
        >
          <X size={18} />
        </button>
      </GlassCard>
    </AntdModalShell>
  );
}

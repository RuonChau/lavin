'use client';

import { AlertTriangle } from 'lucide-react';
import type { DashboardErrorStateProps } from '../../types/dashboard-component-props.type';
import { GlassCard } from '@/shared/components/GlassCard';

export function DashboardErrorState({ onRetry }: DashboardErrorStateProps) {
  return (
    <GlassCard className="p-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-berry/10 text-berry">
            <AlertTriangle size={20} />
          </div>
          <div>
            <h3 className="font-bold text-text-primary">Không thể tải dữ liệu tổng quan</h3>
            <p className="mt-1 text-sm text-text-secondary">
              API dashboard hoặc các API tổng hợp đang chưa phản hồi. Hãy thử tải lại.
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={onRetry}
          className="h-10 rounded-xl bg-primary px-4 text-sm font-bold text-white transition-all hover:bg-[#6F4A31]"
        >
          Thử lại
        </button>
      </div>
    </GlassCard>
  );
}

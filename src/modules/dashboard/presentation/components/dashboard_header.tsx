'use client';

import { RefreshCcw } from 'lucide-react';
import type { DashboardHeaderProps } from '../../types/dashboard-component-props.type';
import { cn } from '@/shared/utils/cn';

export function DashboardHeader({ userName, isFetching, onRefresh }: DashboardHeaderProps) {
  return (
    <header className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
      <div>
        <h1 className="text-[28px] font-bold text-text-primary tracking-tight">
          Xin chào, {userName ?? 'Quản trị viên'}
        </h1>
        <p className="text-text-secondary">
          Đây là báo cáo tổng quan của chuỗi BrewGlass hôm nay.
        </p>
      </div>

      <button
        type="button"
        onClick={onRefresh}
        className="inline-flex h-10 w-fit items-center gap-2 rounded-xl border border-primary-soft/30 bg-white/60 px-4 text-sm font-bold text-text-secondary transition-all hover:bg-white"
      >
        <RefreshCcw size={16} className={cn(isFetching && 'animate-spin')} />
        Tải lại
      </button>
    </header>
  );
}

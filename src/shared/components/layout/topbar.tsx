'use client';

import { Bell, Menu, Search, UserCircle } from 'lucide-react';
import { usePublicSettings } from '@/modules/settings/presentation/providers/public-settings.provider';

interface TopbarProps {
  onMenuClick: () => void;
}

export function Topbar({ onMenuClick }: TopbarProps) {
  const { settings } = usePublicSettings();

  return (
    <header className="fixed right-0 top-0 z-40 flex h-19 w-full items-center justify-between border-b border-primary-soft/20 px-4 shadow-none! glass-panel md:w-[calc(100%-280px)] md:px-8">
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="rounded-xl p-2 text-text-secondary transition-colors hover:bg-white/40 md:hidden"
        >
          <Menu size={24} />
        </button>
        <div className="flex flex-col">
          <h1 className="text-sm font-bold tracking-tight text-text-primary md:text-xl">Dashboard Tổng Quan</h1>
          <p className="text-[9px] font-bold uppercase tracking-widest text-text-muted md:text-[10px]">
            {settings.brandName || 'LaVin ERP'}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3 md:gap-6">
        <div className="relative hidden w-48 sm:block lg:w-64">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-primary-soft" size={16} />
          <input
            type="text"
            placeholder="Tìm kiếm..."
            className="w-full rounded-full px-10 py-2 text-sm text-text-primary shadow-sm transition-all glass-control placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>

        <div className="flex items-center gap-2 md:gap-4">
          <button className="flex h-9 w-9 items-center justify-center rounded-full border border-primary-soft/20 bg-white/80 shadow-sm backdrop-blur-md transition-colors hover:bg-white md:h-10 md:w-10">
            <Bell size={18} className="text-primary" />
          </button>

          <div className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-primary/20 bg-primary/10 shadow-sm md:h-10 md:w-10">
            <UserCircle size={24} className="text-primary" />
          </div>
        </div>
      </div>
    </header>
  );
}

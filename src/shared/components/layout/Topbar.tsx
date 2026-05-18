'use client';

import { Bell, Search, UserCircle, Menu } from 'lucide-react';

interface TopbarProps {
  onMenuClick: () => void;
}

export function Topbar({ onMenuClick }: TopbarProps) {
  return (
    <header className="h-[76px] w-full md:w-[calc(100%-280px)] fixed top-0 right-0 z-40 px-4 md:px-8 flex items-center justify-between glass-panel border-b border-[#D8B894]/20 !shadow-none">
      <div className="flex items-center gap-4">
        <button 
          onClick={onMenuClick}
          className="md:hidden p-2 text-[#6F5A4A] hover:bg-white/40 rounded-xl transition-colors"
        >
          <Menu size={24} />
        </button>
        <div className="flex flex-col">
          <h1 className="text-sm md:text-xl font-bold text-[#2A1E17] tracking-tight">Dashboard Tổng Quan</h1>
          <p className="text-[9px] md:text-[10px] text-[#9A8677] font-bold uppercase tracking-widest">Cập nhật lúc: 14:30 Today</p>
        </div>
      </div>

      <div className="flex items-center gap-3 md:gap-6">
        <div className="relative w-48 lg:w-64 hidden sm:block">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#D8B894]" size={16} />
          <input 
            type="text" 
            placeholder="Tìm kiếm..." 
            className="w-full glass-control rounded-full py-2 px-10 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all shadow-sm text-[#2A1E17] placeholder:text-[#9A8677]"
          />
        </div>
        
        <div className="flex items-center gap-2 md:gap-4">
          <button className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-white/80 backdrop-blur-md flex items-center justify-center border border-[#D8B894]/20 shadow-sm hover:bg-white transition-colors">
            <Bell size={18} className="text-primary" />
          </button>
          
          <div className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center cursor-pointer shadow-sm">
            <UserCircle size={24} className="text-primary" />
          </div>
        </div>
      </div>
    </header>
  );
}

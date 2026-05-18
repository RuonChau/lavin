'use client';

import { useState } from 'react';
import { motion } from 'motion/react';
import { 
  ArrowLeft, 
  Search, 
  Filter, 
  History, 
  Download, 
  ArrowUpRight, 
  ArrowDownRight, 
  User, 
  Clock,
  FileText 
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { GlassCard } from '@/shared/components/GlassCard';
import { cn } from '@/shared/utils/cn';
import { useAllInventoryHistory } from '@/modules/inventory/presentation/hooks/useInventory';

export const InventoryHistory = () => {
  const router = useRouter();
  const { data: history, isLoading } = useAllInventoryHistory();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredHistory = history?.filter(log => 
    log.materialName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.reason.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.user.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => router.back()}
            className="p-3 rounded-2xl bg-white/60 border border-[#D8B894]/30 text-[#6F5A4A] hover:bg-white hover:shadow-md transition-all active:scale-95"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-[28px] font-bold text-[#2A1E17] tracking-tight">Lịch sử Kho hàng</h1>
            <div className="flex items-center gap-2 mt-1">
               <History size={14} className="text-primary" />
               <p className="text-[#9A8677] text-sm leading-relaxed">Toàn bộ biến động xuất, nhập và điều chuyển nguyên vật liệu.</p>
            </div>
          </div>
        </div>
        
        <button className="flex items-center gap-2 rounded-[20px] bg-white/60 border border-[#D8B894]/30 px-6 py-3 text-sm font-bold text-[#6F5A4A] transition-all hover:bg-white hover:shadow-md">
          <Download size={18} />
          Xuất dữ liệu CSV
        </button>
      </div>

      {/* Main Filter & List */}
      <GlassCard className="p-0 overflow-hidden" radius="4xl">
        {/* Toolbar */}
        <div className="p-6 border-b border-[#D8B894]/10 bg-white/40 flex flex-col sm:flex-row gap-4 items-center">
          <div className="relative flex-1 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#D8B894] transition-colors group-focus-within:text-primary" size={18} />
            <input 
              type="text" 
              placeholder="Tìm theo tên nguyên liệu, lý do, người thực hiện..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-5 py-3 rounded-2xl bg-[#FFFAF4]/60 border border-[#D8B894]/30 text-sm focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all font-medium"
            />
          </div>
          <div className="flex items-center gap-3">
             <button className="flex items-center gap-3 bg-[#FFFAF4]/60 border border-[#D8B894]/30 rounded-2xl px-5 py-3 text-sm font-bold text-[#6F5A4A] hover:bg-white transition-all">
                <Filter size={18} /> Lọc thời gian
             </button>
          </div>
        </div>

        {/* List Content */}
        <div className="p-6 space-y-4">
          {isLoading ? (
            <div className="py-32 flex flex-col items-center justify-center">
               <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4" />
               <p className="text-sm font-bold text-[#9A8677]">Đang tải dữ liệu lịch sử...</p>
            </div>
          ) : (
            <>
              {filteredHistory?.map((log) => (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  key={`full-history-${log.id}`}
                  className="flex flex-col md:flex-row md:items-center gap-6 p-6 rounded-[32px] bg-white/40 border border-[#D8B894]/10 hover:border-primary/20 hover:bg-white/60 transition-all group"
                >
                  {/* Status Icon */}
                  <div className={cn(
                    "w-14 h-14 rounded-3xl flex items-center justify-center shrink-0 shadow-sm transition-all group-hover:scale-110",
                    log.type === 'INCREASE' ? "bg-green-50 text-green-600 border border-green-100" : "bg-red-50 text-red-600 border border-red-100"
                  )}>
                    {log.type === 'INCREASE' ? <ArrowUpRight size={28} /> : <ArrowDownRight size={28} />}
                  </div>

                  {/* Main Info */}
                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-center gap-3">
                       <span className={cn(
                         "px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider",
                         log.type === 'INCREASE' ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                       )}>
                         {log.type === 'INCREASE' ? 'Nhập kho' : 'Xuất kho'}
                       </span>
                       <span className="text-[10px] font-bold text-[#9A8677] uppercase tracking-widest bg-[#D8B894]/10 px-2.5 py-0.5 rounded-full">
                         {log.id}
                       </span>
                    </div>
                    <h3 className="text-lg font-black text-[#2A1E17] truncate">{log.materialName}</h3>
                    <div className="flex items-center gap-2 text-[#6F5A4A] text-sm font-medium">
                       <FileText size={14} className="text-[#D8B894]" />
                       <p className="truncate">{log.reason}</p>
                    </div>
                  </div>

                  {/* Quantity & Time */}
                  <div className="flex items-center md:flex-col md:items-end gap-6 md:gap-2 px-6 md:border-l border-[#D8B894]/20">
                     <div className="text-left md:text-right">
                        <p className="text-[10px] font-bold text-[#9A8677] uppercase tracking-widest mb-1">Số lượng</p>
                        <p className={cn(
                          "text-xl font-black",
                          log.type === 'INCREASE' ? "text-green-600" : "text-red-500"
                        )}>
                          {log.type === 'INCREASE' ? '+' : '-'}{log.quantity} {log.unit}
                        </p>
                     </div>
                  </div>

                  {/* Metadata */}
                  <div className="flex items-center md:flex-col md:items-end gap-6 md:gap-2 px-6 md:border-l border-[#D8B894]/20 min-w-[180px]">
                     <div className="flex items-center gap-2 text-sm font-bold text-[#2A1E17]">
                        <User size={16} className="text-primary" />
                        <span>{log.user}</span>
                     </div>
                     <div className="flex items-center gap-2 text-xs font-bold text-[#9A8677]">
                        <Clock size={14} />
                        <span>{new Date(log.timestamp).toLocaleString('vi-VN')}</span>
                     </div>
                  </div>
                </motion.div>
              ))}

              {(!filteredHistory || filteredHistory.length === 0) && (
                <div className="py-32 flex flex-col items-center justify-center text-center">
                  <div className="w-20 h-20 rounded-[40px] bg-[#FFFAF4] flex items-center justify-center mb-6 border border-[#D8B894]/20 shadow-inner">
                    <History size={40} className="text-[#D8B894] opacity-40" />
                  </div>
                  <h3 className="text-xl font-bold text-[#2A1E17]">Không tìm thấy lịch sử phù hợp</h3>
                  <p className="text-[#9A8677] text-sm mt-1 max-w-xs mx-auto">Vui lòng thử lại với từ khóa khác hoặc xóa bộ lọc để xem toàn bộ dữ liệu.</p>
                  <button 
                    onClick={() => setSearchTerm('')}
                    className="mt-6 px-8 py-3 rounded-2xl bg-white border border-[#D8B894]/30 text-sm font-bold text-primary hover:shadow-md transition-all active:scale-95"
                  >
                    Xóa tìm kiếm
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </GlassCard>
    </div>
  );
}

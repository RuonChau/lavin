'use client';

import { useState } from 'react';
import { motion } from 'motion/react';
import { 
  ArrowLeft, 
  Warehouse, 
  MapPin, 
  User, 
  ThermometerSnowflake, 
  Box, 
  TrendingUp, 
  AlertCircle,
  MoreVertical,
  Plus,
  Search,
  LayoutGrid,
  List
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { GlassCard } from '@/shared/components/GlassCard';
import { cn } from '@/shared/utils/cn';
import { useWarehouses } from '@/modules/inventory/presentation/hooks/useInventory';

import { WarehouseModal } from '@/modules/inventory/presentation/components/modal/WarehouseModal';
import { ShelfDetailsModal } from '@/modules/inventory/presentation/components/modal/ShelfDetailsModal';
import { Warehouse as WarehouseType } from '@/modules/inventory/domain/entities/warehouse.entity';

export const Warehouses = () => {
  const router = useRouter();
  const { data: warehouses, isLoading } = useWarehouses();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isShelfModalOpen, setIsShelfModalOpen] = useState(false);
  const [selectedWarehouse, setSelectedWarehouse] = useState<WarehouseType | null>(null);

  const handleShelfClick = (warehouse: WarehouseType) => {
    setSelectedWarehouse(warehouse);
    setIsShelfModalOpen(true);
  };

  return (
    <div className="space-y-8 pb-12">
      <WarehouseModal 
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={(data) => {
          console.log('New Warehouse:', data);
          setIsAddModalOpen(false);
        }}
      />

      <ShelfDetailsModal 
        isOpen={isShelfModalOpen}
        onClose={() => setIsShelfModalOpen(false)}
        warehouse={selectedWarehouse}
      />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => router.back()}
            className="p-3 rounded-2xl bg-white/60 border border-[#D8B894]/30 text-[#6F5A4A] hover:bg-white transition-all active:scale-95"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-[28px] font-bold text-[#2A1E17] tracking-tight">Chi tiết Kho & Vị trí</h1>
            <p className="text-[#9A8677] text-sm mt-1">Quản lý không gian lưu trữ, sức chứa và điều kiện bảo quản.</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 rounded-[20px] bg-white border border-[#D8B894]/30 px-5 py-3 text-sm font-bold text-[#6F5A4A] transition-all hover:shadow-md">
            <LayoutGrid size={18} className={viewMode === 'grid' ? "text-primary" : ""} onClick={() => setViewMode('grid')} />
            <div className="w-px h-4 bg-[#D8B894]/30 mx-1" />
            <List size={18} className={viewMode === 'list' ? "text-primary" : ""} onClick={() => setViewMode('list')} />
          </button>
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 rounded-[20px] bg-[#8B5E3C] px-6 py-3 text-sm font-bold text-white shadow-lg transition-all hover:bg-[#5B3A29]"
          >
            <Plus size={20} />
            Thêm kho mới
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="py-32 flex flex-col items-center justify-center">
           <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4" />
           <p className="text-sm font-bold text-[#9A8677]">Đang tải dữ liệu kho hàng...</p>
        </div>
      ) : (
        <div className={cn(
          "grid gap-6",
          viewMode === 'grid' ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"
        )}>
          {warehouses?.map((wh, idx) => (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              key={wh.id}
            >
              <GlassCard className="p-8 group relative overflow-hidden h-full" radius="4xl">
                 <div className="absolute top-0 right-0 p-4">
                    <button className="p-2 text-[#9A8677] hover:bg-primary/5 rounded-xl transition-all">
                       <MoreVertical size={20} />
                    </button>
                 </div>

                 {/* Icon & Status */}
                 <div className="flex items-start justify-between mb-6">
                    <div className={cn(
                      "w-16 h-16 rounded-[28px] flex items-center justify-center shadow-lg transition-transform group-hover:scale-110",
                      wh.type === 'COLD' ? "bg-blue-50 text-blue-500 border border-blue-100" :
                      wh.type === 'GENERAL' ? "bg-primary/10 text-primary border border-primary/20" :
                      "bg-amber-50 text-amber-600 border border-amber-100"
                    )}>
                       {wh.type === 'COLD' ? <ThermometerSnowflake size={32} /> : <Warehouse size={32} />}
                    </div>
                    <div className={cn(
                       "px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border",
                       wh.status === 'ACTIVE' ? "bg-green-50 text-green-600 border-green-200" :
                       wh.status === 'FULL' ? "bg-red-50 text-red-600 border-red-200" :
                       "bg-amber-50 text-amber-600 border-amber-200"
                    )}>
                       {wh.status === 'ACTIVE' ? 'Sẵn dụng' : wh.status === 'FULL' ? 'Đã đầy' : 'Bảo trì'}
                    </div>
                 </div>

                 {/* Store Info */}
                 <div className="space-y-1 mb-8">
                    <h3 className="text-2xl font-black text-[#2A1E17]">{wh.name}</h3>
                    <p className="text-sm font-bold text-[#9A8677] uppercase tracking-wider">{wh.code}</p>
                 </div>

                 {/* Capacity Bar */}
                 <div className="space-y-3 mb-8">
                    <div className="flex justify-between items-end">
                       <div className="flex items-center gap-2">
                          <Box size={16} className="text-[#D8B894]" />
                          <span className="text-sm font-bold text-[#6F5A4A]">Sức chứa</span>
                       </div>
                       <p className="text-sm font-black text-[#2A1E17]">
                         {wh.currentUsage} / {wh.capacity} <span className="text-[10px] text-[#9A8677]">đơn vị</span>
                       </p>
                    </div>
                    <div className="h-3 w-full bg-[#D8B894]/10 rounded-full overflow-hidden border border-[#D8B894]/5">
                       <motion.div 
                         initial={{ width: 0 }}
                         animate={{ width: `${(wh.currentUsage / wh.capacity) * 100}%` }}
                         className={cn(
                           "h-full rounded-full shadow-inner",
                           (wh.currentUsage / wh.capacity) > 0.9 ? "bg-red-500" :
                           (wh.currentUsage / wh.capacity) > 0.7 ? "bg-amber-500" : "bg-primary"
                         )}
                       />
                    </div>
                 </div>

                 {/* Details List */}
                 <div className="grid grid-cols-2 gap-4 pb-4">
                    <div className="p-4 rounded-3xl bg-[#FFFAF4]/60 border border-[#D8B894]/10 flex flex-col gap-1">
                       <div className="flex items-center gap-2 text-[#9A8677]">
                          <MapPin size={14} />
                          <span className="text-[10px] font-black uppercase">Vị trí</span>
                       </div>
                       <p className="text-xs font-bold text-[#2A1E17] truncate">{wh.location}</p>
                    </div>
                    <div className="p-4 rounded-3xl bg-[#FFFAF4]/60 border border-[#D8B894]/10 flex flex-col gap-1">
                       <div className="flex items-center gap-2 text-[#9A8677]">
                          <User size={14} />
                          <span className="text-[10px] font-black uppercase">Quản lý</span>
                       </div>
                       <p className="text-xs font-bold text-[#2A1E17] truncate">{wh.manager}</p>
                    </div>
                 </div>

                 {/* Footer Button */}
                 <button 
                  onClick={() => handleShelfClick(wh)}
                  className="w-full mt-4 py-4 rounded-2xl bg-[#FFFAF4] border border-[#D8B894]/20 text-sm font-bold text-primary hover:bg-primary hover:text-white transition-all shadow-sm"
                 >
                    Xem chi tiết kệ hàng
                 </button>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      )}

      {/* Quick Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <GlassCard className="p-6 flex items-center gap-6" radius="4xl">
            <div className="w-14 h-14 rounded-full bg-green-50 text-green-600 flex items-center justify-center">
               <TrendingUp size={28} />
            </div>
            <div>
               <p className="text-[10px] font-black text-[#9A8677] uppercase tracking-widest">Hiệu suất sử dụng</p>
               <h4 className="text-2xl font-black text-[#2A1E17]">78.4%</h4>
            </div>
         </GlassCard>
         <GlassCard className="p-6 flex items-center gap-6" radius="4xl">
            <div className="w-14 h-14 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center">
               <AlertCircle size={28} />
            </div>
            <div>
               <p className="text-[10px] font-black text-[#9A8677] uppercase tracking-widest">Kho sắp đầy</p>
               <h4 className="text-2xl font-black text-[#2A1E17]">01 <span className="text-sm font-medium text-[#9A8677]">(Kho lạnh B)</span></h4>
            </div>
         </GlassCard>
         <GlassCard className="p-6 flex items-center gap-6" radius="4xl">
            <div className="w-14 h-14 rounded-full bg-primary/10 text-primary flex items-center justify-center">
               <Warehouse size={28} />
            </div>
            <div>
               <p className="text-[10px] font-black text-[#9A8677] uppercase tracking-widest">Lần kiểm kê cuối</p>
               <h4 className="text-2xl font-black text-[#2A1E17]">10/05</h4>
            </div>
         </GlassCard>
      </div>
    </div>
  );
}

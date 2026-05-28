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

import { WarehouseModal } from '@/modules/inventory/presentation/components/modal/warehouse.modal';
import { ShelfDetailsModal } from '@/modules/inventory/presentation/components/modal/shelf-details.modal';
import { Warehouse as WarehouseType } from '@/modules/inventory/domain/entities/warehouse.entity';

export const Warehouses = () => {
   const router = useRouter();
   const {
      warehouses,
      isLoading,
      createWarehouse,
      updateWarehouse,
      deleteWarehouse
   } = useWarehouses();
   console.log("🚀 ~ Warehouses ~ warehouses:", warehouses)
   const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

   const [isAddModalOpen, setIsAddModalOpen] = useState(false);
   const [isShelfModalOpen, setIsShelfModalOpen] = useState(false);
   const [selectedWarehouse, setSelectedWarehouse] = useState<WarehouseType | null>(null);
   const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

   const handleShelfClick = (warehouse: WarehouseType) => {
      setSelectedWarehouse(warehouse);
      setIsShelfModalOpen(true);
   };

   return (
      <div className="space-y-8 pb-12">
         <WarehouseModal
            isOpen={isAddModalOpen}
            onClose={() => {
               setIsAddModalOpen(false);
               setSelectedWarehouse(null);
            }}
            warehouse={selectedWarehouse}
            onSave={async (data) => {
               try {
                  if (selectedWarehouse) {
                     await updateWarehouse({
                        id: selectedWarehouse.id,
                        data: { name: data.name, location: data.location }
                     });
                  } else {
                     await createWarehouse({
                        name: data.name,
                        location: data.location
                     });
                  }
               } catch (err) {
                  console.error(err);
               }
               setIsAddModalOpen(false);
               setSelectedWarehouse(null);
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
                  className="p-3 rounded-2xl bg-white/60 border border-primary-soft/30 text-text-secondary hover:bg-white transition-all active:scale-95"
               >
                  <ArrowLeft size={20} />
               </button>
               <div>
                  <h1 className="text-[28px] font-bold text-text-primary tracking-tight">Chi tiết Kho & Vị trí</h1>
                  <p className="text-text-muted text-sm mt-1">Quản lý không gian lưu trữ, sức chứa và điều kiện bảo quản.</p>
               </div>
            </div>

            <div className="flex items-center gap-3">
               <button className="flex items-center gap-2 rounded-2xl bg-white border border-primary-soft/30 px-5 py-3 text-sm font-bold text-text-secondary transition-all hover:shadow-md">
                  <LayoutGrid size={18} className={viewMode === 'grid' ? "text-primary" : ""} onClick={() => setViewMode('grid')} />
                  <div className="w-px h-4 bg-primary-soft/30 mx-1" />
                  <List size={18} className={viewMode === 'list' ? "text-primary" : ""} onClick={() => setViewMode('list')} />
               </button>
               <button
                  onClick={() => {
                     setSelectedWarehouse(null);
                     setIsAddModalOpen(true);
                  }}
                  className="flex items-center gap-2 rounded-2xl bg-primary px-6 py-3 text-sm font-bold text-white shadow-lg transition-all hover:bg-primary-deep"
               >
                  <Plus size={20} />
                  Thêm kho mới
               </button>
            </div>
         </div>

         {isLoading ? (
            <div className="py-32 flex flex-col items-center justify-center">
               <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4" />
               <p className="text-sm font-bold text-text-muted">Đang tải dữ liệu kho hàng...</p>
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
                        <div className="absolute top-0 right-0 p-4 z-30">
                           <button
                              onClick={(e) => {
                                 e.stopPropagation();
                                 setActiveMenuId(activeMenuId === wh.id ? null : wh.id);
                              }}
                              className="p-2 text-text-muted hover:bg-primary/5 rounded-xl transition-all active:scale-95"
                           >
                              <MoreVertical size={20} />
                           </button>

                           {activeMenuId === wh.id && (
                              <>
                                 <div
                                    className="fixed inset-0 z-40"
                                    onClick={(e) => {
                                       e.stopPropagation();
                                       setActiveMenuId(null);
                                    }}
                                 />
                                 <motion.div
                                    initial={{ opacity: 0, scale: 0.95, y: -10 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    className="absolute right-4 top-14 bg-white border border-primary-soft/20 rounded-2xl shadow-xl py-2 w-40 z-50 overflow-hidden"
                                    onClick={(e) => e.stopPropagation()}
                                 >
                                    <button
                                       onClick={() => {
                                          setSelectedWarehouse(wh);
                                          setIsAddModalOpen(true);
                                          setActiveMenuId(null);
                                       }}
                                       className="w-full text-left px-4 py-3 text-xs font-bold text-text-secondary hover:bg-primary/5 hover:text-primary transition-all flex items-center gap-2"
                                    >
                                       Chỉnh sửa
                                    </button>
                                    <button
                                       onClick={async () => {
                                          if (confirm(`Bạn có chắc muốn xóa nhà kho "${wh.name}" không?`)) {
                                             try {
                                                await deleteWarehouse(wh.id);
                                             } catch (err) {
                                                console.error(err);
                                             }
                                          }
                                          setActiveMenuId(null);
                                       }}
                                       className="w-full text-left px-4 py-3 text-xs font-bold text-red-500 hover:bg-red-50 transition-all flex items-center gap-2"
                                    >
                                       Xóa kho
                                    </button>
                                 </motion.div>
                              </>
                           )}
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
                           <h3 className="text-2xl font-black text-text-primary">{wh.name}</h3>
                           <p className="text-sm font-bold text-text-muted uppercase tracking-wider">{wh.code}</p>
                        </div>

                        {/* Capacity Bar */}
                        <div className="space-y-3 mb-8">
                           <div className="flex justify-between items-end">
                              <div className="flex items-center gap-2">
                                 <Box size={16} className="text-primary-soft" />
                                 <span className="text-sm font-bold text-text-secondary">Sức chứa</span>
                              </div>
                              <p className="text-sm font-black text-text-primary">
                                 {wh.currentUsage} / {wh.capacity} <span className="text-[10px] text-text-muted">đơn vị</span>
                              </p>
                           </div>
                           <div className="h-3 w-full bg-primary-soft/10 rounded-full overflow-hidden border border-primary-soft/5">
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
                           <div className="p-4 rounded-3xl bg-primary-soft/10 border border-primary-soft/5 flex flex-col gap-1">
                              <div className="flex items-center gap-2 text-primary-soft">
                                 <MapPin size={14} />
                                 <span className="text-[10px] font-black uppercase">Vị trí</span>
                              </div>
                              <p className="text-xs font-bold text-text-primary truncate">{wh.location}</p>
                           </div>
                           <div className="p-4 rounded-3xl bg-primary-soft/10 border border-primary-soft/5 flex flex-col gap-1">
                              <div className="flex items-center gap-2 text-primary-soft">
                                 <User size={14} />
                                 <span className="text-[10px] font-black uppercase">Quản lý</span>
                              </div>
                              <p className="text-xs font-bold text-text-primary truncate">{wh.manager}</p>
                           </div>
                        </div>

                        {/* Footer Button */}
                        <button
                           onClick={() => handleShelfClick(wh)}
                           className="w-full mt-4 py-4 rounded-2xl bg-[#FFFAF4] border border-primary-soft/20 text-sm font-bold text-primary hover:bg-primary hover:text-white transition-all shadow-sm"
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
                  <p className="text-[10px] font-black text-text-muted uppercase tracking-widest">Hiệu suất sử dụng</p>
                  <h4 className="text-2xl font-black text-text-primary">78.4%</h4>
               </div>
            </GlassCard>
            <GlassCard className="p-6 flex items-center gap-6" radius="4xl">
               <div className="w-14 h-14 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center">
                  <AlertCircle size={28} />
               </div>
               <div>
                  <p className="text-[10px] font-black text-text-muted uppercase tracking-widest">Kho sắp đầy</p>
                  <h4 className="text-2xl font-black text-text-primary">01 <span className="text-sm font-medium text-text-muted">(Kho lạnh B)</span></h4>
               </div>
            </GlassCard>
            <GlassCard className="p-6 flex items-center gap-6" radius="4xl">
               <div className="w-14 h-14 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                  <Warehouse size={28} />
               </div>
               <div>
                  <p className="text-[10px] font-black text-text-muted uppercase tracking-widest">Lần kiểm kê cuối</p>
                  <h4 className="text-2xl font-black text-text-primary">10/05</h4>
               </div>
            </GlassCard>
         </div>
      </div>
   );
}

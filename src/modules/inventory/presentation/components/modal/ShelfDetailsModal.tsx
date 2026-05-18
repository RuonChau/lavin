'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Layout, Box, Hash, MoreVertical, Search, Filter, Warehouse, Layers, CheckCircle2, AlertTriangle, Package, Plus } from 'lucide-react';
import { GlassCard } from '@/shared/components/GlassCard';
import { cn } from '@/shared/utils/cn';
import { Warehouse as WarehouseType } from '../../../domain/entities/warehouse.entity';

interface ShelfDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  warehouse: WarehouseType | null;
}

export function ShelfDetailsModal({ isOpen, onClose, warehouse }: ShelfDetailsModalProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'high' | 'low' | 'empty'>('all');
  const [selectedRack, setSelectedRack] = useState<any | null>(null);
  const [isLevelModalOpen, setIsLevelModalOpen] = useState(false);
  const [openRackMenuId, setOpenRackMenuId] = useState<string | null>(null);
  const [isAddRackModalOpen, setIsAddRackModalOpen] = useState(false);

  const [activeActionModal, setActiveActionModal] = useState<'edit' | 'move' | 'audit' | 'alert' | 'delete' | null>(null);

  // Mocked shelf data
  const aisles = useMemo(() => [
    { id: 'aisle-1', name: 'Dãy A', racks: [
      { id: 'r-1', name: 'Kệ A1', shelves: 4, usage: 85, items: ['Hạt Arabica Cầu Đất', 'Matcha Uji'] },
      { id: 'r-2', name: 'Kệ A2', shelves: 4, usage: 45, items: ['Đường nước 10L'] },
      { id: 'r-3', name: 'Kệ A3', shelves: 4, usage: 10, items: [] },
    ]},
    { id: 'aisle-2', name: 'Dãy B', racks: [
      { id: 'r-4', name: 'Kệ B1', shelves: 3, usage: 92, items: ['Ly giấy 12oz', 'Ly giấy 16oz'] },
      { id: 'r-5', name: 'Kệ B2', shelves: 3, usage: 60, items: ['Nắp cầu', 'Nắp bằng'] },
    ]}
  ], []);

  const filteredAisles = useMemo(() => {
    return aisles.map(aisle => ({
      ...aisle,
      racks: aisle.racks.filter(rack => {
        const matchesSearch = rack.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            rack.items.some(item => item.toLowerCase().includes(searchTerm.toLowerCase()));
        
        let matchesFilter = true;
        if (filterStatus === 'high') matchesFilter = rack.usage >= 80;
        if (filterStatus === 'low') matchesFilter = rack.usage < 80 && rack.usage > 0;
        if (filterStatus === 'empty') matchesFilter = rack.usage === 0;

        return matchesSearch && matchesFilter;
      })
    })).filter(aisle => aisle.racks.length > 0);
  }, [searchTerm, filterStatus, aisles]);

  if (!isOpen || !warehouse) return null;

  const handleManageLevels = (rack: any) => {
    setSelectedRack(rack);
    setIsLevelModalOpen(true);
  };

  return (
    <>
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 z-[150] bg-black/20 backdrop-blur-sm"
        />

        <div className="fixed inset-0 z-[151] flex items-center justify-center p-4 pointer-events-none">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="w-full max-w-5xl pointer-events-auto h-[90vh] flex flex-col"
          >
            <GlassCard className="relative overflow-hidden flex flex-col h-full shadow-2xl" radius="4xl">
              {/* Header */}
              <div className="p-8 border-b border-[#D8B894]/20 bg-white/40 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-5">
                  <div className="w-14 h-14 rounded-[24px] bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                    <Layout size={28} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-[#2A1E17]">Chi tiết Kệ hàng & Vị trí</h2>
                    <div className="flex items-center gap-3 mt-1">
                       <span className="text-xs font-bold text-primary uppercase tracking-widest">{warehouse.name}</span>
                       <span className="w-1 h-1 rounded-full bg-[#D8B894]" />
                       <span className="text-xs font-bold text-[#9A8677] uppercase tracking-widest">{warehouse.code}</span>
                    </div>
                  </div>
                </div>
                <button onClick={onClose} className="p-3 text-[#9A8677] hover:bg-white/60 rounded-2xl transition-all">
                  <X size={24} />
                </button>
              </div>

              {/* Quick Stats Toolbar */}
              <div className="px-8 py-5 bg-[#FFFAF4]/30 border-b border-[#D8B894]/10 flex flex-wrap items-center justify-between gap-4 shrink-0">
                 <div className="flex items-center gap-6">
                    <div className="flex flex-col">
                       <span className="text-[9px] font-black text-[#9A8677] uppercase tracking-widest">Tổng kệ</span>
                       <span className="text-lg font-black text-[#2A1E17]">24 kệ</span>
                    </div>
                    <div className="w-px h-8 bg-[#D8B894]/20" />
                    <div className="flex flex-col">
                       <span className="text-[9px] font-black text-[#9A8677] uppercase tracking-widest">Hiệu suất sử dụng</span>
                       <span className="text-lg font-black text-primary">72%</span>
                    </div>
                 </div>

                 <div className="flex items-center gap-3">
                    <div className="relative group">
                      <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#D8B894] group-focus-within:text-primary transition-colors" size={14} />
                      <input 
                        type="text" 
                        placeholder="Tìm rack, kệ, sản phẩm..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="bg-white/60 border border-[#D8B894]/20 rounded-xl py-2.5 pl-9 pr-4 text-xs font-bold w-64 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                      />
                    </div>
                    <div className="flex bg-white/60 border border-[#D8B894]/20 rounded-xl p-1">
                      {[
                        { id: 'all', label: 'Tất cả' },
                        { id: 'high', label: 'Sắp đầy' },
                        { id: 'empty', label: 'Trống' },
                      ].map(tab => (
                        <button
                          key={tab.id}
                          onClick={() => setFilterStatus(tab.id as any)}
                          className={cn(
                            "px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all",
                            filterStatus === tab.id ? "bg-primary text-white shadow-sm" : "text-[#6F5A4A] hover:bg-white"
                          )}
                        >
                          {tab.label}
                        </button>
                      ))}
                    </div>
                    <button 
                      onClick={() => setIsAddRackModalOpen(true)}
                      className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white rounded-xl text-xs font-black uppercase tracking-wider hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
                    >
                      <Plus size={14} strokeWidth={3} />
                      Thêm kệ mới
                    </button>
                 </div>
              </div>

              {/* Scrollable Layout Content */}
              <div className="flex-1 overflow-y-auto p-8 space-y-10">
                 {filteredAisles.map((aisle, aisleIdx) => (
                   <div key={aisle.id} className="space-y-6">
                      <div className="flex items-center gap-3">
                         <h3 className="text-sm font-black text-[#2A1E17] uppercase tracking-widest underline decoration-primary/40 underline-offset-8 decoration-2">{aisle.name}</h3>
                         <span className="text-[10px] font-bold text-[#9A8677]">{aisle.racks.length} Kệ hàng</span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                         {aisle.racks.map((rack, rackIdx) => (
                           <div 
                             key={rack.id}
                             className="p-6 rounded-[32px] bg-white/60 border border-[#D8B894]/10 hover:border-primary/20 transition-all group"
                           >
                              <div className="flex justify-between items-start mb-6">
                                 <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-2xl bg-[#FFFAF4] border border-[#D8B894]/30 flex items-center justify-center text-[#6F5A4A]">
                                       <Hash size={18} />
                                    </div>
                                    <h4 className="text-base font-black text-[#2A1E17]">{rack.name}</h4>
                                 </div>
                                 <div className="relative">
                                   <button 
                                     onClick={(e) => {
                                       e.stopPropagation();
                                       setOpenRackMenuId(openRackMenuId === rack.id ? null : rack.id);
                                     }}
                                     className={cn(
                                       "p-1.5 rounded-lg transition-all",
                                       openRackMenuId === rack.id ? "bg-primary text-white" : "text-[#9A8677] hover:bg-white/60"
                                     )}
                                   >
                                      <MoreVertical size={16} />
                                   </button>
                                   
                                   <AnimatePresence>
                                     {openRackMenuId === rack.id && (
                                       <>
                                         <div 
                                           key={`${rack.id}-menu-overlay`}
                                           className="fixed inset-0 z-10" 
                                           onClick={() => setOpenRackMenuId(null)} 
                                         />
                                         <motion.div
                                           key={`${rack.id}-menu-content`}
                                           initial={{ opacity: 0, scale: 0.95, y: 10 }}
                                           animate={{ opacity: 1, scale: 1, y: 0 }}
                                           exit={{ opacity: 0, scale: 0.95, y: 10 }}
                                           className="absolute right-0 top-full mt-2 w-48 bg-white rounded-2xl shadow-xl border border-[#D8B894]/20 p-2 z-20 overflow-hidden"
                                         >
                                           {[
                                             { id: 'edit', label: 'Chỉnh sửa kệ', icon: Hash, color: 'text-[#6F5A4A]' },
                                             { id: 'goods', label: 'Quản lý hàng hóa', icon: Package, color: 'text-blue-500' },
                                             { id: 'move', label: 'Di chuyển vị trí', icon: Warehouse, color: 'text-[#6F5A4A]' },
                                             { id: 'audit', label: 'Kiểm kê / Dọn dẹp', icon: CheckCircle2, color: 'text-green-600' },
                                             { id: 'alert', label: 'Cảnh báo tồn kho', icon: AlertTriangle, color: 'text-amber-600' },
                                             { id: 'delete', label: 'Xóa kệ trống', icon: X, color: 'text-red-500' },
                                           ].map((action) => (
                                             <button
                                               key={`${rack.id}-action-${action.id}`}
                                               onClick={() => {
                                                 setSelectedRack(rack);
                                                 setActiveActionModal(action.id as any);
                                                 setOpenRackMenuId(null);
                                               }}
                                               className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-[#FFFAF4] transition-all group text-left"
                                             >
                                               <action.icon size={14} className={action.color} />
                                               <span className="text-[11px] font-bold text-[#2A1E17] tracking-tight">{action.label}</span>
                                             </button>
                                           ))}
                                         </motion.div>
                                       </>
                                     )}
                                   </AnimatePresence>
                                 </div>
                              </div>

                              <div className="space-y-4">
                                 <div className="flex justify-between text-[10px] font-bold text-[#9A8677] uppercase tracking-widest">
                                    <span>Tình trạng lắp đầy</span>
                                    <span className={cn(rack.usage > 80 ? "text-red-500" : "text-primary")}>{rack.usage}%</span>
                                 </div>
                                 <div className="h-2 w-full bg-[#D8B894]/10 rounded-full overflow-hidden">
                                    <motion.div 
                                      initial={{ width: 0 }}
                                      animate={{ width: `${rack.usage}%` }}
                                      className={cn("h-full rounded-full", rack.usage > 80 ? "bg-red-500" : "bg-primary")}
                                    />
                                  </div>
                              </div>

                              <div className="mt-8 space-y-2">
                                 <p className="text-[10px] font-black text-[#968271] uppercase tracking-[0.2em]">Mặt hàng đang chứa</p>
                                 <div className="flex flex-wrap gap-1.5">
                                    {rack.items.length > 0 ? rack.items.map((item, i) => (
                                      <span key={`rack-${rack.id}-item-${i}`} className="px-2.5 py-1 rounded-lg bg-primary/5 text-primary text-[10px] font-bold border border-primary/5">
                                        {item}
                                      </span>
                                    )) : (
                                      <span className="text-[10px] font-bold text-[#D8B894] italic px-1">Kệ trống</span>
                                    )}
                                 </div>
                              </div>

                              <button 
                                onClick={() => handleManageLevels(rack)}
                                className="w-full mt-6 py-3 rounded-xl bg-[#FFFAF4] border border-[#D8B894]/10 text-[10px] font-black text-[#6F5A4A] uppercase tracking-widest hover:bg-primary hover:text-white hover:border-primary transition-all"
                              >
                                 Quản lý tầng kệ ({rack.shelves})
                              </button>
                           </div>
                         ))}
                      </div>
                   </div>
                 ))}

                 {filteredAisles.length === 0 && (
                   <div className="py-24 flex flex-col items-center justify-center text-center">
                     <div className="w-20 h-20 rounded-[40px] bg-[#FFFAF4] flex items-center justify-center mb-6 border border-[#D8B894]/20 shadow-inner">
                       <Search size={40} className="text-[#D8B894] opacity-40" />
                     </div>
                     <h3 className="text-xl font-bold text-[#2A1E17]">Không tìm thấy vị trí phù hợp</h3>
                     <p className="text-[#9A8677] text-sm mt-1 max-w-xs mx-auto">Vui lòng thử lại với từ khóa khác hoặc xóa bộ lọc.</p>
                   </div>
                 )}
              </div>

              {/* Footer */}
              <div className="p-8 border-t border-[#D8B894]/20 bg-[#FFFAF4]/60 flex items-center justify-between shrink-0">
                 <div className="flex items-center gap-2 text-xs font-bold text-[#9A8677]">
                    <Warehouse size={14} className="text-primary" />
                    Hệ thống quản lý kệ hàng v1.2
                 </div>
                 <button onClick={onClose} className="px-10 py-3.5 rounded-2xl bg-white border border-[#D8B894]/30 text-sm font-bold text-[#6F5A4A] transition-all hover:shadow-md active:scale-95">
                   Đóng cửa sổ
                 </button>
              </div>
            </GlassCard>
          </motion.div>
        </div>
      </AnimatePresence>

      <ShelfLevelModal 
        isOpen={isLevelModalOpen}
        onClose={() => setIsLevelModalOpen(false)}
        rack={selectedRack}
      />

      <AddRackModal 
        isOpen={isAddRackModalOpen}
        onClose={() => setIsAddRackModalOpen(false)}
      />

      {/* Action Modals */}
      <ActionModal 
        isOpen={!!activeActionModal}
        type={activeActionModal}
        rack={selectedRack}
        onClose={() => setActiveActionModal(null)}
      />
    </>
  );
}

function ShelfLevelModal({ isOpen, onClose, rack }: { isOpen: boolean, onClose: () => void, rack: any }) {
  if (!isOpen || !rack) return null;

  // Mocked levels
  const levels = Array.from({ length: rack.shelves }, (_, i) => ({
    id: `level-${i + 1}`,
    name: `Tầng ${i + 1}`,
    usage: i === 0 ? 90 : i === 1 ? 60 : 0,
    items: i === 0 ? ['Hạt Arabica Cầu Đất'] : i === 1 ? ['Matcha Uji'] : []
  })).reverse();

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 z-[160] bg-black/40 backdrop-blur-md"
      />

      <div className="fixed inset-0 z-[161] flex items-center justify-center p-4 pointer-events-none">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 100 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 100 }}
          className="w-full max-w-2xl pointer-events-auto"
        >
          <GlassCard className="overflow-hidden" radius="4xl">
            {/* Header */}
            <div className="p-8 border-b border-[#D8B894]/20 bg-white/60 flex items-center justify-between">
              <div className="flex items-center gap-5">
                <div className="w-14 h-14 rounded-[24px] bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                  <Layers size={28} />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-[#2A1E17]">Quản lý Tầng kệ</h2>
                  <p className="text-xs text-[#9A8677] font-bold uppercase tracking-widest mt-1">Cấu trúc chi tiết của {rack.name}</p>
                </div>
              </div>
              <button onClick={onClose} className="p-3 text-[#9A8677] hover:bg-white/60 rounded-2xl transition-all">
                <X size={24} />
              </button>
            </div>

            {/* Content */}
            <div className="p-8 space-y-4 max-h-[60vh] overflow-y-auto bg-[#FFFAF4]/20">
               {levels.map((level, idx) => (
                 <motion.div
                   initial={{ opacity: 0, x: -20 }}
                   animate={{ opacity: 1, x: 0 }}
                   transition={{ delay: idx * 0.1 }}
                   key={level.id}
                   className="p-6 rounded-[32px] bg-white border border-[#D8B894]/20 hover:border-primary/30 transition-all flex items-center gap-6 group"
                 >
                    <div className="w-12 h-12 rounded-2xl bg-[#FFFAF4] border border-[#D8B894]/20 flex items-center justify-center font-black text-[#2A1E17]">
                       {level.id.split('-')[1]}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                       <div className="flex items-center justify-between mb-2">
                          <h4 className="text-base font-black text-[#2A1E17]">{level.name}</h4>
                          <span className={cn(
                            "text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full",
                            level.usage >= 90 ? "bg-red-50 text-red-500" : 
                            level.usage > 0 ? "bg-green-50 text-green-600" : "bg-gray-50 text-gray-400"
                          )}>
                            {level.usage >= 90 ? 'Đã đầy' : level.usage > 0 ? 'Còn chỗ' : 'Trống'}
                          </span>
                       </div>

                       <div className="flex flex-wrap gap-2">
                          {level.items.length > 0 ? level.items.map((item, i) => (
                            <div key={`${level.id}-item-${i}`} className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-primary/5 border border-primary/10 text-[10px] font-bold text-primary">
                               <Package size={12} />
                               {item}
                            </div>
                          )) : (
                            <p className="text-[10px] text-[#D8B894] font-bold uppercase tracking-widest italic">Sẵn sàng để nhập hàng</p>
                          )}
                       </div>
                    </div>

                    <div className="w-32 hidden sm:block">
                       <div className="flex justify-between text-[9px] font-black text-[#968271] uppercase mb-1.5">
                          <span>Usage</span>
                          <span>{level.usage}%</span>
                       </div>
                       <div className="h-1.5 w-full bg-[#D8B894]/10 rounded-full overflow-hidden">
                          <div 
                            className={cn("h-full rounded-full transition-all duration-1000", level.usage >= 90 ? "bg-red-500" : "bg-primary")}
                            style={{ width: `${level.usage}%` }}
                          />
                       </div>
                    </div>
                 </motion.div>
               ))}
            </div>

            {/* Footer */}
            <div className="p-8 border-t border-[#D8B894]/20 bg-white/40 flex justify-end">
               <button 
                 onClick={onClose}
                 className="px-10 py-3.5 rounded-2xl bg-primary text-white text-sm font-black shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] active:scale-95"
               >
                 Xác nhận thiết lập
               </button>
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

function ActionModal({ isOpen, type, rack, onClose }: { isOpen: boolean, type: any, rack: any, onClose: () => void }) {
  if (!isOpen || !rack) return null;

  const actionConfigs: Record<string, { title: string, icon: any, btnText: string, color: string }> = {
    edit: { title: 'Chỉnh sửa Kệ', icon: Hash, btnText: 'Cập nhật thông tin', color: 'primary' },
    goods: { title: 'Quản lý Hàng hóa', icon: Package, btnText: 'Lưu danh sách hàng', color: 'blue-500' },
    move: { title: 'Di chuyển Vị trí', icon: Warehouse, btnText: 'Lưu vị trí mới', color: 'primary' },
    audit: { title: 'Kiểm kê & Dọn dẹp', icon: CheckCircle2, btnText: 'Hoàn tất kiểm kê', color: 'green-600' },
    alert: { title: 'Cảnh báo Tồn kho', icon: AlertTriangle, btnText: 'Thiết lập cảnh báo', color: 'amber-600' },
    delete: { title: 'Xóa Kệ hàng', icon: X, btnText: 'Xác nhận xóa kệ', color: 'red-500' },
  };

  const config = actionConfigs[type as keyof typeof actionConfigs] || { title: 'Thông tin Shelf', icon: Hash, btnText: 'Xác nhận', color: 'primary' };

  const Icon = config.icon;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 z-[180] bg-black/50 backdrop-blur-md"
      />

      <div className="fixed inset-0 z-[181] flex items-center justify-center p-4 pointer-events-none">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 30 }}
          className="w-full max-w-md pointer-events-auto"
        >
          <GlassCard className="overflow-hidden" radius="4xl">
            <div className="p-8 border-b border-[#D8B894]/20 bg-white/60 flex items-center justify-between">
              <div className="flex items-center gap-5">
                <div className={cn(
                  "w-14 h-14 rounded-[24px] flex items-center justify-center border",
                  type === 'delete' ? "bg-red-50 text-red-500 border-red-100" :
                  type === 'audit' ? "bg-green-50 text-green-600 border-green-100" :
                  type === 'alert' ? "bg-amber-50 text-amber-600 border-amber-100" :
                  "bg-primary/10 text-primary border-primary/20"
                )}>
                  <Icon size={28} />
                </div>
                <div>
                  <h2 className="text-xl font-black text-[#2A1E17]">{config.title}</h2>
                  <p className="text-[10px] text-[#9A8677] font-bold uppercase tracking-widest mt-0.5">Đang thao tác trên: {rack.name}</p>
                </div>
              </div>
            </div>

            <div className="p-8 space-y-6">
               {type === 'goods' && (
                 <div className="space-y-4">
                    <p className="text-xs font-bold text-[#6F5A4A] leading-relaxed">
                      Danh sách các mặt hàng đang được lưu trữ tại <span className="text-primary font-black">{rack.name}</span>:
                    </p>
                    <div className="space-y-2">
                       {rack.items.map((item: string, i: number) => (
                         <div key={i} className="flex items-center justify-between p-3 bg-white/60 border border-[#D8B894]/20 rounded-xl group hover:border-blue-500/30 transition-all">
                            <span className="text-xs font-bold text-[#2A1E17]">{item}</span>
                            <button className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100">
                               <X size={14} />
                            </button>
                         </div>
                       ))}
                    </div>
                    <div className="relative pt-2">
                       <input 
                         type="text" 
                         placeholder="Nhập tên mặt hàng mới..." 
                         className="w-full bg-[#FFFAF4]/50 border border-[#D8B894]/30 border-dashed rounded-2xl py-4 px-6 text-sm font-bold focus:outline-none focus:border-blue-500 focus:bg-white transition-all shadow-inner"
                       />
                       <Plus size={16} className="absolute right-6 top-1/2 -translate-y-1/2 text-blue-500" />
                    </div>
                 </div>
               )}

               {type === 'edit' && (
                 <div className="space-y-4">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-[#968271] uppercase tracking-[0.2em]">Tên kệ mới</label>
                       <input defaultValue={rack.name} className="w-full bg-white/60 border border-[#D8B894]/20 rounded-2xl py-4 px-6 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-primary/20 shadow-inner" />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-[#968271] uppercase tracking-[0.2em]">Số tầng kệ</label>
                       <input type="number" defaultValue={rack.shelves} className="w-full bg-white/60 border border-[#D8B894]/20 rounded-2xl py-4 px-6 text-sm font-bold" />
                    </div>
                 </div>
               )}

               {type === 'move' && (
                 <div className="space-y-4">
                   <p className="text-xs font-bold text-[#6F5A4A] leading-relaxed">Chọn dãy kệ mới cho <span className="text-primary">{rack.name}</span>. Hành động này sẽ thay đổi vị trí tìm kiếm của nhân viên kho.</p>
                   <select className="w-full bg-white/60 border border-[#D8B894]/20 rounded-2xl py-4 px-6 text-sm font-bold appearance-none cursor-pointer">
                      <option>Dãy A (Khu khô ráo)</option>
                      <option>Dãy B (Khu lạnh)</option>
                      <option>Dãy C (Nguyên vật liệu)</option>
                   </select>
                 </div>
               )}

               {(type === 'audit' || type === 'alert') && (
                 <div className="space-y-4">
                    <div className="p-6 rounded-3xl bg-[#FFFAF4]/50 border border-[#D8B894]/10">
                       <p className="text-[11px] font-bold text-[#6F5A4A] leading-relaxed italic">
                         Hành động này sẽ giúp tối ưu hóa không gian lưu trữ và đảm bảo quy trình quản lý kho đạt chuẩn ISO-HACCP.
                       </p>
                    </div>
                    <div className="flex items-center gap-4">
                        <input type="checkbox" className="w-5 h-5 rounded-lg border-[#D8B894] accent-primary" id="confirm-check" />
                        <label htmlFor="confirm-check" className="text-xs font-black text-[#2A1E17] uppercase tracking-tighter">Xác nhận thực hiện quy trình</label>
                    </div>
                 </div>
               )}

               {type === 'delete' && (
                 <div className="space-y-4">
                    <p className="text-sm font-black text-[#2A1E17] leading-relaxed">
                      Bạn có chắc chắn muốn <span className="text-red-500">XÓA VĨNH VIỄN</span> kệ hàng này không?
                    </p>
                    <div className="p-4 rounded-2xl bg-red-50 border border-red-100 flex gap-3">
                       <AlertTriangle size={16} className="text-red-500 shrink-0 mt-0.5" />
                       <p className="text-[10px] font-bold text-red-600 uppercase tracking-widest leading-normal">Lưu ý: Chỉ có thế xóa khi kệ đang trống hoàn toàn.</p>
                    </div>
                 </div>
               )}
            </div>

            <div className="p-8 border-t border-[#D8B894]/20 bg-white/40 flex gap-3">
               <button onClick={onClose} className="flex-1 py-4 rounded-2xl bg-white border border-[#D8B894]/30 text-sm font-bold text-[#6F5A4A]">Hủy</button>
               <button 
                 onClick={onClose}
                 className={cn(
                   "flex-[2] py-4 rounded-2xl text-white text-sm font-black shadow-lg shadow-opacity-20",
                   type === 'delete' ? "bg-red-500 shadow-red-500/20" : 
                   type === 'audit' ? "bg-green-600 shadow-green-600/20" :
                   "bg-primary shadow-primary/20"
                 )}
               >
                 {config.btnText}
               </button>
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

function AddRackModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 z-[170] bg-black/40 backdrop-blur-md"
      />

      <div className="fixed inset-0 z-[171] flex items-center justify-center p-4 pointer-events-none">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 50 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 50 }}
          className="w-full max-w-md pointer-events-auto"
        >
          <GlassCard className="overflow-hidden" radius="4xl">
            <div className="p-8 border-b border-[#D8B894]/20 bg-white/60 flex items-center justify-between">
              <div className="flex items-center gap-5">
                <div className="w-14 h-14 rounded-[24px] bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                  <Plus size={28} />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-[#2A1E17]">Thêm Kệ mới</h2>
                  <p className="text-xs text-[#9A8677] font-bold uppercase tracking-widest mt-1">Khởi tạo vị trí lưu trữ mới</p>
                </div>
              </div>
              <button onClick={onClose} className="p-3 text-[#9A8677] hover:bg-white/60 rounded-2xl transition-all">
                <X size={24} />
              </button>
            </div>

            <div className="p-8 space-y-6">
               <div className="space-y-2">
                  <label className="text-[10px] font-black text-[#968271] uppercase tracking-[0.2em]">Tên kệ hàng</label>
                  <input 
                    type="text" 
                    placeholder="Ví dụ: Kệ A4, Kệ B5..."
                    className="w-full bg-white/60 border border-[#D8B894]/20 rounded-2xl py-4 px-6 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all shadow-inner"
                  />
               </div>

               <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                     <label className="text-[10px] font-black text-[#968271] uppercase tracking-[0.2em]">Số tầng</label>
                     <select className="w-full bg-white/60 border border-[#D8B894]/20 rounded-2xl py-4 px-6 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all appearance-none cursor-pointer">
                        <option>3 tầng</option>
                        <option>4 tầng</option>
                        <option>5 tầng</option>
                        <option>6 tầng</option>
                     </select>
                  </div>
                  <div className="space-y-2">
                     <label className="text-[10px] font-black text-[#968271] uppercase tracking-[0.2em]">Dãy kệ</label>
                     <select className="w-full bg-white/60 border border-[#D8B894]/20 rounded-2xl py-4 px-6 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all appearance-none cursor-pointer">
                        <option>Dãy A</option>
                        <option>Dãy B</option>
                        <option>Dãy C</option>
                     </select>
                  </div>
               </div>

               <div className="p-6 rounded-3xl bg-[#FFFAF4]/50 border border-[#D8B894]/10">
                  <div className="flex gap-4">
                     <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center shrink-0 border border-amber-100">
                        <AlertTriangle size={18} className="text-amber-600" />
                     </div>
                     <p className="text-[11px] font-medium text-[#6F5A4A] leading-relaxed">
                        Bạn đang khởi tạo kệ hàng trong kho lạnh. Vui lòng đảm bảo các tầng kệ chịu được nhiệt độ thấp theo tiêu chuẩn an toàn.
                     </p>
                  </div>
               </div>
            </div>

            <div className="p-8 border-t border-[#D8B894]/20 bg-white/40 flex gap-3">
               <button 
                 onClick={onClose}
                 className="flex-1 py-4 rounded-2xl bg-white border border-[#D8B894]/30 text-sm font-black text-[#6F5A4A] transition-all hover:bg-gray-50 active:scale-95"
               >
                 Hủy bỏ
               </button>
               <button 
                 onClick={onClose}
                 className="flex-[2] py-4 rounded-2xl bg-primary text-white text-sm font-black shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] active:scale-95"
               >
                 Tạo kệ hàng mới
               </button>
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}


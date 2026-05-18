'use client';

import { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Search, 
  Filter, 
  FileDown, 
  Plus, 
  Boxes, 
  AlertTriangle, 
  ArrowRightLeft, 
  Warehouse,
  TrendingDown,
  History,
  CheckCircle2,
  AlertCircle,
  MoreVertical,
  ChevronRight
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { GlassCard } from '@/shared/components/GlassCard';
import { cn } from '@/shared/utils/cn';
import { useInventory } from '@/modules/inventory/presentation/hooks/useInventory';
import { Material } from '@/modules/inventory/domain/entities/material.entity';
import { StockAdjustmentModal } from '@/modules/inventory/presentation/components/modal/StockAdjustmentModal';
import { StockHistoryModal } from '@/modules/inventory/presentation/components/modal/StockHistoryModal';
import { MaterialSelectionModal } from '@/modules/inventory/presentation/components/modal/MaterialSelectionModal';
import { toast } from 'react-toastify';

export default function InventoryPage() {
  const router = useRouter();
  const { materials, isLoading, updateStock, isUpdating } = useInventory();
  const [searchTerm, setSearchTerm] = useState('');
  const [showLowStockOnly, setShowLowStockOnly] = useState(false);
  const [selectedMaterial, setSelectedMaterial] = useState<Material | null>(null);
  const [isAdjustmentModalOpen, setIsAdjustmentModalOpen] = useState(false);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [isSelectionModalOpen, setIsSelectionModalOpen] = useState(false);

  const lowStockCount = materials.filter(m => m.currentStock < m.minStock).length;

  const filteredMaterials = materials.filter(m => {
    const matchesSearch = m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         m.sku.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLowStock = showLowStockOnly ? m.currentStock < m.minStock : true;
    return matchesSearch && matchesLowStock;
  });

  const handleAdjustClick = (material: Material) => {
    setSelectedMaterial(material);
    setIsAdjustmentModalOpen(true);
  };

  const handleHistoryClick = (material: Material) => {
    setSelectedMaterial(material);
    setIsHistoryModalOpen(true);
  };

  const handleSaveStock = async (newStock: number) => {
    if (selectedMaterial) {
      try {
        await updateStock({ id: selectedMaterial.id, newStock });
        toast.success(`Đã cập nhật tồn kho cho ${selectedMaterial.name}`);
        setIsAdjustmentModalOpen(false);
      } catch (error) {
        toast.error('Có lỗi xảy ra khi cập nhật tồn kho.');
      }
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-[28px] font-bold text-[#2A1E17] tracking-tight">Quản lý Tồn kho</h1>
          <p className="text-[#9A8677] text-sm mt-1 leading-relaxed">Theo dõi nguyên liệu, vật tư và định mức tồn kho tại các kho hàng.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsSelectionModalOpen(true)}
            className="flex items-center gap-2 rounded-[20px] bg-white/60 border border-[#D8B894]/30 px-5 py-3 text-sm font-bold text-[#6F5A4A] transition-all hover:bg-white hover:shadow-md active:scale-95"
          >
            <History size={18} />
            Tra cứu lịch sử
          </button>
          <button className="flex items-center gap-2 rounded-[20px] bg-white/60 border border-[#D8B894]/30 px-5 py-3 text-sm font-bold text-[#6F5A4A] transition-all hover:bg-white hover:shadow-md active:scale-95">
            <FileDown size={18} />
            Xuất báo cáo tồn
          </button>
          <button className="flex items-center gap-2 rounded-[20px] bg-[#8B5E3C] px-6 py-3 text-sm font-bold text-white shadow-lg shadow-[#8B5E3C]/20 transition-all hover:bg-[#5B3A29] hover:-translate-y-0.5 active:translate-y-0">
            <Plus size={20} />
            Thêm nguyên liệu
          </button>
        </div>
      </div>

      <StockAdjustmentModal 
        isOpen={isAdjustmentModalOpen}
        onClose={() => setIsAdjustmentModalOpen(false)}
        material={selectedMaterial}
        onSave={handleSaveStock}
        onViewHistory={handleHistoryClick}
        isSubmitting={isUpdating}
      />

      <StockHistoryModal 
        isOpen={isHistoryModalOpen}
        onClose={() => setIsHistoryModalOpen(false)}
        material={selectedMaterial}
      />

      <MaterialSelectionModal
        isOpen={isSelectionModalOpen}
        onClose={() => setIsSelectionModalOpen(false)}
        materials={materials}
        onSelect={(material) => {
          setSelectedMaterial(material);
          setIsSelectionModalOpen(false);
          setIsHistoryModalOpen(true);
        }}
        title="Tra cứu lịch sử nguyên vật liệu"
        description="Chọn một nguyên liệu để xem toàn bộ lịch sử biến động tồn kho."
      />

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'TỔNG NGUYÊN LIỆU', value: `${materials.length} loại`, change: '+12% so với tháng trước', icon: Boxes, color: 'bg-primary' },
          { label: 'CẢNH BÁO TỒN THẤP', value: lowStockCount.toString().padStart(2, '0'), change: 'Cần nhập hàng ngay', icon: AlertTriangle, color: lowStockCount > 0 ? 'bg-red-500' : 'bg-gray-400', active: lowStockCount > 0 },
          { label: 'GIÁ TRỊ KHO TỔNG', value: '₫425.8M', change: '-2.4M hao hụt', icon: Warehouse, color: 'bg-amber-500', negative: true },
          { label: 'GIAO DỊCH TRONG NGÀY', value: '24', change: 'vừa cập nhật 5 phút trước', icon: ArrowRightLeft, color: 'bg-green-500' },
        ].map((stat) => (
          <GlassCard 
            key={`stat-${stat.label}`} 
            className={cn(
              "p-6 relative group overflow-hidden transition-all duration-300",
              stat.active && "ring-2 ring-red-500/50 shadow-lg shadow-red-500/10 scale-[1.02]"
            )} 
            radius="4xl"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-[10px] font-bold text-[#9A8677] uppercase tracking-widest">{stat.label}</p>
                <h3 className="text-2xl font-bold text-[#2A1E17] mt-2 mb-1">{stat.value}</h3>
                <div className={cn(
                  "flex items-center gap-1 text-[11px] font-bold",
                  stat.negative ? "text-red-500" : "text-green-600"
                )}>
                  {stat.negative ? <TrendingDown size={12} /> : "•"} {stat.change}
                </div>
              </div>
              <div className={cn("p-2.5 rounded-2xl text-white shadow-lg", stat.color)}>
                <stat.icon size={20} />
              </div>
            </div>
          </GlassCard>
        ))}
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Inventory List */}
        <div className="lg:col-span-8 space-y-6">
          <GlassCard className="p-0 overflow-hidden" radius="4xl">
            {/* Toolbar */}
            <div className="p-6 border-b border-[#D8B894]/10 bg-white/40 flex flex-col sm:flex-row gap-4 items-center">
              <div className="relative flex-1 group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#D8B894] transition-colors group-focus-within:text-primary" size={18} />
                <input 
                  type="text" 
                  placeholder="Tìm tên nguyên liệu, SKU..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-11 pr-5 py-3 rounded-2xl bg-[#FFFAF4]/60 border border-[#D8B894]/30 text-sm focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all"
                />
              </div>
              <div className="flex items-center gap-3">
                 <button 
                  onClick={() => setShowLowStockOnly(!showLowStockOnly)}
                  className={cn(
                    "flex items-center gap-2 px-4 py-3 rounded-2xl text-xs font-bold transition-all border",
                    showLowStockOnly 
                      ? "bg-red-50 border-red-200 text-red-600 shadow-sm" 
                      : "bg-[#FFFAF4]/60 border-[#D8B894]/30 text-[#6F5A4A] hover:bg-white"
                  )}
                 >
                    <AlertTriangle size={16} />
                    {showLowStockOnly ? "Đang xem tồn thấp" : "Lọc tồn thấp"}
                 </button>
                 <button className="flex items-center gap-3 bg-[#FFFAF4]/60 border border-[#D8B894]/30 rounded-2xl px-4 py-3 text-xs font-bold text-[#6F5A4A] hover:bg-white transition-all">
                    <Filter size={16} /> Bộ lọc
                 </button>
              </div>
            </div>

            {/* List */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#FFFAF4]/40 text-[#9A8677] text-[11px] font-bold uppercase tracking-widest border-b border-[#D8B894]/10">
                    <th className="py-5 px-8">Nguyên liệu / SKU</th>
                    <th className="py-5 px-6">Trạng thái</th>
                    <th className="py-5 px-6 text-center">Tồn kho</th>
                    <th className="py-5 px-6">Giá trị đơn vị</th>
                    <th className="py-5 px-8 text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#D8B894]/5">
                  {filteredMaterials.map((material, idx) => {
                    const isLowStock = material.currentStock < material.minStock;
                    return (
                      <motion.tr 
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        key={material.id} 
                        className={cn(
                          "group transition-all duration-300 border-l-4",
                          isLowStock 
                            ? "bg-red-50/50 border-red-500 hover:bg-red-50" 
                            : "bg-transparent border-transparent hover:bg-[#FFFAF4]/40"
                        )}
                      >
                      <td className="py-5 px-8">
                         <div 
                           className="cursor-pointer hover:translate-x-1 transition-transform group/name"
                           onClick={() => handleHistoryClick(material)}
                         >
                            <p className="text-sm font-bold text-[#2A1E17] leading-tight group-hover/name:text-primary transition-colors">{material.name}</p>
                            <p className="text-[10px] text-[#9A8677] mt-1 font-bold">{material.sku} • {material.category}</p>
                         </div>
                      </td>
                      <td className="py-5 px-6">
                         <div className={cn(
                           "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
                           material.status === 'IN_STOCK' ? "bg-green-50 text-green-600" :
                           material.status === 'LOW_STOCK' ? "bg-amber-50 text-amber-600" :
                           "bg-red-50 text-red-600"
                         )}>
                            {material.status === 'IN_STOCK' && <CheckCircle2 size={12} />}
                            {material.status === 'LOW_STOCK' && <AlertCircle size={12} />}
                            {material.status === 'OUT_OF_STOCK' && <AlertTriangle size={12} />}
                            {material.status === 'IN_STOCK' ? 'Đang sẵn hàng' : 
                             material.status === 'LOW_STOCK' ? 'Đang sắp hết' : 'Hết hàng'}
                         </div>
                      </td>
                      <td className="py-5 px-6 text-center">
                         <p className={cn(
                           "text-sm font-black",
                           material.currentStock < material.minStock ? "text-red-500" : "text-[#2A1E17]"
                         )}>
                           {material.currentStock} {material.unit}
                         </p>
                         <p className="text-[9px] text-[#9A8677] font-bold">Tối thiểu: {material.minStock}</p>
                      </td>
                      <td className="py-5 px-6 text-xs font-bold text-[#6F5A4A]">
                         ₫{material.pricePerUnit.toLocaleString('vi-VN')}
                      </td>
                      <td className="py-5 px-8 text-right">
                         <div className="flex items-center justify-end gap-2 shrink-0">
                            <button 
                              onClick={() => handleHistoryClick(material)}
                              className="p-2.5 hover:bg-[#8B5E3C]/10 hover:text-[#8B5E3C] rounded-xl transition-all shadow-sm border border-transparent hover:border-[#8B5E3C]/20" 
                              title="Xem lịch sử"
                            >
                               <History size={16} />
                            </button>
                            <button 
                              onClick={() => handleAdjustClick(material)}
                              className="p-2.5 bg-primary/5 text-primary border border-primary/10 rounded-xl hover:bg-primary hover:text-white transition-all shadow-sm"
                              title="Điều chỉnh tồn kho"
                            >
                               <ArrowRightLeft size={16} />
                            </button>
                            <button className="p-2.5 text-[#9A8677] hover:bg-white/60 rounded-xl transition-all">
                               <MoreVertical size={16} />
                            </button>
                         </div>
                      </td>
                    </motion.tr>
                  ); })}
                </tbody>
              </table>
            </div>
          </GlassCard>
        </div>

        {/* Right: Activity & Alerts */}
        <div className="lg:col-span-4 space-y-8">
          {/* Warehouse Map/List */}
          <GlassCard className="p-8" radius="4xl">
            <h3 className="text-sm font-black text-[#2A1E17] uppercase tracking-widest mb-6 flex items-center gap-2">
              <Warehouse size={18} className="text-primary" /> Vị trí kho hàng
            </h3>
            <div className="space-y-4">
              {[
                { name: 'Kho tổng A', items: 156, status: 'Ổn định', color: 'bg-green-500' },
                { name: 'Kho lạnh B', items: 42, status: 'Đang đầy', color: 'bg-amber-500' },
                { name: 'Kho vật tư', items: 88, status: 'Ổn định', color: 'bg-green-500' },
              ].map((warehouse, idx) => (
                <div 
                  key={idx} 
                  onClick={() => router.push('/inventory/warehouses')}
                  className="p-4 rounded-3xl bg-[#FFFAF4]/40 border border-[#D8B894]/20 hover:border-primary/20 transition-all group flex items-center justify-between cursor-pointer"
                >
                  <div className="flex items-center gap-4">
                    <div className={cn("w-2 h-2 rounded-full", warehouse.color)} />
                    <div>
                       <p className="text-sm font-bold text-[#2A1E17]">{warehouse.name}</p>
                       <p className="text-[10px] text-[#9A8677] font-bold">{warehouse.items} mặt hàng</p>
                    </div>
                  </div>
                  <ChevronRight size={16} className="text-[#D8B894] group-hover:translate-x-1 transition-transform" />
                </div>
              ))}
            </div>
          </GlassCard>

          {/* Activity Log */}
          <GlassCard className="p-8" radius="4xl">
            <h3 className="text-sm font-black text-[#2A1E17] uppercase tracking-widest mb-6 flex items-center gap-2">
              <History size={18} className="text-primary" /> Nhật ký xuất nhập
            </h3>
            <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-px before:bg-[#D8B894]/30">
              {[
                { action: 'Nhập kho', material: 'Hạt Arabica', qty: '+50kg', time: '12/05/2024 10:30', user: 'Admin' },
                { action: 'Xuất kho', material: 'Sữa tươi', qty: '-24 hộp', time: '12/05/2024 09:15', user: 'POS-01' },
                { action: 'Hao hụt', material: 'Matcha Uji', qty: '-0.2kg', time: '11/05/2024 17:00', user: 'Ký duyệt' },
              ].map((log, idx) => (
                <div key={idx} className="relative">
                  <div className="absolute -left-[1.65rem] top-1 w-3 h-3 rounded-full bg-white border-2 border-primary shadow-sm" />
                  <p className="text-xs font-bold text-[#2A1E17]">{log.action}: <span className={cn(log.qty.startsWith('+') ? "text-green-600" : "text-red-500")}>{log.qty}</span> {log.material}</p>
                  <p className="text-[10px] text-[#9A8677] mt-0.5">{log.time} • {log.user}</p>
                </div>
              ))}
            </div>
            <button 
              onClick={() => router.push('/inventory/history')}
              className="w-full mt-8 py-3 text-xs font-black text-primary hover:bg-primary/5 rounded-2xl transition-all"
            >
               Xem toàn bộ lịch sử
            </button>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}

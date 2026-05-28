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
import { useInventory, useWarehouses, useAllInventoryHistory } from '@/modules/inventory/presentation/hooks/useInventory';
import { Material } from '@/modules/inventory/domain/entities/material.entity';
import { StockAdjustmentModal } from '@/modules/inventory/presentation/components/modal/stock-adjustment.modal';
import { StockHistoryModal } from '@/modules/inventory/presentation/components/modal/stock-history.modal';
import { MaterialSelectionModal } from '@/modules/inventory/presentation/components/modal/material-selection.modal';
import { AddMaterialModal } from '@/modules/inventory/presentation/components/modal/add-material.modal';
import { toast } from 'react-toastify';

export default function InventoryPage() {
  const router = useRouter();
  const { materials, isLoading, updateStock, isUpdating, createMaterial, isCreating } = useInventory();
  const { warehouses, isLoading: isWarehousesLoading } = useWarehouses();
  const { data: activityLog, isLoading: isActivityLoading } = useAllInventoryHistory();
  const [searchTerm, setSearchTerm] = useState('');
  const [showLowStockOnly, setShowLowStockOnly] = useState(false);
  const [selectedMaterial, setSelectedMaterial] = useState<Material | null>(null);
  const [isAdjustmentModalOpen, setIsAdjustmentModalOpen] = useState(false);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [isSelectionModalOpen, setIsSelectionModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const lowStockCount = materials.filter(m => m.currentStock < m.minStock).length;

  // Dynamic calculations for stats overview
  const totalWarehouseValue = materials.reduce((sum, m) => sum + (m.currentStock * m.pricePerUnit), 0);

  const today = new Date();
  const todayTransactionsCount = activityLog?.filter((log: any) => {
    const logDate = new Date(log.timestamp);
    return logDate.getDate() === today.getDate() &&
           logDate.getMonth() === today.getMonth() &&
           logDate.getFullYear() === today.getFullYear();
  }).length || 0;

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

  const handleSaveMaterial = async (newMaterialData: Omit<Material, 'id' | 'lastUpdated' | 'status'>) => {
    try {
      await createMaterial(newMaterialData);
      toast.success(`Đã thêm nguyên liệu "${newMaterialData.name}" thành công!`);
      setIsAddModalOpen(false);
    } catch (error) {
      toast.error('Có lỗi xảy ra khi thêm nguyên liệu.');
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-[28px] font-bold text-text-primary tracking-tight">Quản lý Tồn kho</h1>
          <p className="text-text-muted text-sm mt-1 leading-relaxed">Theo dõi nguyên liệu, vật tư và định mức tồn kho tại các kho hàng.</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsSelectionModalOpen(true)}
            className="flex items-center gap-2 rounded-2xl bg-white/60 border border-primary-soft/30 px-5 py-3 text-sm font-bold text-text-secondary transition-all hover:bg-white hover:shadow-md active:scale-95"
          >
            <History size={18} />
            Tra cứu lịch sử
          </button>
          <button className="flex items-center gap-2 rounded-2xl bg-white/60 border border-primary-soft/30 px-5 py-3 text-sm font-bold text-text-secondary transition-all hover:bg-white hover:shadow-md active:scale-95">
            <FileDown size={18} />
            Xuất báo cáo tồn
          </button>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 rounded-2xl bg-primary px-6 py-3 text-sm font-bold text-white shadow-lg shadow-primary/20 transition-all hover:bg-primary-deep hover:-translate-y-0.5 active:translate-y-0"
          >
            <Plus size={20} />
            Thêm nguyên liệu
          </button>
        </div>
      </div>

      <AddMaterialModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleSaveMaterial}
        isSubmitting={isCreating}
      />

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
          { 
            label: 'GIÁ TRỊ KHO TỔNG', 
            value: `₫${(totalWarehouseValue).toLocaleString('vi-VN')}`, 
            change: 'Từ tồn kho thực tế', 
            icon: Warehouse, 
            color: 'bg-amber-500' 
          },
          { 
            label: 'GIAO DỊCH TRONG NGÀY', 
            value: todayTransactionsCount.toString(), 
            change: 'Hôm nay', 
            icon: ArrowRightLeft, 
            color: 'bg-green-500' 
          },
        ].map((stat: any) => (
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
                <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest">{stat.label}</p>
                <h3 className="text-2xl font-bold text-text-primary mt-2 mb-1">{stat.value}</h3>
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
            <div className="p-6 border-b border-primary-soft/10 bg-white/40 flex flex-col sm:flex-row gap-4 items-center">
              <div className="relative flex-1 group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-primary-soft transition-colors group-focus-within:text-primary" size={18} />
                <input
                  type="text"
                  placeholder="Tìm tên nguyên liệu, SKU..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-11 pr-5 py-3 rounded-2xl bg-[#FFFAF4]/60 border border-primary-soft/30 text-sm focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all"
                />
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowLowStockOnly(!showLowStockOnly)}
                  className={cn(
                    "flex items-center gap-2 px-4 py-3 rounded-2xl text-xs font-bold transition-all border",
                    showLowStockOnly
                      ? "bg-red-50 border-red-200 text-red-600 shadow-sm"
                      : "bg-white/40 border-primary-soft/30 text-text-secondary hover:bg-white"
                  )}
                >
                  <AlertTriangle size={16} />
                  {showLowStockOnly ? "Đang xem tồn thấp" : "Lọc tồn thấp"}
                </button>
                <button className="flex items-center gap-3 bg-[#FFFAF4]/60 border border-primary-soft/30 rounded-2xl px-4 py-3 text-xs font-bold text-text-secondary hover:bg-white transition-all">
                  <Filter size={16} /> Bộ lọc
                </button>
              </div>
            </div>

            {/* List */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#FFFAF4]/40 text-text-muted text-[11px] font-bold uppercase tracking-widest border-b border-primary-soft/10">
                    <th className="py-5 px-8">Nguyên liệu / SKU</th>
                    <th className="py-5 px-6">Trạng thái</th>
                    <th className="py-5 px-6 text-center">Tồn kho</th>
                    <th className="py-5 px-6">Giá trị đơn vị</th>
                    <th className="py-5 px-8 text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-primary-soft/5">
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
                            <p className="text-sm font-bold text-text-primary leading-tight group-hover/name:text-primary transition-colors">{material.name}</p>
                            <p className="text-[10px] text-text-muted mt-1 font-bold">{material.sku} • {material.category}</p>
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
                            material.currentStock < material.minStock ? "text-red-500" : "text-text-primary"
                          )}>
                            {material.currentStock} {material.unit}
                          </p>
                          <p className="text-[9px] text-text-muted font-bold">Tối thiểu: {material.minStock}</p>
                        </td>
                        <td className="py-5 px-6 text-xs font-bold text-text-secondary">
                          ₫{material.pricePerUnit.toLocaleString('vi-VN')}
                        </td>
                        <td className="py-5 px-8 text-right">
                          <div className="flex items-center justify-end gap-2 shrink-0">
                            <button
                              onClick={() => handleHistoryClick(material)}
                              className="p-2.5 hover:bg-primary/10 hover:text-primary rounded-xl transition-all shadow-sm border border-transparent hover:border-primary/20"
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
                            <button className="p-2.5 text-text-muted hover:bg-white/60 rounded-xl transition-all">
                              <MoreVertical size={16} />
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </GlassCard>
        </div>

        {/* Right: Activity & Alerts */}
        <div className="lg:col-span-4 space-y-8">
          {/* Warehouse Map/List */}
          <GlassCard className="p-8" radius="4xl">
            <h3 className="text-sm font-black text-text-primary uppercase tracking-widest mb-6 flex items-center gap-2">
              <Warehouse size={18} className="text-primary" /> Vị trí kho hàng
            </h3>
            <div className="space-y-4">
              {isWarehousesLoading ? (
                <div className="py-6 flex flex-col items-center justify-center">
                  <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin mb-2" />
                  <p className="text-[10px] font-bold text-text-muted">Đang tải vị trí kho...</p>
                </div>
              ) : warehouses.length === 0 ? (
                <div className="text-center py-6 border border-dashed border-primary-soft/30 rounded-3xl p-4 bg-[#FFFAF4]/20">
                  <p className="text-xs font-bold text-text-muted">Chưa có vị trí kho hàng nào.</p>
                  <button 
                     onClick={() => router.push('/inventory/warehouses')}
                     className="mt-3 text-xs font-black text-primary hover:underline"
                  >
                     + Thiết lập ngay
                  </button>
                </div>
              ) : (
                warehouses.map((wh: any) => {
                  const itemsCount = materials.filter(m => m.warehouse === wh.name).length;
                  const color = wh.type === 'COLD' ? 'bg-blue-500' : 'bg-green-500';
                  return (
                    <div
                      key={wh.id}
                      onClick={() => router.push('/inventory/warehouses')}
                      className="p-4 rounded-3xl bg-[#FFFAF4]/40 border border-primary-soft/20 hover:border-primary/20 transition-all group flex items-center justify-between cursor-pointer"
                    >
                      <div className="flex items-center gap-4">
                        <div className={cn("w-2 h-2 rounded-full", color)} />
                        <div>
                          <p className="text-sm font-bold text-text-primary">{wh.name}</p>
                          <p className="text-[10px] text-text-muted font-bold">{itemsCount} mặt hàng</p>
                        </div>
                      </div>
                      <ChevronRight size={16} className="text-primary-soft group-hover:translate-x-1 transition-transform" />
                    </div>
                  );
                })
              )}
            </div>
          </GlassCard>

          {/* Activity Log */}
          <GlassCard className="p-8" radius="4xl">
            <h3 className="text-sm font-black text-text-primary uppercase tracking-widest mb-6 flex items-center gap-2">
              <History size={18} className="text-primary" /> Nhật ký xuất nhập
            </h3>
            <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-px before:bg-primary-soft/30">
              {isActivityLoading ? (
                <div className="py-6 flex flex-col items-center justify-center">
                  <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin mb-2" />
                  <p className="text-[10px] font-bold text-text-muted">Đang tải nhật ký...</p>
                </div>
              ) : !activityLog || activityLog.length === 0 ? (
                <p className="text-xs font-bold text-[#968271] italic py-2">Chưa có giao dịch xuất nhập nào.</p>
              ) : (
                activityLog.slice(0, 5).map((log: any, idx: number) => {
                  const isIncrease = log.type === 'INCREASE';
                  const qtyText = `${isIncrease ? '+' : '-'}${log.quantity}${log.unit || 'đv'}`;
                  
                  return (
                    <div key={log.id || idx} className="relative">
                      <div className="absolute left-[-1.65rem] top-1 w-3 h-3 rounded-full bg-white border-2 border-primary shadow-sm" />
                      <p className="text-xs font-bold text-text-primary">
                        {isIncrease ? 'Nhập kho' : 'Xuất kho'}: <span className={cn(isIncrease ? "text-green-600" : "text-red-500")}>{qtyText}</span> {log.materialName}
                      </p>
                      <p className="text-[10px] text-text-muted mt-0.5">
                        {new Date(log.timestamp).toLocaleString('vi-VN')} • {log.user}
                      </p>
                    </div>
                  );
                })
              )}
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

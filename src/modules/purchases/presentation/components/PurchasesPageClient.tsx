'use client';

import { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Search, 
  Filter, 
  Plus,
  ShoppingCart,
  MoreVertical,
  ChevronRight,
  FileText,
  Calendar,
  User,
  Package,
  AlertCircle,
  Truck,
  Eye,
  Edit2,
  FileDown,
} from 'lucide-react';
import { GlassCard } from '@/shared/components/GlassCard';
import { cn } from '@/shared/utils/cn';
import { useRouter } from 'next/navigation';
import { MOCK_POS } from '../../mocks/purchase-orders.mock';
import { StatsSummary } from '../../mocks/stats-summary.mock';
import { STATUS_CONFIG } from '../../configs/status-pos.config';
import { Supplier } from '../../mocks/supplier.mock';
import CreatePurchaseOrderModal from './modals/CreatePurchaseOrderModal';
import ViewPurchaseOrderModal from './modals/ViewPurchaseOrderModal';
import EditPurchaseOrderModal from './modals/EditPurchaseOrderModal';
import SupplierHistoryModal from './modals/SupplierHistoryModal';





export default function PurchaseOrdersPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('ALL');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [viewingOrder, setViewingOrder] = useState<any>(null);
  const [editingOrder, setEditingOrder] = useState<any>(null);
  const [viewingSupplier, setViewingSupplier] = useState<any>(null);

  const filteredOrders = MOCK_POS.filter(po => {
    const matchesSearch = po.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         po.supplier.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTab = activeTab === 'ALL' ? true : po.status === activeTab;
    return matchesSearch && matchesTab;
  });

  return (
    <div className="space-y-8 pb-12">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-[28px] font-bold text-[#2A1E17] tracking-tight">Đơn nhập hàng</h1>
          <p className="text-[#9A8677] text-sm mt-1 leading-relaxed">Quản lý quy trình mua hàng, theo dõi đơn nhập và công nợ nhà cung cấp.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 rounded-[20px] bg-white/60 border border-[#D8B894]/30 px-5 py-3 text-sm font-bold text-[#6F5A4A] transition-all hover:bg-white hover:shadow-md active:scale-95">
            <FileDown size={18} />
            Xuất báo cáo
          </button>
          <button 
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center gap-2 rounded-[20px] bg-[#8B5E3C] px-6 py-3 text-sm font-bold text-white shadow-lg shadow-[#8B5E3C]/20 transition-all hover:bg-[#5B3A29] hover:-translate-y-0.5 active:translate-y-0"
          >
            <Plus size={20} />
            Tạo đơn nhập mới
          </button>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {StatsSummary.map((stat, idx) => (
          <GlassCard key={idx} className="p-6 transition-all duration-300 hover:scale-[1.02]" radius="4xl">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-[10px] font-bold text-[#9A8677] uppercase tracking-widest">{stat.label}</p>
                <h3 className="text-2xl font-bold text-[#2A1E17] mt-2 mb-1">{stat.value}</h3>
                <p className="text-[11px] font-bold text-green-600 flex items-center gap-1">
                  {stat.change}
                </p>
              </div>
              <div className={cn("p-2.5 rounded-2xl text-white shadow-lg", stat.color)}>
                <stat.icon size={20} />
              </div>
            </div>
          </GlassCard>
        ))}
      </div>

      {/* Main Content Area */}
      <GlassCard className="p-0 overflow-hidden" radius="4xl">
        {/* Toolbar & Tabs */}
        <div className="border-b border-[#D8B894]/10 bg-white/40">
          <div className="p-6 flex flex-col sm:flex-row gap-6 items-center">
            <div className="flex items-center gap-1 p-1 bg-[#FFFAF4]/60 rounded-2xl border border-[#D8B894]/20">
              {['ALL', 'PENDING', 'SHIPPING', 'COMPLETED'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={cn(
                    "px-4 py-2 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all",
                    activeTab === tab 
                      ? "bg-white text-primary shadow-sm" 
                      : "text-[#9A8677] hover:bg-white/40"
                  )}
                >
                  {tab === 'ALL' ? 'Tất cả' : 
                   tab === 'PENDING' ? 'Chờ duyệt' :
                   tab === 'SHIPPING' ? 'Đang giao' : 'Hoàn thành'}
                </button>
              ))}
            </div>

            <div className="relative flex-1 group w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#D8B894] transition-colors group-focus-within:text-primary" size={18} />
              <input 
                type="text" 
                placeholder="Tìm mã đơn, nhà cung cấp..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-11 pr-5 py-3 rounded-2xl bg-[#FFFAF4]/60 border border-[#D8B894]/30 text-sm focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all"
              />
            </div>

            <button className="flex items-center gap-3 bg-[#FFFAF4]/60 border border-[#D8B894]/30 rounded-2xl px-6 py-3 text-xs font-bold text-[#6F5A4A] hover:bg-white transition-all">
              <Filter size={16} /> Bộ lọc
            </button>
          </div>
        </div>

        {/* List Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#FFFAF4]/40 text-[#9A8677] text-[11px] font-bold uppercase tracking-widest border-b border-[#D8B894]/10">
                <th className="py-5 px-8">Mã đơn / Ngày tạo</th>
                <th className="py-5 px-6">Nhà cung cấp</th>
                <th className="py-5 px-6">Trạng thái</th>
                <th className="py-5 px-6">Số mặt hàng</th>
                <th className="py-5 px-6">Tổng giá trị</th>
                <th className="py-5 px-8 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#D8B894]/5">
              {filteredOrders.map((po, idx) => {
                const StatusIcon = STATUS_CONFIG[po.status as keyof typeof STATUS_CONFIG].icon;
                return (
                  <motion.tr 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    key={po.id} 
                    className="group hover:bg-[#FFFAF4]/40 transition-all duration-300 cursor-pointer"
                  >
                    <td className="py-5 px-8" onClick={() => {}}>
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-2xl bg-primary/5 flex items-center justify-center text-primary border border-primary/10">
                          <FileText size={18} />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-[#2A1E17] group-hover:text-primary transition-colors">{po.id}</p>
                          <div className="flex items-center gap-2 text-[10px] text-[#9A8677] font-bold mt-1">
                            <Calendar size={10} />
                            {po.date}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-5 px-6">
                      <p className="text-sm font-bold text-[#6F5A4A]">{po.supplier}</p>
                      <p className="text-[10px] text-[#9A8677] font-bold mt-1 uppercase tracking-tight">{po.branch}</p>
                    </td>
                    <td className="py-5 px-6">
                      <div className={cn(
                        "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider border",
                        STATUS_CONFIG[po.status as keyof typeof STATUS_CONFIG].color
                      )}>
                        <StatusIcon size={12} strokeWidth={3} />
                        {STATUS_CONFIG[po.status as keyof typeof STATUS_CONFIG].label}
                      </div>
                    </td>
                    <td className="py-5 px-6">
                      <div className="flex items-center gap-2 text-sm font-bold text-[#6F5A4A]">
                        <Package size={14} className="text-[#D8B894]" />
                        {po.itemsCount} mặt hàng
                      </div>
                    </td>
                    <td className="py-5 px-6">
                      <p className="text-sm font-black text-[#2A1E17]">₫{po.total.toLocaleString('vi-VN')}</p>
                    </td>
                    <td className="py-5 px-8 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
                        <button 
                          onClick={() => setViewingOrder(po)}
                          title="Xem chi tiết"
                          className="p-2 bg-white border border-[#D8B894]/30 rounded-xl text-[#6F5A4A] hover:text-primary hover:border-primary/30 transition-all shadow-sm active:scale-95"
                        >
                          <Eye size={16} strokeWidth={2.5} />
                        </button>
                        <button 
                          onClick={() => setEditingOrder(po)}
                          title="Sửa đơn hàng"
                          className="p-2 bg-white border border-[#D8B894]/30 rounded-xl text-[#6F5A4A] hover:text-blue-600 hover:border-blue-200 transition-all shadow-sm active:scale-95"
                        >
                          <Edit2 size={16} strokeWidth={2.5} />
                        </button>
                        <button 
                          title="Thao tác khác"
                          className="p-2 text-[#9A8677] hover:bg-white border border-transparent hover:border-[#D8B894]/30 rounded-xl transition-all active:scale-95"
                        >
                          <MoreVertical size={16} strokeWidth={2.5} />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                );
              })}

              {filteredOrders.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-20 text-center">
                    <div className="flex flex-col items-center">
                      <div className="w-20 h-20 rounded-[32px] bg-[#FFFAF4] flex items-center justify-center text-[#D8B894]/30 mb-4">
                        <ShoppingCart size={40} />
                      </div>
                      <p className="text-sm font-bold text-[#9A8677]">Không tìm thấy đơn nhập hàng nào</p>
                      <button className="mt-4 text-xs font-black text-primary uppercase tracking-widest hover:underline">Xóa bộ lọc</button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </GlassCard>

      {/* Detailed Info Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <GlassCard className="p-8" radius="4xl">
          <h3 className="text-sm font-black text-[#2A1E17] uppercase tracking-widest mb-6 flex items-center gap-2">
            <User size={18} className="text-primary" /> Nhà cung cấp hàng đầu
          </h3>
          <div className="space-y-4">
            {Supplier.map((sup, idx) => (
              <div 
                key={idx} 
                onClick={() => setViewingSupplier(sup)}
                className="p-4 bg-[#FFFAF4]/40 border border-[#D8B894]/20 rounded-[24px] flex items-center justify-between group hover:border-primary/30 transition-all cursor-pointer active:scale-[0.98]"
              >
                <div>
                  <p className="text-sm font-bold text-[#2A1E17]">{sup.name}</p>
                  <p className="text-[10px] text-[#9A8677] font-bold uppercase tracking-tight">{sup.total} đơn nhập thành công</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-black text-primary">{sup.amount}</p>
                  <ChevronRight size={14} className="text-[#D8B894] ml-auto mt-1 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            ))}
          </div>
        </GlassCard>

        <GlassCard className="p-8" radius="4xl">
          <h3 className="text-sm font-black text-[#2A1E17] uppercase tracking-widest mb-6 flex items-center gap-2">
             <AlertCircle size={18} className="text-primary" /> Lưu ý hệ thống
          </h3>
          <div className="space-y-4">
             <div className="p-5 rounded-[24px] bg-amber-50 border border-amber-100 flex gap-4">
               <div className="p-2.5 bg-white rounded-2xl text-amber-500 h-fit shadow-sm">
                 <AlertCircle size={18} />
               </div>
               <div>
                 <p className="text-xs font-black text-[#2A1E17] uppercase tracking-tight mb-1">Cảnh báo công nợ</p>
                 <p className="text-xs text-[#6F5A4A] leading-relaxed">Có 2 nhà cung cấp sắp đến hạn thanh toán công nợ. Vui lòng kiểm tra đối soát trước khi duyệt đơn mới.</p>
               </div>
             </div>
             <div className="p-5 rounded-[24px] bg-blue-50 border border-blue-100 flex gap-4">
               <div className="p-2.5 bg-white rounded-2xl text-blue-500 h-fit shadow-sm">
                 <Truck size={18} />
               </div>
               <div>
                 <p className="text-xs font-black text-[#2A1E17] uppercase tracking-tight mb-1">Theo dõi vận chuyển</p>
                 <p className="text-xs text-[#6F5A4A] leading-relaxed">Đơn hàng PO-2024-003 từ Gia vị Nhà Bếp đang bị trễ 4 tiếng so với dự kiến. Liên hệ tài xế: 090xxxxxxx.</p>
               </div>
             </div>
          </div>
        </GlassCard>
      </div>

      <CreatePurchaseOrderModal
        isOpen={isCreateModalOpen} 
        onClose={() => setIsCreateModalOpen(false)} 
      />

      <ViewPurchaseOrderModal
        order={viewingOrder}
        onClose={() => setViewingOrder(null)}
      />

      <EditPurchaseOrderModal
        order={editingOrder}
        onClose={() => setEditingOrder(null)}
      />

      <SupplierHistoryModal
        supplier={viewingSupplier}
        onClose={() => setViewingSupplier(null)}
        onViewOrder={(id) => {
          const order = MOCK_POS.find(p => p.id === id);
          if (order) {
            setViewingOrder(order);
            // Don't necessarily close supplier modal? 
            // User might want to go back.
            // But usually, one modal at a time is better.
            // Let's keep it open for now, the viewing modal has z-index 150/151.
          }
        }}
      />
    </div>
  );
}



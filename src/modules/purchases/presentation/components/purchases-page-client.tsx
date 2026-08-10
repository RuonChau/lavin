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
  Clock,
} from 'lucide-react';
import { GlassCard } from '@/shared/components/GlassCard';
import { cn } from '@/shared/utils/cn';
import { useRouter } from 'next/navigation';
import { usePurchases } from '@/modules/purchases/presentation/hooks/usePurchases';
import { STATUS_CONFIG } from '../../configs/status-pos.config';
import CreatePurchaseOrderModal from './modals/create-purchase-order.modal';
import ViewPurchaseOrderModal from './modals/view-purchase-order.modal';
import EditPurchaseOrderModal from './modals/edit-purchase-order.modal';
import SupplierHistoryModal from './modals/supplier-history.modal';
import { mapSystemAlerts } from '../utils/map-system-alerts';




export default function PurchaseOrdersPage() {
  const router = useRouter();
  const { purchaseOrders, isLoading, topSuppliers, systemAlerts } = usePurchases();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('ALL');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [viewingOrder, setViewingOrder] = useState<any>(null);
  const [editingOrder, setEditingOrder] = useState<any>(null);
  const [viewingSupplier, setViewingSupplier] = useState<any>(null);

  const filteredOrders = purchaseOrders.filter(po => {
    const matchesSearch = po.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      po.supplier.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTab = activeTab === 'ALL' ? true : po.status === activeTab;
    return matchesSearch && matchesTab;
  });

  // Calculate dynamic stats from database POs
  const totalCost = purchaseOrders
    .filter(po => po.status === 'COMPLETED' || po.status === 'SHIPPING')
    .reduce((sum, po) => sum + po.total, 0);

  const pendingCount = purchaseOrders.filter(po => po.status === 'PENDING').length;
  const shippingOrdersCount = purchaseOrders.filter(po => po.status === 'SHIPPING').length;
  const uniqueSuppliersCount = new Set(purchaseOrders.map(po => po.supplierId)).size;

  const statsSummary = [
    { label: 'TỔNG ĐƠN NHẬP', value: `${purchaseOrders.length} đơn`, change: 'Đang lưu trữ', icon: ShoppingCart, color: 'bg-primary' },
    { label: 'CHI PHÍ NHẬP KHO', value: `₫${totalCost.toLocaleString('vi-VN')}`, change: 'Đơn thành công/đang giao', icon: FileText, color: 'bg-amber-500' },
    { label: 'ĐƠN CHỜ DUYỆT', value: pendingCount.toString(), change: 'Cần xử lý phê duyệt', icon: Calendar, color: 'bg-blue-500' },
    { label: 'ĐỐI TÁC GIAO DỊCH', value: uniqueSuppliersCount.toString(), change: 'Nhà cung cấp đang dùng', icon: User, color: 'bg-green-500' },
  ];

  // Map backend alerts to frontend display details
  const displayAlerts = mapSystemAlerts(systemAlerts);

  return (
    <div className="space-y-8 pb-12">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-[28px] font-bold text-text-primary tracking-tight">Đơn nhập hàng</h1>
          <p className="text-text-muted text-sm mt-1 leading-relaxed">Quản lý quy trình mua hàng, theo dõi đơn nhập và công nợ nhà cung cấp.</p>
        </div>

        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 rounded-2xl bg-white/60 border border-border-primary/30 px-5 py-3 text-sm font-bold text-text-muted transition-all hover:bg-white hover:shadow-md active:scale-95">
            <FileDown size={18} />
            Xuất báo cáo
          </button>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center gap-2 rounded-2xl bg-primary px-6 py-3 text-sm font-bold text-white shadow-lg shadow-primary/20 transition-all hover:bg-primary-deep hover:-translate-y-0.5 active:translate-y-0"
          >
            <Plus size={20} />
            Tạo đơn nhập mới
          </button>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsSummary.map((stat, idx) => (
          <GlassCard key={idx} className="p-6 transition-all duration-300 hover:scale-[1.02]" radius="4xl">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest">{stat.label}</p>
                <h3 className="text-2xl font-bold text-text-primary mt-2 mb-1">{stat.value}</h3>
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
        <div className="border-b border-primary-soft/10 bg-white/40">
          <div className="p-6 flex flex-col sm:flex-row gap-6 items-center">
            <div className="flex items-center gap-1 p-1 bg-white/60 rounded-2xl border border-primary-soft/20">
              {['ALL', 'PENDING', 'SHIPPING', 'COMPLETED'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={cn(
                    "px-4 py-2 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all",
                    activeTab === tab
                      ? "bg-white text-primary shadow-sm"
                      : "text-text-muted hover:bg-white/40"
                  )}
                >
                  {tab === 'ALL' ? 'Tất cả' :
                    tab === 'PENDING' ? 'Chờ duyệt' :
                      tab === 'SHIPPING' ? 'Đang giao' : 'Hoàn thành'}
                </button>
              ))}
            </div>

            <div className="relative flex-1 group w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-primary-soft transition-colors group-focus-within:text-primary" size={18} />
              <input
                type="text"
                placeholder="Tìm mã đơn, nhà cung cấp..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-11 pr-5 py-3 rounded-2xl bg-white/60 border border-primary-soft/30 text-sm focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all"
              />
            </div>

            <button className="flex items-center gap-3 bg-white/60 border border-primary-soft/30 rounded-2xl px-6 py-3 text-xs font-bold text-text-muted hover:bg-white transition-all">
              <Filter size={16} /> Bộ lọc
            </button>
          </div>
        </div>

        {/* List Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/40 text-text-muted text-[11px] font-bold uppercase tracking-widest border-b border-primary-soft/10">
                <th className="py-5 px-8">Mã đơn / Ngày tạo</th>
                <th className="py-5 px-6">Nhà cung cấp</th>
                <th className="py-5 px-6">Trạng thái</th>
                <th className="py-5 px-6">Số mặt hàng</th>
                <th className="py-5 px-6">Tổng giá trị</th>
                <th className="py-5 px-8 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-primary-soft/5">
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="animate-pulse bg-white/10">
                    <td className="py-5 px-8">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-2xl bg-primary-soft/10" />
                        <div className="space-y-2">
                          <div className="h-4 w-28 bg-primary-soft/15 rounded-lg" />
                          <div className="h-3 w-16 bg-primary-soft/10 rounded-lg" />
                        </div>
                      </div>
                    </td>
                    <td className="py-5 px-6">
                      <div className="space-y-2">
                        <div className="h-4 w-32 bg-primary-soft/15 rounded-lg" />
                        <div className="h-3 w-20 bg-primary-soft/10 rounded-lg" />
                      </div>
                    </td>
                    <td className="py-5 px-6">
                      <div className="h-7 w-24 bg-primary-soft/15 rounded-full" />
                    </td>
                    <td className="py-5 px-6">
                      <div className="h-4 w-20 bg-primary-soft/15 rounded-lg" />
                    </td>
                    <td className="py-5 px-6">
                      <div className="h-4 w-24 bg-primary-soft/15 rounded-lg" />
                    </td>
                    <td className="py-5 px-8">
                      <div className="h-8 w-8 bg-primary-soft/15 rounded-xl ml-auto" />
                    </td>
                  </tr>
                ))
              ) : filteredOrders.map((po, idx) => {
                const StatusIcon = STATUS_CONFIG[po.status as keyof typeof STATUS_CONFIG]?.icon || FileText;
                return (
                  <motion.tr
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    key={po.id}
                    className="group hover:bg-[#FFFAF4]/40 transition-all duration-300 cursor-pointer"
                  >
                    <td className="py-5 px-8" onClick={() => { }}>
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-2xl bg-primary/5 flex items-center justify-center text-primary border border-primary/10">
                          <FileText size={18} />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-text-primary group-hover:text-primary transition-colors">{po.id}</p>
                          <div className="flex items-center gap-2 text-[10px] text-text-muted font-bold mt-1">
                            <Calendar size={10} />
                            {po.date}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-5 px-6">
                      <p className="text-sm font-bold text-text-primary">{po.supplier}</p>
                      <p className="text-[10px] text-text-muted font-bold mt-1 uppercase tracking-tight">{po.branch}</p>
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
                      <div className="flex items-center gap-2 text-sm font-bold text-text-primary">
                        <Package size={14} className="text-primary-soft" />
                        {po.itemsCount} mặt hàng
                      </div>
                    </td>
                    <td className="py-5 px-6">
                      <p className="text-sm font-black text-text-primary">₫{po.total.toLocaleString('vi-VN')}</p>
                    </td>
                    <td className="py-5 px-8 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
                        <button
                          onClick={() => setViewingOrder(po)}
                          title="Xem chi tiết"
                          className="p-2 bg-white border border-primary-soft/30 rounded-xl text-text-muted hover:text-primary hover:border-primary/30 transition-all shadow-sm active:scale-95"
                        >
                          <Eye size={16} strokeWidth={2.5} />
                        </button>
                        <button
                          onClick={() => setEditingOrder(po)}
                          title="Sửa đơn hàng"
                          className="p-2 bg-white border border-primary-soft/30 rounded-xl text-text-muted hover:text-blue-600 hover:border-blue-200 transition-all shadow-sm active:scale-95"
                        >
                          <Edit2 size={16} strokeWidth={2.5} />
                        </button>
                        <button
                          title="Thao tác khác"
                          className="p-2 text-text-muted hover:bg-white border border-transparent hover:border-primary-soft/30 rounded-xl transition-all active:scale-95"
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
                      <div className="w-20 h-20 rounded-4xl bg-white/60 flex items-center justify-center text-text-muted/60 mb-4">
                        <ShoppingCart size={40} />
                      </div>
                      <p className="text-sm font-bold text-text-muted">Không tìm thấy đơn nhập hàng nào</p>
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
          <h3 className="text-sm font-black text-text-primary uppercase tracking-widest mb-6 flex items-center gap-2">
            <User size={18} className="text-primary" /> Nhà cung cấp hàng đầu
          </h3>
          <div className="space-y-4">
            {topSuppliers.map((sup, idx) => (
              <div
                key={idx}
                onClick={() => setViewingSupplier(sup)}
                className="p-4 bg-[#FFFAF4]/40 border border-primary-soft/20 rounded-3xl flex items-center justify-between group hover:border-primary/30 transition-all cursor-pointer active:scale-[0.98]"
              >
                <div>
                  <p className="text-sm font-bold text-text-primary">{sup.name}</p>
                  <p className="text-[10px] text-text-muted font-bold uppercase tracking-tight">{sup.total} đơn nhập thành công</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-black text-primary">{sup.amount}</p>
                  <ChevronRight size={14} className="text-primary-soft ml-auto mt-1 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            ))}
          </div>
        </GlassCard>

        <GlassCard className="p-8" radius="4xl">
          <h3 className="text-sm font-black text-text-primary uppercase tracking-widest mb-6 flex items-center gap-2">
            <AlertCircle size={18} className="text-primary" /> Lưu ý hệ thống
          </h3>
          <div className="space-y-4">
            {displayAlerts.map((alert, idx) => {
              const AlertIcon = alert.icon;
              return (
                <div key={idx} className={cn("p-5 rounded-3xl flex gap-4 border", alert.color)}>
                  <div className="p-2.5 bg-white rounded-2xl h-fit shadow-sm">
                    <AlertIcon size={18} />
                  </div>
                  <div>
                    <p className="text-xs font-black text-text-primary uppercase tracking-tight mb-1">{alert.title}</p>
                    <p className="text-xs text-text-muted leading-relaxed">{alert.desc}</p>
                  </div>
                </div>
              );
            })}
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
        orders={purchaseOrders}
        onClose={() => setViewingSupplier(null)}
        onViewOrder={(id) => {
          const order = purchaseOrders.find(p => p.id === id);
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



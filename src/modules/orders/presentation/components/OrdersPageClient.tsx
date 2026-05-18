'use client';

import { motion } from 'motion/react';
import {
  Search,
  Filter,
  Download,
  Eye,
  XCircle,
  ShoppingBag,
  Coffee,
  User,
  CreditCard,
  Calendar,
  MoreVertical
} from 'lucide-react';
import { GlassCard } from '@/shared/components/GlassCard';
import { cn } from '@/shared/utils/cn';
import { useState, useEffect, useRef } from 'react';
import { useOrders } from '@/modules/orders/presentation/hooks/useOrders';
import { OrderStatus, Order } from '@/modules/orders/domain/entities/order.entity';
import { OrderDetailsModal } from '@/modules/orders/presentation/components/modal/OrderDetailsModal';
import { ConfirmPaymentModal } from '@/modules/orders/presentation/components/modal/ConfirmPaymentModal';
import { StatusUpdateModal } from '@/modules/orders/presentation/components/modal/StatusUpdateModal';
import { CancelOrderModal } from '@/modules/orders/presentation/components/modal/CancelOrderModal';
import { toast } from 'react-toastify';
import { getStatusConfig } from '../../config/order-status.config';
import { getPaymentStatusConfig } from '../../config/payment-status.config';
import { StatsOverviewOrder } from '../../mocks/stats-overview-order.mock';

export default function OrdersPage() {
  const { orders, isLoading, refreshOrders } = useOrders();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [menuPos, setMenuPos] = useState({ top: 0, left: 0 });
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpenMenuId(null);
      }
    };
    const handleScroll = () => setOpenMenuId(null);
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('scroll', handleScroll, true);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('scroll', handleScroll, true);
    };
  }, []);

  const handleToggleMenu = (e: React.MouseEvent<HTMLButtonElement>, orderId: string) => {
    if (openMenuId === orderId) {
      setOpenMenuId(null);
      return;
    }
    const rect = e.currentTarget.getBoundingClientRect();
    setMenuPos({
      top: rect.top - 8,
      left: rect.right,
    });
    setOpenMenuId(orderId);
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerName?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order);
    setIsDetailsModalOpen(true);
  };

  const handleActionClick = (order: Order, type: 'payment' | 'status' | 'cancel') => {
    setSelectedOrder(order);
    if (type === 'payment') setIsPaymentModalOpen(true);
    else if (type === 'status') setIsStatusModalOpen(true);
    else if (type === 'cancel') setIsCancelModalOpen(true);
  };

  const handleConfirmPayment = async () => {
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    toast.success('Xác nhận thanh toán thành công!');
    setIsSubmitting(false);
    setIsPaymentModalOpen(false);
    refreshOrders();
  };

  const handleConfirmStatus = async () => {
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    toast.success('Đã cập nhật trạng thái chuẩn bị xong!');
    setIsSubmitting(false);
    setIsStatusModalOpen(false);
    refreshOrders();
  };

  const handleConfirmCancel = async () => {
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    toast.error('Đã hủy đơn hàng.');
    setIsSubmitting(false);
    setIsCancelModalOpen(false);
    refreshOrders();
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#2A1E17] tracking-tight">Quản lý Đơn hàng</h1>
          <p className="text-[#6F5A4A] mt-1 text-sm">Theo dõi, xử lý và cập nhật trạng thái đơn hàng thời gian thực.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white border border-[#D8B894]/30 text-sm font-bold text-[#6F5A4A] shadow-sm hover:shadow-md transition-all">
            <Download size={18} />
            Xuất báo cáo
          </button>
        </div>
      </div>

      <OrderDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        order={selectedOrder}
      />

      <ConfirmPaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        order={selectedOrder}
        onConfirm={handleConfirmPayment}
        isSubmitting={isSubmitting}
      />

      <StatusUpdateModal
        isOpen={isStatusModalOpen}
        onClose={() => setIsStatusModalOpen(false)}
        order={selectedOrder}
        onConfirm={handleConfirmStatus}
        isSubmitting={isSubmitting}
        title="Đồ uống đã sẵn sàng?"
        description="Xác nhận món đã pha chế xong và thông báo cho khách hàng đến lấy."
      />

      <CancelOrderModal
        isOpen={isCancelModalOpen}
        onClose={() => setIsCancelModalOpen(false)}
        order={selectedOrder}
        onConfirm={handleConfirmCancel}
        isSubmitting={isSubmitting}
      />

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {StatsOverviewOrder.map((stat, i) => (
          <GlassCard key={i} className="p-6" radius="3xl">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[11px] font-bold text-[#9A8677] uppercase tracking-widest">{stat.label}</p>
                <h3 className="text-2xl font-bold text-[#2A1E17] mt-1">{stat.value}</h3>
                <p className="text-[10px] text-[#6F5A4A] mt-1 flex items-center gap-1">
                  <span className="w-1 h-1 rounded-full bg-green-500" />
                  {stat.sub}
                </p>
              </div>
              <div className={cn("w-10 h-10 rounded-2xl flex items-center justify-center text-white", stat.color)}>
                <ShoppingBag size={20} />
              </div>
            </div>
          </GlassCard>
        ))}
      </div>

      {/* Filter & Search Bar */}
      <GlassCard className="p-4" radius="2xl">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9A8677]" size={20} />
            <input
              type="text"
              placeholder="Tìm mã đơn hàng, tên khách hàng..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-[#FFFAF4]/40 border border-[#D8B894]/20 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-[#2A1E17] placeholder:text-[#9A8677]/40"
            />
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-[#FFFAF4]/40 border border-[#D8B894]/20 rounded-2xl px-4 py-2">
              <span className="text-[11px] font-bold text-[#9A8677] uppercase tracking-widest">Trạng thái:</span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-transparent text-sm font-bold text-[#2A1E17] focus:outline-none cursor-pointer"
              >
                <option value="all">Tất cả</option>
                {Object.values(OrderStatus).map(status => (
                  <option key={status} value={status}>{getStatusConfig(status).label}</option>
                ))}
              </select>
            </div>
            <button className="p-3 bg-[#FFFAF4]/40 border border-[#D8B894]/20 rounded-2xl text-[#9A8677] hover:bg-white/60 transition-all">
              <Filter size={20} />
            </button>
          </div>
        </div>
      </GlassCard>

      {/* Orders Table */}
      <GlassCard className="overflow-visible" radius="3xl">
        <div className="overflow-x-auto w-full min-w-0">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#FFFAF4]/60 border-b border-[#D8B894]/10">
                <th className="py-4 px-6 text-[11px] font-bold text-[#9A8677] uppercase tracking-widest">Mã đơn hàng</th>
                <th className="py-4 px-6 text-[11px] font-bold text-[#9A8677] uppercase tracking-widest">Khách hàng</th>
                <th className="py-4 px-6 text-[11px] font-bold text-[#9A8677] uppercase tracking-widest">Thời gian</th>
                <th className="py-4 px-6 text-[11px] font-bold text-[#9A8677] uppercase tracking-widest">Tổng tiền</th>
                <th className="py-4 px-6 text-[11px] font-bold text-[#9A8677] uppercase tracking-widest">Thanh toán</th>
                <th className="py-4 px-6 text-[11px] font-bold text-[#9A8677] uppercase tracking-widest">Trạng thái</th>
                <th className="py-4 px-6 text-[11px] font-bold text-[#9A8677] uppercase tracking-widest text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan={7} className="py-4 px-6"><div className="h-12 bg-[#D8B894]/10 rounded-xl" /></td>
                  </tr>
                ))
              ) : filteredOrders.map((order) => {
                const status = getStatusConfig(order.status);
                const payment = getPaymentStatusConfig(order.paymentStatus);
                return (
                  <motion.tr
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    key={order.id}
                    className="border-b border-[#D8B894]/5 hover:bg-[#FFFAF4]/30 transition-all group"
                  >
                    <td className="py-4 px-6">
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-[#2A1E17] group-hover:text-primary transition-colors">{order.orderNumber}</span>
                        <span className="text-[10px] text-[#9A8677] flex items-center gap-1 mt-0.5">
                          {order.type === 'dine-in' ? `Bàn: ${order.tableNumber}` : order.type === 'take-away' ? 'Mang về' : 'Giao hàng'}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#8B5E3C]/10 flex items-center justify-center text-primary">
                          <User size={14} />
                        </div>
                        <span className="text-sm font-semibold text-[#6F5A4A]">{order.customerName || 'Khách vãng lai'}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-[12px] font-mono text-[#6F5A4A] flex items-center gap-1.5">
                        <Calendar size={12} className="text-[#9A8677]" />
                        {new Date(order.createdAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-sm font-bold text-[#2A1E17]">₫{order.totalAmount.toLocaleString('vi-VN')}</span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex flex-col">
                        <span className={cn("text-[11px] font-bold", payment.color)}>{payment.label}</span>
                        <span className="text-[10px] text-[#9A8677]">{order.paymentMethod}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className={cn(
                        "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold shadow-sm",
                        status.color
                      )}>
                        <status.icon size={12} />
                        {status.label}
                      </div>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2 text-[#9A8677]">
                        <button
                          onClick={() => handleViewOrder(order)}
                          className="p-2 hover:bg-primary/10 hover:text-primary rounded-xl transition-all"
                          title="Xem chi tiết"
                        >
                          <Eye size={18} />
                        </button>
                        <button
                          onClick={(e) => handleToggleMenu(e, order.id)}
                          className={`p-2 rounded-full transition-all ${openMenuId === order.id ? 'bg-[#8B5E3C]/10 text-primary' : 'hover:bg-[#8B5E3C]/10'}`}
                          title="Tùy chọn"
                        >
                          <MoreVertical size={20} className="text-[#9A8677]" />
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

      {/* Fixed-position Dropdown – renders outside all overflow containers */}
      {openMenuId && (() => {
        const order = filteredOrders.find(o => o.id === openMenuId);
        if (!order) return null;
        return (
          <div
            ref={menuRef}
            style={{
              position: 'fixed',
              top: menuPos.top,
              left: menuPos.left,
              transform: 'translate(-100%, -100%)',
              zIndex: 9999,
            }}
            className="w-64 bg-white rounded-[32px] shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-[#D8B894]/10 py-4 text-left"
          >
            <div className="px-4 pb-2 mb-2 border-b border-[#D8B894]/5">
              <p className="text-[10px] font-bold text-[#9A8677] uppercase tracking-widest">Xử lý nhanh</p>
            </div>
            <button
              onClick={() => { handleActionClick(order, 'status'); setOpenMenuId(null); }}
              className="w-full text-left px-6 py-3 text-sm font-bold text-[#6F5A4A] hover:bg-[#FFFAF4] hover:text-primary flex items-center gap-3 transition-colors"
            >
              <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shadow-sm">
                <Coffee size={16} />
              </div>
              Chuẩn bị xong
            </button>
            <button
              onClick={() => { handleActionClick(order, 'payment'); setOpenMenuId(null); }}
              className="w-full text-left px-6 py-3 text-sm font-bold text-[#6F5A4A] hover:bg-[#FFFAF4] hover:text-primary flex items-center gap-3 transition-colors"
            >
              <div className="w-8 h-8 rounded-xl bg-green-50 text-green-600 flex items-center justify-center shadow-sm">
                <CreditCard size={16} />
              </div>
              Xác nhận thanh toán
            </button>
            <div className="my-2 border-t border-[#D8B894]/5 mx-4" />
            <button
              onClick={() => { handleActionClick(order, 'cancel'); setOpenMenuId(null); }}
              className="w-full text-left px-6 py-3 text-sm font-bold text-red-500 hover:bg-red-50 flex items-center gap-3 transition-colors"
            >
              <div className="w-8 h-8 rounded-xl bg-red-50 text-red-500 flex items-center justify-center shadow-sm">
                <XCircle size={16} />
              </div>
              Hủy đơn hàng
            </button>
          </div>
        );
      })()}
    </div>
  );
}

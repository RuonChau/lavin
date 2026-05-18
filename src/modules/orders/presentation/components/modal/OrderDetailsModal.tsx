'use client';

import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Printer, 
  Clock, 
  CheckCircle2, 
  XCircle,
  User, 
  CreditCard, 
  ShoppingBag,
  MapPin,
  MessageSquare,
  Coffee,
  Timer
} from 'lucide-react';
import { GlassCard } from '@/shared/components/GlassCard';
import { Order, OrderStatus } from '@/modules/orders/domain/entities/order.entity';
import { cn } from '@/shared/utils/cn';
import { getStatusConfig } from '@/modules/orders/config/order-status.config';

interface OrderDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: Order | null;
}

export function OrderDetailsModal({ isOpen, onClose, order }: OrderDetailsModalProps) {
  if (!order) return null;


  const currentStatus = getStatusConfig(order.status);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[100] bg-black/20 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <div className="fixed inset-0 z-[101] flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="w-full max-w-3xl pointer-events-auto"
            >
              <GlassCard className="relative overflow-hidden flex flex-col max-h-[90vh]" radius="4xl">
                {/* Header */}
                <div className="p-6 border-b border-[#D8B894]/20 bg-white/40 flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                       <h2 className="text-xl font-bold text-[#2A1E17]">Đơn hàng {order.orderNumber}</h2>
                       <div className={cn(
                         "flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold shadow-sm",
                         currentStatus.color
                       )}>
                         <currentStatus.icon size={12} />
                         {currentStatus.label}
                       </div>
                    </div>
                    <p className="text-xs text-[#9A8677] mt-1 flex items-center gap-2">
                       <Timer size={12} />
                       Đặt lúc {new Date(order.createdAt).toLocaleString('vi-VN')}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="p-2.5 bg-[#FFFAF4] text-primary border border-primary/20 rounded-xl hover:bg-white transition-all shadow-sm">
                       <Printer size={20} />
                    </button>
                    <button 
                      onClick={onClose}
                      className="p-2.5 text-[#9A8677] hover:bg-white/60 rounded-xl transition-all"
                    >
                      <X size={20} />
                    </button>
                  </div>
                </div>

                {/* Body Content */}
                <div className="flex-1 overflow-y-auto p-0 flex flex-col md:flex-row">
                   {/* Left Column: Order Items */}
                   <div className="flex-1 p-8 space-y-6">
                      <div className="flex items-center justify-between">
                         <h3 className="text-sm font-bold text-[#2A1E17] uppercase tracking-wider">Danh sách món ({order.items.length})</h3>
                      </div>
                      
                      <div className="space-y-4">
                         {order.items.map((item, idx) => (
                           <div key={idx} className="flex gap-4 p-4 rounded-3xl bg-[#FFFAF4]/40 border border-[#D8B894]/10 hover:border-primary/20 transition-all group">
                              <div className="w-16 h-16 rounded-2xl overflow-hidden shadow-sm border border-white flex-shrink-0">
                                 <img 
                                   src={item.image || `https://picsum.photos/seed/${item.productId}/200/200`} 
                                   alt={item.productName} 
                                   className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                 />
                              </div>
                              <div className="flex-1 min-w-0">
                                 <div className="flex items-start justify-between">
                                    <h4 className="text-sm font-bold text-[#2A1E17] truncate">{item.productName}</h4>
                                    <span className="text-sm font-bold text-primary">₫{(item.price * item.quantity).toLocaleString('vi-VN')}</span>
                                 </div>
                                 <div className="flex items-center gap-2 mt-1">
                                    {item.size && (
                                      <span className="px-1.5 py-0.5 rounded-md bg-white border border-[#D8B894]/20 text-[10px] font-bold text-[#9A8677]">
                                        Size {item.size}
                                      </span>
                                    )}
                                    <span className="text-[11px] text-[#6F5A4A] font-medium">x{item.quantity}</span>
                                    <span className="text-[10px] text-[#9A8677]">(@ ₫{item.price.toLocaleString('vi-VN')})</span>
                                 </div>
                                 {item.note && (
                                   <div className="mt-2 flex items-center gap-1.5 p-2 rounded-xl bg-amber-50/50 border border-amber-100/50">
                                      <MessageSquare size={12} className="text-amber-600" />
                                      <p className="text-[10px] text-amber-700 italic">"{item.note}"</p>
                                   </div>
                                 )}
                              </div>
                           </div>
                         ))}
                      </div>

                      {/* Payment Summary */}
                      <div className="mt-8 pt-6 border-t border-[#D8B894]/20 space-y-3">
                         <div className="flex justify-between text-sm text-[#6F5A4A]">
                            <span>Tạm tính</span>
                            <span className="font-semibold">₫{order.totalAmount.toLocaleString('vi-VN')}</span>
                         </div>
                         <div className="flex justify-between text-sm text-[#6F5A4A]">
                            <span>Giảm giá</span>
                            <span className="font-semibold text-green-600">-₫0</span>
                         </div>
                         <div className="flex justify-between text-lg font-bold text-[#2A1E17] pt-2">
                            <span>Tổng tiền</span>
                            <span className="text-primary">₫{order.totalAmount.toLocaleString('vi-VN')}</span>
                         </div>
                      </div>
                   </div>

                   {/* Right Column: Order Info */}
                   <div className="w-full md:w-80 bg-[#FFFAF4]/60 border-l border-[#D8B894]/20 p-8 space-y-8">
                      {/* Customer Section */}
                      <div className="space-y-4">
                         <h3 className="text-[11px] font-bold text-[#9A8677] uppercase tracking-widest">Khách hàng</h3>
                         <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-primary shadow-sm border border-[#D8B894]/20">
                               <User size={20} />
                            </div>
                            <div>
                               <p className="text-sm font-bold text-[#2A1E17]">{order.customerName || 'Khách vãng lai'}</p>
                               <p className="text-[10px] text-[#9A8677]">Khách hàng thân thiết</p>
                            </div>
                         </div>
                      </div>

                      {/* Order Logistics */}
                      <div className="space-y-4">
                         <h3 className="text-[11px] font-bold text-[#9A8677] uppercase tracking-widest">Thông tin đơn hàng</h3>
                         <div className="space-y-3">
                            <div className="flex items-center gap-3 text-[#2A1E17]">
                               <div className="w-8 h-8 rounded-xl bg-white flex items-center justify-center text-[#9A8677] border border-[#D8B894]/20 shadow-sm">
                                  <ShoppingBag size={14} />
                               </div>
                               <div>
                                  <p className="text-[10px] font-bold uppercase text-[#9A8677] tracking-wider">Hình thức</p>
                                  <p className="text-xs font-bold">{order.type === 'dine-in' ? 'Ăn tại chỗ' : order.type === 'take-away' ? 'Mang về' : 'Giao hàng'}</p>
                               </div>
                            </div>
                            
                            {order.tableNumber && (
                              <div className="flex items-center gap-3 text-[#2A1E17]">
                                 <div className="w-8 h-8 rounded-xl bg-white flex items-center justify-center text-[#9A8677] border border-[#D8B894]/20 shadow-sm">
                                    <MapPin size={14} />
                                 </div>
                                 <div>
                                    <p className="text-[10px] font-bold uppercase text-[#9A8677] tracking-wider">Vị trí</p>
                                    <p className="text-xs font-bold">Bàn số {order.tableNumber}</p>
                                 </div>
                              </div>
                            )}

                            <div className="flex items-center gap-3 text-[#2A1E17]">
                               <div className="w-8 h-8 rounded-xl bg-white flex items-center justify-center text-[#9A8677] border border-[#D8B894]/20 shadow-sm">
                                  <CreditCard size={14} />
                               </div>
                               <div>
                                  <p className="text-[10px] font-bold uppercase text-[#9A8677] tracking-wider">Thanh toán</p>
                                  <p className="text-xs font-bold">{order.paymentMethod}</p>
                               </div>
                            </div>
                         </div>
                      </div>

                      {/* Timeline / Status Update History (Simulated) */}
                      <div className="space-y-4">
                        <h3 className="text-[11px] font-bold text-[#9A8677] uppercase tracking-widest">Tiến độ phục vụ</h3>
                        <div className="relative pl-6 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-px before:bg-[#D8B894]/30">
                           <div className="relative">
                              <div className="absolute -left-[1.65rem] top-1 w-3 h-3 rounded-full bg-green-500 border-2 border-white shadow-sm" />
                              <p className="text-[10px] font-bold text-[#2A1E17]">Đã xác nhận</p>
                              <p className="text-[9px] text-[#9A8677]">vài phút trước</p>
                           </div>
                           <div className="relative">
                              <div className={cn(
                                "absolute -left-[1.65rem] top-1 w-3 h-3 rounded-full border-2 border-white shadow-sm",
                                order.status === OrderStatus.PENDING ? "bg-[#D8B894]" : "bg-green-500"
                              )} />
                              <p className="text-[10px] font-bold text-[#2A1E17]">Đang chuẩn bị</p>
                              <p className="text-[9px] text-[#9A8677]">---</p>
                           </div>
                        </div>
                      </div>
                   </div>
                </div>

                {/* Footer Actions */}
                <div className="p-6 border-t border-[#D8B894]/20 bg-white/40 flex items-center justify-between gap-3">
                  <div className="flex gap-2">
                    <button className="px-4 py-2 rounded-xl text-xs font-bold text-red-500 hover:bg-red-50 transition-all border border-red-100">
                       Hủy đơn
                    </button>
                    <button className="px-4 py-2 rounded-xl text-xs font-bold text-[#6F5A4A] hover:bg-white/60 transition-all border border-[#D8B894]/30">
                       Chỉnh sửa
                    </button>
                  </div>
                  <div className="flex gap-3">
                    <button 
                      onClick={onClose}
                      className="px-6 py-2.5 rounded-2xl bg-white border border-[#D8B894]/30 text-sm font-bold text-[#6F5A4A] hover:shadow-md transition-all"
                    >
                      Đóng
                    </button>
                    {order.status !== OrderStatus.COMPLETED && (
                      <button 
                        className="px-8 py-2.5 rounded-2xl bg-[#8B5E3C] text-white text-sm font-bold shadow-lg shadow-[#8B5E3C]/20 hover:bg-[#5B3A29] transition-all flex items-center gap-2"
                      >
                        <CheckCircle2 size={18} />
                        Hoàn thành phục vụ
                      </button>
                    )}
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}

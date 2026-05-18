'use client';

import { motion, AnimatePresence } from 'motion/react';
import { X, Coffee, CheckCircle2, XCircle, Info, Tag, Calendar, DollarSign, Layers } from 'lucide-react';
import { GlassCard } from '@/shared/components/GlassCard';
import { cn } from '@/shared/utils/cn';
import { ProductDetailsModalProps } from '@/modules/products/types/product-details-modal-props.type';



export function ProductDetailsModal({ isOpen, onClose, product, categories }: ProductDetailsModalProps) {
  if (!product) return null;

  const categoryName = categories.find(c => c.id === product.categoryId)?.name || 'Chưa phân loại';

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
              className="w-full max-w-2xl pointer-events-auto"
            >
              <GlassCard className="relative overflow-hidden flex flex-col max-h-[90vh]" radius="4xl">
                {/* Header with Background Pattern */}
                <div className="relative h-32 bg-[#8B5E3C] overflow-hidden">
                   <div className="absolute inset-0 opacity-10 flex flex-wrap gap-4 p-4 pointer-events-none">
                      {Array.from({ length: 20 }).map((_, i) => (
                        <Coffee key={i} size={40} className="rotate-12" />
                      ))}
                   </div>
                   <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                   <button 
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-xl text-white transition-all z-10"
                   >
                    <X size={20} />
                   </button>
                </div>

                {/* Profile Image Overlay */}
                <div className="relative px-8 -mt-16">
                  <div className="flex items-end gap-6">
                    <div className="relative w-32 h-32 rounded-3xl overflow-hidden border-4 border-white shadow-xl bg-white">
                      {product.image ? (
                        <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full bg-[#primary-soft]/20 flex items-center justify-center text-primary">
                          <Coffee size={48} />
                        </div>
                      )}
                    </div>
                    <div className="pb-2">
                       <h2 className="text-2xl font-bold text-[#2A1E17] leading-tight">{product.name}</h2>
                       <div className="flex items-center gap-2 mt-1">
                          <span className="text-[10px] font-mono text-[#9A8677] uppercase tracking-wider bg-[#FFFAF4] px-2 py-0.5 rounded-md border border-[#D8B894]/20">
                            SKU: PROD-{product.id.split('-')[1] || '001'}
                          </span>
                          <div className={cn(
                            "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold",
                            product.isActive 
                              ? "bg-green-100 text-green-600" 
                              : "bg-red-100 text-red-600"
                          )}>
                            {product.isActive ? <CheckCircle2 size={10} /> : <XCircle size={10} />}
                            {product.isActive ? 'Đang bán' : 'Ngừng bán'}
                          </div>
                       </div>
                    </div>
                  </div>
                </div>

                {/* Body Content */}
                <div className="flex-1 overflow-y-auto p-8 pt-6 space-y-8">
                  {/* Status Badges Row */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                     <div className="p-3 rounded-2xl bg-white border border-[#D8B894]/10 shadow-sm">
                        <div className="flex items-center gap-2 text-[#9A8677] mb-1">
                           <Layers size={14} />
                           <span className="text-[10px] font-bold uppercase tracking-widest">Danh mục</span>
                        </div>
                        <p className="text-sm font-bold text-[#2A1E17] truncate">{categoryName}</p>
                     </div>
                     <div className="p-3 rounded-2xl bg-white border border-[#D8B894]/10 shadow-sm">
                        <div className="flex items-center gap-2 text-[#9A8677] mb-1">
                           <DollarSign size={14} />
                           <span className="text-[10px] font-bold uppercase tracking-widest">Giá cơ bản</span>
                        </div>
                        <p className="text-sm font-bold text-[#2A1E17]">₫{product.basePrice.toLocaleString('vi-VN')}</p>
                     </div>
                     <div className="p-3 rounded-2xl bg-white border border-[#D8B894]/10 shadow-sm">
                        <div className="flex items-center gap-2 text-[#9A8677] mb-1">
                           <Calendar size={14} />
                           <span className="text-[10px] font-bold uppercase tracking-widest">Khởi tạo</span>
                        </div>
                        <p className="text-sm font-bold text-[#2A1E17]">{new Date(product.createdAt).toLocaleDateString('vi-VN')}</p>
                     </div>
                     <div className="p-3 rounded-2xl bg-white border border-[#D8B894]/10 shadow-sm">
                        <div className="flex items-center gap-2 text-[#9A8677] mb-1">
                           <Tag size={14} />
                           <span className="text-[10px] font-bold uppercase tracking-widest">Kích cỡ</span>
                        </div>
                        <div className="flex items-center gap-1">
                           {(product as any).sizes?.length > 0 ? (product as any).sizes.map((s: string) => (
                             <span key={s} className="w-5 h-5 rounded-md bg-primary/10 text-primary flex items-center justify-center text-[10px] font-bold border border-primary/20">
                               {s}
                             </span>
                           )) : <span className="text-[10px] text-[#9A8677]">Mặc định</span>}
                        </div>
                     </div>
                  </div>

                  {/* Description Box */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 px-1">
                       <Info size={16} className="text-primary" />
                       <h3 className="text-sm font-bold text-[#2A1E17] uppercase tracking-wider">Mô tả sản phẩm</h3>
                    </div>
                    <div className="p-6 rounded-[32px] bg-[#FFFAF4]/40 border border-[#D8B894]/20 text-[#6F5A4A] text-sm leading-relaxed">
                      {product.description || 'Sản phẩm này hiện chưa có mô tả chi tiết từ quản trị viên. Vui lòng cập nhật thêm thông tin để khách hàng hiểu rõ hơn về hương vị và thành phần.'}
                    </div>
                  </div>

                  {/* Size Config Section */}
                  {(product as any).sizeConfigs && Object.keys((product as any).sizeConfigs).length > 0 && (
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 px-1">
                         <Layers size={16} className="text-primary" />
                         <h3 className="text-sm font-bold text-[#2A1E17] uppercase tracking-wider">Cấu hình chi tiết theo Size</h3>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                         {Object.entries((product as any).sizeConfigs).filter(([size]) => (product as any).sizes?.includes(size)).map(([size, config]: [string, any]) => (
                           <div key={size} className="p-4 rounded-2xl bg-white border border-[#D8B894]/20 shadow-sm flex flex-col gap-2">
                              <div className="flex items-center justify-between">
                                 <span className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-[10px] font-bold">
                                   {size}
                                 </span>
                                 <span className="text-xs font-bold text-primary">₫{config.price.toLocaleString('vi-VN')}</span>
                              </div>
                              <div className="mt-2 flex -space-x-2 overflow-hidden">
                                 {/* Simulating size-specific images if they exist in state or entity */}
                                 <div className="inline-block h-8 w-8 rounded-lg ring-2 ring-white bg-[#FFFAF4] flex items-center justify-center text-[#D8B894]">
                                    <Coffee size={14} />
                                 </div>
                              </div>
                           </div>
                         ))}
                      </div>
                    </div>
                  )}

                  {/* System Footnote */}
                  <div className="pt-4 text-center">
                    <p className="text-[10px] text-[#9A8677] italic italic">Thông tin sản phẩm được cập nhật lần cuối vào {new Date(product.updatedAt).toLocaleDateString('vi-VN')}</p>
                  </div>
                </div>

                {/* Footer Actions */}
                <div className="p-6 border-t border-[#D8B894]/20 bg-white/40 flex items-center justify-end gap-3">
                  <button 
                    onClick={onClose}
                    className="px-8 py-2.5 rounded-2xl bg-[#8B5E3C] text-white text-sm font-bold shadow-lg shadow-[#8B5E3C]/20 hover:bg-[#5B3A29] transition-all"
                  >
                    Đóng cửa sổ
                  </button>
                </div>
              </GlassCard>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}

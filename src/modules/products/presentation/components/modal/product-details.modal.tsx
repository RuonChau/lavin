'use client';

import { X, Coffee, CheckCircle2, XCircle, Info, Tag, Calendar, DollarSign, Layers } from 'lucide-react';
import { GlassCard } from '@/shared/components/GlassCard';
import { cn } from '@/shared/utils/cn';
import { ProductDetailsModalProps } from '@/modules/products/types/product-details-modal-props.type';
import { AntdModalShell } from '@/shared/ui/antd-modal-shell';



export function ProductDetailsModal({ isOpen, onClose, product, categories }: ProductDetailsModalProps) {
  if (!product) return null;
  console.log('product: ', product);

  const categoryName = categories.find(c => c.id === product.category_id)?.name || 'Chưa phân loại';

  return (
    <AntdModalShell open={isOpen} onClose={onClose} width={672} zIndex={1000}>
      <GlassCard className="relative overflow-hidden flex flex-col max-h-[90vh]" radius="4xl">
        {/* Header with Background Pattern */}
        <div className="relative h-32 bg-primary overflow-hidden">
          <div className="absolute inset-0 opacity-10 flex flex-wrap gap-4 p-4 pointer-events-none">
            {Array.from({ length: 20 }).map((_, i) => (
              <Coffee key={i} size={40} className="rotate-12" />
            ))}
          </div>
          <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent" />
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
              <h2 className="text-2xl font-bold text-text-primary leading-tight">{product.name}</h2>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-[10px] font-mono text-text-muted uppercase tracking-wider bg-[#FFFAF4] px-2 py-0.5 rounded-md border border-primary-soft/20">
                  SKU: {product.sku || 'N/A'}
                </span>
                <div className={cn(
                  "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold",
                  product.is_active
                    ? "bg-green-100 text-green-600"
                    : "bg-red-100 text-red-600"
                )}>
                  {product.is_active ? <CheckCircle2 size={10} /> : <XCircle size={10} />}
                  {product.is_active ? 'Đang bán' : 'Ngừng bán'}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Body Content */}
        <div className="flex-1 overflow-y-auto p-8 pt-6 space-y-8">
          {/* Status Badges Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-3 rounded-2xl bg-white border border-primary-soft/10 shadow-sm">
              <div className="flex items-center gap-2 text-text-muted mb-1">
                <Layers size={14} />
                <span className="text-[10px] font-bold uppercase tracking-widest">Danh mục</span>
              </div>
              <p className="text-sm font-bold text-text-primary truncate">{categoryName}</p>
            </div>
            <div className="p-3 rounded-2xl bg-white border border-primary-soft/10 shadow-sm">
              <div className="flex items-center gap-2 text-text-muted mb-1">
                <DollarSign size={14} />
                <span className="text-[10px] font-bold uppercase tracking-widest">Giá cơ bản</span>
              </div>
              <p className="text-sm font-bold text-text-primary">
                {product.base_price.toLocaleString(product.currency?.locale || 'vi-VN', {
                  style: 'currency',
                  currency: product.currency?.currency || 'VND',
                })}
              </p>
            </div>
            <div className="p-3 rounded-2xl bg-white border border-primary-soft/10 shadow-sm">
              <div className="flex items-center gap-2 text-text-muted mb-1">
                <Calendar size={14} />
                <span className="text-[10px] font-bold uppercase tracking-widest">Khởi tạo</span>
              </div>
              <p className="text-sm font-bold text-text-primary">{new Date(product.created_at).toLocaleDateString('vi-VN')}</p>
            </div>
            <div className="p-3 rounded-2xl bg-white border border-primary-soft/10 shadow-sm">
              <div className="flex items-center gap-2 text-text-muted mb-1">
                <Tag size={14} />
                <span className="text-[10px] font-bold uppercase tracking-widest">Kích cỡ</span>
              </div>
              <div className="flex items-center gap-1">
                {product.sizes?.length ? product.sizes.map((s) => (
                  <span key={s} className="w-5 h-5 rounded-md bg-primary/10 text-primary flex items-center justify-center text-[10px] font-bold border border-primary/20">
                    {s}
                  </span>
                )) : <span className="text-[10px] text-text-muted">Mặc định</span>}
              </div>
            </div>
          </div>

          {/* Description Box */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 px-1">
              <Info size={16} className="text-primary" />
              <h3 className="text-sm font-bold text-text-primary uppercase tracking-wider">Mô tả sản phẩm</h3>
            </div>
            <div className="p-6 rounded-4xl bg-[#FFFAF4]/40 border border-primary-soft/20 text-text-primary text-sm leading-relaxed">
              {product.description || 'Sản phẩm này hiện chưa có mô tả chi tiết từ quản trị viên. Vui lòng cập nhật thêm thông tin để khách hàng hiểu rõ hơn về hương vị và thành phần.'}
            </div>
          </div>

          {/* Size Config Section */}
          {product.sizeConfigs && Object.keys(product.sizeConfigs).length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 px-1">
                <Layers size={16} className="text-primary" />
                <h3 className="text-sm font-bold text-text-primary uppercase tracking-wider">Cấu hình chi tiết theo Size</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {product.variants?.map(variant => (
                  <div key={variant.size} className="p-4 rounded-2xl bg-white border border-primary-soft/20 shadow-sm flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-text-muted">
                        <Coffee size={14} />
                        <span className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-[10px] font-bold">
                          {variant.size}
                        </span>
                      </div>
                      <span className="text-xs font-bold text-primary">
                        {Number(variant.price).toLocaleString(product.currency?.locale || 'vi-VN', {
                          style: 'currency',
                          currency: product.currency?.currency || 'VND',
                        })}
                      </span>
                    </div>
                    <div className="mt-2 flex items-center space-x-3 overflow-hidden">
                      <span className="text-xs font-bold text-primary">
                        Đã bán: {variant.sold_count}
                      </span>
                    </div>
                    <div className="mt-2 flex items-center space-x-3 overflow-hidden">
                      <span className='text-xs text-primary font-bold'>Số lượng {variant.quantity} </span>
                    </div>
                  </div>
                ))
                }
              </div>
            </div>
          )}

          {/* System Footnote */}
          <div className="pt-4 text-center">
            <p className="text-[10px] text-text-muted italic">Thông tin sản phẩm được cập nhật lần cuối vào {new Date(product.updated_at).toLocaleDateString('vi-VN')}</p>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t border-primary-soft/20 bg-white/40 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-8 py-2.5 rounded-2xl bg-primary text-white text-sm font-bold shadow-lg shadow-primary/20 hover:bg-primary-deep transition-all"
          >
            Đóng cửa sổ
          </button>
        </div>
      </GlassCard>
    </AntdModalShell>
  );
}

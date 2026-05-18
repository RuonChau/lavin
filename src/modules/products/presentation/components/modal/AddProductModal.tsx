'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion, AnimatePresence } from 'motion/react';
import { X, Image as ImageIcon, Check, Loader2, Plus, XCircle, Save } from 'lucide-react';
import { GlassCard } from '@/shared/components/GlassCard';
import { cn } from '@/shared/utils/cn';
import { useState } from 'react';
import { ProductFormData, productSchema } from '../../../validations/add-product.schema';
import { SIZES } from '@/modules/products/domain/enum/product-size.enum';
import { AddProductModalProps } from '@/modules/products/types/product-modal-props.type';



export function AddProductModal({ isOpen, onClose, categories, onSubmit, isSubmitting }: AddProductModalProps) {
  const [sizeImages, setSizeImages] = useState<Record<string, string[]>>({
    'S': [],
    'M': [],
    'L': [],
  });

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: '',
      categoryId: '',
      basePrice: 0,
      baseCurrency: '₫',
      description: '',
      isActive: true,
      sizes: [],
      sizeConfigs: {
        'S': { price: 0 },
        'M': { price: 0 },
        'L': { price: 0 },
      }
    },
  });

  const selectedSizes = watch('sizes');

  const addMockImage = (size: string) => {
    if (sizeImages[size].length >= 5) return;
    const newImages = [...sizeImages[size], `https://picsum.photos/seed/${size}${sizeImages[size].length}/200/200`];
    setSizeImages({ ...sizeImages, [size]: newImages });
  };

  const removeImage = (size: string, index: number) => {
    const newImages = sizeImages[size].filter((_, i) => i !== index);
    setSizeImages({ ...sizeImages, [size]: newImages });
  };

  const handleFormSubmit = (data: ProductFormData) => {
    onSubmit(data);
  };

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
                {/* Header */}
                <div className="p-6 border-b border-[#D8B894]/20 flex items-center justify-between bg-white/40">
                  <div>
                    <h2 className="text-xl font-bold text-[#2A1E17]">Thêm sản phẩm mới</h2>
                    <p className="text-xs text-[#6F5A4A] mt-0.5">Điền thông tin chi tiết để tạo sản phẩm trong thực đơn.</p>
                  </div>
                  <button 
                    onClick={onClose}
                    className="p-2 text-[#9A8677] hover:bg-white/60 rounded-xl transition-all"
                  >
                    <X size={20} />
                  </button>
                </div>

                {/* Body */}
                <form id="add-product-form" onSubmit={handleSubmit(handleFormSubmit)} className="flex-1 overflow-y-auto p-8 space-y-6">
                  {/* Basic Info Group */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[11px] font-bold text-[#9A8677] uppercase tracking-widest ml-1">Tên sản phẩm</label>
                      <input 
                        {...register('name')}
                        type="text" 
                        placeholder="VD: Phê La Latte" 
                        className={cn(
                          "w-full glass-control rounded-2xl py-3 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-[#2A1E17] placeholder:text-[#9A8677]/40",
                          errors.name && "border-red-400"
                        )}
                      />
                      {errors.name && <p className="text-[10px] text-red-500 ml-1">{errors.name.message}</p>}
                    </div>

                    <div className="space-y-2">
                      <label className="text-[11px] font-bold text-[#9A8677] uppercase tracking-widest ml-1">Danh mục</label>
                      <select 
                        {...register('categoryId')}
                        className={cn(
                          "w-full glass-control rounded-2xl py-3 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-[#2A1E17] bg-white/40 appearance-none",
                          errors.categoryId && "border-red-400"
                        )}
                      >
                        <option value="">Chọn danh mục...</option>
                        {categories
                          .sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0))
                          .map(cat => {
                            let currentDepth = 0;
                            let parent = categories.find(c => c.id === cat.parentId);
                            while (parent) {
                              currentDepth++;
                              const nextParentId = parent.parentId;
                              parent = nextParentId ? categories.find(c => c.id === nextParentId) : undefined;
                            }
                            return (
                              <option key={cat.id} value={cat.id}>
                                {'\u00A0'.repeat(currentDepth * 3)}{cat.name}
                              </option>
                            );
                          })
                        }
                      </select>
                      {errors.categoryId && <p className="text-[10px] text-red-500 ml-1">{errors.categoryId.message}</p>}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[11px] font-bold text-[#9A8677] uppercase tracking-widest ml-1">Giá cơ bản</label>
                      <div className="flex gap-2">
                        <div className="flex-1">
                          <input 
                            {...register('basePrice', { valueAsNumber: true })}
                            type="number" 
                            placeholder="65,000" 
                            className={cn(
                              "w-full glass-control rounded-2xl py-3 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-[#2A1E17] placeholder:text-[#9A8677]/40",
                              errors.basePrice && "border-red-400"
                            )}
                          />
                        </div>
                        <div className="w-24">
                          <select 
                            {...register('baseCurrency')}
                            className="w-full glass-control rounded-2xl py-3 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-[#2A1E17] bg-white/40 appearance-none"
                          >
                            <option value="₫">₫ (VNĐ)</option>
                            <option value="$">$ (USD)</option>
                            <option value="€">€ (EUR)</option>
                          </select>
                        </div>
                      </div>
                      {errors.basePrice && <p className="text-[10px] text-red-500 ml-1">{errors.basePrice.message}</p>}
                    </div>

                    <div className="space-y-2">
                      <label className="text-[11px] font-bold text-[#9A8677] uppercase tracking-widest ml-1">Trạng thái bán</label>
                      <div className="flex items-center gap-3 p-3 glass-control rounded-2xl bg-white/40">
                         <input 
                           {...register('isActive')}
                           type="checkbox" 
                           id="is-active"
                           className="w-5 h-5 rounded-md border-[#D8B894]/40 text-primary focus:ring-primary/20 bg-white"
                         />
                         <label htmlFor="is-active" className="text-sm font-semibold text-[#6F5A4A] cursor-pointer">Cho phép bán ngay</label>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[11px] font-bold text-[#9A8677] uppercase tracking-widest ml-1">Mô tả sản phẩm</label>
                    <textarea 
                      {...register('description')}
                      rows={3}
                      placeholder="Thông tin chi tiết về sản phẩm..." 
                      className="w-full glass-control rounded-2xl py-3 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-[#2A1E17] placeholder:text-[#9A8677]/40 resize-none"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[11px] font-bold text-[#9A8677] uppercase tracking-widest ml-1">Kích cỡ (Size)</label>
                    <div className="flex gap-4">
                      {SIZES.map((size) => (
                        <label key={size} className="flex items-center gap-2 cursor-pointer group">
                          <input 
                            {...register('sizes')}
                            type="checkbox" 
                            value={size}
                            className="w-5 h-5 rounded-md border-[#D8B894]/40 text-primary focus:ring-primary/20 bg-white/50"
                          />
                          <span className={cn(
                            "text-sm font-bold transition-colors",
                            selectedSizes.includes(size) ? "text-primary" : "text-[#9A8677] group-hover:text-[#6F5A4A]"
                          )}>
                            Size {size}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Dynamic Image Uploads */}
                  {selectedSizes.length > 0 && (
                    <div className="space-y-6 pt-2">
                      <label className="text-[11px] font-bold text-[#9A8677] uppercase tracking-widest ml-1">Hình ảnh theo kích cỡ (Tối đa 5 ảnh/size)</label>
                      <div className="space-y-8">
                        {selectedSizes.map((size) => (
                          <div key={size} className="space-y-4 p-5 rounded-[24px] bg-[#FFFAF4]/50 border border-[#D8B894]/10">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="w-7 h-7 rounded-full bg-[#8B5E3C] text-white flex items-center justify-center text-xs font-bold shadow-md">
                                {size}
                              </span>
                              <p className="text-sm font-bold text-[#2A1E17] uppercase tracking-wider">Cấu hình Size {size}</p>
                              <span className="text-[10px] text-[#9A8677] font-medium ml-auto">Tối đa 5 ảnh</span>
                            </div>

                            {/* Price per Size */}
                            <div className="space-y-1.5">
                              <label className="text-[10px] font-bold text-[#9A8677] uppercase tracking-widest ml-1">Giá bán Size {size}</label>
                              <div className="relative">
                                <input 
                                  {...register(`sizeConfigs.${size}.price` as any, { valueAsNumber: true })}
                                  type="number" 
                                  placeholder="0"
                                  className="w-full glass-control rounded-xl py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-[#2A1E17] placeholder:text-[#9A8677]/40"
                                />
                              </div>
                            </div>
                            
                            <div className="space-y-2">
                              <label className="text-[10px] font-bold text-[#9A8677] uppercase tracking-widest ml-1 text-xs">Hình ảnh Size {size}</label>
                              <div className="flex flex-wrap gap-3">
                                {/* Existing Previews */}
                                {sizeImages[size].map((img, idx) => (
                                  <div key={idx} className="relative w-[72px] h-[72px] rounded-xl overflow-hidden border border-[#D8B894]/30 shadow-sm transition-transform hover:scale-[1.02]">
                                    <img src={img} alt={`Preview ${size} ${idx}`} className="w-full h-full object-cover" />
                                    <button 
                                      type="button"
                                      onClick={() => removeImage(size, idx)}
                                      className="absolute -top-0.5 -right-0.5 p-0.5 bg-white rounded-full shadow-md text-red-500 hover:text-red-600 border border-slate-100"
                                    >
                                      <XCircle size={14} />
                                    </button>
                                  </div>
                                ))}

                                {/* Add Button */}
                                {sizeImages[size].length < 5 && (
                                  <button
                                    type="button"
                                    onClick={() => addMockImage(size)}
                                    className="w-[110px] h-[72px] rounded-xl border-1.5 border-dashed border-[#8B5E3C]/30 bg-[#8B5E3C]/5 flex flex-col items-center justify-center gap-1 transition-all hover:bg-[#8B5E3C]/10 hover:border-[#8B5E3C]/50"
                                  >
                                    <div className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center shadow-sm">
                                      <Plus size={14} strokeWidth={3} />
                                    </div>
                                    <span className="text-[10px] font-bold text-primary">Thêm ảnh</span>
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </form>

                {/* Footer */}
                <div className="p-6 border-t border-[#D8B894]/20 bg-white/40 flex items-center justify-end gap-3">
                  <button 
                    type="button"
                    onClick={onClose}
                    className="px-6 py-2.5 rounded-2xl border border-[#D8B894]/30 text-sm font-bold text-[#6F5A4A] hover:bg-white/60 transition-all"
                  >
                    Hủy bỏ
                  </button>
                  <button 
                    form="add-product-form"
                    type="submit"
                    disabled={isSubmitting}
                    className="flex items-center gap-2 px-8 py-2.5 rounded-2xl bg-primary text-white text-sm font-bold shadow-lg shadow-primary/20 hover:bg-primary-deep transition-all disabled:opacity-70"
                  >
                    {isSubmitting ? (
                      <Loader2 size={18} className="animate-spin" />
                    ) : (
                      <Save size={18} />
                    )}
                    Lưu bảng nháp
                  </button>
                  <button 
                    form="add-product-form"
                    type="submit"
                    disabled={isSubmitting}
                    className="flex items-center gap-2 px-8 py-2.5 rounded-2xl bg-primary text-white text-sm font-bold shadow-lg shadow-primary/20 hover:bg-primary-deep transition-all disabled:opacity-70"
                  >
                    {isSubmitting ? (
                      <Loader2 size={18} className="animate-spin" />
                    ) : (
                      <Check size={18} />
                    )}
                    Lưu sản phẩm
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

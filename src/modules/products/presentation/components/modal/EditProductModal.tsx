'use client';

import { useForm, type FieldPath } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { X, Loader2, Plus, XCircle, PencilLine, Save } from 'lucide-react';
import { GlassCard } from '@/shared/components/GlassCard';
import { cn } from '@/shared/utils/cn';
import { useState, useEffect, useRef } from 'react';
import { EditProductFormData, editProductSchema } from '@/modules/products/validations/edit-product.schema';
import { EditProductModalProps } from '@/modules/products/types/edit-product-modal-props.type';
import { AntdModalShell } from '@/shared/ui/antdModalShell';

type SizeImagePreview = {
  id: string;
  previewUrl: string;
};

function getCurrencyLocale(currency: string) {
  if (currency === 'USD') return 'en-US';
  if (currency === 'EUR') return 'de-DE';
  return 'vi-VN';
}

export function EditProductModal({
  isOpen,
  onClose,
  product,
  categories,
  onSubmit,
  isSubmitting,
  isLoadingProductDetail,
}: EditProductModalProps) {
  const [sizeImages, setSizeImages] = useState<Record<string, SizeImagePreview[]>>({
    'S': [],
    'M': [],
    'L': [],
  });
  const formScrollRef = useRef<HTMLFormElement | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<EditProductFormData>({
    resolver: zodResolver(editProductSchema),
  });

  // Initialize form when product changes
  useEffect(() => {
    if (product) {
      reset({
        name: product.name,
        categoryId: product.category_id,
        base_price: product.base_price,
        currency: product.currency ?? {
          currency: 'VND',
          locale: 'vi-VN',
        },
        description: product.description || '',
        is_active: product.is_active,
        sizes: product.sizes || [],
        sizeConfigs: product.sizeConfigs || {
          'S': { price: 0 },
          'M': { price: 0 },
          'L': { price: 0 },
        },
      });
      setSizeImages({
        'S': (product.sizeImages?.S || []).map((url, index) => ({ id: `S-${index}-${url}`, previewUrl: url })),
        'M': (product.sizeImages?.M || []).map((url, index) => ({ id: `M-${index}-${url}`, previewUrl: url })),
        'L': (product.sizeImages?.L || []).map((url, index) => ({ id: `L-${index}-${url}`, previewUrl: url })),
      });
    }
  }, [product, reset]);

  const selectedSizes = watch('sizes') || [];

  const addLocalImages = (size: string, files: FileList | null) => {
    if (!files?.length) return;

    const availableSlots = Math.max(0, 5 - sizeImages[size].length);
    const nextImages = Array.from(files)
      .filter((file) => file.type.startsWith('image/'))
      .slice(0, availableSlots)
      .map((file) => ({
        id: `${size}-${file.name}-${file.lastModified}-${crypto.randomUUID()}`,
        previewUrl: URL.createObjectURL(file),
      }));

    if (nextImages.length === 0) return;

    setSizeImages({
      ...sizeImages,
      [size]: [...sizeImages[size], ...nextImages],
    });
  };

  const removeImage = (size: string, index: number) => {
    const removedImage = sizeImages[size][index];
    if (removedImage?.previewUrl.startsWith('blob:')) URL.revokeObjectURL(removedImage.previewUrl);

    const newImages = sizeImages[size].filter((_, i) => i !== index);
    setSizeImages({ ...sizeImages, [size]: newImages });
  };

  const restoreFormScroll = (scrollTop: number | undefined) => {
    if (scrollTop === undefined) return;

    requestAnimationFrame(() => {
      if (formScrollRef.current) formScrollRef.current.scrollTop = scrollTop;
    });
  };

  const handleFormSubmit = (data: EditProductFormData) => {
    onSubmit(data);
  };

  if (!product) return null;

  return (
    <AntdModalShell
      open={isOpen}
      onClose={onClose}
      width={672}
      zIndex={1000}
      className="[&_.ant-modal-content]:max-h-[calc(100vh-48px)]!"
    >
      <GlassCard className="relative flex max-h-[calc(100vh-48px)] min-h-0 w-full flex-col overflow-hidden">
        {/* Header */}
        <div className="shrink-0 p-6 border-b border-primary-soft/20 flex items-center justify-between bg-white/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
              <PencilLine size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-text-primary">Chỉnh sửa sản phẩm</h2>
              <p className="text-xs text-text-secondary mt-0.5">Cập nhật thông tin chi tiết cho {product.name}</p>
            </div>
          </div>
          <button onClick={onClose}
            className="p-2 text-text-muted hover:bg-white/60 rounded-xl transition-all"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <form
          ref={formScrollRef}
          id="edit-product-form"
          onSubmit={handleSubmit(handleFormSubmit)}
          className={cn(
            "max-h-[calc(100vh-230px)] overflow-y-auto overscroll-contain p-8 space-y-6 transition-opacity",
            isLoadingProductDetail && "pointer-events-none opacity-60"
          )}
        >
          {isLoadingProductDetail && (
            <div className="flex items-center gap-2 rounded-2xl border border-primary-soft/20 bg-white/60 px-4 py-3 text-xs font-bold text-primary">
              <Loader2 size={16} className="animate-spin" />
              Đang tải dữ liệu mới nhất...
            </div>
          )}
          {/* Basic Info Group */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-text-muted uppercase tracking-widest ml-1">Tên sản phẩm</label>
              <input 
                {...register('name')}
                type="text" 
                placeholder="VD: Phê La Latte" 
                className={cn(
                  "w-full glass-control rounded-2xl py-3 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-text-primary placeholder:text-text-muted/40",
                  errors.name && "border-red-400"
                )}
              />
              {errors.name && <p className="text-[10px] text-red-500 ml-1">{errors.name.message}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-bold text-text-muted uppercase tracking-widest ml-1">Danh mục</label>
              <select 
                {...register('categoryId')}
                className={cn(
                  "w-full glass-control rounded-2xl py-3 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-text-primary bg-white/40 appearance-none",
                  errors.categoryId && "border-red-400"
                )}
              >
                <option value="">Chọn danh mục...</option>
                {categories
                  .sort((a, b) => (a.display_order || 0) - (b.display_order || 0))
                  .map(cat => {
                    let currentDepth = 0;
                    let parent = categories.find(c => c.id === cat.parent_id);
                    while (parent) {
                      currentDepth++;
                      const nextParentId = parent.parent_id;
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
              <label className="text-[11px] font-bold text-text-muted uppercase tracking-widest ml-1">Giá cơ bản</label>
              <div className="flex gap-2">
                <div className="flex-1">
                  <input 
                    {...register('base_price', { valueAsNumber: true })}
                    type="number" 
                    className={cn(
                      "w-full glass-control rounded-2xl py-3 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-text-primary placeholder:text-text-muted/40",
                      errors.base_price && "border-red-400"
                    )}
                  />
                </div>
                <div className="w-24">
                  <select 
                    {...register('currency.currency', {
                      onChange: (event) => {
                        setValue('currency.locale', getCurrencyLocale(event.target.value), {
                          shouldValidate: true,
                        });
                      },
                    })}
                    className="w-full glass-control rounded-2xl py-3 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-text-primary bg-white/40 appearance-none"
                  >
                    <option value="VND">VND</option>
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                  </select>
                  <input type="hidden" {...register('currency.locale')} />
                </div>
              </div>
              {errors.base_price && <p className="text-[10px] text-red-500 ml-1">{errors.base_price.message}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-bold text-text-muted uppercase tracking-widest ml-1">Trạng thái bán</label>
              <div className="flex items-center gap-3 p-3 glass-control rounded-2xl bg-white/40">
                  <input 
                    {...register('is_active')}
                    type="checkbox" 
                    id="edit-is-active"
                    className="w-5 h-5 rounded-md border-primary-soft/40 text-primary focus:ring-primary/20 bg-white"
                  />
                  <label htmlFor="edit-is-active" className="text-sm font-semibold text-text-secondary cursor-pointer">Cho phép bán ngay</label>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[11px] font-bold text-text-muted uppercase tracking-widest ml-1">Mô tả sản phẩm</label>
            <textarea 
              {...register('description')}
              rows={3}
              className="w-full glass-control rounded-2xl py-3 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-text-primary placeholder:text-text-muted/40 resize-none"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[11px] font-bold text-text-muted uppercase tracking-widest ml-1">Kích cỡ (Size)</label>
            <div className="flex gap-4">
              {['S', 'M', 'L'].map((size) => (
                <label key={size} className="flex items-center gap-2 cursor-pointer group">
                  <input 
                    {...register('sizes')}
                    type="checkbox" 
                    value={size}
                    className="w-5 h-5 rounded-md border-primary-soft/40 text-primary focus:ring-primary/20 bg-white/50"
                  />
                  <span className={cn(
                    "text-sm font-bold transition-colors",
                    selectedSizes.includes(size) ? "text-primary" : "text-text-muted group-hover:text-text-secondary"
                  )}>
                    Size {size}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Dynamic Configs */}
          {selectedSizes.length > 0 && (
            <div className="space-y-6 pt-2">
              <label className="text-[11px] font-bold text-text-muted uppercase tracking-widest ml-1">Cấu hình theo kích cỡ</label>
              <div className="space-y-8">
                {selectedSizes.map((size) => (
                  <div key={size} className="space-y-4 p-5 rounded-3xl bg-[#FFFAF4]/50 border border-primary-soft/10">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="w-7 h-7 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold shadow-md">
                        {size}
                      </span>
                      <p className="text-sm font-bold text-text-primary uppercase tracking-wider">Cấu hình Size {size}</p>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest ml-1">Giá bán Size {size}</label>
                      <div className="relative">
                        <input 
                          {...register(`sizeConfigs.${size}.price` as FieldPath<EditProductFormData>, { valueAsNumber: true })}
                          type="number" 
                          placeholder="0"
                          className="w-full glass-control rounded-xl py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-text-primary"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest ml-1">Hình ảnh Size {size}</label>
                      <div className="flex flex-wrap gap-3">
                        {sizeImages[size]?.map((image, idx) => (
                          <div key={image.id} className="relative w-18 h-18 rounded-xl overflow-hidden border border-primary-soft/30 shadow-sm transition-transform hover:scale-[1.02]">
                            <img src={image.previewUrl} alt={`Preview ${size} ${idx}`} className="w-full h-full object-cover" />
                            <button 
                              type="button"
                              onClick={() => removeImage(size, idx)}
                              className="absolute -top-0.5 -right-0.5 p-0.5 bg-white rounded-full shadow-md text-red-500 hover:text-red-600 border border-slate-100"
                            >
                              <XCircle size={14} />
                            </button>
                          </div>
                        ))}

                        {sizeImages[size]?.length < 5 && (
                          <label
                            className="w-27.5 h-18 rounded-xl border-1.5 border-dashed border-primary-soft/30 bg-primary-soft/5 flex flex-col items-center justify-center gap-1 transition-all hover:bg-primary-soft/10 hover:border-primary-soft/50"
                          >
                            <input
                              type="file"
                              accept="image/*"
                              multiple
                              className="sr-only"
                              onChange={(event) => {
                                const scrollTop = formScrollRef.current?.scrollTop;
                                addLocalImages(size, event.target.files);
                                event.target.value = '';
                                event.currentTarget.blur();
                                restoreFormScroll(scrollTop);
                              }}
                            />
                            <div className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center shadow-sm">
                              <Plus size={14} strokeWidth={3} />
                            </div>
                            <span className="text-[10px] font-bold text-primary">Thêm ảnh</span>
                          </label>
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
        <div className="shrink-0 p-6 border-t border-primary-soft/20 bg-white/40 flex items-center justify-end gap-3">
          <button 
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 rounded-2xl border border-primary-soft/30 text-sm font-bold text-text-primary hover:bg-white/60 transition-all"
          >
            Hủy bỏ
          </button>
          <button 
            form="edit-product-form"
            type="submit"
            disabled={isSubmitting}
            className="flex items-center gap-2 px-8 py-2.5 rounded-2xl bg-primary text-white text-sm font-bold shadow-lg shadow-primary/20 hover:bg-primary-deep transition-all disabled:opacity-70"
          >
            {isSubmitting ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <Save size={18} />
            )}
            Cập nhật sản phẩm
          </button>
        </div>
      </GlassCard>
    </AntdModalShell>
  );
}

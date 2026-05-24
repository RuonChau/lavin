'use client';

import { Controller, useForm, type FieldPath } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { X, Check, Loader2, Plus, XCircle, Save, ChevronDown } from 'lucide-react';
import { GlassCard } from '@/shared/components/GlassCard';
import { cn } from '@/shared/utils/cn';
import { useEffect, useRef, useState, type BaseSyntheticEvent } from 'react';
import { ProductFormData, productSchema } from '../../../validations/add-product.schema';
import { SIZES } from '@/modules/products/domain/enum/product-size.enum';
import { AddProductModalProps, type VariantImageItem } from '@/modules/products/types/product-modal-props.type';
import { AntdModalShell } from '@/shared/ui/antdModalShell';
import { InputNumber, Select } from 'antd';
import { currencies } from '@/shared/constants/currencies';
import PriceInput from '@/shared/ui/input-number';
import InputNumberCustom from '@/shared/ui/input-number';


export function AddProductModal({ isOpen, onClose, categories, onSubmit, isSubmitting }: AddProductModalProps) {
  const [sizeImages, setSizeImages] = useState<Record<string, VariantImageItem[]>>({
    'S': [],
    'M': [],
    'L': [],
  });
  const formScrollRef = useRef<HTMLFormElement | null>(null);
  const sizeImagesRef = useRef(sizeImages);
  sizeImagesRef.current = sizeImages;
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});
  const savedScrollRef = useRef<number>(0);

  const {
    register,
    handleSubmit,
    setValue,
    control,
    watch,
    formState: { errors },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: '',
      categoryId: '',
      base_price: undefined,
      currency: {
        currency: "VND",
        locale: "vi-VN"
      },
      description: '',
      is_active: true,
      sizes: [],
      sizeConfigs: {
        'S': { price: 0 },
        'M': { price: 0 },
        'L': { price: 0 },
      }
    },
  });

  const selectedSizes = watch('sizes');

  useEffect(() => {
    return () => {
      Object.values(sizeImagesRef.current).flat().forEach((image) => URL.revokeObjectURL(image.previewUrl));
    };
  }, []);

  const addLocalImages = (size: string, files: FileList | null) => {
    if (!files?.length) return;

    const availableSlots = Math.max(0, 5 - sizeImages[size].length);
    const nextImages = Array.from(files)
      .filter((file) => file.type.startsWith('image/'))
      .slice(0, availableSlots)
      .map((file) => ({
        id: `${size}-${file.name}-${file.lastModified}-${crypto.randomUUID()}`,
        file,
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
    if (removedImage) URL.revokeObjectURL(removedImage.previewUrl);

    const newImages = sizeImages[size].filter((_, i) => i !== index);
    setSizeImages({ ...sizeImages, [size]: newImages });
  };

  const handleFormSubmit = (data: ProductFormData, event?: BaseSyntheticEvent) => {
    const submitter = (event?.nativeEvent as SubmitEvent | undefined)?.submitter as HTMLButtonElement | null;
    const is_draft = submitter?.dataset.draft === 'true';

    onSubmit(data, {
      is_draft,
      size_images: sizeImages,
    });
  };

  return (
    <AntdModalShell open={isOpen} onClose={onClose} width={672} zIndex={1000} className="[&_.ant-modal-content]:max-h-[calc(100vh-48px)]!">
      <GlassCard className="relative flex max-h-[calc(100vh-48px)] min-h-0 flex-col overflow-hidden" radius="4xl">
        {/* Header */}
        <div className="shrink-0 p-6 border-b border-primary-soft/20 flex items-center justify-between bg-white/40">
          <div>
            <h2 className="text-xl font-bold text-text-primary">Thêm sản phẩm mới</h2>
            <p className="text-xs text-text-secondary mt-0.5">Điền thông tin chi tiết để tạo sản phẩm trong thực đơn.</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-text-muted hover:bg-white/60 rounded-xl transition-all"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <form
          ref={formScrollRef}
          id="add-product-form"
          onSubmit={handleSubmit(handleFormSubmit)}
          className="max-h-3/4 overflow-y-auto overscroll-contain px-8 py-4 space-y-6"
        >
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
                <option value="">Chọn danh mục</option>
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
              <label className="ml-1 text-[11px] font-bold uppercase tracking-widest text-text-muted">
                Giá cơ bản
              </label>

              <div className="flex w-full items-center gap-2">
                <div className="min-w-0 flex-1">
                  <Controller
                    name="base_price"
                    control={control}
                    defaultValue={undefined}
                    render={({ field }) => (
                      // <InputNumber
                      //   value={field.value ?? undefined}
                      //   onChange={(value) => {
                      //     field.onChange(value === null ? undefined : value);
                      //   }}
                      //   controls={false}
                      //   placeholder="65,000"
                      //   status={errors.base_price ? "error" : undefined}
                      //   formatter={(value) =>
                      //     value ? `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",") : ""
                      //   }
                      //   parser={(value) => {
                      //     const cleaned = value?.replace(/[^\d]/g, "");

                      //     if (!cleaned) {
                      //       return undefined as unknown as number;
                      //     }

                      //     return Number(cleaned);
                      //   }}
                      //   className={cn(
                      //     "w-full! h-[46px]! rounded-2xl! p-0!",
                      //     "bg-[rgba(255,250,244,0.82)]!",
                      //     "backdrop-blur-[14px]!",
                      //     "border! border-[rgba(216,184,148,0.32)]!",
                      //     "shadow-none! transition-all!",
                      //     "hover:border-[rgba(216,184,148,0.5)]!",
                      //     "focus-within:border-[rgba(216,184,148,0.5)]!",
                      //     "focus-within:shadow-[0_0_0_2px_rgba(216,184,148,0.18)]!",
                      //     "[&_.ant-input-number-input-wrap]:w-full!",
                      //     "[&_.ant-input-number-input-wrap]:h-full!",
                      //     "[&_.ant-input-number-input]:h-[44px]!",
                      //     "[&_.ant-input-number-input]:px-4!",
                      //     "[&_.ant-input-number-input]:text-sm!",
                      //     "[&_.ant-input-number-input]:bg-transparent!",
                      //     "[&_.ant-input-number-input]:outline-none!",
                      //     "[&_.ant-input-number-input]:text-text-primary!",
                      //     "[&_.ant-input-number-input::placeholder]:text-text-muted/40!",
                      //     errors.base_price && "border-red-400!"
                      //   )}
                      // />
                      <InputNumberCustom
                        value={field.value}
                        onChange={field.onChange}
                        error={!!errors.base_price}
                        placeholder="45,000"
                      />
                    )}
                  />
                </div>

                <div className="w-24 shrink-0">
                  <Controller
                    name="currency.currency"
                    control={control}
                    render={({ field }) => (
                      <div className="glass-control flex h-[46px] w-full items-center rounded-2xl bg-white/40 px-1.5 transition-all focus-within:ring-2 focus-within:ring-primary/20">
                        <Select
                          variant="borderless"
                          value={field.value}
                          onChange={(value) => {
                            field.onChange(value);

                            const selectedCountry = currencies.find(
                              (country) => country.currency === value
                            );

                            setValue("currency.locale", selectedCountry?.locale ?? "vi-VN", {
                              shouldValidate: true,
                              shouldDirty: true,
                            });
                          }}
                          className="
                w-full
                text-sm
                text-text-primary
                [&_.ant-select-selector]:bg-transparent!
                [&_.ant-select-selection-item]:text-sm!
                [&_.ant-select-selection-item]:text-text-primary!
              "
                          suffixIcon={
                            <ChevronDown size={16} className="text-text-muted" />
                          }
                          options={currencies.map((country) => ({
                            value: country.currency,
                            label: country.currency,
                          }))}
                        />
                      </div>
                    )}
                  />
                </div>
              </div>

              {errors.base_price && (
                <p className="ml-1 text-[10px] text-red-500">
                  {errors.base_price.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-bold text-text-muted uppercase tracking-widest ml-1">Trạng thái bán</label>
              <div className="flex items-center gap-3 p-3 glass-control rounded-2xl bg-white/40">
                <input
                  {...register('is_active')}
                  type="checkbox"
                  id="is-active"
                  className="w-5 h-5 rounded-md border-primary-soft/40 text-primary focus:ring-primary/20 bg-white"
                />
                <label htmlFor="is-active" className="text-sm font-semibold text-text-secondary cursor-pointer">Cho phép bán ngay</label>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[11px] font-bold text-text-muted uppercase tracking-widest ml-1">Mô tả sản phẩm</label>
            <textarea
              {...register('description')}
              rows={3}
              placeholder="Thông tin chi tiết về sản phẩm..."
              className="w-full glass-control rounded-2xl py-3 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-text-primary placeholder:text-text-muted/40 resize-none"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[11px] font-bold text-text-muted uppercase tracking-widest ml-1">Kích cỡ (Size)</label>
            <div className="flex mt-3 gap-4">
              {SIZES.map((size) => (
                <label key={size} className="flex items-center gap-2 cursor-pointer group">
                  <input
                    {...register('sizes')}
                    type="checkbox"
                    value={size}
                    className="w-5 h-5 rounded-md border-primary-soft/40 text-primary focus:ring-primary/20 bg-white/50"
                  />
                  <span className={cn(
                    "text-sm font-bold transition-colors",
                    selectedSizes.includes(size) ? "text-primary" : "text-text-muted group-hover:text-text-primary"
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
              <label className="text-[11px] font-bold text-text-muted uppercase tracking-widest ml-1">Hình ảnh theo kích cỡ (Tối đa 5 ảnh/size)</label>
              <div className="space-y-8">
                {selectedSizes.map((size) => (
                  <div key={size} className="space-y-4 p-5 rounded-3xl bg-[#FFFAF4]/50 border border-primary-soft/20">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="w-7 h-7 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold shadow-md">
                        {size}
                      </span>
                      <p className="text-sm font-bold text-text-primary uppercase tracking-wider">Cấu hình Size {size}</p>
                      <span className="text-[10px] text-text-muted font-medium ml-auto">Tối đa 5 ảnh</span>
                    </div>

                    {/* Price per Size */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest ml-1">Giá bán Size {size}</label>
                      <div className="relative">
                        <input
                          {...register(`sizeConfigs.${size}.price` as FieldPath<ProductFormData>, { valueAsNumber: true })}
                          type="number"
                          placeholder="0"
                          className="w-full glass-control rounded-xl py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-text-primary placeholder:text-text-muted/40"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest ml-1 text-xs">Hình ảnh Size {size}</label>
                      <div className="flex flex-wrap gap-3">
                        {/* Existing Previews */}
                        {sizeImages[size].map((image, idx) => (
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

                        {/* Add Button */}
                        {sizeImages[size].length < 5 && (
                          <>
                            <input
                              ref={(el) => { fileInputRefs.current[size] = el; }}
                              type="file"
                              accept="image/*"
                              multiple
                              tabIndex={-1}
                              aria-hidden="true"
                              style={{ position: 'fixed', opacity: 0, pointerEvents: 'none', width: 0, height: 0 }}
                              onChange={(event) => {
                                addLocalImages(size, event.target.files);
                                event.target.value = '';
                              }}
                            />
                            <button
                              type="button"
                              onPointerDown={() => {
                                savedScrollRef.current = formScrollRef.current?.scrollTop ?? 0;
                              }}
                              onClick={() => fileInputRefs.current[size]?.click()}
                              className="w-27.5 h-18 rounded-xl border-1.5 border-dashed border-primary/30 bg-primary/5 flex flex-col items-center justify-center gap-1 transition-all hover:bg-primary/10 hover:border-primary/50"
                            >
                              <div className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center shadow-sm">
                                <Plus size={14} strokeWidth={3} />
                              </div>
                              <span className="text-[10px] font-bold text-primary">Thêm ảnh</span>
                            </button>
                          </>
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
            form="add-product-form"
            type="submit"
            data-draft="true"
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
            data-draft="false"
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
    </AntdModalShell>
  );
}

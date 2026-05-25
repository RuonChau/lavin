'use client';

import { useState, useEffect } from 'react';
import { X, Plus, Save, Loader2, Sparkles, Package, Warehouse, Folder, Scale, DollarSign, AlertCircle } from 'lucide-react';
import { GlassCard } from '@/shared/components/GlassCard';
import { Material } from '../../../domain/entities/material.entity';
import { cn } from '@/shared/utils/cn';
import { AntdModalShell } from '@/shared/ui/antd-modal-shell';

interface AddMaterialModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Omit<Material, 'id' | 'lastUpdated' | 'status'>) => Promise<void>;
  isSubmitting?: boolean;
}

const CATEGORIES = ['Cà phê hạt', 'Sữa & Kem', 'Bột pha chế', 'Si rô & Đường', 'Bao bì'];
const WAREHOUSES = ['Kho tổng A', 'Kho lạnh B', 'Kho vật tư'];
const POPULAR_UNITS = ['kg', 'g', 'lít', 'ml', 'hộp 1L', 'cái', 'túi', 'lon'];

export function AddMaterialModal({
  isOpen,
  onClose,
  onSave,
  isSubmitting
}: AddMaterialModalProps) {
  const [name, setName] = useState('');
  const [sku, setSku] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [customCategory, setCustomCategory] = useState('');
  const [showCustomCategory, setShowCustomCategory] = useState(false);
  const [warehouse, setWarehouse] = useState(WAREHOUSES[0]);
  const [unit, setUnit] = useState(POPULAR_UNITS[0]);
  const [customUnit, setCustomUnit] = useState('');
  const [showCustomUnit, setShowCustomUnit] = useState(false);
  const [currentStock, setCurrentStock] = useState<number>(0);
  const [minStock, setMinStock] = useState<number>(0);
  const [pricePerUnit, setPricePerUnit] = useState<number>(0);

  // Validation errors
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Reset form when modal closes/opens
  useEffect(() => {
    if (isOpen) {
      setName('');
      setSku('');
      setCategory(CATEGORIES[0]);
      setCustomCategory('');
      setShowCustomCategory(false);
      setWarehouse(WAREHOUSES[0]);
      setUnit(POPULAR_UNITS[0]);
      setCustomUnit('');
      setShowCustomUnit(false);
      setCurrentStock(0);
      setMinStock(0);
      setPricePerUnit(0);
      setErrors({});
    }
  }, [isOpen]);

  const handleAutoSuggestSku = () => {
    const cleanString = (str: string) => {
      return str
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '') // remove accents
        .replace(/[đĐ]/g, 'd')
        .toUpperCase();
    };

    const activeCategory = showCustomCategory ? customCategory : category;

    const catPart = activeCategory
      ? cleanString(activeCategory)
        .split(' ')
        .map(w => w[0])
        .join('')
        .replace(/[^A-Z]/g, '')
        .slice(0, 3)
      : 'GEN';

    const namePart = name
      ? cleanString(name)
        .split(' ')
        .map(w => w[0])
        .join('')
        .replace(/[^A-Z]/g, '')
        .slice(0, 3)
      : 'MAT';

    const randomNum = Math.floor(100 + Math.random() * 900);
    setSku(`MAT-${catPart || 'GEN'}-${namePart || 'MAT'}-${randomNum}`);

    if (errors.sku) {
      setErrors(prev => ({ ...prev, sku: '' }));
    }
  };

  // Trigger SKU auto suggestion on name/category change if SKU is not manually typed
  useEffect(() => {
    if (name && !sku.startsWith('MAT-MAN-')) {
      // Generate standard suggestion
      const cleanString = (str: string) => {
        return str
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .replace(/[đĐ]/g, 'd')
          .toUpperCase();
      };
      const activeCategory = showCustomCategory ? customCategory : category;
      const catPart = activeCategory
        ? cleanString(activeCategory).split(' ').map(w => w[0]).join('').replace(/[^A-Z]/g, '').slice(0, 3)
        : 'GEN';
      const namePart = cleanString(name).split(' ').map(w => w[0]).join('').replace(/[^A-Z]/g, '').slice(0, 3);

      // We only set if the user hasn't explicitly entered a custom SKU
      // To keep it simple, we just generate once or on button click, but let's do a soft initial generation
      if (!sku) {
        setSku(`MAT-${catPart || 'GEN'}-${namePart || 'MAT'}-${Math.floor(100 + Math.random() * 900)}`);
      }
    }
  }, [name, category, customCategory, showCustomCategory]);

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!name.trim()) newErrors.name = 'Tên nguyên liệu không được để trống';
    if (!sku.trim()) newErrors.sku = 'Mã SKU không được để trống';
    if (showCustomCategory && !customCategory.trim()) newErrors.category = 'Vui lòng nhập danh mục mới';
    if (showCustomUnit && !customUnit.trim()) newErrors.unit = 'Vui lòng nhập đơn vị tính mới';
    if (currentStock < 0) newErrors.currentStock = 'Tồn kho không được nhỏ hơn 0';
    if (minStock < 0) newErrors.minStock = 'Định mức tối thiểu không được nhỏ hơn 0';
    if (pricePerUnit < 0) newErrors.pricePerUnit = 'Đơn giá không được nhỏ hơn 0';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    const finalCategory = showCustomCategory ? customCategory.trim() : category;
    const finalUnit = showCustomUnit ? customUnit.trim() : unit;

    await onSave({
      name: name.trim(),
      sku: sku.trim().toUpperCase(),
      category: finalCategory,
      warehouse,
      unit: finalUnit,
      currentStock,
      minStock,
      pricePerUnit
    });
  };

  return (
    <AntdModalShell open={isOpen} onClose={onClose} width={580} zIndex={1200}>
      <GlassCard className="relative p-8 overflow-hidden max-h-[85vh] flex flex-col" radius="4xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-primary/10 text-primary border border-primary/20">
              <Package size={22} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-text-primary">Thêm nguyên liệu mới</h2>
              <p className="text-[11px] text-text-muted mt-0.5 font-medium">Nhập thông tin chi tiết để thêm nguyên vật liệu vào danh mục quản lý kho.</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-text-muted hover:bg-white/60 rounded-xl transition-all">
            <X size={20} />
          </button>
        </div>

        {/* Form Body */}
        <div className="flex-1 overflow-y-auto space-y-5 pr-1 py-1">
          {/* Tên nguyên liệu */}
          <div>
            <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest block mb-2 px-1">
              Tên nguyên liệu <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (errors.name) setErrors(prev => ({ ...prev, name: '' }));
              }}
              placeholder="Ví dụ: Sữa đặc Ông Thọ, Hạt Arabica..."
              className={cn(
                "w-full bg-white rounded-2xl border px-4 py-3 text-sm font-semibold text-text-primary focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all",
                errors.name ? "border-red-400 focus:border-red-500" : "border-primary-soft/20 focus:border-primary"
              )}
            />
            {errors.name && (
              <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1 font-semibold px-1">
                <AlertCircle size={12} /> {errors.name}
              </p>
            )}
          </div>

          {/* SKU & Warehouse */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Mã SKU */}
            <div>
              <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest block mb-2 px-1 items-center justify-between">
                <span>Mã SKU <span className="text-red-500">*</span></span>
                <button
                  type="button"
                  onClick={handleAutoSuggestSku}
                  className="text-[10px] text-primary font-black uppercase flex items-center gap-1 hover:text-primary-deep transition-colors"
                >
                  <Sparkles size={11} /> Gợi ý SKU
                </button>
              </label>
              <div className="relative group">
                <input
                  type="text"
                  value={sku}
                  onChange={(e) => {
                    setSku(e.target.value);
                    if (errors.sku) setErrors(prev => ({ ...prev, sku: '' }));
                  }}
                  placeholder="MAT-ARA-01"
                  className={cn(
                    "w-full bg-white rounded-2xl border pl-4 pr-12 py-3 text-sm font-bold text-text-primary uppercase focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all",
                    errors.sku ? "border-red-400 focus:border-red-500" : "border-primary-soft/20 focus:border-primary"
                  )}
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-primary-soft">
                  <Sparkles size={16} />
                </div>
              </div>
              {errors.sku && (
                <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1 font-semibold px-1">
                  <AlertCircle size={12} /> {errors.sku}
                </p>
              )}
            </div>

            {/* Vị trí kho */}
            <div>
              <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest block mb-2 px-1">
                Kho lưu trữ <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select
                  value={warehouse}
                  onChange={(e) => setWarehouse(e.target.value)}
                  className="w-full bg-white rounded-2xl border border-primary-soft/20 px-4 py-3 text-sm font-semibold text-text-primary focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all appearance-none cursor-pointer"
                >
                  {WAREHOUSES.map(w => (
                    <option key={w} value={w}>{w}</option>
                  ))}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-text-muted">
                  <Warehouse size={16} />
                </div>
              </div>
            </div>
          </div>

          {/* Danh mục */}
          <div>
            <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest block mb-2 px-1">
              Danh mục nguyên liệu <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <select
                value={showCustomCategory ? 'custom' : category}
                onChange={(e) => {
                  if (e.target.value === 'custom') {
                    setShowCustomCategory(true);
                  } else {
                    setShowCustomCategory(false);
                    setCategory(e.target.value);
                  }
                  if (errors.category) setErrors(prev => ({ ...prev, category: '' }));
                }}
                className="w-full bg-white rounded-2xl border border-primary-soft/20 px-4 py-3 text-sm font-semibold text-text-primary focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all cursor-pointer"
              >
                {CATEGORIES.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
                <option value="custom">+ Thêm danh mục mới...</option>
              </select>

              {showCustomCategory && (
                <div className="relative">
                  <input
                    type="text"
                    value={customCategory}
                    onChange={(e) => {
                      setCustomCategory(e.target.value);
                      if (errors.category) setErrors(prev => ({ ...prev, category: '' }));
                    }}
                    placeholder="Tên danh mục mới"
                    className={cn(
                      "w-full bg-[#FFFAF4] rounded-2xl border px-4 py-3 text-sm font-semibold text-text-primary focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all",
                      errors.category ? "border-red-400 focus:border-red-500" : "border-primary/40 focus:border-primary"
                    )}
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 text-primary">
                    <Folder size={16} />
                  </div>
                </div>
              )}
            </div>
            {errors.category && (
              <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1 font-semibold px-1">
                <AlertCircle size={12} /> {errors.category}
              </p>
            )}
          </div>

          {/* Đơn vị tính & Đơn giá */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Đơn vị tính */}
            <div>
              <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest block mb-2 px-1">
                Đơn vị tính <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <select
                  value={showCustomUnit ? 'custom' : unit}
                  onChange={(e) => {
                    if (e.target.value === 'custom') {
                      setShowCustomUnit(true);
                    } else {
                      setShowCustomUnit(false);
                      setUnit(e.target.value);
                    }
                    if (errors.unit) setErrors(prev => ({ ...prev, unit: '' }));
                  }}
                  className="w-full bg-white rounded-2xl border border-primary-soft/20 px-3 py-3 text-xs font-semibold text-text-primary focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all cursor-pointer"
                >
                  {POPULAR_UNITS.map(u => (
                    <option key={u} value={u}>{u}</option>
                  ))}
                  <option value="custom">Khác...</option>
                </select>

                {showCustomUnit && (
                  <div className="relative">
                    <input
                      type="text"
                      value={customUnit}
                      onChange={(e) => {
                        setCustomUnit(e.target.value);
                        if (errors.unit) setErrors(prev => ({ ...prev, unit: '' }));
                      }}
                      placeholder="VD: túi 500g"
                      className={cn(
                        "w-full bg-[#FFFAF4] rounded-2xl border px-3 py-3 text-xs font-semibold text-text-primary focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all",
                        errors.unit ? "border-red-400 focus:border-red-500" : "border-primary/40 focus:border-primary"
                      )}
                    />
                  </div>
                )}
              </div>
              {errors.unit && (
                <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1 font-semibold px-1">
                  <AlertCircle size={12} /> {errors.unit}
                </p>
              )}
            </div>

            {/* Đơn giá */}
            <div>
              <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest block mb-2 px-1">
                Đơn giá (₫ trên đơn vị)
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={pricePerUnit || ''}
                  onChange={(e) => {
                    setPricePerUnit(Math.max(0, Number(e.target.value)));
                    if (errors.pricePerUnit) setErrors(prev => ({ ...prev, pricePerUnit: '' }));
                  }}
                  placeholder="0"
                  className={cn(
                    "w-full bg-white rounded-2xl border pl-4 pr-12 py-3 text-sm font-bold text-text-primary focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all",
                    errors.pricePerUnit ? "border-red-400 focus:border-red-500" : "border-primary-soft/20 focus:border-primary"
                  )}
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-black text-text-muted">
                  VND
                </span>
              </div>
              {errors.pricePerUnit && (
                <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1 font-semibold px-1">
                  <AlertCircle size={12} /> {errors.pricePerUnit}
                </p>
              )}
            </div>
          </div>

          {/* Tồn kho hiện tại & Định mức tối thiểu */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Tồn kho ban đầu */}
            <div>
              <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest block mb-2 px-1">
                Tồn kho ban đầu
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={currentStock || ''}
                  onChange={(e) => {
                    setCurrentStock(Math.max(0, Number(e.target.value)));
                    if (errors.currentStock) setErrors(prev => ({ ...prev, currentStock: '' }));
                  }}
                  placeholder="0"
                  className={cn(
                    "w-full bg-white rounded-2xl border pl-4 pr-12 py-3 text-sm font-bold text-text-primary focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all",
                    errors.currentStock ? "border-red-400 focus:border-red-500" : "border-primary-soft/20 focus:border-primary"
                  )}
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-text-muted">
                  {showCustomUnit ? customUnit || 'đv' : unit}
                </span>
              </div>
              {errors.currentStock && (
                <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1 font-semibold px-1">
                  <AlertCircle size={12} /> {errors.currentStock}
                </p>
              )}
            </div>

            {/* Định mức tồn tối thiểu */}
            <div>
              <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest block mb-2 px-1">
                Định mức tồn tối thiểu
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={minStock || ''}
                  onChange={(e) => {
                    setMinStock(Math.max(0, Number(e.target.value)));
                    if (errors.minStock) setErrors(prev => ({ ...prev, minStock: '' }));
                  }}
                  placeholder="0"
                  className={cn(
                    "w-full bg-white rounded-2xl border pl-4 pr-12 py-3 text-sm font-bold text-text-primary focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all",
                    errors.minStock ? "border-red-400 focus:border-red-500" : "border-primary-soft/20 focus:border-primary"
                  )}
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-text-muted">
                  {showCustomUnit ? customUnit || 'đv' : unit}
                </span>
              </div>
              {errors.minStock && (
                <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1 font-semibold px-1">
                  <AlertCircle size={12} /> {errors.minStock}
                </p>
              )}
            </div>
          </div>

          {/* Warning state if stock < minStock */}
          {currentStock < minStock && (
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 flex gap-3 items-start animate-pulse shrink-0">
              <AlertCircle size={18} className="text-amber-600 mt-0.5 shrink-0" />
              <div>
                <p className="text-xs font-bold text-amber-800">Cảnh báo: Định mức tồn thấp</p>
                <p className="text-[11px] text-amber-700 mt-0.5 leading-relaxed font-semibold">Số lượng tồn kho ban đầu ({currentStock}) thấp hơn định mức tối thiểu ({minStock}). Nguyên liệu này sẽ ở trạng thái cảnh báo <strong>Đang sắp hết (LOW_STOCK)</strong> ngay khi tạo.</p>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex gap-3 pt-5 border-t border-primary-soft/10 mt-4 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-3 rounded-2xl bg-white border border-primary-soft/30 text-sm font-bold text-text-secondary transition-all hover:bg-gray-50 active:scale-95"
          >
            Hủy bỏ
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={isSubmitting}
            className="flex-2 py-3 rounded-2xl bg-primary text-white text-sm font-bold shadow-lg shadow-primary/20 hover:bg-primary-deep transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
            Xác nhận thêm nguyên liệu
          </button>
        </div>
      </GlassCard>
    </AntdModalShell>
  );
}

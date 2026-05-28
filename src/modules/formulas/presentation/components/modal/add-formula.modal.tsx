'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import {
  X,
  Plus,
  Trash2,
  Save,
  Loader2,
  Calculator,
  TrendingUp,
  AlertCircle
} from 'lucide-react';
import { GlassCard } from '@/shared/components/GlassCard';
import { Formula } from '../../../domain/entities/formula.entity';
import { AntdModalShell } from '@/shared/ui/antd-modal-shell';
import { formulaService } from '../../../infrastructure/services/formula.service';

interface AddFormulaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => Promise<void>;
  isSubmitting?: boolean;
}

interface LocalIngredient {
  id: string;
  materialId: string;
  materialName: string;
  quantity: number;
  unit: string;
  pricePerUnit: number;
  cost: number;
}

export function AddFormulaModal({
  isOpen,
  onClose,
  onSave,
  isSubmitting
}: AddFormulaModalProps) {
  const [dbIngredients, setDbIngredients] = useState<any[]>([]);
  const [dbVariants, setDbVariants] = useState<any[]>([]);
  const [selectedVariantId, setSelectedVariantId] = useState('');
  const [ingredients, setIngredients] = useState<LocalIngredient[]>([]);

  // Custom searchable dropdown states & refs
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Financial costing states
  const [expectedPrice, setExpectedPrice] = useState<number | string>('');

  useEffect(() => {
    if (isOpen) {
      formulaService.getIngredients().then(setDbIngredients);
      formulaService.getProductVariants().then(setDbVariants);
    }
  }, [isOpen]);

  useEffect(() => {
    const variant = dbVariants.find((v) => v.id === selectedVariantId);
    if (variant) {
      setExpectedPrice(Number(variant.price || 0));
    } else {
      setExpectedPrice(0);
    }
  }, [selectedVariantId, dbVariants]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const filteredVariants = dbVariants.filter((v) =>
    v.variant_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    v.sku.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedVariant = dbVariants.find((v) => v.id === selectedVariantId);

  const handleUpdateQuantity = (idx: number, quantity: number) => {
    const updated = [...ingredients];
    updated[idx] = {
      ...updated[idx],
      quantity,
      cost: updated[idx].pricePerUnit * quantity
    };
    setIngredients(updated);
  };

  const handleRemoveIngredient = (idx: number) => {
    setIngredients(ingredients.filter((_, i) => i !== idx));
  };

  const handleAddIngredient = () => {
    const firstIng = dbIngredients[0];
    const newIng: LocalIngredient = {
      id: Math.random().toString(36).substring(2, 9),
      materialId: firstIng ? firstIng.id : '',
      materialName: firstIng ? firstIng.name : 'Nguyên liệu',
      quantity: 1,
      unit: firstIng ? firstIng.unit : 'g',
      pricePerUnit: firstIng ? Number(firstIng.price_per_unit || 0) : 0,
      cost: firstIng ? Number(firstIng.price_per_unit || 0) : 0
    };
    setIngredients([...ingredients, newIng]);
  };

  const totalCost = ingredients.reduce((sum, ing) => sum + ing.cost, 0);
  const priceNum = Number(expectedPrice || 0);
  const marginPercent = priceNum > 0
    ? Math.round(((priceNum - totalCost) / priceNum) * 100)
    : 0;

  const handleSave = async () => {
    if (!selectedVariantId) return;

    const payload = {
      variant_id: selectedVariantId,
      ingredients: ingredients
        .filter((ing) => ing.materialId !== '')
        .map((ing) => ({
          ingredient_id: ing.materialId,
          quantity: ing.quantity
        }))
    };

    await onSave(payload);

    // Reset form
    setSelectedVariantId('');
    setIngredients([]);
  };

  return (
    <AntdModalShell open={isOpen} onClose={onClose} width={1024} zIndex={1100}>
      <GlassCard className="relative overflow-hidden flex flex-col max-h-[90vh]" radius="4xl">
        {/* Header */}
        <div className="p-6 border-b border-primary-soft/20 bg-white/40 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-inner border border-primary/20">
              <Plus size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-text-primary">Thiết lập công thức mới</h2>
              <p className="text-xs text-text-muted font-medium">Chọn biến thể sản phẩm và thiết lập nguyên liệu.</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2.5 text-text-muted hover:bg-white/60 rounded-xl transition-all"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-0 flex flex-col lg:flex-row">
          {/* Left: Editor */}
          <div className="flex-1 p-8 space-y-8">
            {/* Basic Info */}
            {/* Basic Info - Custom Searchable Dropdown */}
            <div className="space-y-2 relative" ref={dropdownRef}>
              <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest block px-1">Sản phẩm & Biến thể</label>

              <div className="relative">
                <input
                  type="text"
                  placeholder="Gõ tên hoặc SKU để tìm kiếm biến thể sản phẩm..."
                  value={
                    isDropdownOpen
                      ? searchQuery
                      : selectedVariant
                        ? `${selectedVariant.variant_name} (${selectedVariant.sku}) - ${Number(selectedVariant.price).toLocaleString('vi-VN')}đ`
                        : searchQuery
                  }
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    if (!isDropdownOpen) setIsDropdownOpen(true);
                  }}
                  onFocus={() => {
                    setIsDropdownOpen(true);
                    setSearchQuery('');
                  }}
                  className="w-full bg-white/60 rounded-xl border border-primary-soft/20 px-4 py-3 text-sm font-bold text-text-primary focus:outline-none focus:border-primary transition-all shadow-sm cursor-pointer pr-10"
                />

                <button
                  type="button"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary transition-all"
                >
                  <svg className={`w-5 h-5 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </div>

              {isDropdownOpen && (
                <div className="absolute z-1200 left-0 right-0 mt-1 max-h-60 overflow-y-auto rounded-2xl bg-white border border-primary-soft/20 shadow-2xl p-2 space-y-1">
                  {filteredVariants.length > 0 ? (
                    filteredVariants.map((v) => (
                      <button
                        type="button"
                        key={v.id}
                        onClick={() => {
                          setSelectedVariantId(v.id);
                          setSearchQuery('');
                          setIsDropdownOpen(false);
                        }}
                        className={`w-full text-left px-4 py-3 text-xs font-bold rounded-xl transition-all flex items-center justify-between ${selectedVariantId === v.id
                            ? 'bg-primary text-white shadow-md'
                            : 'text-text-secondary hover:bg-primary/5 hover:text-primary'
                          }`}
                      >
                        <div>
                          <p className="font-extrabold">{v.variant_name}</p>
                          <p className={`text-[10px] uppercase font-bold tracking-wider mt-0.5 ${selectedVariantId === v.id ? 'text-white/80' : 'text-text-muted'}`}>SKU: {v.sku}</p>
                        </div>
                        <span className={`text-xs font-black ${selectedVariantId === v.id ? 'text-white' : 'text-primary'}`}>
                          {Number(v.price).toLocaleString('vi-VN')}đ
                        </span>
                      </button>
                    ))
                  ) : (
                    <div className="py-6 text-center text-xs font-bold text-text-muted">
                      Không tìm thấy biến thể phù hợp
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-black text-text-primary uppercase tracking-widest">Định mức nguyên liệu ({ingredients.length})</h3>
                <button
                  disabled={dbIngredients.length === 0}
                  onClick={handleAddIngredient}
                  className="flex items-center gap-2 text-xs font-bold text-primary bg-primary/5 hover:bg-primary/10 px-4 py-2 rounded-xl border border-primary/20 transition-all shadow-sm disabled:opacity-50"
                >
                  <Plus size={16} /> Thêm nguyên liệu
                </button>
              </div>

              <div className="space-y-3">
                {ingredients.map((ing, idx) => (
                  <motion.div
                    layout
                    key={ing.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-4 p-4 rounded-2xl bg-white/60 border border-primary-soft/20 hover:border-primary/30 transition-all group"
                  >
                    <div className="flex-1 min-w-0">
                      <select
                        value={ing.materialId}
                        onChange={(e) => {
                          const selectedId = e.target.value;
                          const ingInfo = dbIngredients.find((x) => x.id === selectedId);
                          if (ingInfo) {
                            const updated = [...ingredients];
                            updated[idx] = {
                              ...updated[idx],
                              materialId: selectedId,
                              materialName: ingInfo.name,
                              unit: ingInfo.unit,
                              pricePerUnit: Number(ingInfo.price_per_unit || 0),
                              cost: Number(ingInfo.price_per_unit || 0) * updated[idx].quantity
                            };
                            setIngredients(updated);
                          }
                        }}
                        className="bg-transparent text-sm font-bold text-text-primary focus:outline-none cursor-pointer w-full py-1 border-b border-dashed border-primary-soft/30"
                      >
                        <option value="">Chọn nguyên liệu...</option>
                        {dbIngredients.map((item) => (
                          <option key={item.id} value={item.id}>
                            {item.name} (₫{Number(item.price_per_unit).toLocaleString('vi-VN')}/{item.unit})
                          </option>
                        ))}
                      </select>
                      <p className="text-[10px] text-text-muted font-bold uppercase tracking-wider mt-1">ID: {ing.materialId || 'N/A'}</p>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="flex items-center bg-[#FFFAF4] border border-primary-soft/30 rounded-xl overflow-hidden shadow-inner">
                        <input
                          type="number"
                          value={ing.quantity ?? ''}
                          min="0.001"
                          step="any"
                          onChange={(e) => handleUpdateQuantity(idx, e.target.value === '' ? 0 : Number(e.target.value))}
                          className="w-16 bg-transparent text-center text-sm font-bold text-primary py-2 px-1 focus:outline-none"
                        />
                        <span className="px-3 py-2 text-[10px] font-black text-text-muted border-l border-primary-soft/20 bg-white/40 uppercase">
                          {ing.unit}
                        </span>
                      </div>

                      <div className="w-32 text-right">
                        <p className="text-xs text-text-muted font-bold">Chi phí</p>
                        <p className="text-sm font-black text-text-primary">₫{ing.cost.toLocaleString('vi-VN')}</p>
                      </div>

                      <button
                        onClick={() => handleRemoveIngredient(idx)}
                        className="p-2 text-red-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>

              {ingredients.length === 0 && (
                <div className="py-16 border-2 border-dashed border-primary-soft/20 rounded-4xl flex flex-col items-center justify-center text-text-muted bg-white/20">
                  <div className="w-16 h-16 rounded-3xl bg-white/40 flex items-center justify-center mb-4 border border-primary-soft/10">
                    <AlertCircle size={32} className="opacity-40" />
                  </div>
                  <p className="text-sm font-bold">Bắt đầu bằng cách thêm nguyên liệu đầu tiên</p>
                  <button
                    disabled={dbIngredients.length === 0}
                    onClick={handleAddIngredient}
                    className="mt-4 px-6 py-2 bg-primary text-white text-xs font-bold rounded-xl shadow-lg shadow-primary/20 hover:bg-primary-deep transition-all disabled:opacity-50"
                  >
                    Thêm ngay
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Right: Summary */}
          <div className="w-full lg:w-85 bg-[#FFFAF4]/60 border-l border-primary-soft/20 p-8 space-y-8">
            <div className="space-y-4">
              <h3 className="text-[11px] font-bold text-text-muted uppercase tracking-widest">Tóm tắt chi phí</h3>
              <div className="p-8 rounded-[40px] bg-white shadow-xl shadow-primary-deep/5 border border-primary-soft/20 flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-2xl bg-primary/5 flex items-center justify-center text-primary mb-3">
                  <Calculator size={24} />
                </div>
                <p className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Ước tính Prime Cost</p>
                <p className="text-4xl font-black text-primary mt-1 tracking-tighter">₫{totalCost.toLocaleString('vi-VN')}</p>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-[11px] font-bold text-text-muted uppercase tracking-widest">Phân tích Target</h3>
              <div className="space-y-3">
                <div className="p-5 rounded-2xl bg-white/60 border border-primary-soft/10 flex items-center justify-between">
                  <span className="text-xs font-bold text-text-secondary">Lợi nhuận mục tiêu</span>
                  <span className={`text-sm font-black ${marginPercent >= 70 ? 'text-green-600' : marginPercent >= 50 ? 'text-amber-500' : 'text-red-500'
                    }`}>
                    {marginPercent}%
                  </span>
                </div>
                <div className="p-5 rounded-2xl bg-white focus-within:ring-2 focus-within:ring-primary/20 border border-primary-soft/20 transition-all">
                  <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest block mb-2">Giá bán dự kiến</label>
                  <div className="flex items-center gap-2">
                    <span className="text-text-muted font-bold">₫</span>
                    <input
                      type="number"
                      placeholder="VD: 55000"
                      value={expectedPrice}
                      onChange={(e) => setExpectedPrice(e.target.value === '' ? '' : Number(e.target.value))}
                      className="w-full bg-transparent text-sm font-black text-text-primary focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-amber-50 border border-amber-100 flex gap-4">
              <TrendingUp size={18} className="text-amber-600 shrink-0" />
              <p className="text-[11px] text-amber-800 leading-relaxed">
                Hệ thống sẽ tự động cập nhật Cost khi giá nhập nguyên liệu thay đổi trong phân hệ <b>Kho</b>.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-primary-soft/20 bg-white/40 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-2xl bg-white border border-primary-soft/30 text-sm font-bold text-text-secondary hover:shadow-md transition-all active:scale-95"
          >
            Hủy bỏ
          </button>
          <button
            onClick={handleSave}
            disabled={!selectedVariantId || ingredients.length === 0 || isSubmitting}
            className="px-10 py-3 rounded-2xl bg-primary text-white text-sm font-bold shadow-lg shadow-primary/20 hover:bg-primary-deep hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center gap-2 disabled:opacity-50"
          >
            {isSubmitting ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <Save size={18} />
            )}
            Thiết lập công thức
          </button>
        </div>
      </GlassCard>
    </AntdModalShell>
  );
}

'use client';

import { useState, useEffect } from 'react';
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

interface EditFormulaModalProps {
  isOpen: boolean;
  onClose: () => void;
  formula: Formula | null;
  onSave: (updatedFormula: Formula) => Promise<void>;
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

export function EditFormulaModal({
  isOpen,
  onClose,
  formula,
  onSave,
  isSubmitting
}: EditFormulaModalProps) {
  const [dbIngredients, setDbIngredients] = useState<any[]>([]);
  const [ingredients, setIngredients] = useState<LocalIngredient[]>([]);
  const [expectedPrice, setExpectedPrice] = useState<number | string>('');

  useEffect(() => {
    if (isOpen) {
      formulaService.getIngredients().then((data) => {
        setDbIngredients(data);
        if (formula) {
          setExpectedPrice(formula.variantPrice || 55000);
          const mapped = formula.ingredients.map((ing) => {
            const match = data.find((x) => x.id === ing.materialId);
            const pricePerUnit = match
              ? Number(match.price_per_unit || 0)
              : ing.quantity
              ? ing.cost / ing.quantity
              : 0;
            return {
              id: ing.id,
              materialId: ing.materialId,
              materialName: ing.materialName,
              quantity: ing.quantity,
              unit: ing.unit,
              pricePerUnit,
              cost: ing.cost
            };
          });
          setIngredients(mapped);
        }
      });
    }
  }, [formula, isOpen]);

  if (!formula) return null;

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

  const foodCostPercent = priceNum > 0
    ? Math.round((totalCost / priceNum) * 100)
    : 0;

  const handleSave = async () => {
    const payload = {
      id: formula.id,
      ingredients: ingredients
        .filter((ing) => ing.materialId !== '')
        .map((ing) => ({
          ingredient_id: ing.materialId,
          quantity: ing.quantity
        }))
    };

    await onSave(payload as any);
  };

  return (
    <AntdModalShell open={isOpen} onClose={onClose} width={1024} zIndex={1100}>
      <GlassCard className="relative overflow-hidden flex flex-col max-h-[90vh]" radius="4xl">
        {/* Header */}
        <div className="p-6 border-b border-primary-soft/20 bg-white/40 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 flex items-center justify-center text-amber-600 shadow-inner border border-amber-200">
              <Calculator size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-text-primary">Chỉnh sửa công thức</h2>
              <p className="text-xs text-text-muted font-medium">{formula.productName} • {formula.category}</p>
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
          <div className="flex-1 p-8 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-black text-text-primary uppercase tracking-widest">Thành phần nguyên liệu</h3>
              <button
                disabled={dbIngredients.length === 0}
                onClick={handleAddIngredient}
                className="flex items-center gap-2 text-xs font-bold text-primary bg-primary/5 hover:bg-primary/10 px-4 py-2 rounded-xl border border-primary/20 transition-all disabled:opacity-50"
              >
                <Plus size={16} /> Thêm nguyên liệu
              </button>
            </div>

            <div className="space-y-3">
              {ingredients.map((ing, idx) => (
                <motion.div
                  layout
                  key={ing.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
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
              <div className="py-12 border-2 border-dashed border-primary-soft/20 rounded-3xl flex flex-col items-center justify-center text-text-muted">
                <AlertCircle size={40} className="mb-3 opacity-20" />
                <p className="text-sm font-bold">Chưa có nguyên liệu nào trong công thức</p>
              </div>
            )}
          </div>

          {/* Right: Summary & Costing */}
          <div className="w-full lg:w-80 bg-[#FFFAF4]/60 border-l border-primary-soft/20 p-8 space-y-8">
            <div className="space-y-4">
              <h3 className="text-[11px] font-bold text-text-muted uppercase tracking-widest">Phân tích giá thành</h3>
              <div className="p-6 rounded-4xl bg-white shadow-sm border border-primary-soft/20 flex flex-col items-center text-center">
                <p className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Tổng giá vốn (BOM)</p>
                <p className="text-3xl font-black text-primary mt-1">₫{totalCost.toLocaleString('vi-VN')}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-white/60 border border-primary-soft/10">
                <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest block mb-2 px-1">Giá bán đề xuất</label>
                <div className="flex items-center bg-white rounded-xl border border-primary-soft/20 px-3 py-2 shadow-inner">
                  <span className="text-text-muted font-bold mr-2">₫</span>
                  <input
                    type="number"
                    value={expectedPrice}
                    onChange={(e) => setExpectedPrice(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full bg-transparent text-sm font-black text-text-primary focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-4 rounded-2xl bg-green-50 border border-green-100/50">
                  <p className="text-[10px] font-bold text-green-700 uppercase">Lợi nhuận</p>
                  <p className={`text-lg font-black mt-1 ${
                    marginPercent >= 70 ? 'text-green-600' : marginPercent >= 50 ? 'text-amber-500' : 'text-red-500'
                  }`}>{marginPercent}%</p>
                </div>
                <div className="p-4 rounded-2xl bg-blue-50 border border-blue-100/50">
                  <p className="text-[10px] font-bold text-blue-700 uppercase">Food Cost</p>
                  <p className="text-lg font-black text-blue-600 mt-1">{foodCostPercent}%</p>
                </div>
              </div>
            </div>

            {/* Suggestions */}
            <div className="space-y-3">
              <h3 className="text-[11px] font-bold text-text-muted uppercase tracking-widest">Gợi ý tối ưu</h3>
              <div className="flex gap-3 text-[11px] leading-relaxed text-text-secondary bg-white/40 p-3 rounded-xl border border-primary-soft/10">
                <TrendingUp size={14} className="text-green-600 shrink-0" />
                <p>Giảm lượng <b>Đường nước</b> xuống 15ml để cân bằng vị ngọt và giảm cost.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-primary-soft/20 bg-white/40 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-2xl bg-white border border-primary-soft/30 text-sm font-bold text-text-secondary hover:shadow-md transition-all"
          >
            Hủy bỏ
          </button>
          <button
            onClick={handleSave}
            disabled={isSubmitting}
            className="px-8 py-2.5 rounded-2xl bg-primary text-white text-sm font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2 disabled:opacity-70"
          >
            {isSubmitting ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <Save size={18} />
            )}
            Lưu công thức
          </button>
        </div>
      </GlassCard>
    </AntdModalShell>
  );
}

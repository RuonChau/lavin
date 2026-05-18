'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
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
import { Formula, FormulaIngredient } from '../../../domain/entities/formula.entity';

interface EditFormulaModalProps {
  isOpen: boolean;
  onClose: () => void;
  formula: Formula | null;
  onSave: (updatedFormula: Formula) => Promise<void>;
  isSubmitting?: boolean;
}

export function EditFormulaModal({ 
  isOpen, 
  onClose, 
  formula, 
  onSave, 
  isSubmitting 
}: EditFormulaModalProps) {
  const [ingredients, setIngredients] = useState<FormulaIngredient[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (formula) {
      setIngredients([...formula.ingredients]);
    }
  }, [formula, isOpen]);

  if (!formula) return null;

  const handleUpdateQuantity = (idx: number, quantity: number) => {
    const updated = [...ingredients];
    updated[idx] = { 
      ...updated[idx], 
      quantity,
      cost: (updated[idx].cost / updated[idx].quantity) * quantity // Simple mock cost update
    };
    setIngredients(updated);
  };

  const handleRemoveIngredient = (idx: number) => {
    setIngredients(ingredients.filter((_, i) => i !== idx));
  };

  const handleAddIngredient = () => {
    // Mock adding a new ingredient
    const newIng: FormulaIngredient = {
      id: Math.random().toString(36).substr(2, 9),
      materialId: 'm-new',
      materialName: 'Nguyên liệu mới',
      quantity: 1,
      unit: 'đơn vị',
      cost: 1000
    };
    setIngredients([...ingredients, newIng]);
  };

  const totalCost = ingredients.reduce((sum, ing) => sum + ing.cost, 0);

  const handleSave = async () => {
    await onSave({
      ...formula,
      ingredients,
      totalCost,
      updatedAt: new Date().toISOString()
    });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[110] bg-black/20 backdrop-blur-sm"
          />

          <div className="fixed inset-0 z-[111] flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="w-full max-w-5xl pointer-events-auto"
            >
              <GlassCard className="relative overflow-hidden flex flex-col max-h-[90vh]" radius="4xl">
                {/* Header */}
                <div className="p-6 border-b border-[#D8B894]/20 bg-white/40 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-amber-100 flex items-center justify-center text-amber-600 shadow-inner border border-amber-200">
                      <Calculator size={24} />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-[#2A1E17]">Chỉnh sửa công thức</h2>
                      <p className="text-xs text-[#9A8677] font-medium">{formula.productName} • {formula.category}</p>
                    </div>
                  </div>
                  <button 
                    onClick={onClose}
                    className="p-2.5 text-[#9A8677] hover:bg-white/60 rounded-xl transition-all"
                  >
                    <X size={20} />
                  </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-0 flex flex-col lg:flex-row">
                  {/* Left: Editor */}
                  <div className="flex-1 p-8 space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-black text-[#2A1E17] uppercase tracking-widest">Thành phần nguyên liệu</h3>
                      <button 
                        onClick={handleAddIngredient}
                        className="flex items-center gap-2 text-xs font-bold text-primary bg-primary/5 hover:bg-primary/10 px-4 py-2 rounded-xl border border-primary/20 transition-all"
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
                          className="flex items-center gap-4 p-4 rounded-2xl bg-white/60 border border-[#D8B894]/20 hover:border-primary/30 transition-all group"
                        >
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-[#2A1E17] truncate">{ing.materialName}</p>
                            <p className="text-[10px] text-[#9A8677] font-bold uppercase tracking-wider mt-0.5">{ing.materialId}</p>
                          </div>
                          
                          <div className="flex items-center gap-3">
                            <div className="flex items-center bg-[#FFFAF4] border border-[#D8B894]/30 rounded-xl overflow-hidden">
                              <input 
                                type="number" 
                                value={ing.quantity}
                                onChange={(e) => handleUpdateQuantity(idx, Number(e.target.value))}
                                className="w-16 bg-transparent text-center text-sm font-bold text-primary py-2 px-1 focus:outline-none"
                              />
                              <span className="px-3 py-2 text-[10px] font-black text-[#9A8677] border-l border-[#D8B894]/20 bg-white/40 uppercase">
                                {ing.unit}
                              </span>
                            </div>
                            
                            <div className="w-32 text-right">
                              <p className="text-xs text-[#9A8677] font-bold">Chi phí</p>
                              <p className="text-sm font-black text-[#2A1E17]">₫{ing.cost.toLocaleString('vi-VN')}</p>
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
                      <div className="py-12 border-2 border-dashed border-[#D8B894]/20 rounded-3xl flex flex-col items-center justify-center text-[#9A8677]">
                         <AlertCircle size={40} className="mb-3 opacity-20" />
                         <p className="text-sm font-bold">Chưa có nguyên liệu nào trong công thức</p>
                      </div>
                    )}
                  </div>

                  {/* Right: Summary & Costing */}
                  <div className="w-full lg:w-80 bg-[#FFFAF4]/60 border-l border-[#D8B894]/20 p-8 space-y-8">
                    <div className="space-y-4">
                      <h3 className="text-[11px] font-bold text-[#9A8677] uppercase tracking-widest">Phân tích giá thành</h3>
                      <div className="p-6 rounded-[32px] bg-white shadow-sm border border-[#D8B894]/20 flex flex-col items-center text-center">
                        <p className="text-[10px] font-bold text-[#9A8677] uppercase tracking-wider">Tổng giá vốn (BOM)</p>
                        <p className="text-3xl font-black text-primary mt-1">₫{totalCost.toLocaleString('vi-VN')}</p>
                      </div>
                    </div>

                    <div className="space-y-4">
                       <div className="p-4 rounded-2xl bg-white/60 border border-[#D8B894]/10">
                          <label className="text-[10px] font-bold text-[#9A8677] uppercase tracking-widest block mb-2 px-1">Giá bán đề xuất</label>
                          <div className="flex items-center bg-white rounded-xl border border-[#D8B894]/20 px-3 py-2 shadow-inner">
                            <span className="text-[#9A8677] font-bold mr-2">₫</span>
                            <input 
                              type="text" 
                              defaultValue="55.000"
                              className="w-full bg-transparent text-sm font-black text-[#2A1E17] focus:outline-none"
                            />
                          </div>
                       </div>
                       
                       <div className="grid grid-cols-2 gap-3">
                         <div className="p-4 rounded-2xl bg-green-50 border border-green-100/50">
                            <p className="text-[10px] font-bold text-green-700 uppercase">Lợi nhuận</p>
                            <p className="text-lg font-black text-green-600 mt-1">72%</p>
                         </div>
                         <div className="p-4 rounded-2xl bg-blue-50 border border-blue-100/50">
                            <p className="text-[10px] font-bold text-blue-700 uppercase">Food Cost</p>
                            <p className="text-lg font-black text-blue-600 mt-1">28%</p>
                         </div>
                       </div>
                    </div>

                    {/* Suggestions */}
                    <div className="space-y-3">
                       <h3 className="text-[11px] font-bold text-[#9A8677] uppercase tracking-widest">Gợi ý tối ưu</h3>
                       <div className="flex gap-3 text-[11px] leading-relaxed text-[#6F5A4A] bg-white/40 p-3 rounded-xl border border-[#D8B894]/10">
                          <TrendingUp size={14} className="text-green-600 shrink-0" />
                          <p>Giảm lượng <b>Đường nước</b> xuống 15ml để cân bằng vị ngọt và giảm cost.</p>
                       </div>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-[#D8B894]/20 bg-white/40 flex items-center justify-end gap-3">
                  <button 
                    onClick={onClose}
                    className="px-6 py-2.5 rounded-2xl bg-white border border-[#D8B894]/30 text-sm font-bold text-[#6F5A4A] hover:shadow-md transition-all"
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
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}

'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Plus, 
  Trash2, 
  Save, 
  Loader2, 
  Calculator, 
  TrendingUp,
  AlertCircle,
  Package
} from 'lucide-react';
import { GlassCard } from '@/shared/components/GlassCard';
import { Formula, FormulaIngredient } from '../../../domain/entities/formula.entity';

interface AddFormulaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Partial<Formula>) => Promise<void>;
  isSubmitting?: boolean;
}

export function AddFormulaModal({ 
  isOpen, 
  onClose, 
  onSave, 
  isSubmitting 
}: AddFormulaModalProps) {
  const [productName, setProductName] = useState('');
  const [category, setCategory] = useState('');
  const [ingredients, setIngredients] = useState<FormulaIngredient[]>([]);

  const handleUpdateQuantity = (idx: number, quantity: number) => {
    const updated = [...ingredients];
    updated[idx] = { 
      ...updated[idx], 
      quantity,
      cost: (updated[idx].cost / (updated[idx].quantity || 1)) * quantity
    };
    setIngredients(updated);
  };

  const handleRemoveIngredient = (idx: number) => {
    setIngredients(ingredients.filter((_, i) => i !== idx));
  };

  const handleAddIngredient = () => {
    const newIng: FormulaIngredient = {
      id: Math.random().toString(36).substr(2, 9),
      materialId: 'm-' + Math.floor(Math.random() * 1000),
      materialName: 'Nguyên liệu mới',
      quantity: 1,
      unit: 'g',
      cost: 500
    };
    setIngredients([...ingredients, newIng]);
  };

  const totalCost = ingredients.reduce((sum, ing) => sum + ing.cost, 0);

  const handleSave = async () => {
    if (!productName || !category) return;
    
    await onSave({
      productName,
      category,
      ingredients,
      totalCost,
      updatedAt: new Date().toISOString()
    });
    
    // Reset form after success (handled by parent usually, but clean up state)
    setProductName('');
    setCategory('');
    setIngredients([]);
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
                    <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-inner border border-primary/20">
                      <Plus size={24} />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-[#2A1E17]">Thiết lập công thức mới</h2>
                      <p className="text-xs text-[#9A8677] font-medium">Nhập thông tin sản phẩm và định mức nguyên liệu.</p>
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
                  <div className="flex-1 p-8 space-y-8">
                    {/* Basic Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-[#9A8677] uppercase tracking-widest block px-1">Tên sản phẩm / Thức uống</label>
                        <div className="flex items-center bg-white/60 rounded-xl border border-[#D8B894]/20 px-4 py-2 focus-within:border-primary transition-all shadow-sm">
                           <Package size={18} className="text-[#D8B894] mr-3" />
                           <input 
                             type="text" 
                             value={productName}
                             onChange={(e) => setProductName(e.target.value)}
                             placeholder="VD: Phê La Latte..."
                             className="w-full bg-transparent text-sm font-bold text-[#2A1E17] focus:outline-none placeholder:text-[#9A8677]/50"
                           />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-[#9A8677] uppercase tracking-widest block px-1">Danh mục mục tiêu</label>
                        <select 
                          value={category}
                          onChange={(e) => setCategory(e.target.value)}
                          className="w-full bg-white/60 rounded-xl border border-[#D8B894]/20 px-4 py-3 text-sm font-bold text-[#2A1E17] focus:outline-none focus:border-primary transition-all shadow-sm"
                        >
                          <option value="">Chọn danh mục...</option>
                          <option value="Cà phê">Cà phê</option>
                          <option value="Trà & Đá xay">Trà & Đá xay</option>
                          <option value="Bánh & Dessert">Bánh & Dessert</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-black text-[#2A1E17] uppercase tracking-widest">Định mức nguyên liệu ({ingredients.length})</h3>
                        <button 
                          onClick={handleAddIngredient}
                          className="flex items-center gap-2 text-xs font-bold text-primary bg-primary/5 hover:bg-primary/10 px-4 py-2 rounded-xl border border-primary/20 transition-all shadow-sm"
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
                            className="flex items-center gap-4 p-4 rounded-2xl bg-white/60 border border-[#D8B894]/20 hover:border-primary/30 transition-all group"
                          >
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-bold text-[#2A1E17] truncate">{ing.materialName}</p>
                              <p className="text-[10px] text-[#9A8677] font-bold uppercase tracking-wider mt-0.5">{ing.materialId}</p>
                            </div>
                            
                            <div className="flex items-center gap-3">
                              <div className="flex items-center bg-[#FFFAF4] border border-[#D8B894]/30 rounded-xl overflow-hidden shadow-inner">
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
                        <div className="py-16 border-2 border-dashed border-[#D8B894]/20 rounded-[32px] flex flex-col items-center justify-center text-[#9A8677] bg-white/20">
                           <div className="w-16 h-16 rounded-3xl bg-white/40 flex items-center justify-center mb-4 border border-[#D8B894]/10">
                              <AlertCircle size={32} className="opacity-40" />
                           </div>
                           <p className="text-sm font-bold">Bắt đầu bằng cách thêm nguyên liệu đầu tiên</p>
                           <button 
                             onClick={handleAddIngredient}
                             className="mt-4 px-6 py-2 bg-primary text-white text-xs font-bold rounded-xl shadow-lg shadow-primary/20 hover:bg-[#5B3A29] transition-all"
                           >
                             Thêm ngay
                           </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right: Summary */}
                  <div className="w-full lg:w-85 bg-[#FFFAF4]/60 border-l border-[#D8B894]/20 p-8 space-y-8">
                    <div className="space-y-4">
                      <h3 className="text-[11px] font-bold text-[#9A8677] uppercase tracking-widest">Tóm tắt chi phí</h3>
                      <div className="p-8 rounded-[40px] bg-white shadow-xl shadow-[#5B3A29]/5 border border-[#D8B894]/20 flex flex-col items-center text-center">
                        <div className="w-12 h-12 rounded-2xl bg-primary/5 flex items-center justify-center text-primary mb-3">
                           <Calculator size={24} />
                        </div>
                        <p className="text-[10px] font-bold text-[#9A8677] uppercase tracking-wider">Ước tính Prime Cost</p>
                        <p className="text-4xl font-black text-primary mt-1 tracking-tighter">₫{totalCost.toLocaleString('vi-VN')}</p>
                      </div>
                    </div>

                    <div className="space-y-4">
                       <h3 className="text-[11px] font-bold text-[#9A8677] uppercase tracking-widest">Phân tích Target</h3>
                       <div className="space-y-3">
                          <div className="p-5 rounded-2xl bg-white/60 border border-[#D8B894]/10 flex items-center justify-between">
                             <span className="text-xs font-bold text-[#6F5A4A]">Lợi nhuận mục tiêu</span>
                             <span className="text-sm font-black text-green-600">70%</span>
                          </div>
                          <div className="p-5 rounded-2xl bg-white focus-within:ring-2 focus-within:ring-primary/20 border border-[#D8B894]/20 transition-all">
                             <label className="text-[10px] font-bold text-[#9A8677] uppercase tracking-widest block mb-2">Giá bán dự kiến</label>
                             <div className="flex items-center gap-2">
                                <span className="text-[#9A8677] font-bold">₫</span>
                                <input 
                                  type="text" 
                                  placeholder="VD: 55.000"
                                  className="w-full bg-transparent text-sm font-black text-[#2A1E17] focus:outline-none"
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
                <div className="p-6 border-t border-[#D8B894]/20 bg-white/40 flex items-center justify-end gap-3">
                  <button 
                    onClick={onClose}
                    className="px-6 py-2.5 rounded-2xl bg-white border border-[#D8B894]/30 text-sm font-bold text-[#6F5A4A] hover:shadow-md transition-all active:scale-95"
                  >
                    Hủy bỏ
                  </button>
                  <button 
                    onClick={handleSave}
                    disabled={!productName || !category || isSubmitting}
                    className="px-10 py-3 rounded-2xl bg-primary text-white text-sm font-bold shadow-lg shadow-primary/20 hover:bg-[#5B3A29] hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center gap-2 disabled:opacity-50"
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
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}

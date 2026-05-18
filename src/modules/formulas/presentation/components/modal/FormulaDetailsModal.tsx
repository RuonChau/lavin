'use client';

import { motion, AnimatePresence } from 'motion/react';
import { X, Printer, Calculator, Layers, Beaker, ArrowRight, History } from 'lucide-react';
import { GlassCard } from '@/shared/components/GlassCard';
import { Formula } from '../../../domain/entities/formula.entity';

interface FormulaDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  formula: Formula | null;
  onEdit: (formula: Formula) => void;
}

export function FormulaDetailsModal({ isOpen, onClose, formula, onEdit }: FormulaDetailsModalProps) {
  if (!formula) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[100] bg-black/20 backdrop-blur-sm"
          />

          <div className="fixed inset-0 z-[101] flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="w-full max-w-4xl pointer-events-auto"
            >
              <GlassCard className="relative overflow-hidden flex flex-col max-h-[90vh]" radius="4xl">
                {/* Header */}
                <div className="p-6 border-b border-[#D8B894]/20 bg-white/40 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl overflow-hidden shadow-md border border-white flex-shrink-0">
                      <img 
                        src={formula.productImage || `https://picsum.photos/seed/${formula.productId}/200/200`} 
                        alt={formula.productName} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-[#2A1E17]">{formula.productName}</h2>
                      <p className="text-xs text-[#9A8677] mt-1 flex items-center gap-2">
                         <Layers size={12} />
                         Danh mục: {formula.category} • Cập nhật: {new Date(formula.updatedAt).toLocaleDateString('vi-VN')}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="p-2.5 bg-[#FFFAF4] text-primary border border-primary/20 rounded-xl hover:bg-white transition-all shadow-sm flex items-center gap-2 text-xs font-bold">
                       <Printer size={16} /> In công thức
                    </button>
                    <button 
                      onClick={onClose}
                      className="p-2.5 text-[#9A8677] hover:bg-white/60 rounded-xl transition-all"
                    >
                      <X size={20} />
                    </button>
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-0 flex flex-col lg:flex-row">
                  {/* Left: Ingredients List */}
                  <div className="flex-1 p-8 space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-bold text-[#2A1E17] uppercase tracking-wider flex items-center gap-2">
                        <Beaker size={16} className="text-primary" />
                        Định mức nguyên liệu ({formula.ingredients.length})
                      </h3>
                    </div>

                    <div className="overflow-hidden rounded-3xl border border-[#D8B894]/20 bg-white/40">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="bg-[#FFFAF4]/80 text-[#9A8677] text-[10px] font-bold uppercase tracking-widest border-b border-[#D8B894]/10">
                            <th className="py-4 px-6">Nguyên liệu</th>
                            <th className="py-4 px-4 text-center">Định lượng</th>
                            <th className="py-4 px-4 text-center">Đơn vị</th>
                            <th className="py-4 px-6 text-right">Chi phí ước tính</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#D8B894]/10">
                          {formula.ingredients.map((ing, idx) => (
                            <tr key={idx} className="group hover:bg-white/30 transition-colors">
                              <td className="py-4 px-6">
                                <span className="text-sm font-bold text-[#2A1E17]">{ing.materialName}</span>
                              </td>
                              <td className="py-4 px-4 text-center">
                                <span className="text-sm font-bold text-primary bg-primary/5 px-3 py-1 rounded-lg border border-primary/10">
                                  {ing.quantity}
                                </span>
                              </td>
                              <td className="py-4 px-4 text-center text-xs font-bold text-[#6F5A4A]">
                                {ing.unit}
                              </td>
                              <td className="py-4 px-6 text-right">
                                <span className="text-sm font-bold text-[#2A1E17]">₫{ing.cost.toLocaleString('vi-VN')}</span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Cost Alert */}
                    <div className="p-4 rounded-3xl bg-amber-50/50 border border-amber-100 flex items-start gap-4">
                      <div className="w-10 h-10 rounded-2xl bg-amber-100 flex items-center justify-center text-amber-600 flex-shrink-0">
                         <Calculator size={20} />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-amber-900">Tính toán Cost/Price</p>
                        <p className="text-[11px] text-amber-700 leading-relaxed mt-0.5">
                          Tỷ lệ chi phí nguyên liệu đang chiếm khoảng 30% giá bán lẻ. Đây là ngưỡng an toàn cho tối ưu hóa lợi nhuận.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Right: Cost Analysis */}
                  <div className="w-full lg:w-80 bg-[#FFFAF4]/60 border-l border-[#D8B894]/20 p-8 space-y-8">
                    <div>
                      <h3 className="text-[11px] font-bold text-[#9A8677] uppercase tracking-widest mb-4">Tổng chi phí (BOM)</h3>
                      <div className="p-6 rounded-[32px] bg-white shadow-sm border border-[#D8B894]/20 flex flex-col items-center text-center">
                        <p className="text-[10px] font-bold text-[#9A8677] uppercase tracking-wider">Prime Cost / Cup</p>
                        <p className="text-3xl font-black text-primary mt-1">₫{formula.totalCost.toLocaleString('vi-VN')}</p>
                        <div className="mt-4 flex items-center justify-center gap-2 text-[10px] text-green-600 font-bold bg-green-50 px-3 py-1 rounded-full border border-green-100">
                          <History size={12} /> -5% so với tháng trước
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-[11px] font-bold text-[#9A8677] uppercase tracking-widest">Hiệu năng kinh doanh</h3>
                      <div className="space-y-3">
                        <div className="p-4 rounded-2xl bg-white/60 border border-[#D8B894]/10 flex items-center justify-between">
                           <span className="text-xs text-[#6F5A4A]">Giá bán đề xuất</span>
                           <span className="text-sm font-bold text-[#2A1E17]">₫55.000</span>
                        </div>
                        <div className="p-4 rounded-2xl bg-white/60 border border-[#D8B894]/10 flex items-center justify-between">
                           <span className="text-xs text-[#6F5A4A]">Lợi nhuận gộp</span>
                           <span className="text-sm font-bold text-green-600">72%</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-[11px] font-bold text-[#9A8677] uppercase tracking-widest">Lịch sử thay đổi</h3>
                      <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-px before:bg-[#D8B894]/30">
                        <div className="relative">
                          <div className="absolute -left-[1.65rem] top-1 w-3 h-3 rounded-full bg-primary border-2 border-white shadow-sm" />
                          <p className="text-[11px] font-bold text-[#2A1E17]">Thêm bột béo (10g)</p>
                          <p className="text-[9px] text-[#9A8677]">12/05/2024 • Admin</p>
                        </div>
                        <div className="relative">
                          <div className="absolute -left-[1.65rem] top-1 w-3 h-3 rounded-full bg-[#D8B894] border-2 border-white shadow-sm" />
                          <p className="text-[11px] font-bold text-[#2A1E17]">Khởi tạo công thức</p>
                          <p className="text-[9px] text-[#9A8677]">01/05/2024 • System</p>
                        </div>
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
                    Đóng
                  </button>
                  <button 
                    onClick={() => onEdit(formula)}
                    className="px-8 py-2.5 rounded-2xl bg-[#8B5E3C] text-white text-sm font-bold shadow-lg shadow-[#8B5E3C]/20 hover:bg-[#5B3A29] transition-all flex items-center gap-2"
                  >
                    Chỉnh sửa công thức
                    <ArrowRight size={18} />
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

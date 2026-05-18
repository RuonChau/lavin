'use client';

import { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Search, 
  Filter, 
  FileDown, 
  Plus, 
  Eye, 
  Edit3,
  TrendingDown,
  Beaker,
  AlertCircle
} from 'lucide-react';
import { GlassCard } from '@/shared/components/GlassCard';
import { cn } from '@/shared/utils/cn';
import { useFormulas } from '@/modules/formulas/presentation/hooks/useFormulas';
import { Formula } from '@/modules/formulas/domain/entities/formula.entity';
import { FormulaDetailsModal } from '@/modules/formulas/presentation/components/modal/FormulaDetailsModal';
import { EditFormulaModal } from '@/modules/formulas/presentation/components/modal/EditFormulaModal';
import { AddFormulaModal } from '@/modules/formulas/presentation/components/modal/AddFormulaModal';
import { toast } from 'react-toastify';
import { StatsOverview } from '../../mocks/stats-overview.mock';

export default function FormulasPage() {
  const { formulas, isLoading, updateFormula, createFormula, isUpdating, isCreating } = useFormulas();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFormula, setSelectedFormula] = useState<Formula | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const filteredFormulas = formulas.filter(f => 
    f.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    f.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleViewDetails = (formula: Formula) => {
    setSelectedFormula(formula);
    setIsDetailsModalOpen(true);
  };

  const handleEditClick = (formula: Formula) => {
    setSelectedFormula(formula);
    setIsEditModalOpen(true);
    setIsDetailsModalOpen(false);
  };

  const handleSaveFormula = async (updatedFormula: Formula) => {
    try {
      await updateFormula({ id: updatedFormula.id, data: updatedFormula });
      toast.success('Cập nhật công thức thành công!');
      setIsEditModalOpen(false);
    } catch (error) {
      toast.error('Có lỗi xảy ra khi cập nhật công thức.');
    }
  };

  const handleCreateFormula = async (data: Partial<Formula>) => {
    try {
      await createFormula(data);
      toast.success('Thiết lập công thức mới thành công!');
      setIsAddModalOpen(false);
    } catch (error) {
      toast.error('Có lỗi xảy ra khi thiết lập công thức.');
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-[28px] font-bold text-[#2A1E17] tracking-tight">Quản lý Công thức / BOM</h1>
          <p className="text-[#9A8677] text-sm mt-1 leading-relaxed">Thiết lập định mức nguyên liệu & tính toán giá thành sản phẩm chính xác.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 rounded-[20px] bg-white/60 border border-[#D8B894]/30 px-5 py-3 text-sm font-bold text-[#6F5A4A] transition-all hover:bg-white hover:shadow-md">
            <FileDown size={18} />
            Xuất báo cáo
          </button>
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 rounded-[20px] bg-[#8B5E3C] px-6 py-3 text-sm font-bold text-white shadow-lg shadow-[#8B5E3C]/20 transition-all hover:bg-[#5B3A29] hover:-translate-y-0.5"
          >
            <Plus size={20} />
            Thêm công thức
          </button>
        </div>
      </div>

      <FormulaDetailsModal 
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        formula={selectedFormula}
        onEdit={handleEditClick}
      />

      <EditFormulaModal 
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        formula={selectedFormula}
        onSave={handleSaveFormula}
        isSubmitting={isUpdating}
      />

      <AddFormulaModal 
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleCreateFormula}
        isSubmitting={isCreating}
      />

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {StatsOverview.map((stat, idx) => (
          <GlassCard key={idx} className="p-6 relative group overflow-hidden" radius="4xl">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-[10px] font-bold text-[#9A8677] uppercase tracking-widest">{stat.label}</p>
                <h3 className="text-2xl font-bold text-[#2A1E17] mt-2 mb-1">{stat.value}</h3>
                <div className={cn(
                  "flex items-center gap-1 text-[11px] font-bold",
                  stat.negative ? "text-red-500" : "text-green-600"
                )}>
                  {stat.negative ? <TrendingDown size={12} /> : "•"} {stat.change}
                </div>
              </div>
              <div className={cn("p-2.5 rounded-2xl text-white shadow-lg", stat.color)}>
                <stat.icon size={20} />
              </div>
            </div>
            <div className="absolute bottom-0 right-0 opacity-5 group-hover:scale-125 transition-transform duration-500">
               <stat.icon size={80} />
            </div>
          </GlassCard>
        ))}
      </div>

      {/* Filter & Table Area */}
      <GlassCard className="p-0 overflow-hidden" radius="4xl">
        {/* Search & Filter Bar */}
        <div className="p-6 border-b border-[#D8B894]/10 bg-white/40 flex flex-col sm:flex-row gap-4 items-center">
          <div className="relative flex-1 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#D8B894] transition-colors group-focus-within:text-primary" size={18} />
            <input 
              type="text" 
              placeholder="Tìm tên sản phẩm, mã công thức..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-5 py-3 rounded-2xl bg-[#FFFAF4]/60 border border-[#D8B894]/30 text-sm focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all placeholder:text-[#9A8677]"
            />
          </div>
          <div className="flex items-center gap-3">
             <div className="flex items-center gap-3 bg-[#FFFAF4]/60 border border-[#D8B894]/30 rounded-2xl px-4 py-3">
                <span className="text-xs font-bold text-[#9A8677] uppercase tracking-widest whitespace-nowrap">Danh mục:</span>
                <select className="bg-transparent text-sm font-bold text-[#6F5A4A] focus:outline-none cursor-pointer pr-4">
                   <option value="all">Tất cả</option>
                   <option value="coffee">Cà phê</option>
                   <option value="tea">Trà & Đá xay</option>
                </select>
             </div>
             <button className="p-3 bg-[#FFFAF4]/60 border border-[#D8B894]/30 rounded-2xl text-[#6F5A4A] hover:bg-white transition-all shadow-sm">
                <Filter size={18} />
             </button>
          </div>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="py-24 flex flex-col items-center justify-center">
               <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4" />
               <p className="text-sm font-bold text-[#9A8677]">Chuẩn bị dữ liệu công thức...</p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#FFFAF4]/40 text-[#9A8677] text-[11px] font-bold uppercase tracking-widest border-b border-[#D8B894]/10">
                  <th className="py-5 px-8">Sản phẩm / Công thức</th>
                  <th className="py-5 px-6">Danh mục</th>
                  <th className="py-5 px-6 text-center">Nguyên liệu</th>
                  <th className="py-5 px-6 text-center">Chi phí BOM</th>
                  <th className="py-5 px-6">Cập nhật</th>
                  <th className="py-5 px-8 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#D8B894]/5">
                {filteredFormulas.map((formula, idx) => (
                  <motion.tr 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    key={idx} 
                    className="group hover:bg-[#FFFAF4]/40 transition-all duration-300"
                  >
                    <td className="py-5 px-8">
                       <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-2xl overflow-hidden border border-[#D8B894]/20 shadow-sm transition-transform group-hover:scale-110">
                             <img 
                               src={formula.productImage || `https://picsum.photos/seed/${formula.productId}/200/200`} 
                               alt={formula.productName} 
                               className="w-full h-full object-cover"
                             />
                          </div>
                          <div>
                             <p className="text-sm font-bold text-[#2A1E17] leading-tight">{formula.productName}</p>
                             <p className="text-[10px] text-[#9A8677] mt-1 font-bold bg-white/60 px-2 py-0.5 rounded-md border border-[#D8B894]/10 inline-block">
                                REC-{formula.id.toUpperCase()}
                             </p>
                          </div>
                       </div>
                    </td>
                    <td className="py-5 px-6">
                       <span className="px-3 py-1.5 rounded-xl bg-primary/10 text-primary text-[11px] font-bold">
                          {formula.category}
                       </span>
                    </td>
                    <td className="py-5 px-6 text-center">
                       <span className="text-xs font-bold text-[#6F5A4A] flex items-center justify-center gap-1.5">
                          <Beaker size={14} className="text-primary" /> {formula.ingredients.length} loại
                       </span>
                    </td>
                    <td className="py-5 px-6 text-center">
                       <p className="text-sm font-black text-[#2A1E17]">₫{formula.totalCost.toLocaleString('vi-VN')}</p>
                       <p className="text-[9px] text-green-600 font-bold uppercase tracking-tighter">Tối ưu</p>
                    </td>
                    <td className="py-5 px-6">
                       <p className="text-xs font-bold text-[#6F5A4A]">{new Date(formula.updatedAt).toLocaleDateString('vi-VN')}</p>
                       <p className="text-[10px] text-[#9A8677]">Bởi Admin</p>
                    </td>
                    <td className="py-5 px-8 text-right">
                       <div className="flex items-center justify-end gap-2 text-[#9A8677]">
                          <button 
                            onClick={() => handleViewDetails(formula)}
                            className="p-2.5 hover:bg-primary/10 hover:text-primary rounded-xl transition-all shadow-sm border border-transparent hover:border-primary/20" 
                            title="Xem chi tiết"
                          >
                             <Eye size={18} />
                          </button>
                          <button 
                            onClick={() => handleEditClick(formula)}
                            className="p-2.5 hover:bg-[#8B5E3C]/10 hover:text-[#8B5E3C] rounded-xl transition-all shadow-sm border border-transparent hover:border-[#8B5E3C]/20" 
                            title="Chỉnh sửa"
                          >
                             <Edit3 size={18} />
                          </button>
                       </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Empty State */}
        {!isLoading && filteredFormulas.length === 0 && (
          <div className="py-24 flex flex-col items-center justify-center">
             <div className="w-20 h-20 rounded-[32px] bg-[#FFFAF4] flex items-center justify-center text-[#D8B894] mb-4 border border-[#D8B894]/20">
                <AlertCircle size={32} />
             </div>
             <p className="text-base font-bold text-[#2A1E17]">Không tìm thấy công thức !</p>
             <p className="text-sm text-[#9A8677] mt-1">Vui lòng kiểm tra lại từ khóa tìm kiếm hoặc bộ lọc.</p>
             <button onClick={() => setSearchTerm('')}
               className="mt-6 text-primary text-xs font-bold hover:underline"
             >
                Xóa tất cả bộ lọc
             </button>
          </div>
        )}

        {/* Pagination Info */}
        <div className="p-6 border-t border-[#D8B894]/10 bg-[#FFFAF4]/20 flex items-center justify-between">
           <p className="text-[11px] font-bold text-[#9A8677] uppercase tracking-widest">Hiển thị {filteredFormulas.length} trên {formulas.length} công thức</p>
           <div className="flex gap-2">
              <button disabled className="w-9 h-9 rounded-xl border border-[#D8B894]/20 flex items-center justify-center text-[#9A8677] disabled:opacity-30">
                 <Filter className="rotate-90" size={14} />
              </button>
              <button className="w-9 h-9 rounded-xl border border-[#primary]/30 bg-primary/5 flex items-center justify-center text-primary font-bold text-xs">
                 1
              </button>
              <button className="w-9 h-9 rounded-xl border border-[#D8B894]/20 flex items-center justify-center text-[#9A8677] hover:bg-white transition-all">
                 <Filter className="-rotate-90" size={14} />
              </button>
           </div>
        </div>
      </GlassCard>
    </div>
  );
}

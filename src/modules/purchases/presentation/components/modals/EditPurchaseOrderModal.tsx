import { Material } from "@/modules/inventory/domain/entities/material.entity";
import { MaterialSelectionModal } from "@/modules/inventory/presentation/components/modal/MaterialSelectionModal";
import { MOCK_MATERIALS } from "@/modules/purchases/mocks/material.mock";
import { EditPurchaseOrderModalProps } from "@/modules/purchases/types/EditPurchaseOrderModalProps";
import { GlassCard } from "@/shared/components/GlassCard";
import { AnimatePresence, motion } from "framer-motion";
import { Edit2, Minus, Package, Plus, Trash2, X } from "lucide-react";
import { useState } from "react";

export default function EditPurchaseOrderModal({ order, onClose }: EditPurchaseOrderModalProps) {
  const [selectedItems, setSelectedItems] = useState<{ material: Material, quantity: number, price: number }[]>([]);
  const [isMaterialPickerOpen, setIsMaterialPickerOpen] = useState(false);

  // Pre-fill if order exists
  useState(() => {
    if (order) {
       // In practice, load real items. Here we simulate with mock.
       setSelectedItems([
         { material: MOCK_MATERIALS[0], quantity: 5, price: 250000 },
         { material: MOCK_MATERIALS[1], quantity: 10, price: 35000 }
       ]);
    }
  });

  if (!order) return null;

  const totalPrice = selectedItems.reduce((acc, item) => acc + (item.quantity * item.price), 0);

  const handleAddMaterial = (material: Material) => {
    if (selectedItems.find(item => item.material.id === material.id)) {
      setIsMaterialPickerOpen(false);
      return;
    }
    setSelectedItems([...selectedItems, { material, quantity: 1, price: material.pricePerUnit || 0 }]);
    setIsMaterialPickerOpen(false);
  };

  const updateItem = (index: number, updates: Partial<{ quantity: number, price: number }>) => {
    const newItems = [...selectedItems];
    newItems[index] = { ...newItems[index], ...updates };
    setSelectedItems(newItems);
  };

  const removeItem = (index: number) => {
    setSelectedItems(selectedItems.filter((_, i) => i !== index));
  };

  return (
    <AnimatePresence>
      <motion.div
        key="backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 z-[150] bg-black/40 backdrop-blur-md"
      />

      <div key="modal-container" className="fixed inset-0 z-[151] flex items-center justify-center p-4 pointer-events-none">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 50 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 50 }}
          className="w-full max-w-2xl pointer-events-auto"
        >
          <GlassCard className="overflow-hidden" radius="4xl">
            <div className="p-8 border-b border-[#D8B894]/20 bg-white/60 flex items-center justify-between">
              <div className="flex items-center gap-5">
                <div className="w-14 h-14 rounded-[24px] bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                  <Edit2 size={28} />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-[#2A1E17]">Chỉnh sửa Đơn hàng</h2>
                  <p className="text-xs text-[#9A8677] font-bold uppercase tracking-widest mt-1">Cập nhật thông tin cho {order.id}</p>
                </div>
              </div>
              <button onClick={onClose} className="p-3 text-[#9A8677] hover:bg-white/60 rounded-2xl transition-all">
                <X size={24} />
              </button>
            </div>

            <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6 bg-white/40">
               <div className="space-y-4">
                  <div className="space-y-2">
                     <label className="text-[10px] font-black text-[#968271] uppercase tracking-[0.2em]">Nhà cung cấp</label>
                     <select defaultValue={order.supplier} className="w-full bg-white/60 border border-[#D8B894]/20 rounded-2xl py-4 px-6 text-sm font-bold focus:outline-none appearance-none cursor-pointer">
                        <option>Cung cấp Nguyên liệu Toàn Cầu</option>
                        <option>Sữa Tươi Ba Vì</option>
                        <option>Gia vị Nhà Bếp</option>
                     </select>
                  </div>
                  <div className="space-y-2">
                     <label className="text-[10px] font-black text-[#968271] uppercase tracking-[0.2em]">Ngày dự kiến nhận</label>
                     <input type="date" defaultValue="2026-05-16" className="w-full bg-white/60 border border-[#D8B894]/20 rounded-2xl py-4 px-6 text-sm font-bold" />
                  </div>
               </div>

               <div className="space-y-4">
                  <div className="space-y-2">
                     <label className="text-[10px] font-black text-[#968271] uppercase tracking-[0.2em]">Kho hàng nhập</label>
                     <select defaultValue={order.branch} className="w-full bg-white/60 border border-[#D8B894]/20 rounded-2xl py-4 px-6 text-sm font-bold focus:outline-none appearance-none cursor-pointer">
                        <option>Chi nhánh Quận 1</option>
                        <option>Chi nhánh Quận 3</option>
                        <option>Tổng Kho</option>
                     </select>
                  </div>
                  <div className="space-y-2">
                     <label className="text-[10px] font-black text-[#968271] uppercase tracking-[0.2em]">Ghi chú</label>
                     <textarea placeholder="Nội dung ghi chú..." className="w-full bg-white/60 border border-[#D8B894]/20 rounded-2xl py-4 px-6 text-sm font-bold h-[54px] resize-none" />
                  </div>
               </div>
            </div>

            <div className="px-8 py-6 bg-[#FFFAF4]/30 border-y border-[#D8B894]/10">
               <div className="flex items-center justify-between mb-4">
                  <h4 className="text-[10px] font-black text-[#2A1E17] uppercase tracking-[0.2em]">Danh sách mặt hàng ({selectedItems.length})</h4>
                  <button 
                    onClick={() => setIsMaterialPickerOpen(true)}
                    className="flex items-center gap-1.5 text-[10px] font-black text-primary uppercase tracking-wider hover:underline"
                  >
                     <Plus size={14} strokeWidth={3} /> Thêm mặt hàng
                  </button>
               </div>
               
               {selectedItems.length > 0 ? (
                 <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                    {selectedItems.map((item, idx) => (
                      <div key={item.material.id} className="flex items-center gap-4 bg-white/60 border border-[#D8B894]/20 rounded-3xl p-4 group transition-all hover:border-primary/30">
                        <div className="w-10 h-10 rounded-2xl bg-primary/5 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
                          <Package size={18} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-[#2A1E17] truncate">{item.material.name}</p>
                          <p className="text-[10px] text-[#968271] font-bold uppercase tracking-widest">{item.material.sku}</p>
                        </div>
                        <div className="flex items-center gap-3">
                           <div className="flex items-center bg-white border border-[#D8B894]/20 rounded-xl px-2 py-1">
                              <button 
                                onClick={() => updateItem(idx, { quantity: Math.max(1, item.quantity - 1) })}
                                className="p-1 text-[#9A8677] hover:text-primary transition-colors hover:bg-gray-50 rounded-lg"
                              >
                                <Minus size={14} />
                              </button>
                              <span className="w-10 text-center text-xs font-black text-[#2A1E17]">{item.quantity}</span>
                              <button 
                                onClick={() => updateItem(idx, { quantity: item.quantity + 1 })}
                                className="p-1 text-[#9A8677] hover:text-primary transition-colors hover:bg-gray-50 rounded-lg"
                              >
                                <Plus size={14} />
                              </button>
                           </div>
                           <div className="w-32 bg-white border border-[#D8B894]/20 rounded-xl px-3 py-1 flex items-center group/price focus-within:border-primary/40 transition-colors">
                              <span className="text-[10px] font-bold text-[#9A8677] mr-2">₫</span>
                              <input 
                                type="number" 
                                value={item.price || ''} 
                                onChange={(e) => updateItem(idx, { price: Number(e.target.value) })}
                                placeholder="Đơn giá"
                                className="w-full bg-transparent text-xs font-black text-[#2A1E17] focus:outline-none"
                              />
                           </div>
                           <button 
                             onClick={() => removeItem(idx)}
                             className="p-2 text-[#9A8677] hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                           >
                             <Trash2 size={16} />
                           </button>
                        </div>
                      </div>
                    ))}
                 </div>
               ) : (
                 <button 
                   onClick={() => setIsMaterialPickerOpen(true)}
                   className="w-full py-10 border-2 border-dashed border-[#D8B894]/20 rounded-3xl flex flex-col items-center justify-center text-[#D8B894]/60 hover:border-primary/40 hover:bg-primary/5 hover:text-primary transition-all group"
                 >
                    <Package size={32} className="mb-2 opacity-50 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500" />
                    <p className="text-xs font-black uppercase tracking-widest">Chưa có mặt hàng nào</p>
                    <p className="text-[10px] mt-1 font-bold">Nhấn vào đây để thêm mặt hàng vào đơn</p>
                 </button>
               )}
            </div>

            <div className="p-8 border-t border-[#D8B894]/20 bg-white/40 flex items-center justify-between">
               <div className="flex flex-col">
                  <p className="text-[10px] font-black text-[#9A8677] uppercase tracking-widest">Tổng giá trị đơn hàng</p>
                  <p className="text-2xl font-black text-primary">₫{totalPrice.toLocaleString('vi-VN')}</p>
               </div>
               <div className="flex gap-3">
                  <button 
                    onClick={onClose}
                    className="px-8 py-4 rounded-2xl bg-white border border-[#D8B894]/30 text-sm font-black text-[#6F5A4A] transition-all hover:bg-gray-50"
                  >
                    Hủy bỏ
                  </button>
                  <button 
                    onClick={() => {
                        console.log('Updating PO:', order.id, 'with items:', selectedItems);
                        onClose();
                    }}
                    className="px-10 py-4 rounded-2xl bg-primary text-white text-sm font-black shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] active:scale-95"
                  >
                    Lưu thay đổi
                  </button>
               </div>
            </div>
          </GlassCard>
        </motion.div>
      </div>

      <MaterialSelectionModal
        isOpen={isMaterialPickerOpen}
        onClose={() => setIsMaterialPickerOpen(false)}
        materials={MOCK_MATERIALS}
        onSelect={handleAddMaterial}
        title="Thêm mặt hàng nhập"
        description="Chọn nguyên liệu cần cập nhật cho đơn hàng này."
      />
    </AnimatePresence>
  );
}

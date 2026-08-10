import { Material } from "@/modules/inventory/domain/entities/material.entity";
import { MaterialSelectionModal } from "@/modules/inventory/presentation/components/modal/material-selection.modal";
import { useInventory, useWarehouses } from "@/modules/inventory/presentation/hooks/useInventory";
import { usePurchases } from "@/modules/purchases/presentation/hooks/usePurchases";
import { CreatePurchaseOrderModalProps } from "@/modules/purchases/types/CreatePurchaseOrderModalProps";
import { GlassCard } from "@/shared/components/GlassCard";
import { AntdModalShell } from "@/shared/ui/antd-modal-shell";
import { Minus, Package, Plus, ShoppingCart, Trash2, X, Loader2 } from "lucide-react";
import { useState } from "react";

export default function CreatePurchaseOrderModal({ isOpen, onClose }: CreatePurchaseOrderModalProps) {
  const { suppliers, createPurchaseOrder, isCreating } = usePurchases();
  const { warehouses, isLoading: isLoadingWarehouses } = useWarehouses();
  const { materials, isLoading: isLoadingMaterials } = useInventory();

  const [selectedSupplierId, setSelectedSupplierId] = useState("");
  const [selectedWarehouseId, setSelectedWarehouseId] = useState("");
  const [expectedDate, setExpectedDate] = useState("");
  const [note, setNote] = useState("");
  const [selectedItems, setSelectedItems] = useState<{ material: Material, quantity: number, price: number }[]>([]);
  const [isMaterialPickerOpen, setIsMaterialPickerOpen] = useState(false);
  const [validationError, setValidationError] = useState("");

  if (!isOpen) return null;

  const totalPrice = selectedItems.reduce((acc, item) => acc + (item.quantity * item.price), 0);

  const handleAddMaterial = (material: Material) => {
    // Check if material already exists
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

  const handleCreateOrder = async () => {
    if (!selectedSupplierId) {
      setValidationError("Vui lòng chọn nhà cung cấp");
      return;
    }
    if (!selectedWarehouseId) {
      setValidationError("Vui lòng chọn kho hàng nhập");
      return;
    }
    if (selectedItems.length === 0) {
      setValidationError("Vui lòng thêm ít nhất một mặt hàng");
      return;
    }

    setValidationError("");
    try {
      await createPurchaseOrder({
        supplier_id: selectedSupplierId,
        branch_id: selectedWarehouseId,
        total_value: totalPrice,
        note: note || "Nhập hàng tự động",
        items: selectedItems.map((item) => ({
          ingredient_id: item.material.id,
          quantity: item.quantity,
          unit_price: item.price,
        })),
      });

      // Reset form states
      setSelectedSupplierId("");
      setSelectedWarehouseId("");
      setExpectedDate("");
      setNote("");
      setSelectedItems([]);
      onClose();
    } catch (err: any) {
      setValidationError(err?.response?.data?.message || "Có lỗi xảy ra khi tạo đơn hàng");
    }
  };

  return (
    <>
      <AntdModalShell open={isOpen} onClose={onClose} width={672} zIndex={1500} maskColor="rgba(0, 0, 0, 0.4)">
        <GlassCard className="overflow-hidden" radius="4xl">
          <div className="p-8 border-b border-primary-soft/20 bg-white/60 flex items-center justify-between">
            <div className="flex items-center gap-5">
              <div className="w-14 h-14 rounded-3xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                <ShoppingCart size={28} />
              </div>
              <div>
                <h2 className="text-2xl font-black text-text-primary">Tạo Đơn nhập hàng</h2>
                <p className="text-xs text-text-muted font-bold uppercase tracking-widest mt-1">Khởi tạo phiếu nhập kho mới</p>
              </div>
            </div>
            <button onClick={onClose} className="p-3 text-text-muted hover:bg-white/60 rounded-2xl transition-all">
              <X size={24} />
            </button>
          </div>

          <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6 bg-white/40">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-[#968271] uppercase tracking-[0.2em]">Nhà cung cấp</label>
                <select
                  value={selectedSupplierId}
                  onChange={(e) => {
                    setSelectedSupplierId(e.target.value);
                    setValidationError("");
                  }}
                  className="w-full bg-white/60 border border-primary-soft/20 rounded-2xl py-4 px-6 text-sm font-bold focus:outline-none appearance-none cursor-pointer"
                >
                  <option value="">Chọn nhà cung cấp...</option>
                  {suppliers.map((s) => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-[#968271] uppercase tracking-[0.2em]">Ngày dự kiến nhận</label>
                <input
                  type="date"
                  value={expectedDate}
                  onChange={(e) => setExpectedDate(e.target.value)}
                  className="w-full bg-white/60 border border-primary-soft/20 rounded-2xl py-4 px-6 text-sm font-bold"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-[#968271] uppercase tracking-[0.2em]">Kho hàng nhập</label>
                <select
                  value={selectedWarehouseId}
                  onChange={(e) => {
                    setSelectedWarehouseId(e.target.value);
                    setValidationError("");
                  }}
                  className="w-full bg-white/60 border border-primary-soft/20 rounded-2xl py-4 px-6 text-sm font-bold focus:outline-none appearance-none cursor-pointer"
                >
                  <option value="">Chọn kho hàng...</option>
                  {warehouses.map((w: any) => (
                    <option key={w.id} value={w.id}>{w.name}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-[#968271] uppercase tracking-[0.2em]">Ghi chú</label>
                <textarea
                  placeholder="Nội dung ghi chú..."
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="w-full bg-white/60 border border-primary-soft/20 rounded-2xl py-4 px-6 text-sm font-bold h-13.5 resize-none"
                />
              </div>
            </div>
          </div>

          {validationError && (
            <div className="px-8 py-3 bg-red-50 border-y border-red-100 text-xs font-bold text-red-600">
              {validationError}
            </div>
          )}

          <div className="px-8 py-6 bg-bg-secondary/50 border-y border-primary-soft/10">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-[10px] font-black text-text-primary uppercase tracking-[0.2em]">Danh sách mặt hàng ({selectedItems.length})</h4>
              <button
                onClick={() => setIsMaterialPickerOpen(true)}
                className="flex items-center gap-1.5 text-[10px] font-black text-primary uppercase tracking-wider hover:underline"
              >
                <Plus size={14} strokeWidth={3} /> Thêm mặt hàng
              </button>
            </div>

            {selectedItems.length > 0 ? (
              <div className="space-y-3 max-h-75 overflow-y-auto pr-2 custom-scrollbar">
                {selectedItems.map((item, idx) => (
                  <div key={item.material.id} className="flex items-center gap-4 bg-white/60 border border-primary-soft/20 rounded-3xl p-4 group transition-all hover:border-primary/30">
                    <div className="w-10 h-10 rounded-2xl bg-primary/5 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
                      <Package size={18} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-text-primary truncate">{item.material.name}</p>
                      <p className="text-[10px] text-[#968271] font-bold uppercase tracking-widest">{item.material.sku}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center bg-white border border-primary-soft/20 rounded-xl px-2 py-1">
                        <button
                          onClick={() => updateItem(idx, { quantity: Math.max(1, item.quantity - 1) })}
                          className="p-1 text-text-muted hover:text-primary transition-colors hover:bg-gray-50 rounded-lg"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="w-10 text-center text-xs font-black text-text-primary">{item.quantity}</span>
                        <button
                          onClick={() => updateItem(idx, { quantity: item.quantity + 1 })}
                          className="p-1 text-text-muted hover:text-primary transition-colors hover:bg-gray-50 rounded-lg"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                      <div className="w-32 bg-white border border-primary-soft/20 rounded-xl px-3 py-1 flex items-center group/price focus-within:border-primary/40 transition-colors">
                        <span className="text-[10px] font-bold text-text-muted mr-2">₫</span>
                        <input
                          type="number"
                          value={item.price || ''}
                          onChange={(e) => updateItem(idx, { price: Number(e.target.value) })}
                          placeholder="Đơn giá"
                          className="w-full bg-transparent text-xs font-black text-text-primary focus:outline-none"
                        />
                      </div>
                      <button
                        onClick={() => removeItem(idx)}
                        className="p-2 text-text-muted hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
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
                className="w-full py-10 border-2 border-dashed border-primary-soft/20 rounded-3xl flex flex-col items-center justify-center text-primary-soft/60 hover:border-primary/40 hover:bg-primary/5 hover:text-primary transition-all group"
              >
                <Package size={32} className="mb-2 opacity-50 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500" />
                <p className="text-xs font-bold uppercase tracking-widest">Chưa có mặt hàng nào</p>
                <p className="text-[10px] mt-1 font-bold">Nhấn vào đây để thêm mặt hàng vào đơn</p>
              </button>
            )}
          </div>

          <div className="p-8 border-t border-primary-soft/20 bg-white/40 flex items-center justify-between">
            <div className="flex flex-col">
              <p className="text-[10px] font-black text-text-muted uppercase tracking-widest">Tổng giá trị tạm tính</p>
              <p className="text-2xl font-black text-primary">₫{totalPrice.toLocaleString('vi-VN')}</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={onClose}
                disabled={isCreating}
                className="px-8 py-4 rounded-2xl bg-white border border-primary-soft/30 text-sm font-black text-text-secondary transition-all hover:bg-gray-50 disabled:opacity-50"
              >
                Hủy bỏ
              </button>
              <button
                onClick={handleCreateOrder}
                disabled={selectedItems.length === 0 || isCreating}
                className="px-10 py-4 rounded-2xl bg-primary text-white text-sm font-black shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:grayscale disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isCreating && <Loader2 size={16} className="animate-spin" />}
                Tạo đơn hàng
              </button>
            </div>
          </div>
        </GlassCard>
      </AntdModalShell>

      <MaterialSelectionModal
        isOpen={isMaterialPickerOpen}
        onClose={() => setIsMaterialPickerOpen(false)}
        materials={materials}
        onSelect={handleAddMaterial}
        title="Thêm mặt hàng nhập"
        description="Chọn nguyên liệu cần nhập kho cho đơn hàng này."
      />
    </>
  );
}

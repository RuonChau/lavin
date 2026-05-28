import { Material } from "@/modules/inventory/domain/entities/material.entity";
import { MaterialSelectionModal } from "@/modules/inventory/presentation/components/modal/material-selection.modal";
import { useInventory, useWarehouses } from "@/modules/inventory/presentation/hooks/useInventory";
import { usePurchases } from "@/modules/purchases/presentation/hooks/usePurchases";
import { EditPurchaseOrderModalProps } from "@/modules/purchases/types/EditPurchaseOrderModalProps";
import { GlassCard } from "@/shared/components/GlassCard";
import { AntdModalShell } from "@/shared/ui/antd-modal-shell";
import { Edit2, Minus, Package, Plus, Trash2, X, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";

export default function EditPurchaseOrderModal({ order, onClose }: EditPurchaseOrderModalProps) {
  const { suppliers, updatePurchaseOrder, isUpdating } = usePurchases();
  const { warehouses } = useWarehouses();
  const { materials } = useInventory();

  const [selectedSupplierId, setSelectedSupplierId] = useState("");
  const [selectedWarehouseId, setSelectedWarehouseId] = useState("");
  const [status, setStatus] = useState("");
  const [note, setNote] = useState("");
  const [selectedItems, setSelectedItems] = useState<{ material: Material, quantity: number, price: number }[]>([]);
  const [isMaterialPickerOpen, setIsMaterialPickerOpen] = useState(false);
  const [validationError, setValidationError] = useState("");

  useEffect(() => {
    if (order) {
      setSelectedSupplierId(order.supplierId || "");
      setSelectedWarehouseId(order.branch_id || "");
      setStatus(order.status || "PENDING");
      setNote(order.note || "");

      // Populate demo materials if available
      if (materials.length >= 2) {
        setSelectedItems([
          { material: materials[0], quantity: 5, price: materials[0].pricePerUnit || 250000 },
          { material: materials[1], quantity: 10, price: materials[1].pricePerUnit || 35000 }
        ]);
      }
    }
  }, [order, materials]);

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

  const handleSaveChanges = async () => {
    if (!selectedSupplierId) {
      setValidationError("Vui lòng chọn nhà cung cấp");
      return;
    }
    if (!status) {
      setValidationError("Vui lòng chọn trạng thái");
      return;
    }

    setValidationError("");
    try {
      await updatePurchaseOrder({
        id: order.dbId,
        data: {
          status,
          note,
          total_value: totalPrice
        }
      });
      onClose();
    } catch (err: any) {
      setValidationError(err?.response?.data?.message || "Có lỗi xảy ra khi lưu thay đổi");
    }
  };

  return (
    <>
      <AntdModalShell open={!!order} onClose={onClose} width={672} zIndex={1500} maskColor="rgba(0, 0, 0, 0.4)">
        <GlassCard className="overflow-hidden" radius="4xl">
          <div className="p-8 border-b border-primary-soft/20 bg-white/60 flex items-center justify-between">
            <div className="flex items-center gap-5">
              <div className="w-14 h-14 rounded-3xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                <Edit2 size={28} />
              </div>
              <div>
                <h2 className="text-2xl font-black text-text-primary">Chỉnh sửa Đơn hàng</h2>
                <p className="text-xs text-text-muted font-bold uppercase tracking-widest mt-1">Cập nhật thông tin cho {order.id}</p>
              </div>
            </div>
            <button onClick={onClose} className="p-3 text-text-muted hover:bg-white/60 rounded-2xl transition-all">
              <X size={24} />
            </button>
          </div>

          <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6 bg-white/40">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em]">Nhà cung cấp</label>
                <select
                  value={selectedSupplierId}
                  onChange={(e) => setSelectedSupplierId(e.target.value)}
                  className="w-full bg-white/60 border border-primary-soft/20 rounded-2xl py-4 px-6 text-sm font-bold focus:outline-none appearance-none cursor-pointer"
                >
                  <option value="">Chọn nhà cung cấp...</option>
                  {suppliers.map((s) => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em]">Trạng thái đơn hàng</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full bg-white/60 border border-primary-soft/20 rounded-2xl py-4 px-6 text-sm font-bold focus:outline-none appearance-none cursor-pointer"
                >
                  <option value="PENDING">Chờ duyệt</option>
                  <option value="SHIPPING">Đang giao hàng</option>
                  <option value="COMPLETED">Đã hoàn thành</option>
                  <option value="CANCELLED">Đã hủy</option>
                </select>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em]">Kho hàng nhập</label>
                <select
                  value={selectedWarehouseId}
                  onChange={(e) => setSelectedWarehouseId(e.target.value)}
                  className="w-full bg-white/60 border border-primary-soft/20 rounded-2xl py-4 px-6 text-sm font-bold focus:outline-none appearance-none cursor-pointer"
                >
                  <option value="">Chọn kho hàng...</option>
                  {warehouses.map((w: any) => (
                    <option key={w.id} value={w.id}>{w.name}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em]">Ghi chú</label>
                <textarea
                  placeholder="Nội dung ghi chú..."
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="w-full bg-white/60 border border-primary-soft/20 rounded-2xl py-4 px-6 text-sm font-bold h-[54px] resize-none"
                />
              </div>
            </div>
          </div>

          {validationError && (
            <div className="px-8 py-3 bg-red-50 border-y border-red-100 text-xs font-bold text-red-600">
              {validationError}
            </div>
          )}

          <div className="px-8 py-6 bg-[#FFFAF4]/30 border-y border-primary-soft/10">
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
              <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                {selectedItems.map((item, idx) => (
                  <div key={item.material.id} className="flex items-center gap-4 bg-white/60 border border-primary-soft/20 rounded-3xl p-4 group transition-all hover:border-primary/30">
                    <div className="w-10 h-10 rounded-2xl bg-primary/5 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
                      <Package size={18} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-text-primary truncate">{item.material.name}</p>
                      <p className="text-[10px] text-text-muted font-bold uppercase tracking-widest">{item.material.sku}</p>
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
                className="w-full py-10 border-2 border-dashed border-primary-soft/20 rounded-3xl flex flex-col items-center justify-center text-text-muted hover:border-primary/40 hover:bg-primary/5 hover:text-primary transition-all group"
              >
                <Package size={32} className="mb-2 opacity-50 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500" />
                <p className="text-xs font-black uppercase tracking-widest">Chưa có mặt hàng nào</p>
                <p className="text-[10px] mt-1 font-bold">Nhấn vào đây để thêm mặt hàng vào đơn</p>
              </button>
            )}
          </div>

          <div className="p-8 border-t border-primary-soft/20 bg-white/40 flex items-center justify-between">
            <div className="flex flex-col">
              <p className="text-[10px] font-black text-text-muted uppercase tracking-widest">Tổng giá trị đơn hàng</p>
              <p className="text-2xl font-black text-primary">₫{totalPrice.toLocaleString('vi-VN')}</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={onClose}
                disabled={isUpdating}
                className="px-8 py-4 rounded-2xl bg-white border border-primary-soft/30 text-sm font-black text-text-primary transition-all hover:bg-gray-50 disabled:opacity-50"
              >
                Hủy bỏ
              </button>
              <button
                onClick={handleSaveChanges}
                disabled={isUpdating}
                className="px-10 py-4 rounded-2xl bg-primary text-white text-sm font-black shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50 flex items-center gap-2"
              >
                {isUpdating && <Loader2 size={16} className="animate-spin" />}
                Lưu thay đổi
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
        description="Chọn nguyên liệu cần cập nhật cho đơn hàng này."
      />
    </>
  );
}

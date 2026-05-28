'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Layout, Hash, MoreVertical, Search, Warehouse, Layers, CheckCircle2, AlertTriangle, Package, Plus, Edit2 } from 'lucide-react';
import { GlassCard } from '@/shared/components/GlassCard';
import { cn } from '@/shared/utils/cn';
import { Warehouse as WarehouseType } from '../../../domain/entities/warehouse.entity';
import { AntdModalShell } from '@/shared/ui/antd-modal-shell';
import { useWarehouseLayout, useInventory } from '../../hooks/useInventory';

interface ShelfDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  warehouse: WarehouseType | null;
}

export function ShelfDetailsModal({ isOpen, onClose, warehouse }: ShelfDetailsModalProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'high' | 'low' | 'empty'>('all');
  const [selectedShelfId, setSelectedShelfId] = useState<string | null>(null);
  const [isLevelModalOpen, setIsLevelModalOpen] = useState(false);
  const [openRackMenuId, setOpenRackMenuId] = useState<string | null>(null);
  const [isAddRackModalOpen, setIsAddRackModalOpen] = useState(false);

  const [activeActionModal, setActiveActionModal] = useState<'edit' | 'goods' | 'move' | 'audit' | 'alert' | 'delete' | null>(null);

  // Fetch real layout from backend API
  const {
    layout,
    isLoading,
    createShelf,
    createLocation,
    assignIngredient,
  } = useWarehouseLayout(warehouse?.id || null);

  // Map dynamic layout to expected UI format
  const aisles = useMemo(() => {
    if (!layout || layout.length === 0) return [];
    
    return [
      {
        id: 'all-shelves',
        name: 'Khu vực kệ hàng',
        racks: layout.map((shelf: any) => {
          const totalLocs = shelf.locations?.length || 0;
          const occupiedLocs = shelf.locations?.filter((loc: any) => (loc.currentQuantity || 0) > 0).length || 0;
          const usage = totalLocs > 0 ? Math.round((occupiedLocs / totalLocs) * 100) : 0;
          
          return {
            id: shelf.id,
            name: shelf.name,
            code: shelf.code,
            shelves: totalLocs,
            usage,
            items: [...new Set(shelf.locations?.filter((loc: any) => loc.ingredient).map((loc: any) => loc.ingredient.name) || [])] as string[],
            locations: shelf.locations || []
          };
        })
      }
    ];
  }, [layout]);

  // Dynamically find selected shelf detail
  const selectedRack = useMemo(() => {
    if (!selectedShelfId || !layout) return null;
    const shelf = layout.find((s: any) => s.id === selectedShelfId);
    if (!shelf) return null;
    
    const totalLocs = shelf.locations?.length || 0;
    const occupiedLocs = shelf.locations?.filter((loc: any) => (loc.currentQuantity || 0) > 0).length || 0;
    const usage = totalLocs > 0 ? Math.round((occupiedLocs / totalLocs) * 100) : 0;
    
    return {
      id: shelf.id,
      name: shelf.name,
      code: shelf.code,
      shelves: totalLocs,
      usage,
      items: [...new Set(shelf.locations?.filter((loc: any) => loc.ingredient).map((loc: any) => loc.ingredient.name) || [])] as string[],
      locations: shelf.locations || []
    };
  }, [selectedShelfId, layout]);

  const filteredAisles = useMemo(() => {
    return aisles.map((aisle: any) => ({
      ...aisle,
      racks: aisle.racks.filter((rack: any) => {
        const matchesSearch = rack.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          rack.items.some((item: any) => item.toLowerCase().includes(searchTerm.toLowerCase()));

        let matchesFilter = true;
        if (filterStatus === 'high') matchesFilter = rack.usage >= 80;
        if (filterStatus === 'low') matchesFilter = rack.usage < 80 && rack.usage > 0;
        if (filterStatus === 'empty') matchesFilter = rack.usage === 0;

        return matchesSearch && matchesFilter;
      })
    })).filter((aisle: any) => aisle.racks.length > 0);
  }, [searchTerm, filterStatus, aisles]);

  if (!isOpen || !warehouse) return null;

  const handleManageLevels = (rack: any) => {
    setSelectedShelfId(rack.id);
    setIsLevelModalOpen(true);
  };

  return (
    <>
      <AntdModalShell open={isOpen} onClose={onClose} width={1024} zIndex={1500}>
        <GlassCard className="relative overflow-hidden flex flex-col h-[90vh] shadow-2xl" radius="4xl">
          {/* Header */}
          <div className="p-8 border-b border-primary-soft/20 bg-white/40 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-5">
              <div className="w-14 h-14 rounded-3xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                <Layout size={28} />
              </div>
              <div>
                <h2 className="text-2xl font-black text-text-primary">Chi tiết Kệ hàng & Vị trí</h2>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-xs font-bold text-primary uppercase tracking-widest">{warehouse.name}</span>
                  <span className="w-1 h-1 rounded-full bg-primary" />
                  <span className="text-xs font-bold text-text-secondary uppercase tracking-widest">{warehouse.code}</span>
                </div>
              </div>
            </div>
            <button onClick={onClose} className="p-3 text-text-muted hover:bg-white/60 rounded-2xl transition-all">
              <X size={24} />
            </button>
          </div>

          {/* Quick Stats Toolbar */}
          <div className="px-8 py-5 bg-[#FFFAF4]/30 border-b border-primary-soft/10 flex flex-wrap items-center justify-between gap-4 shrink-0">
            <div className="flex items-center gap-6">
              <div className="flex flex-col">
                <span className="text-[9px] font-black text-text-muted uppercase tracking-widest">Tổng kệ</span>
                <span className="text-lg font-black text-text-primary">{layout?.length || 0} kệ</span>
              </div>
              <div className="w-px h-8 bg-primary-soft/20" />
              <div className="flex flex-col">
                <span className="text-[9px] font-black text-text-muted uppercase tracking-widest">Không gian lắp đầy</span>
                <span className="text-lg font-black text-primary">
                  {layout?.length > 0
                    ? Math.round(layout.reduce((acc: number, s: any) => acc + (s.locations?.filter((l: any) => l.currentQuantity > 0).length || 0), 0) /
                      (layout.reduce((acc: number, s: any) => acc + (s.locations?.length || 0), 0) || 1) * 100)
                    : 0}%
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative group">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-primary-soft group-focus-within:text-primary transition-colors" size={14} />
                <input
                  type="text"
                  placeholder="Tìm rack, kệ, sản phẩm..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-white/60 border border-primary-soft/20 rounded-xl py-2.5 pl-9 pr-4 text-xs font-bold w-64 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                />
              </div>
              <div className="flex bg-white/60 border border-primary-soft/20 rounded-xl p-1">
                {[
                  { id: 'all', label: 'Tất cả' },
                  { id: 'high', label: 'Sắp đầy' },
                  { id: 'empty', label: 'Trống' },
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setFilterStatus(tab.id as any)}
                    className={cn(
                       "px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all",
                       filterStatus === tab.id ? "bg-primary text-white shadow-sm" : "text-text-primary hover:bg-white"
                    )}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
              <button
                onClick={() => setIsAddRackModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white rounded-xl text-xs font-black uppercase tracking-wider hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
              >
                <Plus size={14} strokeWidth={3} />
                Thêm kệ mới
              </button>
            </div>
          </div>

          {/* Scrollable Layout Content */}
          <div className="flex-1 overflow-y-auto p-8 space-y-10">
            {isLoading ? (
              <div className="py-24 flex flex-col items-center justify-center">
                <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mb-3" />
                <p className="text-xs font-bold text-text-muted">Đang tải sơ đồ kệ hàng...</p>
              </div>
            ) : filteredAisles.map((aisle: any, aisleIdx: number) => (
              <div key={aisle.id} className="space-y-6">
                <div className="flex items-center gap-3">
                  <h3 className="text-sm font-black text-text-primary uppercase tracking-widest underline decoration-primary/40 underline-offset-8 decoration-2">{aisle.name}</h3>
                  <span className="text-[10px] font-bold text-text-muted">{aisle.racks.length} Kệ hàng</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {aisle.racks.map((rack: any, rackIdx: number) => (
                    <div
                      key={rack.id}
                      className="p-6 rounded-4xl bg-white/60 border border-primary-soft/10 hover:border-primary/20 transition-all group"
                    >
                      <div className="flex justify-between items-start mb-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-2xl bg-[#FFFAF4] border border-primary-soft/30 flex items-center justify-center text-text-secondary">
                            <Hash size={18} />
                          </div>
                          <div>
                            <h4 className="text-base font-black text-text-primary">{rack.name}</h4>
                            <p className="text-[9px] text-text-muted font-bold tracking-wider uppercase">{rack.code}</p>
                          </div>
                        </div>
                        <div className="relative">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setOpenRackMenuId(openRackMenuId === rack.id ? null : rack.id);
                            }}
                            className={cn(
                              "p-1.5 rounded-lg transition-all",
                              openRackMenuId === rack.id ? "bg-primary text-white" : "text-text-muted hover:bg-white/60"
                            )}
                          >
                            <MoreVertical size={16} />
                          </button>

                          <AnimatePresence>
                            {openRackMenuId === rack.id && (
                              <>
                                <div
                                  key={`${rack.id}-menu-overlay`}
                                  className="fixed inset-0 z-10"
                                  onClick={() => setOpenRackMenuId(null)}
                                />
                                <motion.div
                                  key={`${rack.id}-menu-content`}
                                  initial={{ opacity: 0, scale: 0.95, y: 10 }}
                                  animate={{ opacity: 1, scale: 1, y: 0 }}
                                  exit={{ opacity: 0, scale: 0.95, y: 10 }}
                                  className="absolute right-0 top-full mt-2 w-48 bg-white rounded-2xl shadow-xl border border-primary-soft/20 p-2 z-20 overflow-hidden"
                                >
                                  {[
                                    { id: 'edit', label: 'Chỉnh sửa kệ', icon: Hash, color: 'text-text-secondary' },
                                    { id: 'goods', label: 'Quản lý hàng hóa', icon: Package, color: 'text-blue-500' },
                                  ].map((action) => (
                                    <button
                                      key={`${rack.id}-action-${action.id}`}
                                      onClick={() => {
                                        setSelectedShelfId(rack.id);
                                        setActiveActionModal(action.id as any);
                                        setOpenRackMenuId(null);
                                      }}
                                      className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-[#FFFAF4] transition-all group text-left"
                                    >
                                      <action.icon size={14} className={action.color} />
                                      <span className="text-[11px] font-bold text-text-primary tracking-tight">{action.label}</span>
                                    </button>
                                  ))}
                                </motion.div>
                              </>
                            )}
                          </AnimatePresence>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="flex justify-between text-[10px] font-bold text-text-muted uppercase tracking-widest">
                          <span>Không gian đã dùng</span>
                          <span className={cn(rack.usage > 80 ? "text-red-500" : "text-primary")}>{rack.usage}%</span>
                        </div>
                        <div className="h-2 w-full bg-primary-soft/10 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${rack.usage}%` }}
                            className={cn("h-full rounded-full", rack.usage > 80 ? "bg-red-500" : "bg-primary")}
                          />
                        </div>
                      </div>

                      <div className="mt-8 space-y-2">
                        <p className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em]">Mặt hàng đang chứa</p>
                        <div className="flex flex-wrap gap-1.5">
                          {rack.items.length > 0 ? rack.items.map((item: any, i: number) => (
                            <span key={`rack-${rack.id}-item-${i}`} className="px-2.5 py-1 rounded-lg bg-primary/5 text-primary text-[10px] font-bold border border-primary/5">
                              {item}
                            </span>
                          )) : (
                            <span className="text-[10px] font-bold text-primary-soft italic px-1">Kệ trống</span>
                          )}
                        </div>
                      </div>

                      <button
                        onClick={() => handleManageLevels(rack)}
                        className="w-full mt-6 py-3 rounded-xl bg-[#FFFAF4] border border-primary-soft/10 text-[10px] font-black text-text-secondary uppercase tracking-widest hover:bg-primary hover:text-white hover:border-primary transition-all"
                      >
                        Quản lý vị trí ({rack.shelves})
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {!isLoading && filteredAisles.length === 0 && (
              <div className="py-24 flex flex-col items-center justify-center text-center">
                <div className="w-20 h-20 rounded-[40px] bg-[#FFFAF4] flex items-center justify-center mb-6 border border-primary-soft/20 shadow-inner">
                  <Search size={40} className="text-primary-soft opacity-40" />
                </div>
                <h3 className="text-xl font-bold text-text-primary">Không tìm thấy vị trí phù hợp</h3>
                <p className="text-text-muted text-sm mt-1 max-w-xs mx-auto">Vui lòng thử lại với từ khóa khác hoặc xóa bộ lọc.</p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-8 border-t border-primary-soft/20 bg-[#FFFAF4]/60 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2 text-xs font-bold text-text-muted">
              <Warehouse size={14} className="text-primary" />
              Hệ thống quản lý kệ hàng v1.2
            </div>
            <button onClick={onClose} className="px-10 py-3.5 rounded-2xl bg-white border border-primary-soft/30 text-sm font-bold text-text-secondary transition-all hover:shadow-md active:scale-95">
              Đóng cửa sổ
            </button>
          </div>
        </GlassCard>
      </AntdModalShell>

      <ShelfLevelModal
        isOpen={isLevelModalOpen}
        onClose={() => {
          setIsLevelModalOpen(false);
          setSelectedShelfId(null);
        }}
        rack={selectedRack}
        onCreateLocation={createLocation}
        onAssignIngredient={assignIngredient}
      />

      <AddRackModal
        isOpen={isAddRackModalOpen}
        onClose={() => setIsAddRackModalOpen(false)}
        onSave={async (name, code) => {
          await createShelf({
            warehouse_id: warehouse.id,
            name,
            code
          });
          setIsAddRackModalOpen(false);
        }}
      />

      {/* Action Modals */}
      <ActionModal
        isOpen={!!activeActionModal}
        type={activeActionModal}
        rack={selectedRack}
        onClose={() => setActiveActionModal(null)}
      />
    </>
  );
}

interface ShelfLevelModalProps {
  isOpen: boolean;
  onClose: () => void;
  rack: any;
  onCreateLocation: (data: any) => Promise<any>;
  onAssignIngredient: (data: any) => Promise<any>;
}

function ShelfLevelModal({ isOpen, onClose, rack, onCreateLocation, onAssignIngredient }: ShelfLevelModalProps) {
  const { materials } = useInventory();
  const [newLocName, setNewLocName] = useState('');
  const [newLocCode, setNewLocCode] = useState('');
  const [newLocCapacity, setNewLocCapacity] = useState('100');
  const [isAddingLoc, setIsAddingLoc] = useState(false);
  const [selectedLocIdForAssign, setSelectedLocIdForAssign] = useState<string | null>(null);
  const [assignedIngId, setAssignedIngId] = useState<string>('');
  const [assignedQty, setAssignedQty] = useState('0');

  const levels = useMemo(() => {
    if (!rack || !rack.locations) return [];
    return rack.locations.map((loc: any) => {
      const isOccupied = (loc.currentQuantity || 0) > 0;
      return {
        id: loc.id,
        name: loc.name,
        code: loc.code,
        usage: isOccupied ? Math.min(100, Math.round((loc.currentQuantity / (loc.maxCapacity || loc.currentQuantity || 1)) * 100)) : 0,
        items: loc.ingredient ? [`${loc.ingredient.name} (${loc.currentQuantity} ${loc.ingredient.unit || 'đv'})`] : [],
        ingredient: loc.ingredient,
        currentQuantity: loc.currentQuantity,
        maxCapacity: loc.maxCapacity
      };
    }).reverse();
  }, [rack]);

  if (!isOpen || !rack) return null;

  const handleAddLocation = async () => {
    if (!newLocName || !newLocCode) return;
    try {
      await onCreateLocation({
        shelf_id: rack.id,
        name: newLocName,
        code: newLocCode,
        max_capacity: Number(newLocCapacity) || 100
      });
      setNewLocName('');
      setNewLocCode('');
      setNewLocCapacity('100');
      setIsAddingLoc(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAssignIngredient = async () => {
    if (!selectedLocIdForAssign) return;
    try {
      await onAssignIngredient({
        location_id: selectedLocIdForAssign,
        ingredient_id: assignedIngId || null,
        current_quantity: Number(assignedQty) || 0
      });
      setSelectedLocIdForAssign(null);
      setAssignedIngId('');
      setAssignedQty('0');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <AntdModalShell open={isOpen} onClose={onClose} width={768} zIndex={1600} maskColor="rgba(0, 0, 0, 0.4)">
      <GlassCard className="overflow-hidden" radius="4xl">
        {/* Header */}
        <div className="p-8 border-b border-primary-soft/20 bg-white/60 flex items-center justify-between">
          <div className="flex items-center gap-5">
            <div className="w-14 h-14 rounded-3xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
              <Layers size={28} />
            </div>
            <div>
              <h2 className="text-2xl font-black text-text-primary">Quản lý các Vị trí ô kệ</h2>
              <p className="text-xs text-text-muted font-bold uppercase tracking-widest mt-1">Cấu trúc chi tiết của {rack.name} ({rack.code})</p>
            </div>
          </div>
          <button onClick={onClose} className="p-3 text-text-muted hover:bg-white/60 rounded-2xl transition-all">
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-8 space-y-6 max-h-[60vh] overflow-y-auto bg-[#FFFAF4]/20">
          {/* Quick inline creation of location */}
          {!isAddingLoc ? (
            <button
              onClick={() => setIsAddingLoc(true)}
              className="w-full py-4 border border-dashed border-primary-soft/40 rounded-3xl text-xs font-black uppercase tracking-wider text-primary hover:bg-[#FFFAF4] transition-all flex items-center justify-center gap-2"
            >
              <Plus size={16} /> Thêm vị trí chứa hàng mới vào kệ này
            </button>
          ) : (
            <div className="p-6 rounded-4xl bg-white border border-primary-soft/30 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-black text-text-primary uppercase tracking-widest">Thêm vị trí mới</h4>
                <button onClick={() => setIsAddingLoc(false)} className="text-text-muted hover:text-red-500"><X size={16} /></button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <input
                  type="text"
                  placeholder="Tên vị trí (VD: Ô A1)"
                  value={newLocName}
                  onChange={(e) => setNewLocName(e.target.value)}
                  className="bg-white border border-primary-soft/20 rounded-xl py-3 px-4 text-xs font-bold w-full focus:outline-none focus:ring-1 focus:ring-primary shadow-inner"
                />
                <input
                  type="text"
                  placeholder="Mã vị trí (VD: LOC-A1-01)"
                  value={newLocCode}
                  onChange={(e) => setNewLocCode(e.target.value)}
                  className="bg-white border border-primary-soft/20 rounded-xl py-3 px-4 text-xs font-bold w-full focus:outline-none focus:ring-1 focus:ring-primary shadow-inner"
                />
                <input
                  type="number"
                  placeholder="Sức chứa tối đa (VD: 100)"
                  value={newLocCapacity}
                  onChange={(e) => setNewLocCapacity(e.target.value)}
                  className="bg-white border border-primary-soft/20 rounded-xl py-3 px-4 text-xs font-bold w-full focus:outline-none focus:ring-1 focus:ring-primary shadow-inner"
                />
              </div>
              <div className="flex justify-end gap-2">
                <button onClick={() => setIsAddingLoc(false)} className="px-4 py-2 border rounded-xl text-xs font-bold text-text-secondary hover:bg-gray-50">Hủy</button>
                <button onClick={handleAddLocation} className="px-5 py-2 bg-primary text-white rounded-xl text-xs font-bold hover:bg-primary-deep shadow-lg shadow-primary/10">Tạo mới</button>
              </div>
            </div>
          )}

          {/* Quick mapping overlay/form */}
          {selectedLocIdForAssign && (
            <div className="p-6 rounded-4xl bg-primary/5 border border-primary-soft/30 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-black text-primary uppercase tracking-widest">Xếp nguyên liệu vào ô kệ</h4>
                <button onClick={() => setSelectedLocIdForAssign(null)} className="text-text-muted hover:text-red-500"><X size={16} /></button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-[#968271] uppercase">Chọn nguyên liệu</label>
                  <select
                    value={assignedIngId}
                    onChange={(e) => setAssignedIngId(e.target.value)}
                    className="w-full bg-white border border-primary-soft/20 rounded-xl py-3 px-4 text-xs font-bold focus:outline-none"
                  >
                    <option value="">-- Để trống ô kệ --</option>
                    {materials.map((m: any) => (
                      <option key={m.id} value={m.id}>{m.name} ({m.unit})</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-[#968271] uppercase">Số lượng xếp kho</label>
                  <input
                    type="number"
                    value={assignedQty}
                    onChange={(e) => setAssignedQty(e.target.value)}
                    className="w-full bg-white border border-primary-soft/20 rounded-xl py-3 px-4 text-xs font-bold focus:outline-none shadow-inner"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <button onClick={() => setSelectedLocIdForAssign(null)} className="px-4 py-2 border rounded-xl text-xs font-bold text-text-secondary">Hủy</button>
                <button onClick={handleAssignIngredient} className="px-5 py-2 bg-primary text-white rounded-xl text-xs font-bold hover:bg-primary-deep shadow-lg shadow-primary/10">Lưu lại</button>
              </div>
            </div>
          )}

          {/* Locations list */}
          <div className="space-y-3">
            {levels.map((level: any, idx: number) => (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                key={level.id}
                className="p-5 rounded-4xl bg-white border border-primary-soft/20 hover:border-primary/30 transition-all flex items-center gap-5 group"
              >
                <div className="w-10 h-10 rounded-2xl bg-[#FFFAF4] border border-primary-soft/20 flex items-center justify-center font-black text-xs text-text-primary">
                  {idx + 1}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1.5">
                    <div>
                      <h4 className="text-sm font-black text-text-primary flex items-center gap-2">
                        {level.name}
                        <span className="text-[9px] font-bold text-text-muted tracking-wider uppercase bg-gray-100 px-2 py-0.5 rounded-md border border-gray-200">{level.code}</span>
                      </h4>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={cn(
                        "text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border",
                        level.usage >= 90 ? "bg-red-50 text-red-500 border-red-200" :
                          level.usage > 0 ? "bg-green-50 text-green-600 border-green-200" : "bg-gray-50 text-gray-400 border-gray-200"
                      )}>
                        {level.usage >= 90 ? 'Đã đầy' : level.usage > 0 ? 'Còn chỗ' : 'Trống'}
                      </span>
                      <button
                        onClick={() => {
                          setSelectedLocIdForAssign(level.id);
                          setAssignedIngId(level.ingredient?.id || '');
                          setAssignedQty(level.currentQuantity?.toString() || '0');
                        }}
                        className="p-1 text-primary hover:bg-primary/5 rounded-lg border border-primary-soft/20 transition-all"
                        title="Xếp hàng"
                      >
                        <Edit2 size={12} />
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {level.items.length > 0 ? level.items.map((item: any, i: number) => (
                      <div key={`${level.id}-item-${i}`} className="flex items-center gap-2 px-3 py-1 rounded-xl bg-primary/5 border border-primary/10 text-[10px] font-bold text-primary">
                        <Package size={12} />
                        {item}
                      </div>
                    )) : (
                      <p className="text-[10px] text-primary-soft font-bold uppercase tracking-widest italic">Sẵn sàng để nhập nguyên liệu</p>
                    )}
                  </div>
                </div>

                <div className="w-28 hidden sm:block">
                  <div className="flex justify-between text-[8px] font-black text-[#968271] uppercase mb-1">
                    <span>Lượng hàng</span>
                    <span>{level.usage}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-primary-soft/10 rounded-full overflow-hidden">
                    <div
                      className={cn("h-full rounded-full transition-all duration-500", level.usage >= 90 ? "bg-red-500" : "bg-primary")}
                      style={{ width: `${level.usage}%` }}
                    />
                  </div>
                </div>
              </motion.div>
            ))}

            {levels.length === 0 && (
              <div className="py-12 flex flex-col items-center justify-center text-center">
                <p className="text-xs font-bold text-text-muted italic">Chưa có vị trí ô kệ nào được định nghĩa trên kệ này.</p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-8 border-t border-primary-soft/20 bg-white/40 flex justify-end">
          <button
            onClick={onClose}
            className="px-10 py-3.5 rounded-2xl bg-primary text-white text-sm font-black shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] active:scale-95"
          >
            Đóng cửa sổ
          </button>
        </div>
      </GlassCard>
    </AntdModalShell>
  );
}

function ActionModal({ isOpen, type, rack, onClose }: { isOpen: boolean, type: any, rack: any, onClose: () => void }) {
  if (!isOpen || !rack) return null;

  const actionConfigs: Record<string, { title: string, icon: any, btnText: string, color: string }> = {
    edit: { title: 'Chỉnh sửa Kệ', icon: Hash, btnText: 'Cập nhật thông tin', color: 'primary' },
    goods: { title: 'Quản lý Hàng hóa', icon: Package, btnText: 'Đóng cửa sổ', color: 'blue-500' },
  };

  const config = actionConfigs[type as keyof typeof actionConfigs] || { title: 'Thông tin Shelf', icon: Hash, btnText: 'Xác nhận', color: 'primary' };
  const Icon = config.icon;

  return (
    <AntdModalShell open={isOpen} onClose={onClose} width={448} zIndex={1800} maskColor="rgba(0, 0, 0, 0.5)">
      <GlassCard className="overflow-hidden" radius="4xl">
        <div className="p-8 border-b border-primary-soft/20 bg-white/60 flex items-center justify-between">
          <div className="flex items-center gap-5">
            <div className={cn(
              "w-14 h-14 rounded-3xl flex items-center justify-center border",
              type === 'delete' ? "bg-red-50 text-red-500 border-red-100" :
                "bg-primary/10 text-primary border-primary/20"
            )}>
              <Icon size={28} />
            </div>
            <div>
              <h2 className="text-xl font-black text-text-primary">{config.title}</h2>
              <p className="text-[10px] text-text-muted font-bold uppercase tracking-widest mt-0.5">Đang thao tác trên: {rack.name}</p>
            </div>
          </div>
        </div>

        <div className="p-8 space-y-6">
          {type === 'goods' && (
            <div className="space-y-4">
              <p className="text-xs font-bold text-text-secondary leading-relaxed">
                Danh sách các mặt hàng đang được lưu trữ tại <span className="text-primary font-black">{rack.name}</span>:
              </p>
              <div className="space-y-2">
                {rack.items.map((item: string, i: number) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-white/60 border border-primary-soft/20 rounded-xl group hover:border-blue-500/30 transition-all">
                    <span className="text-xs font-bold text-text-primary">{item}</span>
                  </div>
                ))}
                {rack.items.length === 0 && (
                  <p className="text-xs text-text-muted italic">Kệ đang trống</p>
                )}
              </div>
            </div>
          )}

          {type === 'edit' && (
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em]">Tên kệ mới</label>
                <input defaultValue={rack.name} className="w-full bg-white/60 border border-primary-soft/20 rounded-2xl py-4 px-6 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-primary/20 shadow-inner" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em]">Mã kệ mới</label>
                <input defaultValue={rack.code} className="w-full bg-white/60 border border-primary-soft/20 rounded-2xl py-4 px-6 text-sm font-bold" />
              </div>
            </div>
          )}
        </div>

        <div className="p-8 border-t border-primary-soft/20 bg-white/40 flex gap-3">
          <button onClick={onClose} className="flex-1 py-4 rounded-2xl bg-white border border-primary-soft/30 text-sm font-bold text-text-secondary">Hủy</button>
          <button
            onClick={onClose}
            className="flex-2 py-4 rounded-2xl bg-primary text-white text-sm font-black shadow-lg shadow-primary/20"
          >
            {config.btnText}
          </button>
        </div>
      </GlassCard>
    </AntdModalShell>
  );
}

interface AddRackModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (name: string, code: string) => Promise<void>;
}

function AddRackModal({ isOpen, onClose, onSave }: AddRackModalProps) {
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  if (!isOpen) return null;

  const handleSave = async () => {
    if (!name || !code) return;
    setIsSaving(true);
    try {
      await onSave(name, code);
      setName('');
      setCode('');
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <AntdModalShell open={isOpen} onClose={onClose} width={448} zIndex={1700} maskColor="rgba(0, 0, 0, 0.4)">
      <GlassCard className="overflow-hidden" radius="4xl">
        <div className="p-8 border-b border-primary-soft/20 bg-white/60 flex items-center justify-between">
          <div className="flex items-center gap-5">
            <div className="w-14 h-14 rounded-3xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
              <Plus size={28} />
            </div>
            <div>
              <h2 className="text-2xl font-black text-text-primary">Thêm Kệ mới</h2>
              <p className="text-xs text-text-muted font-bold uppercase tracking-widest mt-1">Khởi tạo vị trí lưu trữ mới</p>
            </div>
          </div>
          <button onClick={onClose} className="p-3 text-text-muted hover:bg-white/60 rounded-2xl transition-all">
            <X size={24} />
          </button>
        </div>

        <div className="p-8 space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em]">Tên kệ hàng</label>
            <input
              type="text"
              placeholder="Ví dụ: Kệ A4, Kệ B5..."
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                // Auto generate code from name
                const generatedCode = `SHELF-${e.target.value.replace(/[^A-Za-z0-9]/g, "").toUpperCase()}`;
                setCode(generatedCode);
              }}
              className="w-full bg-white/60 border border-primary-soft/20 rounded-2xl py-4 px-6 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all shadow-inner"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em]">Mã kệ hàng</label>
            <input
              type="text"
              placeholder="Ví dụ: SHELF-A4"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full bg-white/60 border border-primary-soft/20 rounded-2xl py-4 px-6 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all shadow-inner"
            />
          </div>

          <div className="p-6 rounded-3xl bg-[#FFFAF4]/50 border border-primary-soft/10">
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center shrink-0 border border-amber-100">
                <AlertTriangle size={18} className="text-amber-600" />
              </div>
              <p className="text-[11px] font-medium text-text-secondary leading-relaxed">
                Sau khi tạo kệ hàng mới, bạn sẽ có thể tạo thêm các tầng và ô chứa hàng chi tiết tương ứng trên kệ đó.
              </p>
            </div>
          </div>
        </div>

        <div className="p-8 border-t border-primary-soft/20 bg-white/40 flex gap-3">
          <button
            onClick={onClose}
            disabled={isSaving}
            className="flex-1 py-4 rounded-2xl bg-white border border-primary-soft/30 text-sm font-black text-text-secondary transition-all hover:bg-gray-50 active:scale-95"
          >
            Hủy bỏ
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving || !name || !code}
            className="flex-2 py-4 rounded-2xl bg-primary text-white text-sm font-black shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50"
          >
            {isSaving ? "Đang lưu..." : "Tạo kệ hàng mới"}
          </button>
        </div>
      </GlassCard>
    </AntdModalShell>
  );
}

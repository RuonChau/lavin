'use client';

import { motion, AnimatePresence } from 'motion/react';
import { X, Warehouse, MapPin, User, ThermometerSnowflake, ShieldCheck, Box } from 'lucide-react';
import { GlassCard } from '@/shared/components/GlassCard';
import { cn } from '@/shared/utils/cn';
import { useState } from 'react';

interface WarehouseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
}

export function WarehouseModal({ isOpen, onClose, onSave }: WarehouseModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    type: 'GENERAL',
    location: '',
    manager: '',
    capacity: 1000,
  });

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 z-[150] bg-black/20 backdrop-blur-sm"
      />

      <div className="fixed inset-0 z-[151] flex items-center justify-center p-4 pointer-events-none">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="w-full max-w-xl pointer-events-auto"
        >
          <GlassCard className="relative overflow-hidden" radius="4xl">
            {/* Header */}
            <div className="p-8 border-b border-[#D8B894]/20 bg-white/40 flex items-center justify-between">
              <div className="flex items-center gap-5">
                <div className="w-14 h-14 rounded-[24px] bg-primary/10 flex items-center justify-center text-primary border border-primary/20 shadow-inner">
                  <Warehouse size={28} />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-[#2A1E17]">Thêm kho mới</h2>
                  <p className="text-xs text-[#9A8677] font-bold uppercase tracking-widest mt-0.5">Thiết lập khu vực lưu trữ mới</p>
                </div>
              </div>
              <button onClick={onClose} className="p-3 text-[#9A8677] hover:bg-white/60 rounded-2xl transition-all">
                <X size={24} />
              </button>
            </div>

            {/* Form Content */}
            <div className="p-8 space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-[#968271] uppercase tracking-[0.2em] ml-1">Tên kho</label>
                  <div className="relative group">
                    <Warehouse className="absolute left-4 top-1/2 -translate-y-1/2 text-[#D8B894] group-focus-within:text-primary transition-colors" size={18} />
                    <input 
                      type="text" 
                      placeholder="VD: Kho tổng A"
                      className="w-full bg-[#FFFAF4]/40 border border-[#D8B894]/20 rounded-2xl py-3.5 pl-12 pr-4 text-sm font-bold text-[#2A1E17] focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all"
                      value={formData.name}
                      onChange={e => setFormData({...formData, name: e.target.value})}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-[#968271] uppercase tracking-[0.2em] ml-1">Mã kho</label>
                  <input 
                    type="text" 
                    placeholder="VD: WH-01"
                    className="w-full bg-[#FFFAF4]/40 border border-[#D8B894]/20 rounded-2xl py-3.5 px-4 text-sm font-bold text-[#2A1E17] focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all uppercase"
                    value={formData.code}
                    onChange={e => setFormData({...formData, code: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-[#968271] uppercase tracking-[0.2em] ml-1">Loại hình bảo quản</label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { id: 'GENERAL', label: 'Kho thường', icon: Warehouse },
                    { id: 'COLD', label: 'Kho lạnh', icon: ThermometerSnowflake },
                    { id: 'SUPPLY', label: 'Kho vật tư', icon: Box },
                  ].map((type) => (
                    <button
                      key={type.id}
                      onClick={() => setFormData({...formData, type: type.id as any})}
                      className={cn(
                        "flex flex-col items-center gap-2 p-4 rounded-3xl border transition-all active:scale-95",
                        formData.type === type.id 
                          ? "bg-primary/5 border-primary text-primary shadow-sm"
                          : "bg-white border-[#D8B894]/20 text-[#6F5A4A] hover:bg-white hover:border-[#D8B894]/40"
                      )}
                    >
                      <type.icon size={20} />
                      <span className="text-[10px] font-black uppercase tracking-wider">{type.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-[#968271] uppercase tracking-[0.2em] ml-1">Vị trí địa lý</label>
                  <div className="relative group">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-[#D8B894] group-focus-within:text-primary transition-colors" size={18} />
                    <input 
                      type="text" 
                      placeholder="VD: Tầng móng, Khu kỹ thuật"
                      className="w-full bg-[#FFFAF4]/40 border border-[#D8B894]/20 rounded-2xl py-3.5 pl-12 pr-4 text-sm font-bold text-[#2A1E17] focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all"
                      value={formData.location}
                      onChange={e => setFormData({...formData, location: e.target.value})}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-[#968271] uppercase tracking-[0.2em] ml-1">Quản lý kho</label>
                    <div className="relative group">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 text-[#D8B894] group-focus-within:text-primary transition-colors" size={18} />
                      <input 
                        type="text" 
                        placeholder="Tên người quản lý"
                        className="w-full bg-[#FFFAF4]/40 border border-[#D8B894]/20 rounded-2xl py-3.5 pl-12 pr-4 text-sm font-bold text-[#2A1E17] focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all"
                        value={formData.manager}
                        onChange={e => setFormData({...formData, manager: e.target.value})}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-[#968271] uppercase tracking-[0.2em] ml-1">Sức chứa tối đa</label>
                    <input 
                      type="number" 
                      placeholder="VD: 1000"
                      className="w-full bg-[#FFFAF4]/40 border border-[#D8B894]/20 rounded-2xl py-3.5 px-4 text-sm font-bold text-[#2A1E17] focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all"
                      value={formData.capacity}
                      onChange={e => setFormData({...formData, capacity: parseInt(e.target.value)})}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-8 border-t border-[#D8B894]/20 bg-[#FFFAF4]/40 flex gap-4">
              <button 
                onClick={onClose}
                className="flex-1 py-4 rounded-2xl bg-white border border-[#D8B894]/30 text-sm font-bold text-[#6F5A4A] transition-all hover:shadow-md"
              >
                Hủy bỏ
              </button>
              <button 
                onClick={() => onSave(formData)}
                className="flex-[2] py-4 rounded-2xl bg-primary text-white text-sm font-black shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2"
              >
                <ShieldCheck size={20} />
                Lưu thông tin kho
              </button>
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

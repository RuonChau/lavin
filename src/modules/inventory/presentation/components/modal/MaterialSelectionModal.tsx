'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Search, Package, ChevronRight } from 'lucide-react';
import { GlassCard } from '@/shared/components/GlassCard';
import { Material } from '../../../domain/entities/material.entity';

interface MaterialSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  materials: Material[];
  onSelect: (material: Material) => void;
  title?: string;
  description?: string;
}

export function MaterialSelectionModal({ 
  isOpen, 
  onClose, 
  materials, 
  onSelect,
  title = "Chọn nguyên liệu",
  description = "Chọn một nguyên liệu để tiếp tục hành động."
}: MaterialSelectionModalProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredMaterials = materials.filter(m => 
    m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[200] bg-black/20 backdrop-blur-sm"
          />

          <div className="fixed inset-0 z-[201] flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="w-full max-w-lg pointer-events-auto"
            >
              <GlassCard className="relative overflow-hidden flex flex-col max-h-[70vh]" radius="4xl">
                {/* Header */}
                <div className="p-6 border-b border-[#D8B894]/20 bg-white/40">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h2 className="text-xl font-bold text-[#2A1E17]">{title}</h2>
                      <p className="text-xs text-[#9A8677] mt-0.5">{description}</p>
                    </div>
                    <button onClick={onClose} className="p-2 text-[#9A8677] hover:bg-white/60 rounded-xl transition-all">
                      <X size={20} />
                    </button>
                  </div>

                  <div className="relative group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#D8B894] transition-colors group-focus-within:text-primary" size={18} />
                    <input 
                      type="text" 
                      placeholder="Tìm tên nguyên liệu, SKU..." 
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      autoFocus
                      className="w-full pl-11 pr-5 py-3 rounded-2xl bg-[#FFFAF4]/60 border border-[#D8B894]/30 text-sm focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all"
                    />
                  </div>
                </div>

                {/* List */}
                <div className="flex-1 overflow-y-auto p-4">
                  <div className="space-y-2">
                    {filteredMaterials.map((material) => (
                      <button
                        key={material.id}
                        onClick={() => onSelect(material)}
                        className="w-full flex items-center justify-between p-4 rounded-3xl bg-white/40 border border-transparent hover:border-primary/20 hover:bg-white/60 transition-all group"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-2xl bg-primary/5 flex items-center justify-center text-primary border border-primary/10 group-hover:bg-primary group-hover:text-white transition-all">
                            <Package size={20} />
                          </div>
                          <div className="text-left">
                            <p className="text-sm font-bold text-[#2A1E17]">{material.name}</p>
                            <p className="text-[10px] text-[#9A8677] font-bold">{material.sku} • {material.unit}</p>
                          </div>
                        </div>
                        <ChevronRight size={18} className="text-[#D8B894] group-hover:translate-x-1 transition-transform" />
                      </button>
                    ))}

                    {filteredMaterials.length === 0 && (
                      <div className="py-12 text-center">
                        <Package size={40} className="mx-auto text-[#D8B894] opacity-20 mb-3" />
                        <p className="text-sm font-bold text-[#9A8677]">Không tìm thấy nguyên liệu nào</p>
                      </div>
                    )}
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}

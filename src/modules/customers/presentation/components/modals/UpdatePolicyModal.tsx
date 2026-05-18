'use client';

import { motion, AnimatePresence } from 'motion/react';
import { GlassCard } from '@/shared/components/GlassCard';
import { X, Settings, Coins, CalendarClock, Bell, Save } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/shared/utils/cn';

interface UpdatePolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function UpdatePolicyModal({ isOpen, onClose }: UpdatePolicyModalProps) {
  const [formData, setFormData] = useState({
    pointValue: 1000,
    earnRate: 10000,
    expiry: '12',
    notifyExpiry: true,
  });

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-primary-deep/20 backdrop-blur-sm z-40"
          />

          {/* Modal Container */}
          <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="pointer-events-auto w-full max-w-3xl"
            >
              <GlassCard radius="3xl" className="p-0 overflow-hidden border-[#D8B894]/30 shadow-2xl">
                {/* Header */}
                <div className="px-8 py-6 border-b border-[#D8B894]/20 flex items-center justify-between bg-white/40">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-primary/10 rounded-xl text-primary">
                      <Settings size={20} />
                    </div>
                    <div>
                      <h2 className="text-xl font-black text-primary-deep tracking-tight">Cập nhật chính sách</h2>
                      <p className="text-sm font-medium text-text-muted mt-0.5">Thiết lập quy định chung cho hệ thống điểm thưởng</p>
                    </div>
                  </div>
                  <button
                    onClick={onClose}
                    className="p-2 text-text-muted hover:text-primary hover:bg-primary/10 rounded-full transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>

                {/* Body */}
                <div className="p-4 space-y-4">
                  {/* Point Value */}
                  <div className="space-y-4">
                    <h3 className="text-xs font-black text-primary uppercase tracking-widest flex items-center gap-2">
                      <Coins size={14} /> Giá trị quy đổi
                    </h3>

                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-text-secondary">Tỷ lệ quy đổi (Dùng điểm)</label>
                        <div className="flex items-center">
                          <span className="px-2 py-3 bg-white/50 border border-r-0 border-[#D8B894]/30 rounded-l-xl text-sm font-bold text-text-muted">1 Điểm =</span>
                          <input
                            type="number"
                            value={formData.pointValue}
                            onChange={(e) => setFormData({ ...formData, pointValue: Number(e.target.value) })}
                            className="flex-1 px-4 py-3 bg-white/80 border border-[#D8B894]/30 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-sm font-black text-primary-deep"
                          />
                          <span className="px-2 py-3 bg-white/50 border border-l-0 border-[#D8B894]/30 rounded-r-xl text-sm font-bold text-text-muted">VNĐ</span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-bold text-text-secondary">Tỷ lệ tích lũy (Nhận điểm)</label>
                        <div className="flex items-center">
                          <input
                            type="number"
                            value={formData.earnRate}
                            onChange={(e) => setFormData({ ...formData, earnRate: Number(e.target.value) })}
                            className="flex-1 px-4 py-3 bg-white/80 border border-[#D8B894]/30 border-r-0 rounded-l-xl focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-sm font-black text-primary-deep"
                          />
                          <span className="px-4 py-3 bg-white/50 border border-[#D8B894]/30 rounded-r-xl text-sm font-bold text-text-muted">VNĐ = 1 Điểm</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="h-px bg-gradient-to-r from-transparent via-[#D8B894]/30 to-transparent" />

                  {/* Expiry & Notifications */}
                  <div className="space-y-4">
                    <h3 className="text-xs font-black text-primary uppercase tracking-widest flex items-center gap-2">
                      <CalendarClock size={14} /> Thời hạn & Thông báo
                    </h3>

                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-text-secondary">Hạn sử dụng điểm</label>
                        <select
                          value={formData.expiry}
                          onChange={(e) => setFormData({ ...formData, expiry: e.target.value })}
                          className="w-full px-4 py-3 bg-white/80 border border-[#D8B894]/30 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-sm font-bold text-primary-deep appearance-none"
                        >
                          <option value="none">Không bao giờ hết hạn</option>
                          <option value="6">6 tháng kể từ ngày tích</option>
                          <option value="12">12 tháng kể từ ngày tích</option>
                          <option value="24">24 tháng kể từ ngày tích</option>
                        </select>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-bold text-text-secondary">Thông báo sắp hết hạn</label>
                        <div
                          onClick={() => setFormData({ ...formData, notifyExpiry: !formData.notifyExpiry })}
                          className="flex items-center justify-between p-3 bg-white/60 border border-[#D8B894]/30 rounded-xl cursor-pointer hover:bg-white/80 transition-all"
                        >
                          <div className="flex items-center gap-2 text-sm font-bold text-text-secondary">
                            <Bell size={16} className={formData.notifyExpiry ? "text-primary" : "text-text-muted"} />
                            Nhắc nhở khách hàng
                          </div>
                          <div className={cn(
                            "w-10 h-5.5 rounded-full p-0.5 transition-colors duration-300 ease-in-out",
                            formData.notifyExpiry ? "bg-primary" : "bg-text-muted/30"
                          )}>
                            <div className={cn(
                              "w-4.5 h-4.5 bg-white rounded-full shadow-sm transform transition-transform duration-300 ease-in-out",
                              formData.notifyExpiry ? "translate-x-4.5" : "translate-x-0"
                            )} />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Warning / Note */}
                  <div className="p-4 bg-amber-50/80 border border-amber-200/50 rounded-xl flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-2 flex-shrink-0" />
                    <p className="text-xs font-medium text-amber-800/80 leading-relaxed">
                      Lưu ý: Việc thay đổi tỷ lệ quy đổi sẽ áp dụng ngay lập tức cho toàn bộ giao dịch mới. Điểm hiện tại của khách hàng không bị ảnh hưởng giá trị tuyệt đối.
                    </p>
                  </div>

                </div>

                {/* Footer */}
                <div className="px-8 py-5 border-t border-[#D8B894]/20 bg-white/40 flex items-center justify-end gap-3">
                  <button
                    onClick={onClose}
                    className="px-6 py-2.5 rounded-xl text-sm font-bold text-text-secondary hover:bg-white/60 transition-all"
                  >
                    Hủy bỏ
                  </button>
                  <button
                    onClick={() => {
                      // Logic save here
                      onClose();
                    }}
                    className="flex items-center gap-2 px-6 py-2.5 bg-primary text-white rounded-xl text-sm font-black hover:bg-primary-deep hover:shadow-lg hover:shadow-primary/20 transition-all transform active:scale-95"
                  >
                    <Save size={16} />
                    Lưu thay đổi
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

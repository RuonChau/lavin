'use client';

import { GlassCard } from '@/shared/components/GlassCard';
import { X, Settings, Coins, CalendarClock, Bell, Save } from 'lucide-react';
import { useState } from 'react';
import { AntdModalShell } from '@/shared/ui/antd-modal-shell';
import { InputNumber, Select, Switch } from 'antd';

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
    <AntdModalShell open={isOpen} onClose={onClose} width={768} zIndex={1000} maskColor="rgba(91, 58, 41, 0.2)">
      <GlassCard radius="3xl" className="p-0 overflow-hidden border-primary-soft/30 shadow-2xl">
        {/* Header */}
        <div className="px-8 py-6 border-b border-primary-soft/20 flex items-center justify-between bg-white/40">
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
                <div className="flex h-12 w-full border border-primary-soft/30 rounded-xl overflow-hidden bg-white/80">
                  <span className="flex items-center px-3 bg-white/50 border-r border-primary-soft/30 text-sm font-bold text-text-muted whitespace-nowrap shrink-0">
                    1 Điểm =
                  </span>
                  <InputNumber
                    value={formData.pointValue}
                    onChange={(val) => setFormData({ ...formData, pointValue: val ?? 0 })}
                    min={0}
                    controls={false}
                    variant="borderless"
                    className="flex-1 [&_.ant-input-number-input]:h-12 [&_.ant-input-number-input]:px-3 [&_.ant-input-number-input]:font-black [&_.ant-input-number-input]:text-primary-deep [&_.ant-input-number]:shadow-none!"
                    style={{ flex: 1, background: 'transparent' }}
                  />
                  <span className="flex items-center px-3 bg-white/50 border-l border-primary-soft/30 text-sm font-bold text-text-muted whitespace-nowrap shrink-0">
                    VNĐ
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-text-secondary">Tỷ lệ tích lũy (Nhận điểm)</label>
                <div className="flex h-12 w-full border border-primary-soft/30 rounded-xl overflow-hidden bg-white/80">
                  <InputNumber
                    value={formData.earnRate}
                    onChange={(val) => setFormData({ ...formData, earnRate: val ?? 0 })}
                    min={0}
                    controls={false}
                    variant="borderless"
                    className="flex-1 [&_.ant-input-number-input]:h-12 [&_.ant-input-number-input]:px-3 [&_.ant-input-number-input]:font-black [&_.ant-input-number-input]:text-primary-deep [&_.ant-input-number]:shadow-none!"
                    style={{ flex: 1, background: 'transparent' }}
                  />
                  <span className="flex items-center px-4 bg-white/50 border-l border-primary-soft/30 text-sm font-bold text-text-muted whitespace-nowrap shrink-0">
                    VNĐ = 1 Điểm
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="h-px bg-linear-to-r from-transparent via-primary-soft/30 to-transparent" />

          {/* Expiry & Notifications */}
          <div className="space-y-4">
            <h3 className="text-xs font-black text-primary uppercase tracking-widest flex items-center gap-2">
              <CalendarClock size={14} /> Thời hạn & Thông báo
            </h3>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-text-secondary">Hạn sử dụng điểm</label>
                <Select
                  value={formData.expiry}
                  onChange={(val) => setFormData({ ...formData, expiry: val })}
                  className="w-full h-12 [&_.ant-select-selector]:h-12! [&_.ant-select-selector]:border-primary-soft/30! [&_.ant-select-selector]:bg-white/80! [&_.ant-select-selector]:rounded-xl! [&_.ant-select-selection-item]:flex! [&_.ant-select-selection-item]:items-center! [&_.ant-select-selection-item]:font-bold! [&_.ant-select-selection-item]:text-primary-deep!"
                  options={[
                    { value: 'none', label: 'Không bao giờ hết hạn' },
                    { value: '6', label: '6 tháng kể từ ngày tích' },
                    { value: '12', label: '12 tháng kể từ ngày tích' },
                    { value: '24', label: '24 tháng kể từ ngày tích' },
                  ]}
                  classNames={{ popup: { root: '!rounded-2xl' } }}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-text-secondary">Thông báo sắp hết hạn</label>
                <div className="flex items-center justify-between h-12 px-4 bg-white/60 border border-primary-soft/30 rounded-xl">
                  <div className="flex items-center gap-2 text-sm font-bold text-text-secondary">
                    <Bell size={16} className={formData.notifyExpiry ? 'text-primary' : 'text-text-muted'} />
                    Nhắc nhở khách hàng
                  </div>
                  <Switch
                    checked={formData.notifyExpiry}
                    onChange={(checked) => setFormData({ ...formData, notifyExpiry: checked })}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Warning / Note */}
          <div className="p-4 bg-amber-50/80 border border-amber-200/50 rounded-xl flex items-start gap-3">
            <div className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-2 shrink-0" />
            <p className="text-xs font-medium text-amber-800/80 leading-relaxed">
              Lưu ý: Việc thay đổi tỷ lệ quy đổi sẽ áp dụng ngay lập tức cho toàn bộ giao dịch mới. Điểm hiện tại của khách hàng không bị ảnh hưởng giá trị tuyệt đối.
            </p>
          </div>

        </div>

        {/* Footer */}
        <div className="px-8 py-5 border-t border-primary-soft/20 bg-white/40 flex items-center justify-end gap-3">
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
    </AntdModalShell>
  );
}

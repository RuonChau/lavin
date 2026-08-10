'use client';

import { useState } from "react";
import { GlassCard } from "@/shared/components/GlassCard";
import { cn } from "@/shared/utils/cn";
import { Edit2, Gift, Loader2, TrendingUp } from "lucide-react";
import { App, Form, Input, InputNumber, Modal, Select } from "antd";
import { useCustomerTiers } from "@/modules/customers/presentation/hooks/useCustomerTiers";
import { CustomerTierItem } from "@/modules/customers/infrastructure/services/customer-tier.service";
import { UpdatePolicyModal } from "../modals/update-policy.modal";

const colorClass = (color: string | null) => {
  switch (color) {
    case 'amber': return 'bg-amber-50 border-amber-200 text-amber-700';
    case 'blue': return 'bg-blue-50 border-blue-200 text-blue-700';
    case 'zinc': return 'bg-zinc-50 border-zinc-200 text-zinc-700';
    default: return 'bg-slate-50 border-slate-200 text-slate-700';
  }
};

export default function TiersTab() {
  const { tiers, isLoading, updateTier, isUpdating } = useCustomerTiers();
  const { message } = App.useApp();
  const [isPolicyModalOpen, setIsPolicyModalOpen] = useState(false);
  const [editingTier, setEditingTier] = useState<CustomerTierItem | null>(null);
  const [form] = Form.useForm();

  const openEditModal = (tier: CustomerTierItem) => {
    setEditingTier(tier);
    form.setFieldsValue({
      name: tier.name,
      min_points: tier.min_points,
      color: tier.color || 'slate',
      benefits: (tier.benefits || []).join('\n'),
    });
  };

  const handleSubmit = async (values: any) => {
    if (!editingTier) return;
    try {
      await updateTier({
        id: editingTier.id,
        data: {
          name: values.name,
          min_points: Number(values.min_points),
          color: values.color,
          benefits: String(values.benefits || '')
            .split('\n')
            .map((b: string) => b.trim())
            .filter(Boolean),
        },
      });
      message.success('Đã cập nhật hạng thành viên.');
      setEditingTier(null);
    } catch (err: any) {
      message.error(err?.response?.data?.message ?? 'Không thể cập nhật hạng thành viên.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <button
          onClick={() => setIsPolicyModalOpen(true)}
          className="flex items-center gap-2 px-6 py-3 bg-primary/10 text-primary border border-primary/20 rounded-2xl text-xs font-black uppercase tracking-wider hover:bg-primary hover:text-white transition-all transform active:scale-95 group"
        >
          <TrendingUp size={16} />
          Cập nhật chính sách
        </button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20 text-text-muted">
          <Loader2 size={28} className="animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {(tiers as CustomerTierItem[]).map((tier) => (
            <GlassCard key={tier.id} className="p-8 relative group hover:border-primary/30 transition-all border-primary-soft/20" radius="4xl">
              <div className="flex justify-between items-start mb-6">
                <div className={cn(
                  "px-4 py-1.5 rounded-full border text-xs font-black uppercase tracking-widest",
                  colorClass(tier.color)
                )}>
                  {tier.name}
                </div>
                <button onClick={() => openEditModal(tier)} className="p-2 text-text-muted hover:text-primary transition-colors">
                  <Edit2 size={16} />
                </button>
              </div>

              <div className="mb-6">
                <p className="text-[10px] font-black text-[#968271] uppercase tracking-[0.2em] mb-1">MỨC ĐIỂM YÊU CẦU</p>
                <p className="text-3xl font-black text-text-primary">{tier.min_points}</p>
              </div>

              <div className="space-y-3">
                <p className="text-[10px] font-black text-[#968271] uppercase tracking-[0.2em] border-b border-primary-soft/10 pb-2">ĐẶC QUYỀN</p>
                {(tier.benefits || []).map((benefit, idx) => (
                  <div key={idx} className="flex items-start gap-2">
                    <div className="mt-1"><Gift size={12} className="text-primary" /></div>
                    <span className="text-sm font-medium text-text-secondary">{benefit}</span>
                  </div>
                ))}
              </div>
            </GlassCard>
          ))}
        </div>
      )}

      <Modal
        title={<span className="text-xl font-black text-text-primary tracking-tight italic">Chỉnh sửa hạng thành viên</span>}
        open={!!editingTier}
        onCancel={() => setEditingTier(null)}
        footer={null}
        width={520}
        className="employee-modal"
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit} className="mt-6" requiredMark={false}>
          <Form.Item name="name" label="Tên hạng" rules={[{ required: true, message: 'Vui lòng nhập tên hạng' }]}>
            <Input className="h-12 rounded-xl" />
          </Form.Item>
          <Form.Item name="min_points" label="Điểm tích lũy tối thiểu" rules={[{ required: true, message: 'Vui lòng nhập mức điểm' }]}>
            <InputNumber min={0} className="w-full h-12 rounded-xl [&_.ant-input-number-input]:h-12" />
          </Form.Item>
          <Form.Item name="color" label="Màu hiển thị">
            <Select
              className="h-12"
              options={[
                { value: 'slate', label: 'Xám (Thành viên)' },
                { value: 'zinc', label: 'Bạc' },
                { value: 'amber', label: 'Vàng' },
                { value: 'blue', label: 'Kim Cương' },
              ]}
            />
          </Form.Item>
          <Form.Item name="benefits" label="Quyền lợi (mỗi dòng một quyền lợi)">
            <Input.TextArea rows={4} placeholder={'Tích điểm 2%\nGiảm 5% hóa đơn'} />
          </Form.Item>

          <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-primary-soft/10">
            <button
              type="button"
              onClick={() => setEditingTier(null)}
              className="px-6 py-3 bg-white border border-primary-soft/30 hover:bg-[#FFFAF4] text-text-secondary rounded-2xl text-[10px] font-black uppercase tracking-wider transition-all shadow-sm"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={isUpdating}
              className="px-8 py-3 bg-primary hover:scale-[1.02] active:scale-95 text-white rounded-2xl text-[10px] font-black uppercase tracking-wider transition-all shadow-lg shadow-primary/20 disabled:opacity-60 flex items-center gap-2"
            >
              {isUpdating && <Loader2 size={14} className="animate-spin" />}
              Lưu thay đổi
            </button>
          </div>
        </Form>
      </Modal>

      <UpdatePolicyModal
        isOpen={isPolicyModalOpen}
        onClose={() => setIsPolicyModalOpen(false)}
      />
    </div>
  );
}

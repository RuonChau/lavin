'use client';

import { useState } from 'react';
import {
  Clock,
  Plus,
  Search,
  Edit2,
  Trash2,
  Loader2,
} from 'lucide-react';
import { Input, Modal, Form, TimePicker, App } from 'antd';
import dayjs from 'dayjs';

import { GlassCard } from '@/shared/components/GlassCard';
import { useShifts } from '@/modules/employees/presentation/hooks/useShifts';
import { ShiftItem } from '@/modules/employees/infrastructure/services/shift.service';

const formatHours = (start: string, end: string) => {
  const startTime = dayjs(start, 'HH:mm:ss');
  const endTime = dayjs(end, 'HH:mm:ss');
  if (!startTime.isValid() || !endTime.isValid()) return 0;
  let diff = endTime.diff(startTime, 'minute');
  if (diff < 0) diff += 24 * 60;
  return Math.round((diff / 60) * 10) / 10;
};

export default function ShiftsTab() {
  const { shifts, isLoading, createShift, updateShift, deleteShift, isCreating, isUpdating } = useShifts();
  const { message, modal } = App.useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingShift, setEditingShift] = useState<ShiftItem | null>(null);
  const [form] = Form.useForm();

  const filteredShifts = (shifts as ShiftItem[]).filter((s) =>
    s.shift_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openCreateModal = () => {
    setEditingShift(null);
    form.resetFields();
    setIsModalOpen(true);
  };

  const openEditModal = (shift: ShiftItem) => {
    setEditingShift(shift);
    form.setFieldsValue({
      shift_name: shift.shift_name,
      startTime: dayjs(shift.start_time, 'HH:mm:ss'),
      endTime: dayjs(shift.end_time, 'HH:mm:ss'),
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (values: any) => {
    const data = {
      shift_name: values.shift_name,
      start_time: values.startTime.format('HH:mm:ss'),
      end_time: values.endTime.format('HH:mm:ss'),
    };
    try {
      if (editingShift) {
        await updateShift({ id: editingShift.id, data });
        message.success('Đã cập nhật ca làm việc.');
      } else {
        await createShift(data);
        message.success('Đã tạo ca làm việc mới.');
      }
      setIsModalOpen(false);
      form.resetFields();
    } catch (err: any) {
      message.error(err?.response?.data?.message ?? 'Không thể lưu ca làm việc.');
    }
  };

  const handleDelete = (shift: ShiftItem) => {
    modal.confirm({
      title: 'Xóa ca làm việc?',
      content: `Bạn có chắc chắn muốn xóa "${shift.shift_name}"? Các lịch làm việc đang dùng ca này có thể bị ảnh hưởng.`,
      okText: 'Xóa',
      okButtonProps: { danger: true },
      cancelText: 'Hủy',
      onOk: async () => {
        try {
          await deleteShift(shift.id);
          message.success('Đã xóa ca làm việc.');
        } catch (err: any) {
          message.error(err?.response?.data?.message ?? 'Không thể xóa ca làm việc.');
        }
      },
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="relative w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-primary-soft" size={18} />
          <input
            type="text"
            placeholder="Tìm tên ca..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white/60 border border-primary-soft/20 rounded-2xl py-3.5 pl-12 pr-4 text-sm font-medium focus:outline-none focus:border-primary/40 focus:bg-white transition-all shadow-sm"
          />
        </div>
        <button
          onClick={openCreateModal}
          className="flex items-center gap-2 px-6 py-3 bg-primary/10 text-primary border border-primary/20 rounded-2xl text-xs font-black uppercase tracking-wider hover:bg-primary hover:text-white transition-all transform active:scale-95 group"
        >
          <Plus size={16} strokeWidth={3} className="group-hover:rotate-90 transition-transform" />
          Thêm ca mới
        </button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20 text-text-muted">
          <Loader2 size={28} className="animate-spin" />
        </div>
      ) : filteredShifts.length === 0 ? (
        <GlassCard className="p-16 text-center text-text-muted" radius="4xl">
          <Clock size={40} className="mx-auto mb-3 opacity-30" />
          <p className="text-sm font-bold">Chưa có ca làm việc nào.</p>
        </GlassCard>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredShifts.map((shift) => (
            <GlassCard key={shift.id} className="p-8 relative group hover:border-primary/30 transition-all" radius="4xl">
              <div className="flex justify-between items-start mb-6">
                <div className="p-3 rounded-2xl bg-primary/10 text-primary">
                  <Clock size={24} />
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => openEditModal(shift)} className="p-2 text-text-secondary hover:text-primary transition-colors"><Edit2 size={16} /></button>
                  <button onClick={() => handleDelete(shift)} className="p-2 text-text-secondary hover:text-red-500 transition-colors"><Trash2 size={16} /></button>
                </div>
              </div>

              <h4 className="text-xl font-black text-text-primary tracking-tight mb-1">{shift.shift_name}</h4>
              <p className="text-[10px] font-black text-text-secondary uppercase tracking-[0.2em] mb-6">
                {formatHours(shift.start_time, shift.end_time)} GIỜ
              </p>

              <div className="flex items-center justify-between p-3 bg-[#FFFAF4]/40 rounded-2xl border border-primary-soft/10">
                <span className="text-[10px] font-black text-text-secondary uppercase tracking-widest">Khung giờ</span>
                <span className="text-sm font-black text-primary">
                  {dayjs(shift.start_time, 'HH:mm:ss').format('HH:mm')} - {dayjs(shift.end_time, 'HH:mm:ss').format('HH:mm')}
                </span>
              </div>
            </GlassCard>
          ))}
        </div>
      )}

      <Modal
        title={<span className="text-xl font-black text-text-primary tracking-tight italic">{editingShift ? 'Chỉnh sửa Ca Làm Việc' : 'Tạo Ca Làm Việc Mới'}</span>}
        open={isModalOpen}
        onCancel={() => {
          setIsModalOpen(false);
          form.resetFields();
        }}
        footer={null}
        width={560}
        className="employee-modal"
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          className="mt-6"
          requiredMark={false}
        >
          <Form.Item
            name="shift_name"
            label={<span className="text-[10px] font-black text-text-secondary uppercase tracking-[0.2em]">Tên ca làm việc</span>}
            rules={[{ required: true, message: 'Vui lòng nhập tên ca' }]}
          >
            <Input placeholder="Ví dụ: Ca Sáng, Ca Part-time..." className="h-12 rounded-xl bg-white/60 border-primary-soft/30 hover:border-primary/50 focus:border-primary/50 shadow-sm" />
          </Form.Item>

          <div className="grid grid-cols-2 gap-4">
            <Form.Item
              name="startTime"
              label={<span className="text-[10px] font-black text-text-secondary uppercase tracking-[0.2em]">Giờ bắt đầu</span>}
              rules={[{ required: true, message: 'Vui lòng chọn giờ bắt đầu' }]}
            >
              <TimePicker format="HH:mm" placeholder="--:--" className="w-full h-12 rounded-xl bg-white/60 border-primary-soft/30 hover:border-primary/50 focus:border-primary/50 shadow-sm" classNames={{ popup: '!rounded-2xl' }} />
            </Form.Item>
            <Form.Item
              name="endTime"
              label={<span className="text-[10px] font-black text-text-secondary uppercase tracking-[0.2em]">Giờ kết thúc</span>}
              rules={[{ required: true, message: 'Vui lòng chọn giờ kết thúc' }]}
            >
              <TimePicker format="HH:mm" placeholder="--:--" className="w-full h-12 rounded-xl bg-white/60 border-primary-soft/30 hover:border-primary/50 focus:border-primary/50 shadow-sm" classNames={{ popup: '!rounded-2xl' }} />
            </Form.Item>
          </div>

          <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-primary-soft/10">
            <button
              type="button"
              onClick={() => {
                setIsModalOpen(false);
                form.resetFields();
              }}
              className="px-6 py-3.5 bg-white border border-primary-soft/30 hover:bg-[#FFFAF4] text-text-secondary rounded-2xl text-[10px] font-black uppercase tracking-wider transition-all shadow-sm"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={isCreating || isUpdating}
              className="px-8 py-3.5 bg-primary hover:scale-[1.02] active:scale-95 text-white rounded-2xl text-[10px] font-black uppercase tracking-wider transition-all shadow-lg shadow-primary/20 disabled:opacity-60 flex items-center gap-2"
            >
              {(isCreating || isUpdating) && <Loader2 size={14} className="animate-spin" />}
              Lưu ca làm việc
            </button>
          </div>
        </Form>
      </Modal>
    </div>
  );
}

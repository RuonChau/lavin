'use client';

import { useState } from 'react';
import {
  Clock,
  Plus, 
  Search,
  Edit2, 
  Trash2,
} from 'lucide-react';
import {  Input, Modal, Form, Select, Row, Col, TimePicker } from 'antd';

const { Option } = Select;
import { GlassCard } from '@/shared/components/GlassCard';
import { cn } from '@/shared/utils/cn';
import { shifts } from '@/modules/employees/mocks/shifts.mock';


export default function ShiftsTab() {
  const [isAddShiftModalOpen, setIsAddShiftModalOpen] = useState(false);
  const [form] = Form.useForm();

  const handleAddShiftSubmit = (values: any) => {
    console.log('Thêm ca:', values);
    setIsAddShiftModalOpen(false);
    form.resetFields();
  };


  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="relative w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#D8B894]" size={18} />
          <input 
            type="text" 
            placeholder="Tìm tên ca, mã ca..." 
            className="w-full bg-white/60 border border-[#D8B894]/20 rounded-2xl py-3.5 pl-12 pr-4 text-sm font-medium focus:outline-none focus:border-primary/40 focus:bg-white transition-all shadow-sm"
          />
        </div>
        <button 
          onClick={() => setIsAddShiftModalOpen(true)}
          className="flex items-center gap-2 px-6 py-3 bg-primary/10 text-primary border border-primary/20 rounded-2xl text-xs font-black uppercase tracking-wider hover:bg-primary hover:text-white transition-all transform active:scale-95 group"
        >
          <Plus size={16} strokeWidth={3} className="group-hover:rotate-90 transition-transform" />
          Thêm ca mới
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {shifts.map((shift) => (
          <GlassCard key={shift.id} className={cn("p-8 relative group hover:border-primary/30 transition-all", shift.status === 'INACTIVE' && "opacity-75")} radius="4xl">
             <div className="flex justify-between items-start mb-6">
               <div className={cn(
                 "p-3 rounded-2xl",
                 shift.status === 'ACTIVE' ? "bg-primary/10 text-primary" : "bg-gray-100 text-gray-400"
               )}>
                 <Clock size={24} />
               </div>
               <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="p-2 text-[#9A8677] hover:text-primary transition-colors"><Edit2 size={16} /></button>
                  <button className="p-2 text-[#9A8677] hover:text-red-500 transition-colors"><Trash2 size={16} /></button>
               </div>
             </div>

             <h4 className="text-xl font-black text-[#2A1E17] tracking-tight mb-1">{shift.name}</h4>
             <p className="text-[10px] font-black text-[#9A8677] uppercase tracking-[0.2em] mb-6">{shift.id} • {shift.totalHours} GIỜ</p>

             <div className="space-y-4 mb-8">
                <div className="flex items-center justify-between p-3 bg-[#FFFAF4]/40 rounded-2xl border border-[#D8B894]/10">
                   <span className="text-[10px] font-black text-[#968271] uppercase tracking-widest">Khung giờ</span>
                   <span className="text-sm font-black text-primary">{shift.time}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-[#FFFAF4]/40 rounded-2xl border border-[#D8B894]/10">
                   <span className="text-[10px] font-black text-[#968271] uppercase tracking-widest">Dự phòng (phút)</span>
                   <span className="text-sm font-black text-[#2A1E17]">{shift.buffer}m</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-[#FFFAF4]/40 rounded-2xl border border-[#D8B894]/10">
                   <span className="text-[10px] font-black text-[#968271] uppercase tracking-widest">Đang áp dụng</span>
                   <span className="text-sm font-black text-[#2A1E17]">{shift.employees} nhân viên</span>
                </div>
             </div>

             <div className="flex items-center justify-between pt-6 border-t border-[#D8B894]/10">
                <div className="flex items-center gap-2">
                   <div className={cn(
                     "w-2 h-2 rounded-full",
                     shift.status === 'ACTIVE' ? "bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.4)]" : "bg-gray-300"
                   )} />
                   <span className="text-[10px] font-black text-[#9A8677] uppercase tracking-widest">
                     {shift.status === 'ACTIVE' ? 'Đang hoạt động' : 'Tạm dừng'}
                   </span>
                </div>
                <button className="text-[10px] font-black text-primary uppercase tracking-widest hover:underline">Chi tiết</button>
             </div>
          </GlassCard>
        ))}
      </div>

      <Modal
        title={<span className="text-xl font-black text-[#2A1E17] tracking-tight italic">Tạo Ca Làm Việc Mới</span>}
        open={isAddShiftModalOpen}
        onCancel={() => {
          setIsAddShiftModalOpen(false);
          form.resetFields();
        }}
        footer={null}
        width={700}
        className="employee-modal"
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleAddShiftSubmit}
          className="mt-6"
          requiredMark={false}
        >
          <Row gutter={24}>
            <Col span={16}>
              <Form.Item
                name="name"
                label={<span className="text-[10px] font-black text-[#968271] uppercase tracking-[0.2em]">Tên ca làm việc</span>}
                rules={[{ required: true, message: 'Vui lòng nhập tên ca' }]}
              >
                <Input placeholder="Ví dụ: Ca Sáng, Ca Part-time..." className="h-12 rounded-xl bg-white/60 border-[#D8B894]/30 hover:border-primary/50 focus:border-primary/50 shadow-sm" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="id"
                label={<span className="text-[10px] font-black text-[#968271] uppercase tracking-[0.2em]">Mã ca (Ngắn)</span>}
                rules={[{ required: true, message: 'Vui lòng nhập mã ca' }]}
              >
                <Input placeholder="Ví dụ: S1, PT1" className="h-12 rounded-xl bg-white/60 border-[#D8B894]/30 hover:border-primary/50 focus:border-primary/50 shadow-sm uppercase uppercase-input" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={24}>
            <Col span={12}>
              <Form.Item
                name="startTime"
                label={<span className="text-[10px] font-black text-[#968271] uppercase tracking-[0.2em]">Giờ bắt đầu (Check-in)</span>}
                rules={[{ required: true, message: 'Vui lòng chọn giờ bắt đầu' }]}
              >
                 <TimePicker format="HH:mm" placeholder="--:--" className="w-full h-12 rounded-xl bg-white/60 border-[#D8B894]/30 hover:border-primary/50 focus:border-primary/50 shadow-sm" classNames={{ popup: '!rounded-2xl' }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="endTime"
                label={<span className="text-[10px] font-black text-[#968271] uppercase tracking-[0.2em]">Giờ kết thúc (Check-out)</span>}
                rules={[{ required: true, message: 'Vui lòng chọn giờ kết thúc' }]}
              >
                 <TimePicker format="HH:mm" placeholder="--:--" className="w-full h-12 rounded-xl bg-white/60 border-[#D8B894]/30 hover:border-primary/50 focus:border-primary/50 shadow-sm" classNames={{ popup: '!rounded-2xl' }} />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={24}>
            <Col span={12}>
              <Form.Item
                name="buffer"
                label={<span className="text-[10px] font-black text-[#968271] uppercase tracking-[0.2em]">Thời gian đi trễ cho phép (phút)</span>}
                initialValue={15}
              >
                <Input type="number" min={0} className="h-12 rounded-xl bg-white/60 border-[#D8B894]/30 hover:border-primary/50 focus:border-primary/50 shadow-sm" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="payRateMultiplier"
                label={<span className="text-[10px] font-black text-[#968271] uppercase tracking-[0.2em]">Hệ số lương ca này</span>}
                initialValue="1.0"
              >
                <Select className="h-12" classNames={{ popup: { root: '!rounded-2xl' } }}>
                  <Option value="1.0">Ngày thường (x1.0)</Option>
                  <Option value="1.5">Ca đêm / Cuối tuần (x1.5)</Option>
                  <Option value="2.0">Ngày lễ (x2.0)</Option>
                  <Option value="3.0">Lễ đặc biệt (x3.0)</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          
          <Form.Item
            name="note"
            label={<span className="text-[10px] font-black text-[#968271] uppercase tracking-[0.2em]">Ghi chú cho nhân viên</span>}
          >
            <Input.TextArea rows={2} placeholder="Những lưu ý khi vào ca..." className="rounded-xl bg-white/60 border-[#D8B894]/30 hover:border-primary/50 focus:border-primary/50 shadow-sm py-3" />
          </Form.Item>

          <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-[#D8B894]/10">
            <button
              type="button"
              onClick={() => {
                setIsAddShiftModalOpen(false);
                form.resetFields();
              }}
              className="px-6 py-3.5 bg-white border border-[#D8B894]/30 hover:bg-[#FFFAF4] text-[#6F5A4A] rounded-2xl text-[10px] font-black uppercase tracking-wider transition-all shadow-sm"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-8 py-3.5 bg-primary hover:scale-[1.02] active:scale-95 text-white rounded-2xl text-[10px] font-black uppercase tracking-wider transition-all shadow-lg shadow-primary/20"
            >
              Lưu ca làm việc
            </button>
          </div>
        </Form>
      </Modal>
    </div>
  );
}

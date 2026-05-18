import {
  Col,
  DatePicker,
  Form,
  Input,
  Modal,
  Row,
  Select,
  TimePicker,
} from "antd";
import { useState } from "react";
import {
  Calendar,
  Search,
  ChevronLeft,
  ChevronRight,
  CircleDot
} from 'lucide-react';
import { GlassCard } from "@/shared/components/GlassCard";
import { cn } from "@/shared/utils/cn";
import { ATTENDANCE_STATS_MOCK } from "@/modules/employees/mocks/attendance-stats.mock";
import { attendanceData } from "@/modules/employees/mocks/attendance-data.mock";
import { STATUS_CONFIG } from "@/modules/employees/config/status.config";

export default function AttendanceTab() {
  const [isManualModalOpen, setIsManualModalOpen] = useState(false);
  const [form] = Form.useForm();
  const { Option } = Select;

  const handleManualSubmit = (values: any) => {
    console.log('Chấm công:', values);
    setIsManualModalOpen(false);
    form.resetFields();
  };





  return (
    <div className="space-y-6">
      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {ATTENDANCE_STATS_MOCK.map((stat, idx) => (
          <GlassCard key={idx} className="p-6 flex items-center gap-5" radius="3xl">
             <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center transition-transform hover:rotate-12 duration-500", stat.color)}>
                <stat.icon size={28} />
             </div>
             <div>
                <p className="text-[10px] font-black text-[#9A8677] uppercase tracking-[0.2em]">{stat.label}</p>
                <p className="text-2xl font-black text-[#2A1E17] mt-0.5 tracking-tight">{stat.value}</p>
             </div>
          </GlassCard>
        ))}
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
           <div className="relative w-72">
             <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#D8B894]" size={16} />
             <input 
               type="text" 
               placeholder="Tìm theo tên nhân viên..." 
               className="w-full bg-white/60 border border-[#D8B894]/20 rounded-2xl py-3 pl-11 pr-4 text-xs font-bold focus:outline-none focus:border-primary/40 focus:bg-white transition-all shadow-sm"
             />
           </div>
           <button className="flex items-center gap-2 px-5 py-3 bg-white border border-[#D8B894]/30 rounded-2xl text-[10px] font-black text-[#6F5A4A] uppercase tracking-wider hover:bg-gray-50">
             <Calendar size={14} /> 15/05/2026
           </button>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsManualModalOpen(true)}
            className="flex items-center gap-2 px-6 py-3 bg-white border border-[#D8B894]/30 rounded-2xl text-[10px] font-black text-[#6F5A4A] uppercase tracking-wider hover:bg-gray-50 transition-all shadow-sm"
          >
             Chấm công thủ công
          </button>
        </div>
      </div>

      <GlassCard className="overflow-hidden" radius="4xl">
         <table className="w-full">
            <thead>
              <tr className="bg-[#FFFAF4]/40 border-b border-[#D8B894]/20">
                <th className="py-6 px-8 text-left">
                   <span className="text-[10px] font-black text-[#968271] uppercase tracking-[0.2em]">Nhân viên / Ca</span>
                </th>
                <th className="py-6 px-4 text-center">
                   <span className="text-[10px] font-black text-[#968271] uppercase tracking-[0.2em]">Giờ quy chuẩn</span>
                </th>
                <th className="py-6 px-4 text-center">
                   <span className="text-[10px] font-black text-[#968271] uppercase tracking-[0.2em]">Check-in</span>
                </th>
                <th className="py-6 px-4 text-center">
                   <span className="text-[10px] font-black text-[#968271] uppercase tracking-[0.2em]">Check-out</span>
                </th>
                <th className="py-6 px-4 text-center">
                   <span className="text-[10px] font-black text-[#968271] uppercase tracking-[0.2em]">Đi muộn</span>
                </th>
                <th className="py-6 px-4 text-center">
                   <span className="text-[10px] font-black text-[#968271] uppercase tracking-[0.2em]">Giờ công</span>
                </th>
                <th className="py-6 px-8 text-right">
                   <span className="text-[10px] font-black text-[#968271] uppercase tracking-[0.2em]">Trạng thái</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#D8B894]/10">
               {attendanceData.map((record) => (
                 <tr key={record.id} className="group hover:bg-[#FFFAF4]/20 transition-colors">
                    <td className="py-5 px-8">
                       <div className="flex items-center gap-4">
                          <div className="w-9 h-9 rounded-xl bg-white border border-[#D8B894]/20 flex items-center justify-center text-primary font-black text-xs">
                             {record.name.split(' ').pop()?.[0]}
                          </div>
                          <div>
                             <p className="text-sm font-bold text-[#2A1E17]">{record.name}</p>
                             <p className="text-[9px] font-black text-primary uppercase tracking-widest mt-0.5">Mã ca: {record.shift}</p>
                          </div>
                       </div>
                    </td>
                    <td className="py-5 px-4 text-center">
                       <span className="text-xs font-bold text-[#6F5A4A]">07:00 - 15:00</span>
                    </td>
                    <td className="py-5 px-4 text-center">
                       <span className={cn(
                         "text-xs font-black",
                         record.checkIn === '---' ? "text-[#D8B894]/50" : "text-[#2A1E17]"
                       )}>
                         {record.checkIn}
                       </span>
                    </td>
                    <td className="py-5 px-4 text-center">
                       <span className={cn(
                         "text-xs font-black",
                         record.checkOut === '---' ? "text-[#D8B894]/50" : "text-[#2A1E17]"
                       )}>
                         {record.checkOut}
                       </span>
                    </td>
                    <td className="py-5 px-4 text-center">
                       {record.late > 0 ? (
                         <span className="text-xs font-black text-amber-500">{record.late}m</span>
                       ) : (
                         <span className="text-xs text-[#D8B894]/40 font-bold">-</span>
                       )}
                    </td>
                    <td className="py-5 px-4 text-center">
                       <span className="text-xs font-black text-primary">{record.workHours > 0 ? `${record.workHours}h` : '---'}</span>
                    </td>
                    <td className="py-5 px-8 text-right">
                       <div className={cn(
                         "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider border",
                         STATUS_CONFIG[record.status as keyof typeof STATUS_CONFIG].color
                       )}>
                         <CircleDot size={10} />
                         {STATUS_CONFIG[record.status as keyof typeof STATUS_CONFIG].label}
                       </div>
                    </td>
                 </tr>
               ))}
            </tbody>
         </table>
         
         <div className="p-8 border-t border-[#D8B894]/20 bg-white/40 flex items-center justify-between">
            <div className="flex items-center gap-2">
               <button className="p-2 text-[#9A8677] hover:bg-white rounded-xl transition-all border border-transparent hover:border-[#D8B894]/20"><ChevronLeft size={18} /></button>
               <div className="flex items-center gap-1">
                  <button className="w-8 h-8 rounded-xl bg-primary text-white text-[10px] font-black">1</button>
                  <button className="w-8 h-8 rounded-xl bg-white text-[#9A8677] text-[10px] font-black border border-[#D8B894]/20">2</button>
                  <button className="w-8 h-8 rounded-xl bg-white text-[#9A8677] text-[10px] font-black border border-[#D8B894]/20">3</button>
               </div>
               <button className="p-2 text-[#9A8677] hover:bg-white rounded-xl transition-all border border-transparent hover:border-[#D8B894]/20"><ChevronRight size={18} /></button>
            </div>
            <p className="text-[10px] font-black text-[#968271] uppercase tracking-widest italic">Đang hiển thị 1-5 trên tổng số 24 nhân sự</p>
         </div>
      </GlassCard>

      <Modal
        title={<span className="text-xl font-black text-[#2A1E17] tracking-tight italic">Chấm Công Thủ Công</span>}
        open={isManualModalOpen}
        onCancel={() => {
          setIsManualModalOpen(false);
          form.resetFields();
        }}
        footer={null}
        width={600}
        className="employee-modal"
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleManualSubmit}
          className="mt-6"
          requiredMark={false}
        >
          <Form.Item
            name="employeeId"
            label={<span className="text-[10px] font-black text-[#968271] uppercase tracking-[0.2em]">Nhân viên</span>}
            rules={[{ required: true, message: 'Vui lòng chọn nhân viên' }]}
          >
            <Select placeholder="Chọn nhân viên" className="h-12" classNames={{ popup: { root: '!rounded-2xl' } }}>
              <Option value="1">Nguyễn Văn An</Option>
              <Option value="2">Trần Thị Bình</Option>
              <Option value="3">Lê Minh Chiến</Option>
              <Option value="4">Phạm Hồng Đào</Option>
            </Select>
          </Form.Item>

          <Row gutter={24}>
            <Col span={12}>
              <Form.Item
                name="date"
                label={<span className="text-[10px] font-black text-[#968271] uppercase tracking-[0.2em]">Ngày làm việc</span>}
                rules={[{ required: true, message: 'Vui lòng chọn ngày' }]}
              >
                <DatePicker format="DD/MM/YYYY" placeholder="Chọn ngày" className="w-full h-12 rounded-xl bg-white/60 border-[#D8B894]/30 hover:border-primary/50 focus:border-primary/50 shadow-sm" classNames={{ popup: '!rounded-2xl' }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="shift"
                label={<span className="text-[10px] font-black text-[#968271] uppercase tracking-[0.2em]">Ca làm việc</span>}
                rules={[{ required: true, message: 'Vui lòng chọn ca' }]}
              >
                <Select placeholder="Chọn ca" className="h-12" classNames={{ popup: { root: '!rounded-2xl' } }}>
                  <Option value="S1">Ca Sáng (07:00 - 15:00)</Option>
                  <Option value="S2">Ca Chiều (15:00 - 23:00)</Option>
                  <Option value="S3">Ca Tối (18:00 - 23:00)</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={24}>
            <Col span={12}>
              <Form.Item
                name="checkIn"
                label={<span className="text-[10px] font-black text-[#968271] uppercase tracking-[0.2em]">Giờ Check-in</span>}
              >
                <TimePicker format="HH:mm" placeholder="--:--" className="w-full h-12 rounded-xl bg-white/60 border-[#D8B894]/30 hover:border-primary/50 focus:border-primary/50 shadow-sm" classNames={{ popup: '!rounded-2xl' }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="checkOut"
                label={<span className="text-[10px] font-black text-[#968271] uppercase tracking-[0.2em]">Giờ Check-out</span>}
              >
                <TimePicker format="HH:mm" placeholder="--:--" className="w-full h-12 rounded-xl bg-white/60 border-[#D8B894]/30 hover:border-primary/50 focus:border-primary/50 shadow-sm" classNames={{ popup: '!rounded-2xl' }} />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="note"
            label={<span className="text-[10px] font-black text-[#968271] uppercase tracking-[0.2em]">Ghi chú (Lý do)</span>}
          >
            <Input.TextArea rows={3} placeholder="Ví dụ: Quên điện thoại không check-in được" className="rounded-xl bg-white/60 border-[#D8B894]/30 hover:border-primary/50 focus:border-primary/50 shadow-sm py-3" />
          </Form.Item>

          <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-[#D8B894]/10">
            <button
              type="button"
              onClick={() => {
                setIsManualModalOpen(false);
                form.resetFields();
              }}
              className="px-6 py-3.5 bg-white border border-[#D8B894]/30 hover:bg-[#FFFAF4] text-[#6F5A4A] rounded-2xl text-[10px] font-black uppercase tracking-wider transition-all shadow-sm"
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              className="px-8 py-3.5 bg-primary hover:scale-[1.02] active:scale-95 text-white rounded-2xl text-[10px] font-black uppercase tracking-wider transition-all shadow-lg shadow-primary/20"
            >
              Xác nhận chấm công
            </button>
          </div>
        </Form>
      </Modal>
    </div>
  );
}

'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users,
  Plus,
  FileDown,
} from 'lucide-react';
import {
  ConfigProvider,
  Input,
  Modal,
  Form,
  Select,
  DatePicker,
  Row,
  Col
} from 'antd';

const { Option } = Select;
import { cn } from '@/shared/utils/cn';
import EmployeesListTab from './EmployeesListTab';
import ShiftsTab from './ShiftsTab';
import SchedulingTab from './SchedulingTab';
import AttendanceTab from './AttendanceTab';
import { antdTheme } from '@/shared/utils/antdTheme';
import { TabType } from '../../types/tab.type';
import { staffTabs } from '../../config/staff-tabs.config';




export default function EmployeesPage() {
  const [activeTab, setActiveTab] = useState<TabType>('LIST');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [form] = Form.useForm();

  const handleAddEmployee = (values: any) => {
    console.log('New employee:', values);
    setIsAddModalOpen(false);
    form.resetFields();
  };
 
  

  return (
    <ConfigProvider theme={antdTheme}>
      <div className="space-y-8 pb-20">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                <Users size={20} />
              </div>
              <h1 className="text-3xl font-black text-[#2A1E17] tracking-tight italic">Quản lý Nhân sự</h1>
            </div>
            <p className="text-[#6F5A4A] font-medium">Hệ thống quản lý ca làm, phân lịch và chấm công tự động</p>
          </div>

          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-6 py-3.5 bg-white border border-[#D8B894]/30 rounded-2xl text-[11px] font-black text-[#6F5A4A] uppercase tracking-wider hover:bg-[#FFFAF4] transition-all shadow-sm active:scale-95">
              <FileDown size={14} strokeWidth={3} />
              Xuất báo cáo
            </button>
            <button 
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center gap-2 px-8 py-3.5 bg-primary text-white rounded-2xl text-[11px] font-black uppercase tracking-wider shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all"
            >
              <Plus size={14} strokeWidth={3} />
              Thêm nhân viên
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-4">
          {staffTabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex-1 min-w-[240px] text-left p-6 rounded-[32px] border transition-all duration-500 group relative overflow-hidden",
                  isActive 
                    ? "bg-white border-primary/30 shadow-xl shadow-primary/5 translate-y-[-4px]" 
                    : "bg-white/40 border-[#D8B894]/20 hover:border-primary/20 hover:bg-white/60"
                )}
              >
                <div className="flex items-center gap-4 relative z-10">
                  <div className={cn(
                    "w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500",
                    isActive ? "bg-primary text-white scale-110 shadow-lg shadow-primary/30" : "bg-[#FFFAF4] text-[#D8B894] group-hover:text-primary group-hover:bg-primary/5"
                  )}>
                    <tab.icon size={24} />
                  </div>
                  <div>
                    <h3 className={cn("text-sm font-black uppercase tracking-widest transition-colors", isActive ? "text-[#2A1E17]" : "text-[#9A8677]")}>
                      {tab.label}
                    </h3>
                    <p className="text-[10px] text-[#9A8677] font-medium mt-1 leading-tight">{tab.description}</p>
                  </div>
                </div>
                
                {isActive && (
                  <motion.div 
                    layoutId="activeTabGlow"
                    className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none" 
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* Main Content Area */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            {activeTab === 'LIST' && <EmployeesListTab />}
            {activeTab === 'SHIFTS' && <ShiftsTab />}
            {activeTab === 'SCHEDULING' && <SchedulingTab />}
            {activeTab === 'ATTENDANCE' && <AttendanceTab />}
          </motion.div>
        </AnimatePresence>

        <Modal title={<span className="text-xl font-black text-[#2A1E17] tracking-tight italic">Thêm Nhân Viên Mới</span>} footer={null} width={700}
          open={isAddModalOpen}
          onCancel={() => {
            setIsAddModalOpen(false);
            form.resetFields();
          }}
          className="employee-modal [&_.ant-modal-content]:rounded-[32px] [&_.ant-modal-content]:p-8 [&_.ant-modal-content]:bg-gradient-to-br [&_.ant-modal-content]:from-white/95 [&_.ant-modal-content]:to-[#FFFAF4]/95 [&_.ant-modal-content]:border [&_.ant-modal-content]:border-[#D8B894]/30 [&_.ant-modal-content]:backdrop-blur-[20px] [&_.ant-modal-content]:shadow-[0_25px_50px_-12px_rgba(139,94,60,0.15)] [&_.ant-select-selector]:!rounded-xl [&_.ant-select-selector]:!border-[#D8B894]/30 [&_.ant-select-selector]:!bg-white/60 [&_.ant-select-selector]:!h-12 [&_.ant-select-selector]:!flex [&_.ant-select-selector]:!items-center [&_.ant-select-selector]:!shadow-sm [&_.ant-select-selection-item]:font-medium [&_.ant-select-focused_.ant-select-selector]:!border-[#8B5E3C]/50 [&_.ant-select-focused_.ant-select-selector]:!shadow-[0_0_0_2px_rgba(139,94,60,0.1)]"
          style={{ top: 40 }}
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={handleAddEmployee}
            className="mt-6"
            requiredMark={false}
          >
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item
                  name="name"
                  label={<span className="text-[10px] font-black text-[#968271] uppercase tracking-[0.2em]">Họ và tên</span>}
                  rules={[{ required: true, message: 'Vui lòng nhập họ và tên' }]}
                >
                  <Input placeholder="Nguyễn Văn A" className="h-12 rounded-xl bg-white/60 border-[#D8B894]/30 hover:border-primary/50 focus:border-primary/50 shadow-sm" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="id"
                  label={<span className="text-[10px] font-black text-[#968271] uppercase tracking-[0.2em]">Mã nhân viên</span>}
                >
                  <Input placeholder="Mã tự động tạo (VD: EMP-006)" disabled className="h-12 rounded-xl border-[#D8B894]/20 bg-gray-50/50" />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={24}>
              <Col span={12}>
                <Form.Item
                  name="role"
                  label={<span className="text-[10px] font-black text-[#968271] uppercase tracking-[0.2em]">Vị trí</span>}
                  rules={[{ required: true, message: 'Vui lòng chọn vị trí' }]}
                >
                  <Select placeholder="Chọn vị trí" className="h-12" classNames={{ popup: { root: '!rounded-2xl' } }}>
                    <Option value="Barista">Barista</Option>
                    <Option value="Thu ngân">Thu ngân</Option>
                    <Option value="Phục vụ">Phục vụ</Option>
                    <Option value="Quản lý">Quản lý</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="branch"
                  label={<span className="text-[10px] font-black text-[#968271] uppercase tracking-[0.2em]">Chi nhánh</span>}
                  rules={[{ required: true, message: 'Vui lòng chọn chi nhánh' }]}
                >
                  <Select placeholder="Chọn chi nhánh" className="h-12" classNames={{ popup: { root: '!rounded-2xl' } }}>
                    <Option value="Quận 1">Quận 1</Option>
                    <Option value="Quận 3">Quận 3</Option>
                    <Option value="Tân Bình">Tân Bình</Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={24}>
              <Col span={12}>
                <Form.Item
                  name="email"
                  label={<span className="text-[10px] font-black text-[#968271] uppercase tracking-[0.2em]">Email</span>}
                  rules={[{ type: 'email', message: 'Email không hợp lệ' }, { required: true, message: 'Vui lòng nhập email' }]}
                >
                  <Input placeholder="example@brewglass.vn" className="h-12 rounded-xl bg-white/60 border-[#D8B894]/30 hover:border-primary/50 focus:border-primary/50 shadow-sm" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="phone"
                  label={<span className="text-[10px] font-black text-[#968271] uppercase tracking-[0.2em]">Số điện thoại</span>}
                  rules={[{ required: true, message: 'Vui lòng nhập SDT' }]}
                >
                  <Input placeholder="090x xxx xxx" className="h-12 rounded-xl bg-white/60 border-[#D8B894]/30 hover:border-primary/50 focus:border-primary/50 shadow-sm" />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={24}>
              <Col span={12}>
                <Form.Item
                  name="type"
                  label={<span className="text-[10px] font-black text-[#968271] uppercase tracking-[0.2em]">Loại hợp đồng</span>}
                  rules={[{ required: true, message: 'Vui lòng chọn loại HĐ' }]}
                >
                  <Select placeholder="Chọn loại phân bổ" className="h-12" classNames={{ popup: { root: '!rounded-2xl' } }}>
                    <Option value="Toàn thời gian">Toàn thời gian</Option>
                    <Option value="Bán thời gian">Bán thời gian</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="joinDate"
                  label={<span className="text-[10px] font-black text-[#968271] uppercase tracking-[0.2em]">Ngày gia nhập</span>}
                  rules={[{ required: true, message: 'Vui lòng chọn ngày' }]}
                >
                  <DatePicker format="DD/MM/YYYY" placeholder="Chọn ngày" className="w-full h-12 rounded-xl bg-white/60 border-[#D8B894]/30 hover:border-primary/50 focus:border-primary/50 shadow-sm" classNames={{ popup: '!rounded-2xl' }} />
                </Form.Item>
              </Col>
            </Row>

            <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-[#D8B894]/10">
              <button
                type="button"
                onClick={() => {
                  setIsAddModalOpen(false);
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
                Lưu hồ sơ
              </button>
            </div>
          </Form>
        </Modal>
      </div>
    </ConfigProvider>
  );
}

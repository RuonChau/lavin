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
  App,
  Input,
  Modal,
  Form,
  Select,
  DatePicker,
  Row,
  Col,
  InputNumber,
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
import { useEmployees } from '../hooks/useEmployees';

const POSITION_OPTIONS = [
  { value: 'BARISTA', label: 'Barista (Nhân viên pha chế)' },
  { value: 'SERVER', label: 'Server (Nhân viên phục vụ)' },
  { value: 'CASHIER', label: 'Cashier (Thu ngân)' },
  { value: 'SHIFT_LEADER', label: 'Shift Leader (Quản lý ca)' },
  { value: 'STORE_MANAGER', label: 'Store Manager (Quản lý chi nhánh)' },
  { value: 'AREA_MANAGER', label: 'Area Manager (Quản lý khu vực)' },
  { value: 'ACCOUNTANT', label: 'Kế toán' },
  { value: 'PURCHASING', label: 'Mua hàng' },
  { value: 'ADMIN', label: 'Admin' },
];



function EmployeesPageInner() {
  const [activeTab, setActiveTab] = useState<TabType>('LIST');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [form] = Form.useForm();

  const { users, isLoadingUsers, branches, isLoadingBranches, createEmployee, isCreating } = useEmployees();
  const { message } = App.useApp();

  // Watch user_id để show/hide field full_name
  const selectedUserId = Form.useWatch('user_id', form);

  // Khi chọn user → tự điền full_name, phone, branch_id từ tài khoản đó
  const handleUserChange = (userId: string) => {
    const found = users.find(u => u.id === userId);
    if (found) {
      form.setFieldsValue({
        full_name: found.username,
        phone: found.phone || undefined,
        branch_id: found.branch_id || undefined,
      });
    } else {
      form.setFieldsValue({
        full_name: undefined,
        phone: undefined,
        branch_id: undefined,
      });
    }
  };

  const handleAddEmployee = async (values: any) => {
    try {
      await createEmployee({
        user_id: values.user_id || undefined,
        full_name: values.full_name?.trim(),
        position: values.position,
        base_salary: values.base_salary,
        // hire_date: giữ nguyên local date (YYYY-MM-DD), không để dayjs convert sang UTC
        hire_date: values.hire_date ? values.hire_date.format('YYYY-MM-DD') : '',
        phone: values.phone?.trim() || undefined,
        branch_id: values.branch_id || undefined,
      });
      message.success('Thêm nhân viên thành công!');
      setIsAddModalOpen(false);
      form.resetFields();
    } catch (err: any) {
      message.error(err?.response?.data?.message ?? 'Có lỗi xảy ra, vui lòng thử lại.');
    }
  };


  return (
    <div className="space-y-8 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
              <Users size={20} />
            </div>
            <h1 className="text-3xl font-black text-text-primary tracking-tight italic">Quản lý Nhân sự</h1>
          </div>
          <p className="text-text-secondary font-medium">Hệ thống quản lý ca làm, phân lịch và chấm công tự động</p>
        </div>

        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-6 py-3.5 bg-white border border-primary-soft/30 rounded-2xl text-[11px] font-black text-text-secondary uppercase tracking-wider hover:bg-[#FFFAF4] transition-all shadow-sm active:scale-95">
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
                "flex-1 min-w-60 text-left p-6 rounded-4xl border transition-all duration-500 group relative overflow-hidden",
                isActive
                  ? "bg-white border-primary/30 shadow-xl shadow-primary/5 -translate-y-1"
                  : "bg-white/40 border-primary-soft/20 hover:border-primary/20 hover:bg-white/60"
              )}
            >
              <div className="flex items-center gap-4 relative z-10">
                <div className={cn(
                  "w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500",
                  isActive ? "bg-primary text-white scale-110 shadow-lg shadow-primary/30" : "bg-[#FFFAF4] text-primary-soft group-hover:text-primary group-hover:bg-primary/5"
                )}>
                  <tab.icon size={24} />
                </div>
                <div>
                  <h3 className={cn("text-sm font-black uppercase tracking-widest transition-colors", isActive ? "text-text-primary" : "text-text-muted")}>
                    {tab.label}
                  </h3>
                  <p className="text-[10px] text-text-muted font-medium mt-1 leading-tight">{tab.description}</p>
                </div>
              </div>

              {isActive && (
                <motion.div
                  layoutId="activeTabGlow"
                  className="absolute inset-0 bg-linear-to-br from-primary/5 to-transparent pointer-events-none"
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

      {/* Modal Thêm Nhân Viên */}
      <Modal
        title={<span className="text-xl font-black text-text-primary tracking-tight italic">Thêm Nhân Viên Mới</span>}
        footer={null}
        width={680}
        open={isAddModalOpen}
        onCancel={() => {
          setIsAddModalOpen(false);
          form.resetFields();
        }}
        className="employee-modal [&_.ant-modal-content]:rounded-4xl [&_.ant-modal-content]:p-8 [&_.ant-modal-content]:bg-linear-to-br [&_.ant-modal-content]:from-white/95 [&_.ant-modal-content]:to-[#FFFAF4]/95 [&_.ant-modal-content]:border [&_.ant-modal-content]:border-primary-soft/30 [&_.ant-modal-content]:backdrop-blur-[20px] [&_.ant-modal-content]:shadow-[0_25px_50px_-12px_rgba(139,94,60,0.15)] [&_.ant-select-selector]:rounded-xl! [&_.ant-select-selector]:border-primary-soft/30! [&_.ant-select-selector]:bg-white/60! [&_.ant-select-selector]:h-12! [&_.ant-select-selector]:flex! [&_.ant-select-selector]:items-center! [&_.ant-select-selector]:shadow-sm! [&_.ant-select-selection-item]:font-medium [&_.ant-select-focused_.ant-select-selector]:border-primary/50! [&_.ant-select-focused_.ant-select-selector]:shadow-[0_0_0_2px_rgba(139,94,60,0.1)]!"
        style={{ top: 40 }}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleAddEmployee}
          className="mt-6 w-full"
          requiredMark={false}
        >
          {/* Liên kết tài khoản — tuỳ chọn */}
          <Form.Item
            name="user_id"
            label={
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black text-[#968271] uppercase tracking-[0.2em]">Tài khoản hệ thống</span>
                <span className="text-[10px] font-medium text-text-muted bg-gray-100 px-2 py-0.5 rounded-full">Tuỳ chọn</span>
              </div>
            }
          >
            <Select
              placeholder={isLoadingUsers ? 'Đang tải...' : 'Chọn tài khoản để liên kết (nếu có)'}
              loading={isLoadingUsers}
              showSearch
              allowClear
              optionFilterProp="label"
              className="h-12"
              classNames={{ popup: { root: '!rounded-2xl' } }}
              onChange={handleUserChange}
              onClear={() => form.setFieldsValue({ full_name: undefined, phone: undefined, branch_id: undefined })}
              options={users.map((u) => ({
                value: u.id,
                label: `${u.username}${u.email ? ` — ${u.email}` : ''}${u.branch?.name ? ` (${u.branch.name})` : ''}`,
              }))}
            />
          </Form.Item>

          {/* Tên nhân viên — bắt buộc khi không có tài khoản; tự điền khi có tài khoản */}
          <Form.Item
            name="full_name"
            label={
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black text-[#968271] uppercase tracking-[0.2em]">Tên nhân viên</span>
                {!selectedUserId && (
                  <span className="text-[10px] font-medium text-red-500 bg-red-50 px-2 py-0.5 rounded-full">Bắt buộc</span>
                )}
              </div>
            }
            rules={[{
              required: !selectedUserId,
              message: 'Vui lòng nhập tên nhân viên',
            }]}
          >
            <Input
              placeholder={selectedUserId ? 'Tự điền từ tài khoản đã chọn' : 'Nhập tên đầy đủ của nhân viên'}
              readOnly={!!selectedUserId}
              className={`h-12 rounded-xl border-primary-soft/30 hover:border-primary/50 focus:border-primary/50 shadow-sm ${selectedUserId ? 'bg-gray-50 text-text-muted cursor-not-allowed' : 'bg-white/60'}`}
            />
          </Form.Item>

          {/* SĐT và Chi nhánh — bắt buộc khi không có tài khoản; tự điền khi có tài khoản */}
          <Row gutter={24}>
            <Col span={12}>
              <Form.Item
                name="phone"
                label={
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black text-[#968271] uppercase tracking-[0.2em]">Số điện thoại</span>
                    {!selectedUserId && (
                      <span className="text-[10px] font-medium text-red-500 bg-red-50 px-2 py-0.5 rounded-full">Bắt buộc</span>
                    )}
                  </div>
                }
                rules={[{
                  required: !selectedUserId,
                  message: 'Vui lòng nhập số điện thoại',
                }]}
              >
                <Input
                  placeholder={selectedUserId ? 'Tự điền từ tài khoản' : 'Nhập số điện thoại'}
                  readOnly={!!selectedUserId}
                  className={`h-12 rounded-xl border-primary-soft/30 hover:border-primary/50 focus:border-primary/50 shadow-sm ${selectedUserId ? 'bg-gray-50 text-text-muted cursor-not-allowed' : 'bg-white/60'}`}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="branch_id"
                label={
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black text-[#968271] uppercase tracking-[0.2em]">Chi nhánh làm việc</span>
                    {!selectedUserId && (
                      <span className="text-[10px] font-medium text-red-500 bg-red-50 px-2 py-0.5 rounded-full">Bắt buộc</span>
                    )}
                  </div>
                }
                rules={[{
                  required: !selectedUserId,
                  message: 'Vui lòng chọn chi nhánh',
                }]}
              >
                <Select
                  placeholder={isLoadingBranches ? 'Đang tải...' : 'Chọn chi nhánh'}
                  loading={isLoadingBranches}
                  disabled={!!selectedUserId}
                  showSearch
                  allowClear
                  optionFilterProp="label"
                  className="h-12"
                  classNames={{ popup: { root: '!rounded-2xl' } }}
                  options={branches.map((b: any) => ({
                    value: b.id,
                    label: b.name,
                  }))}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={24}>
            <Col span={12}>
              <Form.Item
                name="position"
                label={<span className="text-[10px] font-black text-[#968271] uppercase tracking-[0.2em]">Chức vụ</span>}
                rules={[{ required: true, message: 'Vui lòng chọn chức vụ' }]}
              >
                <Select placeholder="Chọn chức vụ" className="h-12" classNames={{ popup: { root: '!rounded-2xl' } }}>
                  {POSITION_OPTIONS.map(opt => (
                    <Option key={opt.value} value={opt.value}>{opt.label}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="hire_date"
                label={<span className="text-[10px] font-black text-[#968271] uppercase tracking-[0.2em]">Ngày bắt đầu làm việc</span>}
                rules={[{ required: true, message: 'Vui lòng chọn ngày' }]}
              >
                <DatePicker
                  format="DD/MM/YYYY"
                  placeholder="Chọn ngày"
                  className="w-full h-12 rounded-xl bg-white/60 border-primary-soft/30 hover:border-primary/50 focus:border-primary/50 shadow-sm"
                  classNames={{ popup: '!rounded-2xl' }}
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="base_salary"
            label={<span className="text-[10px] font-black text-[#968271] uppercase tracking-[0.2em]">Lương cơ bản (₫)</span>}
            rules={[{ required: true, message: 'Vui lòng nhập mức lương' }]}
            className="[&_.ant-input-number]:w-full [&_.ant-input-number]:h-12 [&_.ant-input-number]:rounded-xl [&_.ant-input-number]:border-primary-soft/30 [&_.ant-input-number:hover]:border-primary/50 [&_.ant-input-number-focused]:border-primary/50 [&_.ant-input-number-input]:h-full [&_.ant-input-number-input]:px-4"
          >
            <InputNumber
              placeholder="VD: 8,000,000"
              className='w-full! h-12! rounded-xl!'
              // style={{ width: '100%', height: '48px', borderRadius: '12px' }}
              formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              parser={(value) => value!.replace(/,/g, '') as any}
              min={0}
              step={500000}
              controls={false}
            />
          </Form.Item>

          <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-primary-soft/10">
            <button
              type="button"
              onClick={() => {
                setIsAddModalOpen(false);
                form.resetFields();
              }}
              className="px-6 py-3.5 bg-white border border-primary-soft/30 hover:bg-[#FFFAF4] text-text-secondary rounded-2xl text-[10px] font-black uppercase tracking-wider transition-all shadow-sm"
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              disabled={isCreating}
              className="px-8 py-3.5 bg-primary hover:scale-[1.02] active:scale-95 text-white rounded-2xl text-[10px] font-black uppercase tracking-wider transition-all shadow-lg shadow-primary/20 disabled:opacity-60 disabled:scale-100"
            >
              {isCreating ? 'Đang lưu...' : 'Lưu hồ sơ'}
            </button>
          </div>
        </Form>
      </Modal>
    </div>
  );
}

export default function EmployeesPage() {
  return (
    <ConfigProvider theme={antdTheme}>
      <App>
        <EmployeesPageInner />
      </App>
    </ConfigProvider>
  );
}

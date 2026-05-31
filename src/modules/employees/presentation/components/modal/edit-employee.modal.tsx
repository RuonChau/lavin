'use client';

import { useState, useEffect } from 'react';
import {
  ConfigProvider,
  Input,
  Modal,
  Form,
  Select,
  DatePicker,
  Row,
  Col,
  InputNumber,
} from 'antd';
import dayjs from 'dayjs';
import { IEmployeeEntity } from '@/modules/employees/domain/entities/employee.entity';
import { UserItem } from '@/modules/users/infrastructure/services/user.service';
import { Branch } from '@/modules/branches/domain/entities/branch.entity';
import { antdTheme } from '@/shared/utils/antdTheme';

const { Option } = Select;

export interface EditEmployeeModalProps {
  isOpen: boolean;
  onClose: () => void;
  employee: IEmployeeEntity | null;
  users: UserItem[];
  isLoadingUsers: boolean;
  branches: Branch[];
  isLoadingBranches: boolean;
  onSubmit: (values: any) => Promise<void>;
  isSubmitting: boolean;
}

const POSITION_OPTIONS = [
  { value: 'BARISTA', label: 'Barista (Nhân viên pha chế)' },
  { value: 'SERVER', label: 'Server (Nhân viên phục vụ)' },
  { value: 'CASHIER', label: 'Cashier (Thu ngân)' },
  { value: 'SHIFT_LEADER', label: 'Shift Leader (Quản lý ca)' },
  { value: 'AREA_MANAGER', label: 'Area Manager (Quản lý khu vực)' },
  { value: 'ACCOUNTANT', label: 'Kế toán' },
  { value: 'PURCHASING', label: 'Mua hàng' },
  { value: 'ADMIN', label: 'Admin' },
];

export function EditEmployeeModal({
  isOpen,
  onClose,
  employee,
  users,
  isLoadingUsers,
  branches,
  isLoadingBranches,
  onSubmit,
  isSubmitting,
}: EditEmployeeModalProps) {
  const [form] = Form.useForm();
  
  // Watch user_id to toggle required/readonly status
  const selectedUserId = Form.useWatch('user_id', form);

  // Load current values when modal opens or selected employee changes
  useEffect(() => {
    if (isOpen && employee) {
      form.setFieldsValue({
        user_id: employee.user_id || undefined,
        full_name: employee.user?.username ?? employee.full_name,
        phone: employee.user?.phone ?? employee.phone,
        branch_id: employee.user?.branch_id ?? employee.branch_id,
        position: employee.position,
        hire_date: employee.hire_date ? dayjs(employee.hire_date) : null,
        base_salary: employee.base_salary,
      });
    } else {
      form.resetFields();
    }
  }, [isOpen, employee, form]);

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

  const handleFinish = async (values: any) => {
    await onSubmit(values);
  };

  if (!employee) return null;

  return (
    <ConfigProvider theme={antdTheme}>
      <Modal
        title={<span className="text-xl font-black text-text-primary tracking-tight italic">Chỉnh Sửa Hồ Sơ Nhân Viên</span>}
        footer={null}
        width={680}
        open={isOpen}
        onCancel={() => {
          onClose();
          form.resetFields();
        }}
        className="employee-modal [&_.ant-modal-content]:rounded-4xl [&_.ant-modal-content]:p-8 [&_.ant-modal-content]:bg-linear-to-br [&_.ant-modal-content]:from-white/95 [&_.ant-modal-content]:to-[#FFFAF4]/95 [&_.ant-modal-content]:border [&_.ant-modal-content]:border-primary-soft/30 [&_.ant-modal-content]:backdrop-blur-[20px] [&_.ant-modal-content]:shadow-[0_25px_50px_-12px_rgba(139,94,60,0.15)] [&_.ant-select-selector]:rounded-xl! [&_.ant-select-selector]:border-primary-soft/30! [&_.ant-select-selector]:bg-white/60! [&_.ant-select-selector]:h-12! [&_.ant-select-selector]:flex! [&_.ant-select-selector]:items-center! [&_.ant-select-selector]:shadow-sm! [&_.ant-select-selection-item]:font-medium [&_.ant-select-focused_.ant-select-selector]:border-primary/50! [&_.ant-select-focused_.ant-select-selector]:shadow-[0_0_0_2px_rgba(139,94,60,0.1)]!"
        style={{ top: 40 }}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleFinish}
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
                onClose();
                form.resetFields();
              }}
              className="px-6 py-3.5 bg-white border border-primary-soft/30 hover:bg-[#FFFAF4] text-text-secondary rounded-2xl text-[10px] font-black uppercase tracking-wider transition-all shadow-sm"
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-8 py-3.5 bg-primary hover:scale-[1.02] active:scale-95 text-white rounded-2xl text-[10px] font-black uppercase tracking-wider transition-all shadow-lg shadow-primary/20 disabled:opacity-60 disabled:scale-100"
            >
              {isSubmitting ? 'Đang lưu...' : 'Lưu thay đổi'}
            </button>
          </div>
        </Form>
      </Modal>
    </ConfigProvider>
  );
}

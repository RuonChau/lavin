'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Users,
  Plus,
  FileDown,
} from 'lucide-react';
import { ConfigProvider, App, Modal, Form, Input, Row, Col } from 'antd';
import { cn } from '@/shared/utils/cn';
import CustomersListTab from './tabs/customers-list.tab';
import TiersTab from './tabs/tiers.tab';
import HistoryTab from './tabs/history.tab';
import { antdTheme } from '@/shared/utils/antdTheme';
import { TabType } from '../../types/tab.type';
import { tabs } from '../../mocks/tabs.mock';
import { useCustomers } from '../hooks/useCustomers';

function CustomersPageInner() {
  const [activeTab, setActiveTab] = useState<TabType>('LIST');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [form] = Form.useForm();
  const { message } = App.useApp();
  const { createCustomer, isCreating } = useCustomers();

  const handleAddCustomer = async (values: any) => {
    try {
      await createCustomer({
        name: values.name.trim(),
        phone: values.phone.trim(),
        email: values.email?.trim() || '',
      });
      message.success('Thêm khách hàng mới thành công!');
      setIsAddModalOpen(false);
      form.resetFields();
    } catch (err: any) {
      message.error(err?.response?.data?.message ?? 'Đã xảy ra lỗi, vui lòng thử lại.');
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
            <h1 className="text-3xl font-black text-text-primary tracking-tight italic">Khách hàng</h1>
          </div>
          <p className="text-text-secondary font-medium">Hệ thống quản lý thông tin khách hàng và chăm sóc (CRM)</p>
        </div>

        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-6 py-3.5 bg-white border border-primary-soft/30 rounded-2xl text-[11px] font-black text-text-secondary uppercase tracking-wider hover:bg-bg-soft transition-all shadow-sm active:scale-95">
            <FileDown size={14} strokeWidth={3} />
            Xuất dữ liệu
          </button>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 px-8 py-3.5 bg-primary text-white rounded-2xl text-[11px] font-black uppercase tracking-wider shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all"
          >
            <Plus size={14} strokeWidth={3} />
            Thêm khách hàng
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap gap-4">
        {tabs.map((tab) => {
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
                  <h3 className={cn("text-sm font-black uppercase tracking-widest transition-colors", isActive ? "text-text-primary" : "text-primary-soft")}>
                    {tab.label}
                  </h3>
                  <p className="text-[10px] text-text-secondary font-medium mt-1 leading-tight">{tab.description}</p>
                </div>
              </div>

              {isActive && (
                <motion.div
                  layoutId="activeTabGlowC"
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
          {activeTab === 'LIST' && <CustomersListTab />}
          {activeTab === 'TIERS' && <TiersTab />}
          {activeTab === 'HISTORY' && <HistoryTab />}
        </motion.div>
      </AnimatePresence>

      <Modal
        title={<span className="text-xl font-black text-text-primary tracking-tight italic">Thêm Khách Hàng Mới</span>}
        open={isAddModalOpen}
        onCancel={() => {
          setIsAddModalOpen(false);
          form.resetFields();
        }}
        footer={null}
        width={680}
        className="employee-modal [&_.ant-modal-content]:rounded-4xl [&_.ant-modal-content]:p-8 [&_.ant-modal-content]:bg-linear-to-br [&_.ant-modal-content]:from-white/95 [&_.ant-modal-content]:to-[#FFFAF4]/95 [&_.ant-modal-content]:border [&_.ant-modal-content]:border-primary-soft/30 [&_.ant-modal-content]:backdrop-blur-[20px] [&_.ant-modal-content]:shadow-[0_25px_50px_-12px_rgba(139,94,60,0.15)]"
        style={{ top: 60 }}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleAddCustomer}
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
                <Input placeholder="Nguyễn Văn A" className="h-12 rounded-xl border-primary-soft/30 hover:border-primary/50 focus:border-primary/50 shadow-sm bg-white/60" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="phone"
                label={<span className="text-[10px] font-black text-[#968271] uppercase tracking-[0.2em]">Số điện thoại</span>}
                rules={[{ required: true, message: 'Vui lòng nhập số điện thoại' }]}
              >
                <Input placeholder="0901234567" className="h-12 rounded-xl border-primary-soft/30 hover:border-primary/50 focus:border-primary/50 shadow-sm bg-white/60" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="email"
            label={<span className="text-[10px] font-black text-[#968271] uppercase tracking-[0.2em]">Email</span>}
            rules={[{ type: 'email', message: 'Vui lòng nhập email hợp lệ' }]}
          >
            <Input placeholder="nva@example.com" className="h-12 rounded-xl border-primary-soft/30 hover:border-primary/50 focus:border-primary/50 shadow-sm bg-white/60" />
          </Form.Item>

          <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-primary-soft/10">
            <button
              type="button"
              onClick={() => {
                setIsAddModalOpen(false);
                form.resetFields();
              }}
              className="px-6 py-3.5 bg-white border border-primary-soft/30 hover:bg-[#FFFAF4] text-text-secondary rounded-2xl text-[10px] font-black uppercase tracking-wider transition-all shadow-sm"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={isCreating}
              className="px-8 py-3.5 bg-primary hover:scale-[1.02] active:scale-95 text-white rounded-2xl text-[10px] font-black uppercase tracking-wider transition-all shadow-lg shadow-primary/20 disabled:opacity-60 disabled:scale-100"
            >
              {isCreating ? 'Đang thêm...' : 'Thêm khách hàng'}
            </button>
          </div>
        </Form>
      </Modal>
    </div>
  );
}

export default function CustomersPage() {
  return (
    <ConfigProvider theme={antdTheme}>
      <App>
        <CustomersPageInner />
      </App>
    </ConfigProvider>
  );
}
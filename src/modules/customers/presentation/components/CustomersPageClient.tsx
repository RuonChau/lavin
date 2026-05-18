'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Users,
  Plus,
  Star,
  FileDown,
  History,
} from 'lucide-react';
import { ConfigProvider, Modal, Form, Input, Row, Col, Select, DatePicker } from 'antd';
import { cn } from '@/shared/utils/cn';
import CustomersListTab from './tabs/CustomersListTab';
import TiersTab from './tabs/TiersTab';
import HistoryTab from './tabs/HistoryTab';
import { antdTheme } from '@/shared/utils/antdTheme';
import { TabType } from '../../types/tab.type';
import { tabs } from '../../mocks/tabs.mock';



export default function CustomersPage() {
  const [activeTab, setActiveTab] = useState<TabType>('LIST');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [form] = Form.useForm();

  const handleAddCustomer = (values: any) => {
    console.log('New customer:', values);
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
              <h1 className="text-3xl font-black text-[#2A1E17] tracking-tight italic">Khách hàng</h1>
            </div>
            <p className="text-[#6F5A4A] font-medium">Hệ thống quản lý thông tin khách hàng và chăm sóc (CRM)</p>
          </div>

          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-6 py-3.5 bg-white border border-[#D8B894]/30 rounded-2xl text-[11px] font-black text-[#6F5A4A] uppercase tracking-wider hover:bg-[#FFFAF4] transition-all shadow-sm active:scale-95">
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
                    layoutId="activeTabGlowC"
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
            {activeTab === 'LIST' && <CustomersListTab />}
            {activeTab === 'TIERS' && <TiersTab />}
            {activeTab === 'HISTORY' && <HistoryTab />}
          </motion.div>
        </AnimatePresence>

        <Modal
          title={<span className="text-xl font-black text-[#2A1E17] tracking-tight italic">Thêm Khách Hàng Mới</span>}
          open={isAddModalOpen}
          onCancel={() => {
            setIsAddModalOpen(false);
            form.resetFields();
          }}
          footer={null}
          width={700}
          className="customer-modal"
          style={{ top: 40 }}
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
                  <Input placeholder="Nguyễn Văn A" className="h-12 rounded-xl bg-white/60 border-[#D8B894]/30 hover:border-primary/50 focus:border-primary/50 shadow-sm" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="phone"
                  label={<span className="text-[10px] font-black text-[#968271] uppercase tracking-[0.2em]">Số điện thoại</span>}
                  rules={[{ required: true, message: 'Vui lòng nhập số điện thoại' }]}
                >
                  <Input placeholder="0901234567" className="h-12 rounded-xl bg-white/60 border-[#D8B894]/30 hover:border-primary/50 focus:border-primary/50 shadow-sm" />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={24}>
              <Col span={12}>
                <Form.Item
                  name="email"
                  label={<span className="text-[10px] font-black text-[#968271] uppercase tracking-[0.2em]">Email</span>}
                >
                  <Input placeholder="nva@example.com" className="h-12 rounded-xl bg-white/60 border-[#D8B894]/30 hover:border-primary/50 focus:border-primary/50 shadow-sm" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="dob"
                  label={<span className="text-[10px] font-black text-[#968271] uppercase tracking-[0.2em]">Ngày sinh</span>}
                >
                  <DatePicker format="DD/MM/YYYY" placeholder="Chọn ngày sinh" className="w-full h-12 rounded-xl bg-white/60 border-[#D8B894]/30 hover:border-primary/50 focus:border-primary/50 shadow-sm" classNames={{ popup: '!rounded-2xl' }} />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item
              name="address"
              label={<span className="text-[10px] font-black text-[#968271] uppercase tracking-[0.2em]">Địa chỉ</span>}
            >
              <Input placeholder="Địa chỉ giao hàng mặc định" className="h-12 rounded-xl bg-white/60 border-[#D8B894]/30 hover:border-primary/50 focus:border-primary/50 shadow-sm" />
            </Form.Item>

            <Form.Item
              name="note"
              label={<span className="text-[10px] font-black text-[#968271] uppercase tracking-[0.2em]">Ghi chú (Sở thích/Lưu ý)</span>}
            >
              <Input.TextArea rows={2} placeholder="Thường uống cafe ít sữa, ít đá..." className="rounded-xl bg-white/60 border-[#D8B894]/30 hover:border-primary/50 focus:border-primary/50 shadow-sm py-3" />
            </Form.Item>

            <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-[#D8B894]/10">
              <button
                type="button"
                onClick={() => {
                  setIsAddModalOpen(false);
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
                Thêm khách hàng
              </button>
            </div>
          </Form>
        </Modal>
      </div>
    </ConfigProvider>
  );
}
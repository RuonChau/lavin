import { GlassCard } from "@/shared/components/GlassCard";
import { Table, Modal, Form, Input, Row, Col, App } from "antd";
import { CircleDot, Filter, Search, Users, ChevronLeft, ChevronRight } from "lucide-react";
import { customerTableColumns } from "../../../config/customer-table-columns.config";
import { useCustomers } from "../../hooks/useCustomers";
import { useState } from "react";
import { Customer } from "../../../infrastructure/services/customer.service";
import { useAuth } from "@/modules/auth";
import { isManagerRole } from "@/modules/settings/utils/access-control";

export default function CustomersListTab() {
  const { user } = useAuth();
  const canManage = isManagerRole(user?.role);
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const { message } = App.useApp();

  const {
    customers,
    total,
    isLoading,
    updateCustomer,
    isUpdating,
    deleteCustomer,
    isDeleting,
  } = useCustomers(page, 10);

  // Modal states
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const [form] = Form.useForm();

  // Filter clients locally for instant searching on current page
  const filteredCustomers = customers.filter((cust: Customer) => {
    if (!searchTerm) return true;
    const q = searchTerm.toLowerCase();
    return (
      (cust.name && cust.name.toLowerCase().includes(q)) ||
      (cust.phone && cust.phone.includes(q)) ||
      (cust.email && cust.email.toLowerCase().includes(q))
    );
  });

  // Action handlers
  const handleEdit = (customer: Customer) => {
    setSelectedCustomer(customer);
    form.setFieldsValue({
      name: customer.name,
      phone: customer.phone,
      email: customer.email,
    });
    setIsEditModalOpen(true);
  };

  const handleDelete = (customer: Customer) => {
    if (!canManage) return;
    setSelectedCustomer(customer);
    setIsDeleteModalOpen(true);
  };

  const handleEditSubmit = async (values: any) => {
    if (!selectedCustomer) return;
    try {
      await updateCustomer({
        id: selectedCustomer.id,
        data: {
          name: values.name.trim(),
          phone: values.phone.trim(),
          email: values.email?.trim() || '',
        },
      });
      message.success("Cập nhật thông tin khách hàng thành công!");
      setIsEditModalOpen(false);
      setSelectedCustomer(null);
      form.resetFields();
    } catch (err: any) {
      message.error(err?.response?.data?.message ?? "Đã xảy ra lỗi, vui lòng thử lại.");
    }
  };

  const handleDeleteConfirm = async () => {
    if (!selectedCustomer) return;
    try {
      await deleteCustomer(selectedCustomer.id);
      message.success(`Đã xóa thông tin khách hàng "${selectedCustomer.name}" thành công!`);
      setIsDeleteModalOpen(false);
      setSelectedCustomer(null);
    } catch (err: any) {
      message.error(err?.response?.data?.message ?? "Không thể xóa khách hàng.");
    }
  };

  const columns = customerTableColumns(handleEdit, handleDelete, canManage);

  return (
    <div className="space-y-6">
      <GlassCard className="p-8" radius="4xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-primary-soft" size={18} />
            <input
              type="text"
              placeholder="Tìm theo tên, số điện thoại, email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white/60 border border-primary-soft/20 rounded-2xl py-3.5 pl-12 pr-4 text-sm font-medium focus:outline-none focus:border-primary/40 focus:bg-white transition-all shadow-sm h-12"
            />
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-5 py-3.5 bg-white border border-primary-soft/30 rounded-2xl text-[10px] font-black text-text-secondary uppercase tracking-wider hover:bg-gray-50 transition-all shadow-sm">
              <Filter size={14} />
              Lọc hạng
            </button>
          </div>
        </div>

        <div className="bg-white/40 rounded-3xl border border-primary-soft/20 overflow-hidden">
          <Table
            columns={columns}
            dataSource={isLoading ? [] : filteredCustomers}
            loading={isLoading}
            rowKey="id"
            locale={{
              emptyText: (
                <div className="flex flex-col items-center py-12">
                  <div className="w-16 h-16 rounded-3xl bg-white/60 flex items-center justify-center text-text-muted/40 mb-4 border border-primary-soft/10">
                    <Users size={32} />
                  </div>
                  <p className="text-sm font-bold text-text-muted">Chưa tìm thấy khách hàng nào</p>
                </div>
              )
            }}
            pagination={{
              current: page,
              pageSize: 10,
              total: total,
              onChange: (p) => setPage(p),
              placement: ['bottomCenter'],
              itemRender: (_, type, originalElement) => {
                if (type === 'prev') return <div className="p-1"><ChevronLeft size={16} /></div>;
                if (type === 'next') return <div className="p-1"><ChevronRight size={16} /></div>;
                return originalElement;
              },
              className: 'px-8 py-6 mb-0 border-t border-[#D8B894]/20 !mt-0',
            }}
            className="antd-custom-table [&_.ant-table]:bg-transparent [&_.ant-table-thead>tr>th]:py-6! [&_.ant-table-thead>tr>th]:px-4! [&_.ant-table-thead>tr>th]:border-b-primary-soft/20! [&_.ant-table-tbody>tr>td]:py-5! [&_.ant-table-tbody>tr>td]:px-4! [&_.ant-table-tbody>tr>td]:border-b-primary-soft/10! [&_.ant-table-tbody>tr>td]:bg-transparent! [&_.ant-table-pagination]:m-0! [&_.ant-table-pagination]:py-6! [&_.ant-table-pagination]:px-8! [&_.ant-table-pagination]:bg-white/40! [&_.ant-table-pagination]:justify-start! [&_.ant-pagination-item]:rounded-xl! [&_.ant-pagination-item]:border-primary-soft/20! [&_.ant-pagination-item]:bg-white! [&_.ant-pagination-item]:font-black! [&_.ant-pagination-item]:text-[10px]! [&_.ant-pagination-item-active]:bg-primary! [&_.ant-pagination-item-active]:border-primary! [&_.ant-pagination-item-active>a]:text-white! [&_.ant-pagination-prev]:bg-transparent! [&_.ant-pagination-prev]:rounded-xl! [&_.ant-pagination-next]:bg-transparent! [&_.ant-pagination-next]:rounded-xl"
            rowClassName="group hover:bg-[#FFFAF4]/10 transition-colors"
          />
        </div>

        <div className="mt-4 flex justify-between items-center px-2">
          <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-text-muted">
            <span className="flex items-center gap-1.5"><CircleDot size={10} className="text-blue-500" /> Kim Cương</span>
            <span className="flex items-center gap-1.5"><CircleDot size={10} className="text-amber-500" /> Vàng</span>
            <span className="flex items-center gap-1.5"><CircleDot size={10} className="text-slate-500" /> Bạc</span>
          </div>
          <p className="text-[10px] font-black text-[#968271] uppercase tracking-widest italic">
            Đang hiển thị {isLoading ? 0 : filteredCustomers.length} trên tổng số {isLoading ? 0 : total} khách hàng
          </p>
        </div>
      </GlassCard>

      {/* Edit Customer Modal */}
      <Modal
        title={<span className="text-xl font-black text-text-primary tracking-tight italic">Cập Nhật Thông Tin Khách Hàng</span>}
        open={isEditModalOpen}
        onCancel={() => {
          setIsEditModalOpen(false);
          setSelectedCustomer(null);
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
          onFinish={handleEditSubmit}
          className="mt-6 w-full"
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

          <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-primary-soft/10">
            <button
              type="button"
              onClick={() => {
                setIsEditModalOpen(false);
                setSelectedCustomer(null);
                form.resetFields();
              }}
              className="px-6 py-3.5 bg-white border border-primary-soft/30 hover:bg-[#FFFAF4] text-text-secondary rounded-2xl text-[10px] font-black uppercase tracking-wider transition-all shadow-sm active:scale-95"
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              disabled={isUpdating}
              className="px-8 py-3.5 bg-primary hover:scale-[1.02] active:scale-95 text-white rounded-2xl text-[10px] font-black uppercase tracking-wider transition-all shadow-lg shadow-primary/20 disabled:opacity-60 disabled:scale-100"
            >
              {isUpdating ? 'Đang lưu...' : 'Lưu thông tin'}
            </button>
          </div>
        </Form>
      </Modal>

      {/* Delete Customer Confirmation Modal */}
      <Modal
        title={<span className="text-xl font-black text-red-600 tracking-tight italic">Xác Nhận Xóa Khách Hàng</span>}
        open={isDeleteModalOpen}
        onCancel={() => {
          setIsDeleteModalOpen(false);
          setSelectedCustomer(null);
        }}
        footer={null}
        width={440}
        className="employee-modal [&_.ant-modal-content]:rounded-4xl [&_.ant-modal-content]:p-8 [&_.ant-modal-content]:bg-linear-to-br [&_.ant-modal-content]:from-white [&_.ant-modal-content]:to-red-50/30 [&_.ant-modal-content]:border [&_.ant-modal-content]:border-red-200"
        style={{ top: 120 }}
      >
        <div className="mt-4 space-y-4">
          <p className="text-sm font-semibold text-text-secondary leading-relaxed">
            Bạn có chắc chắn muốn xóa hồ sơ khách hàng <strong className="text-text-primary">"{selectedCustomer?.name}"</strong>?
            Hành động này <span className="text-red-500 font-bold">không thể hoàn tác</span> và sẽ xóa vĩnh viễn tất cả thông tin thành viên cùng điểm tích lũy của khách hàng này.
          </p>

          <div className="flex justify-end gap-3 pt-4">
            <button
              onClick={() => {
                setIsDeleteModalOpen(false);
                setSelectedCustomer(null);
              }}
              className="px-5 py-3 bg-white border border-primary-soft/20 text-text-secondary hover:bg-gray-50 rounded-2xl text-[10px] font-black uppercase tracking-wider transition-all shadow-sm active:scale-95"
            >
              Hủy
            </button>
            <button
              onClick={handleDeleteConfirm}
              disabled={isDeleting}
              className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-2xl text-[10px] font-black uppercase tracking-wider transition-all shadow-lg shadow-red-200 disabled:opacity-60 active:scale-95"
            >
              {isDeleting ? 'Đang xóa...' : 'Đồng ý xóa'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

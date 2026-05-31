'use client';

import { useState } from 'react';
import {
  Store,
  Plus,
  FileDown,
  Search,
  MapPin,
  Phone,
  Building2,
  Activity,
  Trash2,
  Edit,
  CheckCircle2,
  XCircle,
  Sparkles,
} from 'lucide-react';
import { ConfigProvider, App, Table, Modal, Form, Input, Row, Col, Select, Switch } from 'antd';
import { cn } from '@/shared/utils/cn';
import { antdTheme } from '@/shared/utils/antdTheme';
import { GlassCard } from '@/shared/components/GlassCard';
import { useBranches } from '../hooks/useBranches';
import { Branch } from '../../domain/entities/branch.entity';

function BranchesPageInner() {
  const {
    branches,
    isLoading,
    createBranch,
    isCreating,
    updateBranch,
    isUpdating,
    deleteBranch,
    isDeleting,
  } = useBranches();

  const { message } = App.useApp();
  const [form] = Form.useForm();

  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingBranch, setEditingBranch] = useState<Branch | null>(null);
  const [deletingBranch, setDeletingBranch] = useState<Branch | null>(null);

  // Filter branches based on search term
  const filteredBranches = branches.filter((branch) => {
    if (!searchTerm) return true;
    const q = searchTerm.toLowerCase();
    return (
      branch.name.toLowerCase().includes(q) ||
      (branch.address && branch.address.toLowerCase().includes(q)) ||
      (branch.phone && branch.phone.includes(q))
    );
  });

  // Calculate statistics
  const totalBranches = branches.length;
  const activeBranches = branches.filter(b => b.is_active).length;
  const hqCount = branches.filter(b => b.is_headquarter).length;
  const warehouseCount = branches.filter(b => b.is_warehouse).length;
  const storeCount = branches.filter(b => !b.is_warehouse && !b.is_headquarter).length;

  // Handle open Edit modal
  const handleEdit = (branch: Branch) => {
    setEditingBranch(branch);

    let locationType = 'STORE';
    if (branch.is_headquarter) {
      locationType = 'HQ';
    } else if (branch.is_warehouse) {
      locationType = 'WAREHOUSE';
    }

    form.setFieldsValue({
      name: branch.name,
      address: branch.address,
      phone: branch.phone,
      is_active: branch.is_active,
      location_type: locationType,
    });
  };

  // Handle Create or Update submission
  const handleFormSubmit = async (values: any) => {
    try {
      const is_warehouse = values.location_type === 'WAREHOUSE';
      const is_headquarter = values.location_type === 'HQ';

      if (editingBranch) {
        await updateBranch({
          id: editingBranch.id,
          data: {
            name: values.name.trim(),
            address: values.address?.trim() || '',
            phone: values.phone?.trim() || '',
            is_active: values.is_active,
            is_warehouse,
            is_headquarter,
          },
        });
        message.success('Cập nhật chi nhánh thành công!');
        setEditingBranch(null);
      } else {
        await createBranch({
          name: values.name.trim(),
          address: values.address?.trim() || '',
          phone: values.phone?.trim() || '',
          is_active: values.is_active !== undefined ? values.is_active : true,
          is_warehouse,
          is_headquarter,
        });
        message.success('Thêm chi nhánh mới thành công!');
        setIsAddModalOpen(false);
      }
      form.resetFields();
    } catch (err: any) {
      message.error(err?.response?.data?.message ?? 'Đã xảy ra lỗi, vui lòng thử lại.');
    }
  };

  // Handle Delete branch
  const handleDeleteConfirm = async () => {
    if (!deletingBranch) return;
    try {
      await deleteBranch(deletingBranch.id);
      message.success(`Đã xóa chi nhánh "${deletingBranch.name}" thành công!`);
      setDeletingBranch(null);
    } catch (err: any) {
      message.error(err?.response?.data?.message ?? 'Không thể xóa chi nhánh.');
    }
  };

  // Define Table Columns
  const columns = [
    {
      title: 'TÊN CHI NHÁNH',
      key: 'name',
      render: (_: any, record: Branch) => (
        <div className="flex items-center gap-3">
          <div className={cn(
            "w-10 h-10 rounded-xl flex items-center justify-center border",
            record.is_headquarter
              ? "bg-rose-50 text-rose-600 border-rose-100"
              : record.is_warehouse
                ? "bg-amber-50 text-amber-600 border-amber-100"
                : "bg-primary/10 text-primary border-primary/20"
          )}>
            {record.is_headquarter ? <Building2 size={18} /> : record.is_warehouse ? <Building2 size={18} /> : <Store size={18} />}
          </div>
          <div>
            <h4 className="font-bold text-text-primary text-sm">{record.name}</h4>
            <span className="text-[10px] uppercase font-semibold text-text-muted tracking-wider">
              {record.is_headquarter ? 'Trụ sở chính' : record.is_warehouse ? 'Nhà kho / Tổng kho' : 'Điểm bán lẻ'}
            </span>
          </div>
        </div>
      ),
    },
    {
      title: 'ĐỊA CHỈ',
      dataIndex: 'address',
      key: 'address',
      render: (address: string) => (
        <div className="flex items-center gap-2 max-w-xs md:max-w-sm">
          <MapPin size={14} className="text-primary-soft shrink-0" />
          <span className="text-xs text-text-secondary font-medium truncate" title={address}>
            {address || 'Chưa cập nhật'}
          </span>
        </div>
      ),
    },
    {
      title: 'SỐ ĐIỆN THOẠI',
      dataIndex: 'phone',
      key: 'phone',
      render: (phone: string) => (
        <div className="flex items-center gap-2">
          <Phone size={14} className="text-primary-soft" />
          <span className="text-xs text-text-secondary font-semibold">
            {phone || 'Chưa cập nhật'}
          </span>
        </div>
      ),
    },
    {
      title: 'TRẠNG THÁI',
      key: 'status',
      render: (_: any, record: Branch) => (
        <span className={cn(
          "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider",
          record.is_active
            ? "bg-green-50 text-green-600 border border-green-100"
            : "bg-red-50 text-red-600 border border-red-100"
        )}>
          {record.is_active ? (
            <>
              <CheckCircle2 size={12} /> Đang mở
            </>
          ) : (
            <>
              <XCircle size={12} /> Đã đóng
            </>
          )}
        </span>
      ),
    },
    {
      title: 'NGÀY TẠO',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (created_at: string) => (
        <span className="text-xs text-text-muted font-medium">
          {created_at ? new Date(created_at).toLocaleDateString('vi-VN') : '---'}
        </span>
      ),
    },
    {
      title: 'HÀNH ĐỘNG',
      key: 'actions',
      align: 'right' as const,
      render: (_: any, record: Branch) => (
        <div className="flex items-center justify-end gap-2">
          <button
            onClick={() => handleEdit(record)}
            className="p-2 bg-white hover:bg-amber-50 text-text-secondary hover:text-amber-600 border border-primary-soft/20 rounded-xl transition-all shadow-sm active:scale-95"
            title="Sửa thông tin"
          >
            <Edit size={14} />
          </button>
          <button
            onClick={() => setDeletingBranch(record)}
            className="p-2 bg-white hover:bg-red-50 text-text-secondary hover:text-red-600 border border-primary-soft/20 rounded-xl transition-all shadow-sm active:scale-95"
            title="Xóa chi nhánh"
          >
            <Trash2 size={14} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-8 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
              <Store size={20} />
            </div>
            <h1 className="text-3xl font-black text-text-primary tracking-tight italic">Chi nhánh & Kho hàng</h1>
          </div>
          <p className="text-text-secondary font-medium">Quản lý hệ thống chuỗi cửa hàng và kho trung chuyển nguyên vật liệu</p>
        </div>

        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-6 py-3.5 bg-white border border-primary-soft/30 rounded-2xl text-[11px] font-black text-text-secondary uppercase tracking-wider hover:bg-[#FFFAF4] transition-all shadow-sm active:scale-95">
            <FileDown size={14} strokeWidth={3} />
            Xuất dữ liệu
          </button>
          <button
            onClick={() => {
              setEditingBranch(null);
              form.resetFields();
              setIsAddModalOpen(true);
            }}
            className="flex items-center gap-2 px-8 py-3.5 bg-primary text-white rounded-2xl text-[11px] font-black uppercase tracking-wider shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all"
          >
            <Plus size={14} strokeWidth={3} />
            Thêm chi nhánh
          </button>
        </div>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <GlassCard className="p-6 border border-primary-soft/20 shadow-md flex items-center gap-4" radius="4xl">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 text-primary flex items-center justify-center">
            <Store size={24} />
          </div>
          <div>
            <p className="text-[10px] text-text-muted font-bold uppercase tracking-wider">Tổng địa điểm</p>
            <h3 className="text-2xl font-black text-text-primary mt-1">{isLoading ? '...' : totalBranches}</h3>
          </div>
        </GlassCard>

        <GlassCard className="p-6 border border-primary-soft/20 shadow-md flex items-center gap-4" radius="4xl">
          <div className="w-12 h-12 rounded-2xl bg-green-50 border border-green-100 text-green-600 flex items-center justify-center">
            <Activity size={24} />
          </div>
          <div>
            <p className="text-[10px] text-text-muted font-bold uppercase tracking-wider">Đang mở cửa</p>
            <h3 className="text-2xl font-black text-text-primary mt-1">{isLoading ? '...' : activeBranches}</h3>
          </div>
        </GlassCard>

        <GlassCard className="p-6 border border-primary-soft/20 shadow-md flex items-center gap-4" radius="4xl">
          <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-100 text-rose-600 flex items-center justify-center">
            <Building2 size={24} />
          </div>
          <div>
            <p className="text-[10px] text-text-muted font-bold uppercase tracking-wider">Trụ sở chính</p>
            <h3 className="text-2xl font-black text-text-primary mt-1">{isLoading ? '...' : hqCount}</h3>
          </div>
        </GlassCard>

        <GlassCard className="p-6 border border-primary-soft/20 shadow-md flex items-center gap-4" radius="4xl">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-100 text-amber-600 flex items-center justify-center">
            <Building2 size={24} />
          </div>
          <div>
            <p className="text-[10px] text-text-muted font-bold uppercase tracking-wider">Tổng kho trung chuyển</p>
            <h3 className="text-2xl font-black text-text-primary mt-1">{isLoading ? '...' : warehouseCount}</h3>
          </div>
        </GlassCard>

        <GlassCard className="p-6 border border-primary-soft/20 shadow-md flex items-center gap-4" radius="4xl">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-100 text-blue-600 flex items-center justify-center">
            <Sparkles size={24} />
          </div>
          <div>
            <p className="text-[10px] text-text-muted font-bold uppercase tracking-wider">Cửa hàng bán lẻ</p>
            <h3 className="text-2xl font-black text-text-primary mt-1">{isLoading ? '...' : storeCount}</h3>
          </div>
        </GlassCard>
      </div>

      {/* Search & Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <Input
          prefix={<Search className="text-primary-soft" size={18} />}
          placeholder="Tìm chi nhánh theo tên, địa chỉ, số điện thoại..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full md:w-96 bg-white/60! border-primary-soft/20! rounded-2xl! py-3.5! pl-10! pr-4! text-sm! font-medium! hover:border-primary/40! focus:border-primary/40! focus:shadow-none! h-12!"
        />
      </div>

      {/* Branches Table */}
      <GlassCard className="overflow-hidden shadow-xl" radius="4xl">
        <Table
          columns={columns}
          dataSource={isLoading ? [] : filteredBranches}
          loading={isLoading}
          rowKey="id"
          locale={{
            emptyText: (
              <div className="flex flex-col items-center py-12">
                <div className="w-16 h-16 rounded-3xl bg-white/60 flex items-center justify-center text-text-muted/40 mb-4 border border-primary-soft/10">
                  <Store size={32} />
                </div>
                <p className="text-sm font-bold text-text-muted">Chưa tìm thấy chi nhánh nào</p>
              </div>
            )
          }}
          pagination={{
            pageSize: 8,
            className: "px-8 py-6 mb-0 border-t border-[#D8B894]/20",
          }}
          className="antd-custom-table [&_.ant-table]:bg-transparent [&_.ant-table-thead>tr>th]:py-6! [&_.ant-table-thead>tr>th]:px-4! [&_.ant-table-thead>tr>th]:border-b-primary-soft/20! [&_.ant-table-tbody>tr>td]:py-5! [&_.ant-table-tbody>tr>td]:px-4! [&_.ant-table-tbody>tr>td]:border-b-primary-soft/10! [&_.ant-table-tbody>tr>td]:bg-transparent! [&_.ant-table-pagination]:m-0! [&_.ant-table-pagination]:py-6! [&_.ant-table-pagination]:px-8! [&_.ant-table-pagination]:bg-white/40! [&_.ant-table-pagination]:justify-start! [&_.ant-pagination-item]:rounded-xl! [&_.ant-pagination-item]:border-primary-soft/20! [&_.ant-pagination-item]:bg-white! [&_.ant-pagination-item]:font-black! [&_.ant-pagination-item]:text-[10px]! [&_.ant-pagination-item-active]:bg-primary! [&_.ant-pagination-item-active]:border-primary! [&_.ant-pagination-item-active>a]:text-white!"
          rowClassName="group hover:bg-[#FFFAF4]/10 transition-colors"
        />
      </GlassCard>

      {/* Add / Edit Branch Modal */}
      <Modal
        title={
          <span className="text-xl font-black text-text-primary tracking-tight italic">
            {editingBranch ? 'Cập Nhật Thông Tin Chi Nhánh' : 'Thêm Chi Nhánh Mới'}
          </span>
        }
        open={isAddModalOpen || !!editingBranch}
        onCancel={() => {
          setIsAddModalOpen(false);
          setEditingBranch(null);
          form.resetFields();
        }}
        footer={null}
        width={680}
        className="employee-modal [&_.ant-modal-content]:rounded-4xl [&_.ant-modal-content]:p-8 [&_.ant-modal-content]:bg-linear-to-br [&_.ant-modal-content]:from-white/95 [&_.ant-modal-content]:to-[#FFFAF4]/95 [&_.ant-modal-content]:border [&_.ant-modal-content]:border-primary-soft/30 [&_.ant-modal-content]:backdrop-blur-[20px] [&_.ant-modal-content]:shadow-[0_25px_50px_-12px_rgba(139,94,60,0.15)] [&_.ant-select-selector]:rounded-xl! [&_.ant-select-selector]:border-primary-soft/30! [&_.ant-select-selector]:bg-white/60! [&_.ant-select-selector]:h-12! [&_.ant-select-selector]:flex! [&_.ant-select-selector]:items-center! [&_.ant-select-selector]:shadow-sm! [&_.ant-select-selection-item]:font-medium [&_.ant-select-focused_.ant-select-selector]:border-primary/50! [&_.ant-select-focused_.ant-select-selector]:shadow-[0_0_0_2px_rgba(139,94,60,0.1)]!"
        style={{ top: 60 }}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleFormSubmit}
          className="mt-6 w-full"
          requiredMark={false}
        >
          <Form.Item
            name="name"
            label={<span className="text-[10px] font-black text-[#968271] uppercase tracking-[0.2em]">Tên chi nhánh / kho</span>}
            rules={[{ required: true, message: 'Vui lòng nhập tên chi nhánh hoặc kho hàng' }]}
          >
            <Input
              placeholder="Ví dụ: LaVin Quận 1 hoặc Tổng Kho Tân Bình"
              className="h-12 rounded-xl border-primary-soft/30 hover:border-primary/50 focus:border-primary/50 shadow-sm bg-white/60"
            />
          </Form.Item>

          <Row gutter={24}>
            <Col span={12}>
              <Form.Item
                name="phone"
                label={<span className="text-[10px] font-black text-[#968271] uppercase tracking-[0.2em]">Số điện thoại liên hệ</span>}
              >
                <Input
                  placeholder="Ví dụ: 0281234567"
                  className="h-12 rounded-xl border-primary-soft/30 hover:border-primary/50 focus:border-primary/50 shadow-sm bg-white/60"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="location_type"
                label={<span className="text-[10px] font-black text-[#968271] uppercase tracking-[0.2em]">Loại địa điểm</span>}
                initialValue="STORE"
              >
                <Select className="h-12" classNames={{ popup: { root: '!rounded-2xl' } }}>
                  <Select.Option value="STORE">Cửa hàng bán lẻ (Outlet)</Select.Option>
                  <Select.Option value="WAREHOUSE">Nhà kho trung chuyển (Warehouse)</Select.Option>
                  <Select.Option value="HQ">Trụ sở chính (Headquarters)</Select.Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="address"
            label={<span className="text-[10px] font-black text-[#968271] uppercase tracking-[0.2em]">Địa chỉ chi tiết</span>}
            rules={[{ required: true, message: 'Vui lòng nhập địa chỉ cụ thể' }]}
          >
            <Input
              placeholder="Số nhà, tên đường, Phường/Xã, Quận/Huyện, TP"
              className="h-12 rounded-xl border-primary-soft/30 hover:border-primary/50 focus:border-primary/50 shadow-sm bg-white/60"
            />
          </Form.Item>

          <Row gutter={24}>
            <Col span={24}>
              <Form.Item
                name="is_active"
                label={<span className="text-[10px] font-black text-[#968271] uppercase tracking-[0.2em]">Trạng thái mở cửa hoạt động</span>}
                valuePropName="checked"
                initialValue={true}
              >
                <div className="flex items-center gap-3 bg-white/40 p-4 rounded-xl border border-primary-soft/25">
                  <Switch defaultChecked />
                  <span className="text-xs text-text-secondary font-bold">Cho phép hoạt động và giao dịch tại chi nhánh này</span>
                </div>
              </Form.Item>
            </Col>
          </Row>

          <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-primary-soft/10">
            <button
              type="button"
              onClick={() => {
                setIsAddModalOpen(false);
                setEditingBranch(null);
                form.resetFields();
              }}
              className="px-6 py-3.5 bg-white border border-primary-soft/30 hover:bg-[#FFFAF4] text-text-secondary rounded-2xl text-[10px] font-black uppercase tracking-wider transition-all shadow-sm active:scale-95"
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              disabled={isCreating || isUpdating}
              className="px-8 py-3.5 bg-primary hover:scale-[1.02] active:scale-95 text-white rounded-2xl text-[10px] font-black uppercase tracking-wider transition-all shadow-lg shadow-primary/20 disabled:opacity-60 disabled:scale-100"
            >
              {isCreating || isUpdating ? 'Đang lưu...' : 'Lưu thông tin'}
            </button>
          </div>
        </Form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        title={<span className="text-xl font-black text-red-600 tracking-tight italic">Xác Nhận Xóa Chi Nhánh</span>}
        open={!!deletingBranch}
        onCancel={() => setDeletingBranch(null)}
        footer={null}
        width={440}
        className="employee-modal [&_.ant-modal-content]:rounded-4xl [&_.ant-modal-content]:p-8 [&_.ant-modal-content]:bg-linear-to-br [&_.ant-modal-content]:from-white [&_.ant-modal-content]:to-red-50/30 [&_.ant-modal-content]:border [&_.ant-modal-content]:border-red-200"
        style={{ top: 120 }}
      >
        <div className="mt-4 space-y-4">
          <p className="text-sm font-semibold text-text-secondary leading-relaxed">
            Bạn có chắc chắn muốn xóa chi nhánh <strong className="text-text-primary">"{deletingBranch?.name}"</strong>?
            Hành động này <span className="text-red-500 font-bold">không thể hoàn tác</span> và có thể ảnh hưởng đến lịch sử giao dịch liên quan.
          </p>

          <div className="flex justify-end gap-3 pt-4">
            <button
              onClick={() => setDeletingBranch(null)}
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

export default function BranchesPage() {
  return (
    <ConfigProvider theme={antdTheme}>
      <App>
        <BranchesPageInner />
      </App>
    </ConfigProvider>
  );
}

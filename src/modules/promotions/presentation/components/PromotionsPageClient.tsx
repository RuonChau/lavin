'use client';

import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import dayjs, { Dayjs } from 'dayjs';
import {
  Button,
  Col,
  ConfigProvider,
  DatePicker,
  Drawer,
  Dropdown,
  Form,
  Input,
  Modal,
  Progress,
  Row,
  Select,
  Switch,
  Table,
  Tag,
  Tooltip,
} from 'antd';
import type { MenuProps } from 'antd';
import {
  CirclePause,
  CirclePlay,
  Download,
  Edit2,
  Eye,
  Gift,
  MoreVertical,
  Plus,
  RefreshCcw,
  Search,
  Trash2,
} from 'lucide-react';
import { GlassCard } from '@/shared/components/GlassCard';
import { cn } from '@/shared/utils/cn';
import { PromotionTypeOptions } from '../../mocks/promotion-type-options.mock';
import { StatusOptions } from '../../mocks/status-options.type';
import { ScopeOptions } from '../../mocks/scope-options.type';
import { ListPromotions } from '../../mocks/list-promotions.type';
import { IPromotion, TPromotionScope, TPromotionStatus, TPromotionType } from '../../types/promotion.type';
import { promotionAntdTheme } from '@/shared/utils/promotionAntdTheme';
import { getPromotionStatus } from '../../utils/promotion-status.util';
import { getDiscountDisplay, getScopeLabel, getTypeLabel } from '../../utils/promotion-display.util';
import { formatCurrency } from '@/shared/utils/format-currency';
import { getPromotionTableColumns } from '../../configs/promotion-table-columns.config';
import { getPromotionStats } from '../../utils/get-promotion-stats.util';




const { RangePicker } = DatePicker;

type PromotionFormValues = {
  name: string;
  code: string;
  type: TPromotionType;
  discountValue: number | string;
  minimumOrderValue?: number | string;
  maxUsage: number | string;
  scope: TPromotionScope;
  status?: TPromotionStatus;
  startDate: Dayjs;
  endDate: Dayjs;
  description?: string;
  isActive: boolean;
};

export default function PromotionsPage() {
  const [promotions, setPromotions] = useState<IPromotion[]>(ListPromotions);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<TPromotionType | 'ALL'>('ALL');
  const [statusFilter, setStatusFilter] = useState<TPromotionStatus | 'ALL'>('ALL');
  const [dateRange, setDateRange] = useState<[Dayjs | null, Dayjs | null] | null>(null);
  const [selectedPromotion, setSelectedPromotion] = useState<IPromotion | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPromotion, setEditingPromotion] = useState<IPromotion | null>(null);
  const [form] = Form.useForm();

  const filteredPromotions = useMemo(() => {
    return promotions.filter((promotion) => {
      const searchValue = searchTerm.trim().toLowerCase();
      const matchesSearch =
        !searchValue ||
        promotion.name.toLowerCase().includes(searchValue) ||
        promotion.code.toLowerCase().includes(searchValue);
      const matchesType = typeFilter === 'ALL' || promotion.type === typeFilter;
      const matchesStatus = statusFilter === 'ALL' || promotion.status === statusFilter;
      const matchesDate =
        !dateRange?.[0] ||
        !dateRange?.[1] ||
        (dayjs(promotion.startDate).isBefore(dateRange[1].endOf('day')) &&
          dayjs(promotion.endDate).isAfter(dateRange[0].startOf('day')));

      return matchesSearch && matchesType && matchesStatus && matchesDate;
    });
  }, [dateRange, promotions, searchTerm, statusFilter, typeFilter]);


 
  const stats = useMemo(() => {
    return getPromotionStats(promotions);
  }, [promotions]);


  const resetFilters = () => {
    setSearchTerm('');
    setTypeFilter('ALL');
    setStatusFilter('ALL');
    setDateRange(null);
  };

  const openCreateModal = () => {
    setEditingPromotion(null);
    form.resetFields();
    form.setFieldsValue({
      type: 'PERCENTAGE',
      scope: 'ALL_ORDER',
      isActive: true,
      status: 'ACTIVE',
      startDate: dayjs(),
      endDate: dayjs().add(14, 'day'),
    });
    setIsModalOpen(true);
  };

  const openEditModal = (promotion: IPromotion) => {
    setEditingPromotion(promotion);
    form.setFieldsValue({
      ...promotion,
      startDate: dayjs(promotion.startDate),
      endDate: dayjs(promotion.endDate),
    });
    setIsModalOpen(true);
  };

  const openDetailDrawer = (promotion: IPromotion) => {
    setSelectedPromotion(promotion);
    setIsDrawerOpen(true);
  };

  const actionItems = (promotion: IPromotion): MenuProps['items'] => [
    {
      key: 'view',
      label: 'Xem chi tiết',
      icon: <Eye size={16} />,
      onClick: () => openDetailDrawer(promotion),
    },
    {
      key: 'edit',
      label: 'Chỉnh sửa',
      icon: <Edit2 size={16} />,
      onClick: () => openEditModal(promotion),
    },
    {
      key: 'toggle',
      label: promotion.status === 'PAUSED' ? 'Kích hoạt' : 'Tạm dừng',
      icon: promotion.status === 'PAUSED' ? <CirclePlay size={16} /> : <CirclePause size={16} />,
      onClick: () => handleToggleActive(promotion),
    },
    { type: 'divider' },
    {
      key: 'delete',
      label: 'Xóa',
      danger: true,
      icon: <Trash2 size={16} />,
      onClick: () => handleDelete(promotion),
    },
  ];

  


  const columns = getPromotionTableColumns({
    openDetailDrawer,
    actionItems,
  });



  const handleDelete = (promotion: IPromotion) => {
    Modal.confirm({
      title: 'Xóa khuyến mãi?',
      content: `Bạn đang xóa "${promotion.name}". Thao tác này chỉ cập nhật mock data trên màn hình.`,
      okText: 'Xóa',
      cancelText: 'Hủy',
      okButtonProps: { danger: true },
      onOk: () => {
        setPromotions((current) => current.filter((item) => item.id !== promotion.id));
      },
    });
  };

  const handleToggleActive = (promotion: IPromotion) => {
    setPromotions((current) =>
      current.map((item) =>
        item.id === promotion.id
          ? {
              ...item,
              isActive: !item.isActive,
              status: item.isActive ? 'PAUSED' : 'ACTIVE',
            }
          : item,
      ),
    );
  };

  const handleSubmit = (values: PromotionFormValues) => {
    const nextStatus: TPromotionStatus = values.isActive ? values.status ?? 'ACTIVE' : 'PAUSED';
    const payload: IPromotion = {
      id: editingPromotion?.id ?? `promo-${Date.now()}`,
      name: values.name,
      code: values.code.toUpperCase(),
      type: values.type,
      discountValue: Number(values.discountValue),
      minimumOrderValue: Number(values.minimumOrderValue ?? 0),
      maxUsage: Number(values.maxUsage),
      usedCount: editingPromotion?.usedCount ?? 0,
      scope: values.scope,
      appliedTargets: editingPromotion?.appliedTargets ?? [getScopeLabel(values.scope)],
      startDate: values.startDate.format('YYYY-MM-DD'),
      endDate: values.endDate.format('YYYY-MM-DD'),
      status: nextStatus,
      description: values.description ?? '',
      isActive: values.isActive,
      impactedRevenue: editingPromotion?.impactedRevenue ?? 0,
      conversionRate: editingPromotion?.conversionRate ?? 0,
      usageHistory: editingPromotion?.usageHistory ?? [],
    };

    setPromotions((current) =>
      editingPromotion ? current.map((item) => (item.id === editingPromotion.id ? payload : item)) : [payload, ...current],
    );
    setIsModalOpen(false);
    form.resetFields();
  };

  

  

  return (
    <ConfigProvider theme={promotionAntdTheme}>
      <div className="space-y-8 pb-16">
        <header className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="mb-3 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10 text-primary">
                <Gift size={22} />
              </div>
              <div>
                <h1 className="text-[28px] font-black tracking-tight text-[#2A1E17] md:text-3xl">Quản lý khuyến mãi</h1>
                <p className="mt-1 text-sm font-medium text-[#6F5A4A]">Tạo, theo dõi và tối ưu các chương trình ưu đãi cho khách hàng.</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button icon={<Download size={17} />} className="!h-11 !border-[#D8B894]/40 !bg-white/70 !font-black !text-[#6F5A4A]">
              Xuất báo cáo
            </Button>
            <Button type="primary" icon={<Plus size={17} />} onClick={openCreateModal} className="!h-11 !font-black !shadow-lg !shadow-primary/20">
              Tạo khuyến mãi
            </Button>
          </div>
        </header>

        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.04, duration: 0.32 }}
            >
              <GlassCard className="h-full p-5" radius="3xl">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#9A8677]">{stat.label}</p>
                    <p className="mt-2 text-2xl font-black text-[#2A1E17]">{stat.value}</p>
                    <p className="mt-1 text-[11px] font-semibold text-[#6F5A4A]">{stat.sub}</p>
                  </div>
                  <div className={cn('flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl shadow-sm', stat.color)}>
                    <stat.icon size={19} />
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </section>

        <GlassCard className="p-4" radius="3xl">
          <div className="grid grid-cols-1 gap-3 xl:grid-cols-[1.25fr_0.8fr_0.8fr_1fr_auto]">
            <Input
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              prefix={<Search size={18} className="text-[#D8B894]" />}
              placeholder="Tìm theo tên/mã khuyến mãi"
              allowClear
              className="!h-11 !border-[#D8B894]/30 !bg-white/70 !font-semibold"
            />
            <Select
              value={typeFilter}
              onChange={setTypeFilter}
              options={[{ value: 'ALL', label: 'Tất cả loại khuyến mãi' }, ...PromotionTypeOptions.map(({ value, label }) => ({ value, label }))]}
              className="h-11"
            />
            <Select
              value={statusFilter}
              onChange={setStatusFilter}
              options={[{ value: 'ALL', label: 'Tất cả trạng thái' }, ...StatusOptions]}
              className="h-11"
            />
            <RangePicker
              value={dateRange}
              onChange={(range) => setDateRange(range)}
              format="DD/MM/YYYY"
              placeholder={['Ngày bắt đầu', 'Ngày kết thúc']}
              className="!h-11 !border-[#D8B894]/30 !bg-white/70"
            />
            <Tooltip title="Reset filter">
              <Button icon={<RefreshCcw size={17} />} onClick={resetFilters} className="!h-11 !border-[#D8B894]/40 !bg-white/70 !font-black">
                Reset
              </Button>
            </Tooltip>
          </div>
        </GlassCard>

        <GlassCard className="hidden overflow-hidden lg:block" radius="4xl">
          <Table
            rowKey="id"
            columns={columns}
            dataSource={filteredPromotions}
            pagination={{ pageSize: 8, placement: ['bottomCenter'], className: '!my-5' }}
            className="promotion-table [&_.ant-table]:bg-transparent [&_.ant-table-container]:rounded-t-[28px] [&_.ant-table-thead>tr>th]:text-[10px] [&_.ant-table-thead>tr>th]:font-black [&_.ant-table-thead>tr>th]:tracking-[0.16em] [&_.ant-table-thead>tr>th]:uppercase [&_.ant-table-tbody>tr>td]:border-b-[#D8B894]/[0.14]"
            scroll={{ x: 1280 }}
          />
        </GlassCard>

        <div className="space-y-4 lg:hidden">
          <AnimatePresence initial={false}>
            {filteredPromotions.map((promotion) => {
              const status = getPromotionStatus(promotion.status);
              const percent = Math.min(Math.round((promotion.usedCount / promotion.maxUsage) * 100), 100);

              return (
                <motion.div
                  key={promotion.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.25 }}
                >
                  <GlassCard className="p-5" radius="3xl">
                    <div className="flex items-start justify-between gap-4">
                      <button onClick={() => openDetailDrawer(promotion)} className="min-w-0 text-left">
                        <p className="line-clamp-2 text-base font-black text-[#2A1E17]">{promotion.name}</p>
                        <p className="mt-1 font-mono text-xs font-black text-primary">{promotion.code}</p>
                      </button>
                      <Dropdown menu={{ items: actionItems(promotion) }} trigger={['click']} placement="bottomRight">
                        <Button type="text" icon={<MoreVertical size={18} />} />
                      </Dropdown>
                    </div>

                    <div className="mt-4 flex flex-wrap items-center gap-2">
                      <Tag color={status.color} className="m-0 rounded-full px-3 py-1 text-[11px] font-black uppercase">{status.label}</Tag>
                      <Tag className="m-0 rounded-full border-[#D8B894]/30 bg-white/70 px-3 py-1 text-[11px] font-bold text-[#6F5A4A]">{getTypeLabel(promotion.type)}</Tag>
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
                      <div className="rounded-2xl border border-[#D8B894]/20 bg-white/50 p-3">
                        <p className="font-black uppercase tracking-wider text-[#9A8677]">Thời hạn</p>
                        <p className="mt-1 font-bold text-[#2A1E17]">{dayjs(promotion.endDate).format('DD/MM/YYYY')}</p>
                      </div>
                      <div className="rounded-2xl border border-[#D8B894]/20 bg-white/50 p-3">
                        <p className="font-black uppercase tracking-wider text-[#9A8677]">Lượt dùng</p>
                        <p className="mt-1 font-bold text-[#2A1E17]">{promotion.usedCount}/{promotion.maxUsage}</p>
                      </div>
                    </div>

                    <div className="mt-4">
                      <Progress percent={percent} showInfo={false} size="small" strokeColor={percent >= 90 ? '#D95F76' : '#21B57D'} railColor="rgba(216, 184, 148, 0.25)" />
                    </div>
                  </GlassCard>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        <Modal
          title={<span className="text-xl font-black text-[#2A1E17]">{editingPromotion ? 'Chỉnh sửa khuyến mãi' : 'Tạo khuyến mãi'}</span>}
          open={isModalOpen}
          onCancel={() => setIsModalOpen(false)}
          footer={null}
          width={860}
          className="promotion-modal [&_.ant-modal-content]:bg-gradient-to-br [&_.ant-modal-content]:from-white/96 [&_.ant-modal-content]:to-[#FFFAF4]/96 [&_.ant-modal-content]:border [&_.ant-modal-content]:border-[#D8B894]/[0.28] [&_.ant-modal-content]:shadow-[0_24px_60px_rgba(91,58,41,0.16)] [&_.ant-modal-content]:rounded-[28px] [&_.ant-modal-content]:p-7 [&_.ant-form-item-label>label]:text-[#8a7666] [&_.ant-form-item-label>label]:text-[11px] [&_.ant-form-item-label>label]:font-black [&_.ant-form-item-label>label]:tracking-[0.12em] [&_.ant-form-item-label>label]:uppercase"
          style={{ top: 28 }}
          destroyOnHidden
        >
          <Form form={form} layout="vertical" requiredMark={false} onFinish={handleSubmit} className="mt-6">
            <Row gutter={18}>
              <Col xs={24} md={12}>
                <Form.Item name="name" label="Tên khuyến mãi" rules={[{ required: true, message: 'Vui lòng nhập tên khuyến mãi' }]}>
                  <Input placeholder="Ví dụ: Chào hè cùng LaVin" />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item name="code" label="Mã khuyến mãi" rules={[{ required: true, message: 'Vui lòng nhập mã khuyến mãi' }]}>
                  <Input placeholder="VD: LAVINHE25" />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={18}>
              <Col xs={24} md={12}>
                <Form.Item name="type" label="Loại khuyến mãi" rules={[{ required: true, message: 'Vui lòng chọn loại khuyến mãi' }]}>
                  <Select options={PromotionTypeOptions.map(({ value, label }) => ({ value, label }))} />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item name="discountValue" label="Giá trị giảm" rules={[{ required: true, message: 'Vui lòng nhập giá trị giảm' }]}>
                  <Input type="number" min={0} placeholder="25 hoặc 50000" />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={18}>
              <Col xs={24} md={12}>
                <Form.Item name="minimumOrderValue" label="Giá trị đơn hàng tối thiểu">
                  <Input type="number" min={0} placeholder="120000" />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item name="maxUsage" label="Số lượt sử dụng tối đa" rules={[{ required: true, message: 'Vui lòng nhập số lượt tối đa' }]}>
                  <Input type="number" min={1} placeholder="1000" />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={18}>
              <Col xs={24} md={12}>
                <Form.Item name="startDate" label="Ngày bắt đầu" rules={[{ required: true, message: 'Vui lòng chọn ngày bắt đầu' }]}>
                  <DatePicker format="DD/MM/YYYY" className="w-full" />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item name="endDate" label="Ngày kết thúc" rules={[{ required: true, message: 'Vui lòng chọn ngày kết thúc' }]}>
                  <DatePicker format="DD/MM/YYYY" className="w-full" />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={18}>
              <Col xs={24} md={12}>
                <Form.Item name="scope" label="Phạm vi áp dụng" rules={[{ required: true, message: 'Vui lòng chọn phạm vi' }]}>
                  <Select options={ScopeOptions.map(({ value, label }) => ({ value, label }))} />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item name="status" label="Trạng thái">
                  <Select options={StatusOptions} />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item name="description" label="Mô tả nội bộ">
              <Input.TextArea rows={3} placeholder="Ghi chú vận hành, mục tiêu chiến dịch, ngân sách..." className="rounded-2xl" />
            </Form.Item>

            <div className="flex flex-col gap-4 border-t border-[#D8B894]/20 pt-5 sm:flex-row sm:items-center sm:justify-between">
              <Form.Item name="isActive" valuePropName="checked" className="!mb-0">
                <Switch checkedChildren="Kích hoạt" unCheckedChildren="Tạm dừng" />
              </Form.Item>
              <div className="flex justify-end gap-3">
                <Button onClick={() => setIsModalOpen(false)}>Hủy</Button>
                <Button type="primary" htmlType="submit" icon={<Plus size={16} />}>
                  {editingPromotion ? 'Lưu thay đổi' : 'Tạo khuyến mãi'}
                </Button>
              </div>
            </div>
          </Form>
        </Modal>

        <Drawer
          title={<span className="text-lg font-black text-[#2A1E17]">Chi tiết khuyến mãi</span>}
          open={isDrawerOpen}
          onClose={() => setIsDrawerOpen(false)}
          size={560}
          className="promotion-drawer [&_.ant-drawer-content]:bg-gradient-to-br [&_.ant-drawer-content]:from-white/96 [&_.ant-drawer-content]:to-[#FFFAF4]/96 [&_.ant-drawer-content]:border [&_.ant-drawer-content]:border-[#D8B894]/[0.28] [&_.ant-drawer-content]:shadow-[0_24px_60px_rgba(91,58,41,0.16)]"
        >
          {selectedPromotion && (
            <div className="space-y-6">
              <section className="rounded-3xl border border-[#D8B894]/25 bg-white/60 p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xl font-black text-[#2A1E17]">{selectedPromotion.name}</p>
                    <p className="mt-2 font-mono text-sm font-black text-primary">{selectedPromotion.code}</p>
                  </div>
                  <Tag color={getPromotionStatus(selectedPromotion.status).color} className="m-0 rounded-full px-3 py-1 font-black">
                    {getPromotionStatus(selectedPromotion.status).label}
                  </Tag>
                </div>
                <p className="mt-4 text-sm font-medium leading-6 text-[#6F5A4A]">{selectedPromotion.description}</p>
              </section>

              <section className="grid grid-cols-2 gap-3">
                {[
                  ['Loại', getTypeLabel(selectedPromotion.type)],
                  ['Giá trị giảm', getDiscountDisplay(selectedPromotion)],
                  ['Đơn tối thiểu', formatCurrency(selectedPromotion.minimumOrderValue)],
                  ['Thời gian', `${dayjs(selectedPromotion.startDate).format('DD/MM')} - ${dayjs(selectedPromotion.endDate).format('DD/MM/YYYY')}`],
                ].map(([label, value]) => (
                  <div key={label} className="rounded-2xl border border-[#D8B894]/20 bg-white/55 p-4">
                    <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#9A8677]">{label}</p>
                    <p className="mt-2 text-sm font-black text-[#2A1E17]">{value}</p>
                  </div>
                ))}
              </section>

              <section className="rounded-3xl border border-[#D8B894]/25 bg-white/60 p-5">
                <p className="text-[11px] font-black uppercase tracking-[0.18em] text-[#9A8677]">Điều kiện áp dụng</p>
                <div className="mt-4 space-y-3 text-sm font-semibold text-[#6F5A4A]">
                  <p>Phạm vi: <span className="font-black text-[#2A1E17]">{getScopeLabel(selectedPromotion.scope)}</span></p>
                  <p>Giới hạn: <span className="font-black text-[#2A1E17]">{selectedPromotion.usedCount}/{selectedPromotion.maxUsage} lượt</span></p>
                  <Progress percent={Math.min(Math.round((selectedPromotion.usedCount / selectedPromotion.maxUsage) * 100), 100)} strokeColor="#8B5E3C" />
                </div>
              </section>

              <section className="rounded-3xl border border-[#D8B894]/25 bg-white/60 p-5">
                <p className="text-[11px] font-black uppercase tracking-[0.18em] text-[#9A8677]">Sản phẩm/danh mục áp dụng</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {selectedPromotion.appliedTargets.map((target) => (
                    <Tag key={target} className="m-0 rounded-full border-[#D8B894]/30 bg-[#FFFAF4] px-3 py-1 text-xs font-bold text-[#6F5A4A]">
                      {target}
                    </Tag>
                  ))}
                </div>
              </section>

              <section className="grid grid-cols-2 gap-3">
                <div className="rounded-2xl border border-[#D8B894]/20 bg-white/55 p-4">
                  <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#9A8677]">Doanh thu ảnh hưởng</p>
                  <p className="mt-2 text-lg font-black text-[#2A1E17]">{formatCurrency(selectedPromotion.impactedRevenue)}</p>
                </div>
                <div className="rounded-2xl border border-[#D8B894]/20 bg-white/55 p-4">
                  <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#9A8677]">Tỷ lệ chuyển đổi</p>
                  <p className="mt-2 text-lg font-black text-[#2A1E17]">{selectedPromotion.conversionRate ?? 0}%</p>
                </div>
              </section>

              <section className="rounded-3xl border border-[#D8B894]/25 bg-white/60 p-5">
                <p className="text-[11px] font-black uppercase tracking-[0.18em] text-[#9A8677]">Lịch sử sử dụng gần đây</p>
                <div className="mt-4 space-y-3">
                  {selectedPromotion.usageHistory.length > 0 ? (
                    selectedPromotion.usageHistory.map((history) => (
                      <div key={history.id} className="flex items-start justify-between gap-4 rounded-2xl bg-[#FFFAF4]/80 p-3">
                        <div>
                          <p className="text-sm font-black text-[#2A1E17]">{history.orderCode}</p>
                          <p className="mt-1 text-xs font-semibold text-[#9A8677]">{history.customer} · {history.branch}</p>
                          <p className="mt-1 text-[11px] font-medium text-[#9A8677]">{dayjs(history.usedAt).format('DD/MM/YYYY HH:mm')}</p>
                        </div>
                        <p className="shrink-0 text-sm font-black text-primary">-{formatCurrency(history.discountAmount)}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm font-semibold text-[#9A8677]">Chưa có lượt sử dụng nào.</p>
                  )}
                </div>
              </section>
            </div>
          )}
        </Drawer>


      </div>
    </ConfigProvider>
  );
}

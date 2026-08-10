'use client';

import { useMemo, useState } from 'react';

import { motion } from 'framer-motion';
import dayjs, { Dayjs } from 'dayjs';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import {
  Button,
  Card,
  ConfigProvider,
  DatePicker,
  Segmented,
  Select,
  Table,
  Tag
} from 'antd';
import {
  ArrowDownRight,
  ArrowUpRight,
  Download,
  FileText,
  RefreshCcw,
  CalendarDays,
  TrendingUp,
  Target,
  AlertTriangle,
  PackageCheck,
} from 'lucide-react';
import { cn } from '@/shared/utils/cn';
import { TRangeFilter } from '../../types/range-filter.type';
import { antdThemeReport } from '@/shared/utils/antdThemeReport';
import { useBranches } from '@/modules/branches/presentation/hooks/useBranches';
import { useCategories } from '@/modules/products/presentation/hooks/use-categories';
import { renderLoading } from './render/renderLoading';
import { renderEmpty } from './render/renderEmpty';
import { renderError } from './render/renderError';
import { kpiCards } from '../../mocks/kpiCards.mock';
import ChartCard from './chart/chart-card';
import { CustomTooltip } from './tooltip/CustomTooltip';
import { formatCompactVnd } from '../../utils/formatCompactVndReport';
import { columnsDailyReport } from '../../types/columnsDailyReport';
import { formatPercentReport } from '../../utils/formatPercentReport';
import { useReports } from '../hooks/useReports';

const { RangePicker } = DatePicker;
const DEFAULT_CHART_HEIGHT = 320;
const COMPACT_CHART_HEIGHT = 220;

const iconMap: Record<string, any> = {
  CalendarDays,
  TrendingUp,
  Target,
  AlertTriangle,
  PackageCheck,
};

export default function ReportsPage() {
  const [rangeFilter, setRangeFilter] = useState<TRangeFilter>('7_DAYS');
  const [branchFilter, setBranchFilter] = useState('ALL');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [dateRange, setDateRange] = useState<[Dayjs | null, Dayjs | null] | null>([dayjs('2026-05-11'), dayjs('2026-05-17')]);

  const { branches } = useBranches();
  const { categories } = useCategories();
  const branchOptions = useMemo(() => [
    { value: 'ALL', label: 'Tất cả chi nhánh' },
    ...branches.map((b: any) => ({ value: b.id, label: b.name })),
  ], [branches]);
  const categoryOptions = useMemo(() => [
    { value: 'ALL', label: 'Tất cả danh mục' },
    ...categories.map((c: any) => ({ value: c.id, label: c.name })),
  ], [categories]);

  // Hook into our backend API
  const { data, isLoading, isError, refetch } = useReports({
    rangeFilter,
    branchFilter,
    categoryFilter,
    dateRange,
  });

  const isDataEmpty = !data || (data.dailyReports && data.dailyReports.length === 0);

  const visibleProducts = useMemo(() => {
    const list = data?.topProducts ?? [];
    return [...list].sort((a, b) => a.sold - b.sold);
  }, [data?.topProducts]);

  const visibleBranchRevenue = useMemo(() => {
    return data?.branchRevenue ?? [];
  }, [data?.branchRevenue]);

  const visibleReports = useMemo(() => {
    return data?.dailyReports ?? [];
  }, [data?.dailyReports]);

  const revenueChartData = useMemo(() => {
    return visibleReports.map((item) => ({
      date: dayjs(item.date).format('DD/MM'),
      revenue: item.revenue,
      orders: item.orders,
    }));
  }, [visibleReports]);

  const orderStatusData = useMemo(() => {
    return data?.orderStatus ?? [];
  }, [data?.orderStatus]);

  const aovTrendData = useMemo(() => {
    return visibleReports.map((item) => ({
      date: dayjs(item.date).format('DD/MM'),
      aov: item.aov,
    }));
  }, [visibleReports]);

  const totals = useMemo(() => {
    return data?.totals ?? {
      todayRevenue: 0,
      todayRevenueGrowth: 0,
      totalOrders: 0,
      totalOrdersGrowth: 0,
      aov: 0,
      aovGrowth: 0,
      cancelRate: 0,
      cancelRateGrowth: 0,
      bestProduct: null,
      bestBranch: null,
    };
  }, [data?.totals]);

  const handleRefresh = () => {
    refetch();
  };

  return (
    <ConfigProvider theme={antdThemeReport}>
      <div className="space-y-8 pb-16">
        <header className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex items-start gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10 text-primary">
              <FileText size={22} />
            </div>
            <div>
              <h1 className="text-[28px] font-black tracking-tight text-text-primary md:text-3xl">Báo cáo kinh doanh</h1>
              <p className="mt-1 max-w-3xl text-sm font-medium text-text-secondary">
                Theo dõi doanh thu, đơn hàng, sản phẩm và hiệu suất vận hành theo thời gian thực.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 md:grid-cols-[minmax(260px,340px)_220px_auto]">
            <RangePicker
              value={dateRange}
              onChange={(range) => {
                setDateRange(range);
                setRangeFilter('CUSTOM');
              }}
              format="DD/MM/YYYY"
              className="h-11! border-primary-soft/30! bg-white/75!"
            />
            <Select value={branchFilter} onChange={setBranchFilter} options={branchOptions} className="h-11" />
            <Button icon={<Download size={17} />} className="h-11! border-primary-soft/40! bg-white/75! font-black! text-text-secondary!">
              Xuất Excel/PDF
            </Button>
          </div>
        </header>

        <Card className="report-card backdrop-blur-[22px] [&_.ant-card-body]:p-5 border-primary-soft/25! shadow-[0_14px_38px_rgba(91,58,41,0.08)]!">
          <div className="grid grid-cols-1 gap-3 xl:grid-cols-[1fr_220px_180px_auto]">
            <Segmented
              block
              value={rangeFilter}
              onChange={(value) => setRangeFilter(value as TRangeFilter)}
              options={[
                { label: 'Hôm nay', value: 'TODAY' },
                { label: '7 ngày', value: '7_DAYS' },
                { label: '30 ngày', value: '30_DAYS' },
                { label: 'Tháng này', value: 'THIS_MONTH' },
                { label: 'Tùy chỉnh ngày', value: 'CUSTOM' },
              ]}
              className="rounded-2xl! bg-[#FFFAF4]/80! p-1!"
            />
            <Select value={branchFilter} onChange={setBranchFilter} options={branchOptions} className="h-11" />
            <Select value={categoryFilter} onChange={setCategoryFilter} options={categoryOptions} className="h-11" />
            <Button onClick={handleRefresh} loading={isLoading} icon={!isLoading && <RefreshCcw size={16} />} className="h-11! border-primary-soft/40! font-black!">
              {isLoading ? 'Đang tải...' : 'Tải lại'}
            </Button>
          </div>
        </Card>

        {isLoading ? (
          renderLoading()
        ) : isError ? (
          renderError(handleRefresh)
        ) : isDataEmpty ? (
          renderEmpty(setCategoryFilter)
        ) : (
          <>
            <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-6">
              {kpiCards(totals).map((item, index) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.04, duration: 0.3 }}
                >
                  <Card className="kpi-card h-full backdrop-blur-[22px] [&_.ant-card-body]:p-5 border-primary-soft/25! bg-white/70! shadow-[0_12px_32px_rgba(91,58,41,0.08)]!">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-[10px] font-black uppercase tracking-[0.16em] text-text-muted">{item.label}</p>
                        <p className="mt-2 line-clamp-2 text-xl font-black leading-tight text-text-primary">{item.value}</p>
                        <div className="mt-2 flex flex-wrap items-center gap-2">
                          <span className="text-[11px] font-semibold text-text-secondary">{item.sub}</span>
                          {typeof item.growth === 'number' && (
                            <span className={cn('inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-black', item.growth >= 0 ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-600')}>
                              {item.growth >= 0 ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                              {formatPercentReport(item.growth)}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className={cn('flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl shadow-sm', item.color)}>
                        <item.icon size={19} />
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </section>

            <section className="grid grid-cols-1 gap-5 xl:grid-cols-2">
              <ChartCard title="Doanh thu theo ngày" subtitle="Area chart theo doanh thu và số đơn">
                <div className="min-w-0 w-full">
                  <ResponsiveContainer width="100%" height={DEFAULT_CHART_HEIGHT}>
                    <AreaChart data={revenueChartData} margin={{ top: 12, right: 16, left: 0, bottom: 0 }}>
                      <defs>
                        <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#8B5E3C" stopOpacity={0.32} />
                          <stop offset="95%" stopColor="#8B5E3C" stopOpacity={0.02} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(216,184,148,0.28)" vertical={false} />
                      <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#9A8677', fontSize: 12, fontWeight: 700 }} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9A8677', fontSize: 12, fontWeight: 700 }} tickFormatter={formatCompactVnd} />
                      <Tooltip content={<CustomTooltip />} />
                      <Area type="monotone" dataKey="revenue" name="Doanh thu" stroke="#8B5E3C" strokeWidth={3} fill="url(#revenueGradient)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </ChartCard>

              <ChartCard title="Đơn hàng theo trạng thái" subtitle="Pie chart tỷ trọng trạng thái đơn">
                <div className="min-w-0 w-full">
                  <ResponsiveContainer width="100%" height={DEFAULT_CHART_HEIGHT}>
                    <PieChart>
                      <Pie data={orderStatusData} dataKey="value" nameKey="name" innerRadius={72} outerRadius={112} paddingAngle={4}>
                        {orderStatusData.map((entry) => (
                          <Cell key={entry.name} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip content={<CustomTooltip />} />
                      <Legend verticalAlign="bottom" iconType="circle" formatter={(value) => <span className="text-xs font-bold text-text-secondary">{value}</span>} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </ChartCard>

              <ChartCard title="Doanh thu theo chi nhánh" subtitle="Bar chart so sánh hiệu suất từng chi nhánh">
                <div className="min-w-0 w-full">
                  <ResponsiveContainer width="100%" height={DEFAULT_CHART_HEIGHT}>
                    <BarChart data={visibleBranchRevenue} margin={{ top: 12, right: 16, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(216,184,148,0.28)" vertical={false} />
                      <XAxis dataKey="branch" axisLine={false} tickLine={false} tick={{ fill: '#9A8677', fontSize: 12, fontWeight: 700 }} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9A8677', fontSize: 12, fontWeight: 700 }} tickFormatter={formatCompactVnd} />
                      <Tooltip content={<CustomTooltip />} />
                      <Bar dataKey="revenue" name="Doanh thu" radius={[12, 12, 0, 0]} fill="#0FA7A0" maxBarSize={54} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </ChartCard>

              <ChartCard title="Top sản phẩm bán chạy" subtitle="Horizontal bar chart theo số lượng bán">
                <div className="min-w-0 w-full">
                  <ResponsiveContainer width="100%" height={DEFAULT_CHART_HEIGHT}>
                    <BarChart data={visibleProducts} layout="vertical" margin={{ top: 12, right: 22, left: 42, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(216,184,148,0.26)" horizontal={false} />
                      <XAxis type="number" axisLine={false} tickLine={false} tick={{ fill: '#9A8677', fontSize: 12, fontWeight: 700 }} />
                      <YAxis type="category" dataKey="name" width={120} axisLine={false} tickLine={false} tick={{ fill: '#6F5A4A', fontSize: 11, fontWeight: 800 }} />
                      <Tooltip content={<CustomTooltip />} />
                      <Bar dataKey="sold" name="Đã bán" radius={[0, 12, 12, 0]} fill="#C9822B" maxBarSize={24} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </ChartCard>
            </section>

            <ChartCard title="Xu hướng AOV" subtitle="LineChart biến động giá trị đơn trung bình" className="bg-white/65!">
              <div className="min-w-0 w-full">
                <ResponsiveContainer width="100%" height={COMPACT_CHART_HEIGHT}>
                  <LineChart data={aovTrendData} margin={{ top: 12, right: 18, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(216,184,148,0.26)" vertical={false} />
                    <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#9A8677', fontSize: 12, fontWeight: 700 }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9A8677', fontSize: 12, fontWeight: 700 }} tickFormatter={(value) => `${Math.round(value / 1000)}k`} />
                    <Tooltip content={<CustomTooltip />} />
                    <Line type="monotone" dataKey="aov" name="AOV" stroke="#D95F76" strokeWidth={3} dot={{ r: 4, fill: '#D95F76', strokeWidth: 0 }} activeDot={{ r: 6 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </ChartCard>

            <section className="grid grid-cols-1 gap-4 lg:grid-cols-5">
              {(data?.insights ?? []).map((item, index) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.035, duration: 0.25 }}
                >
                  <Card className="h-full rounded-3xl! border-primary-soft/25! bg-white/70! shadow-[0_12px_32px_rgba(91,58,41,0.07)]!">
                    <div className="mb-4 flex items-start justify-between gap-3">
                      <div className={cn('flex h-10 w-10 items-center justify-center rounded-2xl border', item.color)}>
                        {(() => {
                          const IconComponent = iconMap[item.icon] || Target;
                          return <IconComponent size={19} />;
                        })()}
                      </div>
                      <Tag className="m-0 rounded-full border-primary-soft/30 bg-[#FFFAF4] px-2.5 py-0.5 text-[10px] font-black text-text-secondary">
                        {item.tag}
                      </Tag>
                    </div>
                    <p className="text-[10px] font-black uppercase tracking-[0.16em] text-text-muted">{item.title}</p>
                    <h3 className="mt-2 text-lg font-black text-text-primary">{item.value}</h3>
                    <p className="mt-2 text-xs font-semibold leading-5 text-text-secondary">{item.description}</p>
                  </Card>
                </motion.div>
              ))}
            </section>

            <Card className="report-card backdrop-blur-[22px] [&_.ant-card-body]:p-5 border-primary-soft/25! shadow-[0_14px_38px_rgba(91,58,41,0.08)]!">
              <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h3 className="text-base font-black text-text-primary">Bảng báo cáo theo ngày</h3>
                  <p className="mt-1 text-xs font-semibold text-text-muted">Doanh thu, đơn hàng, khách mới và tăng trưởng từng ngày.</p>
                </div>
                <Tag color="brown" className="m-0 w-fit rounded-full px-3 py-1 text-xs font-black">
                  {visibleReports.length} ngày dữ liệu
                </Tag>
              </div>
              <Table
                rowKey="key"
                columns={columnsDailyReport}
                dataSource={visibleReports}
                pagination={false}
                scroll={{ x: 980 }}
                className="report-table [&_.ant-table-tbody>tr>td]:border-b-primary-soft/[0.14] [&_.ant-table-tbody>tr>td]:text-[13px] [&_.ant-table-tbody>tr>td]:font-bold [&_.ant-table-tbody>tr>td]:text-text-secondary [&_.ant-table-thead>tr>th]:text-[10px] [&_.ant-table-thead>tr>th]:font-black [&_.ant-table-thead>tr>th]:tracking-[0.16em] [&_.ant-table-thead>tr>th]:uppercase [&_.ant-table]:bg-transparent"
              />
            </Card>
          </>
        )}
      </div>
    </ConfigProvider>
  );
}

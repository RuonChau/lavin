import { ColumnsType } from "antd/es/table";
import { IDailyReport } from "./daily-report.type";
import { ArrowDownRight, ArrowUpRight, Tag, Users } from "lucide-react";
import { formatVndReport } from "../utils/formatVndReport";
import dayjs from "dayjs";
import { cn } from "@/shared/utils/cn";
import { formatPercentReport } from "../utils/formatPercentReport";

export const columnsDailyReport: ColumnsType<IDailyReport> = [
  {
    title: 'Ngày',
    dataIndex: 'date',
    key: 'date',
    fixed: 'left',
    render: (date: string) => <span className="font-black text-text-primary">{dayjs(date).format('DD/MM/YYYY')}</span>,
  },
  {
    title: 'Doanh thu',
    dataIndex: 'revenue',
    key: 'revenue',
    align: 'right',
    render: (value: number) => <span className="font-black text-primary">{formatVndReport(value)}</span>,
  },
  {
    title: 'Số đơn',
    dataIndex: 'orders',
    key: 'orders',
    align: 'right',
    render: (value: number) => value.toLocaleString('vi-VN'),
  },
  {
    title: 'Đơn hoàn thành',
    dataIndex: 'completedOrders',
    key: 'completedOrders',
    align: 'right',
    render: (value: number) => <Tag color="green" className="m-0 rounded-full font-bold">{value.toLocaleString('vi-VN')}</Tag>,
  },
  {
    title: 'Đơn hủy',
    dataIndex: 'canceledOrders',
    key: 'canceledOrders',
    align: 'right',
    render: (value: number) => <Tag color="red" className="m-0 rounded-full font-bold">{value.toLocaleString('vi-VN')}</Tag>,
  },
  {
    title: 'Khách mới',
    dataIndex: 'newCustomers',
    key: 'newCustomers',
    align: 'right',
    render: (value: number) => (
      <span className="inline-flex items-center gap-1 font-bold text-text-secondary">
        <Users size={14} className="text-aqua" />
        {value.toLocaleString('vi-VN')}
      </span>
    ),
  },
  {
    title: 'AOV',
    dataIndex: 'aov',
    key: 'aov',
    align: 'right',
    render: (value: number) => <span className="font-bold text-text-primary">{formatVndReport(value)}</span>,
  },
  {
    title: 'Tăng trưởng',
    dataIndex: 'growth',
    key: 'growth',
    align: 'right',
    render: (value: number) => (
      <span className={cn('inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-black', value >= 0 ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-600')}>
        {value >= 0 ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />}
        {formatPercentReport(value)}
      </span>
    ),
  },
];
import { ColumnsType } from "antd/es/table";
import { Customer } from "../infrastructure/services/customer.service";
import { Edit2, Gift, Phone, Star, Trash2 } from "lucide-react";
import { Button, Space, Tooltip } from "antd";
import { cn } from "@/shared/utils/cn";

// Helper function to calculate customer tier based on loyalty points
export const getCustomerTier = (points: number): string => {
  if (points >= 5000) return 'Kim Cương';
  if (points >= 1000) return 'Vàng';
  if (points >= 200) return 'Bạc';
  return 'Thành viên';
};

export const customerTableColumns = (
  onEdit?: (record: Customer) => void,
  onDelete?: (record: Customer) => void
): ColumnsType<Customer> => [
    {
      title: 'KHÁCH HÀNG',
      key: 'customer',
      width: '25%',
      render: (_, record) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-[14px] bg-primary/10 border border-primary/20 flex items-center justify-center font-black text-primary text-sm shadow-sm">
            {record.name ? record.name.substring(0, 1).toUpperCase() : '?'}
          </div>
          <div>
            <p className="font-bold text-text-primary">{record.name || 'Chưa cập nhật'}</p>
            <div className="flex items-center text-[10px] text-text-muted mt-1 gap-2">
              <span className="flex items-center gap-1"><Phone size={10} /> {record.phone}</span>
              <span className="px-1.5 py-0.5 rounded-md bg-[#FFFAF4] border border-primary-soft/20 font-bold uppercase">{record.id.slice(-6)}</span>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: 'HẠNG THÀNH VIÊN',
      key: 'tier',
      render: (_, record) => {
        const tier = getCustomerTier(record.loyalty_points || 0);
        let color = '';
        let bg = '';
        let iconColor = '';

        switch (tier) {
          case 'Kim Cương':
            color = 'text-blue-700'; bg = 'bg-blue-50 border-blue-200'; iconColor = 'text-blue-500';
            break;
          case 'Vàng':
            color = 'text-amber-700'; bg = 'bg-amber-50 border-amber-200'; iconColor = 'text-amber-500';
            break;
          case 'Bạc':
            color = 'text-slate-700'; bg = 'bg-slate-50 border-slate-200'; iconColor = 'text-slate-500';
            break;
          default:
            color = 'text-gray-600'; bg = 'bg-gray-50 border-gray-200'; iconColor = 'text-gray-400';
        }

        return (
          <div className={cn("inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold uppercase tracking-wider", color, bg)}>
            <Star size={12} className={iconColor} fill="currentColor" />
            {tier}
          </div>
        );
      }
    },
    {
      title: 'ĐIỂM TÍCH LŨY',
      dataIndex: 'loyalty_points',
      key: 'loyalty_points',
      render: (points: number) => (
        <div className="flex items-center gap-1.5 text-sm font-black text-text-primary">
          <Gift size={14} className="text-primary" />
          {(points || 0).toLocaleString()}
        </div>
      ),
    },
    {
      title: 'TỔNG CHI TIÊU',
      key: 'totalSpent',
      render: (_, record) => (
        <p className="font-bold text-text-primary">{(0).toLocaleString()} ₫</p>
      ),
    },
    {
      title: 'NGÀY THAM GIA',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (date: string) => (
        <span className="text-[11px] font-bold text-text-secondary bg-[#FFFAF4] px-2 py-1 rounded-lg border border-primary-soft/20">
          {date ? new Date(date).toLocaleDateString('vi-VN') : '---'}
        </span>
      ),
    },
    {
      title: 'HÀNH ĐỘNG',
      key: 'action',
      width: '120px',
      align: 'right' as const,
      render: (_, record) => (
        <div className="flex justify-end pr-2">
          <Space size="small">
            <Tooltip title="Chỉnh sửa">
              <Button
                type="text"
                icon={<Edit2 size={15} />}
                className="text-text-secondary hover:text-primary! flex items-center justify-center"
                onClick={() => onEdit?.(record)}
              />
            </Tooltip>
            <Tooltip title="Xoá">
              <Button
                type="text"
                danger
                icon={<Trash2 size={15} />}
                className="flex items-center justify-center"
                onClick={() => onDelete?.(record)}
              />
            </Tooltip>
          </Space>
        </div>
      ),
    },
  ];
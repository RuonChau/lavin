import { ColumnsType } from "antd/es/table";
import { customers } from "../mocks/customers.mock";
import { Gift, MoreVertical, Phone, Star } from "lucide-react";
import { cn } from "@/shared/utils/cn";

export const customerTableColumns: ColumnsType<typeof customers[0]> = [
    {
      title: 'KHÁCH HÀNG',
      key: 'customer',
      width: '25%',
      render: (_, record) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-[14px] bg-primary/10 border border-primary/20 flex items-center justify-center font-black text-primary text-sm shadow-sm">
            {record.name.substring(0, 1)}
          </div>
          <div>
            <p className="font-bold text-[#2A1E17]">{record.name}</p>
            <div className="flex items-center text-[10px] text-[#9A8677] mt-1 gap-2">
              <span className="flex items-center gap-1"><Phone size={10} /> {record.phone}</span>
              <span className="px-1.5 py-0.5 rounded-md bg-[#FFFAF4] border border-[#D8B894]/20 font-bold uppercase">{record.id}</span>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: 'HẠNG THÀNH VIÊN',
      key: 'tier',
      render: (_, record) => {
        let color = '';
        let bg = '';
        let iconColor = '';
        
        switch(record.tier) {
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
            {record.tier}
          </div>
        );
      }
    },
    {
      title: 'ĐIỂM TÍCH LŨY',
      dataIndex: 'points',
      key: 'points',
      render: (points: number) => (
        <div className="flex items-center gap-1.5 text-sm font-black text-[#2A1E17]">
          <Gift size={14} className="text-primary" />
          {points.toLocaleString()}
        </div>
      ),
    },
    {
      title: 'TỔNG CHI TIÊU',
      dataIndex: 'totalSpent',
      key: 'totalSpent',
      render: (total: number) => (
         <p className="font-bold text-[#2A1E17]">{total.toLocaleString()} ₫</p>
      ),
    },
    {
      title: 'LẦN CUỐI GHÉ',
      dataIndex: 'lastVisit',
      key: 'lastVisit',
      render: (date: string) => (
        <span className="text-[11px] font-bold text-[#6F5A4A] bg-[#FFFAF4] px-2 py-1 rounded-lg border border-[#D8B894]/20">{date}</span>
      ),
    },
    {
      title: '',
      key: 'action',
      width: '80px',
      render: (_, record) => (
        <div className="flex justify-end pr-4">
          <button className="w-8 h-8 rounded-xl flex items-center justify-center text-[#9A8677] hover:bg-primary/10 hover:text-primary transition-colors">
            <MoreVertical size={16} />
          </button>
        </div>
      ),
    },
  ];
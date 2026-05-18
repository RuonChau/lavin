import { GlassCard } from "@/shared/components/GlassCard";
import { Table } from "antd";
import { CircleDot, Filter, Search } from "lucide-react";
import { customers } from "../../../mocks/customers.mock";
import { customerTableColumns } from "../../../config/customer-table-columns.config";




export default function CustomersListTab() {




  return (
    <GlassCard className="p-8" radius="4xl">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#D8B894]" size={18} />
          <input
            type="text"
            placeholder="Tìm theo tên, số điện thoại..."
            className="w-full bg-white/60 border border-[#D8B894]/20 rounded-2xl py-3.5 pl-12 pr-4 text-sm font-medium focus:outline-none focus:border-primary/40 focus:bg-white transition-all shadow-sm"
          />
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-5 py-3.5 bg-white border border-[#D8B894]/30 rounded-2xl text-[10px] font-black text-[#6F5A4A] uppercase tracking-wider hover:bg-gray-50 transition-all shadow-sm">
            <Filter size={14} />
            Lọc hạng
          </button>
        </div>
      </div>

      <div className="bg-white/40 rounded-[24px] border border-[#D8B894]/20 overflow-hidden">
        <Table
          columns={customerTableColumns}
          dataSource={customers}
          pagination={{
            placement: ['bottomCenter'],
            className: '!mt-6 !mb-2'
          }}
          rowKey="id"
          className="custom-table"
        />
      </div>
      <div className="mt-4 flex justify-between items-center px-2">
        <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-[#9A8677]">
          <span className="flex items-center gap-1.5"><CircleDot size={10} className="text-blue-500" /> Kim Cương</span>
          <span className="flex items-center gap-1.5"><CircleDot size={10} className="text-amber-500" /> Vàng</span>
          <span className="flex items-center gap-1.5"><CircleDot size={10} className="text-slate-500" /> Bạc</span>
        </div>
        <p className="text-[10px] font-black text-[#968271] uppercase tracking-widest italic">Đang hiển thị 5 trên tổng số 120 khách hàng</p>
      </div>
    </GlassCard>
  );
}

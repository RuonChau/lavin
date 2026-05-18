import Table from "antd/es/table";
import { ChevronLeft, ChevronRight, Filter, Search } from "lucide-react";
import { Input } from "antd";
import { GlassCard } from "@/shared/components/GlassCard";
import { employees } from "@/modules/employees/mocks/employee.mock";
import { employeeTableColumns } from "@/modules/employees/config/employee-table-columns.config";

export default function EmployeesListTab() {
  

  

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Input
            prefix={<Search className="text-[#D8B894]" size={18} />}
            placeholder="Tìm tên, email, số điện thoại..." 
            className="w-96 !bg-white/60 !border-[#D8B894]/20 !rounded-2xl !py-3.5 !pl-10 !pr-4 !text-sm font-medium hover:!border-primary/40 focus:!border-primary/40 focus:!shadow-none h-12"
          />
          <button className="flex items-center gap-2 px-5 py-3.5 bg-white border border-[#D8B894]/30 rounded-2xl text-[10px] font-black text-[#6F5A4A] uppercase tracking-wider hover:bg-[#FFFAF4] transition-all shadow-sm h-12">
            <Filter size={14} /> Lọc chi nhánh
          </button>
        </div>
      </div>

      <GlassCard className="overflow-hidden" radius="4xl">
        <Table
          columns={employeeTableColumns} 
          dataSource={employees} 
          pagination={{
            pageSize: 5,
            itemRender: (_, type, originalElement) => {
            if (type === 'prev') return <div className="p-1"><ChevronLeft size={16} /></div>;
            if (type === 'next') return <div className="p-1"><ChevronRight size={16} /></div>;
            return originalElement;
            },
            className: "px-8 py-6 mb-0 border-t border-[#D8B894]/20",
          }}
          className="antd-custom-table [&_.ant-table]:bg-transparent [&_.ant-table-thead>tr>th]:!py-6 [&_.ant-table-thead>tr>th]:!px-4 [&_.ant-table-thead>tr>th]:!border-b-[#D8B894]/20 [&_.ant-table-tbody>tr>td]:!py-5 [&_.ant-table-tbody>tr>td]:!px-4 [&_.ant-table-tbody>tr>td]:!border-b-[#D8B894]/10 [&_.ant-table-tbody>tr>td]:!bg-transparent [&_.ant-table-pagination]:!m-0 [&_.ant-table-pagination]:!py-6 [&_.ant-table-pagination]:!px-8 [&_.ant-table-pagination]:bg-white/40 [&_.ant-table-pagination]:!justify-start [&_.ant-pagination-item]:rounded-xl [&_.ant-pagination-item]:border-[#D8B894]/20 [&_.ant-pagination-item]:bg-white [&_.ant-pagination-item]:font-black [&_.ant-pagination-item]:text-[10px] [&_.ant-pagination-item-active]:!bg-[#8B5E3C] [&_.ant-pagination-item-active]:!border-[#8B5E3C] [&_.ant-pagination-item-active>a]:!text-white [&_.ant-pagination-prev]:bg-transparent [&_.ant-pagination-prev]:rounded-xl [&_.ant-pagination-next]:bg-transparent [&_.ant-pagination-next]:rounded-xl"
          rowClassName="group"
        />
      </GlassCard>


    </div>
  );
}
import { ColumnsType } from "antd/es/table";
import { Employee } from "../application/interfaces/employee.interfaces";
import { CircleDot, Edit2, Trash2 } from "lucide-react";
import { Button, Space, Tooltip } from "antd";
import { cn } from "@/shared/utils/cn";

export const employeeTableColumns: ColumnsType<Employee> = [
  {
    title: 'MÃ NHÂN VIÊN',
    dataIndex: 'id',
    key: 'id',
    render: (id, record) => (
      <div>
        <p className="text-sm font-black text-[#2A1E17] tracking-tight">{id}</p>
        <p className="text-[10px] font-bold text-[#9A8677] uppercase mt-0.5">{record.role}</p>
      </div>
    ),
  },
  {
    title: 'NHÂN SỰ',
    dataIndex: 'name',
    key: 'name',
    render: (name, record) => (
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-2xl bg-white border border-[#D8B894]/20 flex items-center justify-center text-primary font-black text-sm shadow-sm italic">
          {name.split(' ').pop()?.[0]}
        </div>
        <div>
          <p className="text-sm font-bold text-[#2A1E17]">{name}</p>
          <p className="text-[9px] font-medium text-[#9A8677]">{record.email}</p>
        </div>
      </div>
    ),
  },
  {
    title: 'THỜI GIAN GIA NHẬP',
    dataIndex: 'joinDate',
    key: 'joinDate',
    align: 'center',
    render: (date, record) => (
      <div className="flex flex-col items-center">
        <span className="text-xs font-bold text-[#6F5A4A]">{date}</span>
        <span className="text-[9px] text-[#9A8677] font-medium">{record.type}</span>
      </div>
    ),
  },
  {
    title: 'CHI NHÁNH',
    dataIndex: 'branch',
    key: 'branch',
    align: "center",
    render: (branch) => (
      <span className="text-[10px] font-black text-[#2A1E17] uppercase tracking-widest">{branch}</span>
    ),
  },
  {
    title: 'TRẠNG THÁI',
    key: 'status',
    align: 'right',
    render: (_, record) => (
      <div className="flex items-center justify-end gap-3">
        <div className={cn(
          "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-wider border",
          record.status === 'ACTIVE' 
            ? "bg-green-100 text-green-700 border-green-200" 
            : "bg-gray-100 text-gray-500 border-gray-200"
        )}>
          <CircleDot size={10} />
          {record.status === 'ACTIVE' ? 'Đang làm việc' : 'Đã nghỉ'}
        </div>
        
        <Space size="small">
          <Tooltip title="Chỉnh sửa">
            <Button 
              type="text" 
              icon={<Edit2 size={16} />} 
              className="text-[#9A8677] hover:!text-primary"
            />
          </Tooltip>
          <Tooltip title="Xoá">
            <Button 
              type="text" 
              danger
              icon={<Trash2 size={16} />} 
            />
          </Tooltip>
        </Space>
      </div>
    ),
  },
];
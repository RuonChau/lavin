import Table from "antd/es/table";
import { ChevronLeft, ChevronRight, Filter, Search, Users } from "lucide-react";
import { Input, App } from "antd";
import { GlassCard } from "@/shared/components/GlassCard";
import { employeeTableColumns } from "@/modules/employees/config/employee-table-columns.config";
import { useEmployees } from "@/modules/employees/presentation/hooks/useEmployees";
import { useState } from "react";
import { Employee } from "@/modules/employees/application/interfaces/employee.interfaces";
import { IEmployeeEntity } from "@/modules/employees/domain/entities/employee.entity";
import { DeleteEmployeeModal } from "../DeleteEmployeeModal";
import { EditEmployeeModal } from "../EditEmployeeModal";

export default function EmployeesListTab() {
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const {
    employees,
    rawEmployees,
    total,
    isLoading,
    deleteEmployee,
    isDeleting,
    updateEmployee,
    isUpdating,
    users,
    isLoadingUsers,
    branches,
    isLoadingBranches,
  } = useEmployees(page, 10);
  const { message } = App.useApp();

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedEditEmployee, setSelectedEditEmployee] = useState<IEmployeeEntity | null>(null);

  const filtered = employees.filter((emp: Employee) => {
    if (!searchTerm) return true;
    const q = searchTerm.toLowerCase();
    return (
      emp.name.toLowerCase().includes(q) ||
      emp.email.toLowerCase().includes(q) ||
      emp.phone.toLowerCase().includes(q) ||
      emp.employee_code.toLowerCase().includes(q)
    );
  });

  const handleDelete = (employee: Employee) => {
    setSelectedEmployee(employee);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedEmployee) return;
    try {
      await deleteEmployee(selectedEmployee.id);
      message.success(`Đã xóa hồ sơ nhân viên ${selectedEmployee.name} thành công!`);
      setIsDeleteModalOpen(false);
      setSelectedEmployee(null);
    } catch (err: any) {
      message.error(err?.response?.data?.message ?? 'Không thể xóa nhân viên');
    }
  };

  const handleEdit = (record: Employee) => {
    const raw = rawEmployees.find(r => r.id === record.id);
    if (raw) {
      setSelectedEditEmployee(raw);
      setIsEditModalOpen(true);
    }
  };

  const handleConfirmEdit = async (values: any) => {
    if (!selectedEditEmployee) return;
    try {
      await updateEmployee({
        id: selectedEditEmployee.id,
        data: {
          user_id: values.user_id || undefined,
          full_name: values.full_name?.trim(),
          position: values.position,
          base_salary: values.base_salary,
          // hire_date: giữ nguyên local date
          hire_date: values.hire_date ? values.hire_date.format('YYYY-MM-DD') : '',
          phone: values.phone?.trim() || undefined,
          branch_id: values.branch_id || undefined,
        }
      });
      message.success(`Cập nhật hồ sơ nhân viên thành công!`);
      setIsEditModalOpen(false);
      setSelectedEditEmployee(null);
    } catch (err: any) {
      message.error(err?.response?.data?.message ?? 'Không thể cập nhật hồ sơ');
    }
  };

  const columns = employeeTableColumns(handleEdit, handleDelete);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Input
            prefix={<Search className="text-primary-soft" size={18} />}
            placeholder="Tìm tên, email, số điện thoại..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-96 bg-white/60! border-primary-soft/20! rounded-2xl! py-3.5! pl-10! pr-4! text-sm! font-medium! hover:border-primary/40! focus:border-primary/40! focus:shadow-none! h-12!"
          />
          <button className="flex items-center gap-2 px-5 py-3.5! bg-white! border-primary-soft/30! rounded-2xl! text-[10px]! font-black! text-text-secondary! uppercase! tracking-wider! hover:bg-primary/20! transition-all! shadow-sm! h-12!">
            <Filter size={14} /> Lọc chi nhánh
          </button>
        </div>

        {!isLoading && (
          <div className="flex items-center gap-2 text-xs font-bold text-text-muted">
            <Users size={14} className="text-primary-soft" />
            <span>{total} nhân viên</span>
          </div>
        )}
      </div>

      <GlassCard className="overflow-hidden" radius="4xl">
        <Table
          columns={columns}
          dataSource={isLoading ? [] : filtered}
          loading={isLoading}
          rowKey="id"
          locale={{
            emptyText: (
              <div className="flex flex-col items-center py-12">
                <div className="w-16 h-16 rounded-3xl bg-white/60 flex items-center justify-center text-text-muted/40 mb-4">
                  <Users size={32} />
                </div>
                <p className="text-sm font-bold text-text-muted">Chưa có nhân viên nào</p>
              </div>
            )
          }}
          pagination={{
            current: page,
            pageSize: 10,
            total,
            onChange: (p) => setPage(p),
            itemRender: (_, type, originalElement) => {
              if (type === 'prev') return <div className="p-1"><ChevronLeft size={16} /></div>;
              if (type === 'next') return <div className="p-1"><ChevronRight size={16} /></div>;
              return originalElement;
            },
            className: "px-8 py-6 mb-0 border-t border-[#D8B894]/20",
          }}
          className="antd-custom-table [&_.ant-table]:bg-transparent [&_.ant-table-thead>tr>th]:py-6! [&_.ant-table-thead>tr>th]:px-4! [&_.ant-table-thead>tr>th]:border-b-primary-soft/20! [&_.ant-table-tbody>tr>td]:py-5! [&_.ant-table-tbody>tr>td]:px-4! [&_.ant-table-tbody>tr>td]:border-b-primary-soft/10! [&_.ant-table-tbody>tr>td]:bg-transparent! [&_.ant-table-pagination]:m-0! [&_.ant-table-pagination]:py-6! [&_.ant-table-pagination]:px-8! [&_.ant-table-pagination]:bg-white/40! [&_.ant-table-pagination]:justify-start! [&_.ant-pagination-item]:rounded-xl! [&_.ant-pagination-item]:border-primary-soft/20! [&_.ant-pagination-item]:bg-white! [&_.ant-pagination-item]:font-black! [&_.ant-pagination-item]:text-[10px]! [&_.ant-pagination-item-active]:bg-primary! [&_.ant-pagination-item-active]:border-primary! [&_.ant-pagination-item-active>a]:text-white! [&_.ant-pagination-prev]:bg-transparent! [&_.ant-pagination-prev]:rounded-xl! [&_.ant-pagination-next]:bg-transparent! [&_.ant-pagination-next]:rounded-xl"
          rowClassName="group"
        />
      </GlassCard>

      <DeleteEmployeeModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedEmployee(null);
        }}
        employee={selectedEmployee}
        onConfirm={handleConfirmDelete}
        isDeleting={isDeleting}
      />

      <EditEmployeeModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedEditEmployee(null);
        }}
        employee={selectedEditEmployee}
        users={users}
        isLoadingUsers={isLoadingUsers}
        branches={branches}
        isLoadingBranches={isLoadingBranches}
        onSubmit={handleConfirmEdit}
        isSubmitting={isUpdating}
      />
    </div>
  );
}
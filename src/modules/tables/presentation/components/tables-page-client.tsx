"use client";

import { useMemo, useState } from "react";
import {
  App,
  ConfigProvider,
  Form,
  Input,
  InputNumber,
  Modal,
  Select,
} from "antd";
import {
  Armchair,
  CheckCircle2,
  Clock,
  Edit,
  Plus,
  RefreshCw,
  Search,
  Sparkles,
  Trash2,
  Users,
} from "lucide-react";
import { GlassCard } from "@/shared/components/GlassCard";
import { antdTheme } from "@/shared/utils/antdTheme";
import { cn } from "@/shared/utils/cn";
import { useDiningTables } from "@/modules/tables/presentation/hooks/useDiningTables";
import type {
  DiningTable,
  DiningTablePayload,
  DiningTableStatus,
} from "@/modules/tables/domain/entities/dining-table.entity";

const statusOptions: Array<{
  value: DiningTableStatus;
  label: string;
  color: string;
  bg: string;
}> = [
  {
    value: "AVAILABLE",
    label: "Trống",
    color: "text-emerald-700",
    bg: "bg-emerald-50 border-emerald-100",
  },
  {
    value: "OCCUPIED",
    label: "Đang dùng",
    color: "text-amber-700",
    bg: "bg-amber-50 border-amber-100",
  },
  {
    value: "RESERVED",
    label: "Đã đặt",
    color: "text-violet-700",
    bg: "bg-violet-50 border-violet-100",
  },
  {
    value: "CLEANING",
    label: "Dọn bàn",
    color: "text-slate-700",
    bg: "bg-slate-50 border-slate-200",
  },
];

const getStatusMeta = (status: DiningTableStatus) =>
  statusOptions.find((item) => item.value === status) ?? statusOptions[0];

const getErrorMessage = (error: unknown, fallback: string) => {
  if (
    error &&
    typeof error === "object" &&
    "response" in error &&
    error.response &&
    typeof error.response === "object" &&
    "data" in error.response &&
    error.response.data &&
    typeof error.response.data === "object" &&
    "message" in error.response.data &&
    typeof error.response.data.message === "string"
  ) {
    return error.response.data.message;
  }

  return fallback;
};

function TablesPageInner() {
  const {
    tables,
    error,
    isLoading,
    isRefetching,
    refetch,
    createTable,
    isCreating,
    updateTable,
    updateStatus,
    isUpdating,
    deleteTable,
    isDeleting,
  } = useDiningTables();
  const { message } = App.useApp();
  const [form] = Form.useForm<DiningTablePayload>();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<DiningTableStatus | "ALL">(
    "ALL",
  );
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTable, setEditingTable] = useState<DiningTable | null>(null);
  const [deletingTable, setDeletingTable] = useState<DiningTable | null>(null);

  const filteredTables = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    return tables.filter((table) => {
      const matchesStatus =
        statusFilter === "ALL" || table.status === statusFilter;
      const matchesSearch =
        !q ||
        table.code.toLowerCase().includes(q) ||
        table.area?.toLowerCase().includes(q) ||
        table.server_name?.toLowerCase().includes(q);
      return matchesStatus && matchesSearch;
    });
  }, [searchTerm, statusFilter, tables]);

  const counts = useMemo(() => {
    return statusOptions.reduce(
      (acc, item) => {
        acc[item.value] = tables.filter(
          (table) => table.status === item.value,
        ).length;
        return acc;
      },
      {} as Record<DiningTableStatus, number>,
    );
  }, [tables]);

  const openCreateModal = () => {
    setEditingTable(null);
    form.resetFields();
    form.setFieldsValue({
      capacity: 2,
      status: "AVAILABLE",
      display_order: tables.length + 1,
    });
    setIsFormOpen(true);
  };

  const openEditModal = (table: DiningTable) => {
    setEditingTable(table);
    form.setFieldsValue({
      branch_id: table.branch_id ?? null,
      code: table.code,
      area: table.area ?? "",
      capacity: table.capacity,
      status: table.status,
      server_name: table.server_name ?? "",
      display_order: table.display_order,
    });
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setEditingTable(null);
    form.resetFields();
  };

  const handleSubmit = async (values: DiningTablePayload) => {
    const payload: DiningTablePayload = {
      ...values,
      code: values.code.trim().toUpperCase(),
      area: values.area?.trim() || null,
      server_name: values.server_name?.trim() || null,
      branch_id: values.branch_id || null,
      display_order: Number(values.display_order ?? 0),
    };

    try {
      if (editingTable) {
        await updateTable({ id: editingTable.id, data: payload });
        message.success("Đã cập nhật bàn");
      } else {
        await createTable(payload);
        message.success("Đã thêm bàn mới");
      }
      closeForm();
    } catch (err: unknown) {
      message.error(getErrorMessage(err, "Không thể lưu bàn"));
    }
  };

  const handleDelete = async () => {
    if (!deletingTable) return;
    try {
      await deleteTable(deletingTable.id);
      message.success(`Đã xóa bàn ${deletingTable.code}`);
      setDeletingTable(null);
    } catch (err: unknown) {
      message.error(getErrorMessage(err, "Không thể xóa bàn"));
    }
  };

  const handleStatusChange = async (
    table: DiningTable,
    status: DiningTableStatus,
  ) => {
    try {
      await updateStatus(table.id, status);
      message.success(
        `Bàn ${table.code} đã chuyển sang ${getStatusMeta(status).label}`,
      );
    } catch (err: unknown) {
      message.error(getErrorMessage(err, "Không thể cập nhật trạng thái"));
    }
  };

  return (
    <div className="space-y-7 pb-20">
      <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="mb-2 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10 text-primary">
              <Armchair size={20} />
            </div>
            <h1 className="text-3xl font-black tracking-tight text-text-primary italic">
              Sơ đồ bàn
            </h1>
          </div>
          <p className="font-medium text-text-secondary">
            Quản lý bàn, khu vực phục vụ và trạng thái bàn theo thời gian thực
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => refetch()}
            className="flex items-center gap-2 rounded-2xl border border-primary-soft/30 bg-white px-5 py-3 text-[11px] font-black uppercase tracking-wider text-text-secondary shadow-sm transition-all hover:bg-[#FFFAF4] active:scale-95"
          >
            <RefreshCw
              size={14}
              className={cn(isRefetching && "animate-spin")}
            />
            Làm mới
          </button>
          <button
            type="button"
            onClick={openCreateModal}
            className="flex items-center gap-2 rounded-2xl bg-primary px-7 py-3 text-[11px] font-black uppercase tracking-wider text-white shadow-lg shadow-primary/20 transition-all hover:scale-105 active:scale-95"
          >
            <Plus size={14} strokeWidth={3} />
            Thêm bàn
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-5">
        <GlassCard
          className="flex items-center gap-4 border border-primary-soft/20 p-5 shadow-md"
          radius="4xl"
        >
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10 text-primary">
            <Sparkles size={22} />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-text-muted">
              Tổng bàn
            </p>
            <h3 className="mt-1 text-2xl font-black text-text-primary">
              {isLoading ? "..." : tables.length}
            </h3>
          </div>
        </GlassCard>

        {statusOptions.map((status) => (
          <GlassCard
            key={status.value}
            className="flex items-center gap-4 border border-primary-soft/20 p-5 shadow-md"
            radius="4xl"
          >
            <div
              className={cn(
                "flex h-11 w-11 items-center justify-center rounded-2xl border",
                status.bg,
                status.color,
              )}
            >
              {status.value === "AVAILABLE" ? (
                <CheckCircle2 size={22} />
              ) : (
                <Clock size={22} />
              )}
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-text-muted">
                {status.label}
              </p>
              <h3 className="mt-1 text-2xl font-black text-text-primary">
                {isLoading ? "..." : (counts[status.value] ?? 0)}
              </h3>
            </div>
          </GlassCard>
        ))}
      </div>

      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <Input
          prefix={<Search className="text-primary-soft" size={18} />}
          placeholder="Tìm bàn theo mã, khu vực hoặc nhân viên..."
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          className="h-12! w-full rounded-2xl! border-primary-soft/20! bg-white/60! pl-10! text-sm! font-medium! hover:border-primary/40! focus:border-primary/40! md:w-96"
        />
        <Select
          value={statusFilter}
          onChange={setStatusFilter}
          className="h-12! w-full md:w-56"
          options={[
            { value: "ALL", label: "Tất cả trạng thái" },
            ...statusOptions.map((status) => ({
              value: status.value,
              label: status.label,
            })),
          ]}
        />
      </div>

      {error ? (
        <GlassCard
          className="border border-red-100 bg-red-50/50 p-6 text-sm font-bold text-red-600"
          radius="4xl"
        >
          Không tải được sơ đồ bàn. Kiểm tra server hoặc quyền truy cập API.
        </GlassCard>
      ) : null}

      <GlassCard
        className="border border-primary-soft/20 p-5 shadow-xl"
        radius="4xl"
      >
        {filteredTables.length === 0 && !isLoading ? (
          <div className="flex min-h-80 flex-col items-center justify-center text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-3xl border border-primary-soft/20 bg-white/70 text-primary-soft">
              <Armchair size={32} />
            </div>
            <p className="text-sm font-black text-text-primary">
              Chưa có bàn phù hợp
            </p>
            <p className="mt-1 text-xs font-semibold text-text-muted">
              Thêm bàn mới hoặc thay đổi bộ lọc để xem sơ đồ.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {isLoading
              ? Array.from({ length: 8 }).map((_, index) => (
                  <div
                    key={`table-skeleton-${index}`}
                    className="h-42 animate-pulse rounded-2xl bg-white/50"
                  />
                ))
              : filteredTables.map((table) => {
                  const statusMeta = getStatusMeta(table.status);
                  return (
                    <div
                      key={table.id}
                      className="rounded-2xl border border-primary-soft/20 bg-white/70 p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
                    >
                      <div className="mb-4 flex items-start justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <span
                              className={cn(
                                "h-3 w-3 rounded-full border",
                                statusMeta.bg,
                              )}
                            />
                            <h3 className="text-xl font-black text-text-primary">
                              Bàn {table.code}
                            </h3>
                          </div>
                          <p className="mt-1 text-xs font-bold text-text-muted">
                            {table.area || "Chưa có khu vực"}
                          </p>
                        </div>
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => openEditModal(table)}
                            className="rounded-xl border border-primary-soft/20 bg-white p-2 text-text-secondary shadow-sm transition-all hover:bg-amber-50 hover:text-amber-600"
                          >
                            <Edit size={14} />
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeletingTable(table)}
                            className="rounded-xl border border-primary-soft/20 bg-white p-2 text-text-secondary shadow-sm transition-all hover:bg-red-50 hover:text-red-600"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>

                      <div className="mb-4 flex items-center justify-between rounded-xl bg-[#FFFAF4]/70 px-3 py-2">
                        <span className="flex items-center gap-2 text-xs font-black text-text-secondary">
                          <Users size={14} />
                          {table.capacity} khách
                        </span>
                        <span
                          className={cn(
                            "rounded-full border px-3 py-1 text-[10px] font-black uppercase tracking-wider",
                            statusMeta.bg,
                            statusMeta.color,
                          )}
                        >
                          {statusMeta.label}
                        </span>
                      </div>

                      <div className="mb-4 text-xs font-semibold text-text-muted">
                        Phục vụ:{" "}
                        <span className="font-black text-text-primary">
                          {table.server_name || "Chưa phân công"}
                        </span>
                      </div>

                      <Select
                        value={table.status}
                        onChange={(status) => handleStatusChange(table, status)}
                        disabled={isUpdating}
                        className="h-10! w-full"
                        options={statusOptions.map((status) => ({
                          value: status.value,
                          label: status.label,
                        }))}
                      />
                    </div>
                  );
                })}
          </div>
        )}
      </GlassCard>

      <Modal
        title={
          <span className="text-xl font-black tracking-tight text-text-primary italic">
            {editingTable
              ? `Cập nhật bàn ${editingTable.code}`
              : "Thêm bàn mới"}
          </span>
        }
        open={isFormOpen}
        onCancel={closeForm}
        footer={null}
        width={620}
        className="[&_.ant-modal-content]:rounded-4xl [&_.ant-modal-content]:border [&_.ant-modal-content]:border-primary-soft/30 [&_.ant-modal-content]:bg-white/95 [&_.ant-modal-content]:p-8"
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          requiredMark={false}
          className="mt-6"
        >
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Form.Item
              name="code"
              label={
                <span className="text-[10px] font-black uppercase tracking-[0.18em] text-[#968271]">
                  Mã bàn
                </span>
              }
              rules={[{ required: true, message: "Nhập mã bàn" }]}
            >
              <Input placeholder="A05" className="h-12 rounded-xl!" />
            </Form.Item>

            <Form.Item
              name="area"
              label={
                <span className="text-[10px] font-black uppercase tracking-[0.18em] text-[#968271]">
                  Khu vực
                </span>
              }
            >
              <Input placeholder="Sân vườn" className="h-12 rounded-xl!" />
            </Form.Item>

            <Form.Item
              name="capacity"
              label={
                <span className="text-[10px] font-black uppercase tracking-[0.18em] text-[#968271]">
                  Số khách
                </span>
              }
              rules={[{ required: true, message: "Nhập số khách" }]}
            >
              <InputNumber min={0} className="h-12! w-full rounded-xl!" />
            </Form.Item>

            <Form.Item
              name="status"
              label={
                <span className="text-[10px] font-black uppercase tracking-[0.18em] text-[#968271]">
                  Trạng thái
                </span>
              }
              rules={[{ required: true, message: "Chọn trạng thái" }]}
            >
              <Select
                className="h-12!"
                options={statusOptions.map((status) => ({
                  value: status.value,
                  label: status.label,
                }))}
              />
            </Form.Item>

            <Form.Item
              name="server_name"
              label={
                <span className="text-[10px] font-black uppercase tracking-[0.18em] text-[#968271]">
                  Phục vụ
                </span>
              }
            >
              <Input placeholder="Lan" className="h-12 rounded-xl!" />
            </Form.Item>

            <Form.Item
              name="display_order"
              label={
                <span className="text-[10px] font-black uppercase tracking-[0.18em] text-[#968271]">
                  Thứ tự
                </span>
              }
            >
              <InputNumber min={0} className="h-12! w-full rounded-xl!" />
            </Form.Item>
          </div>

          <div className="mt-5 flex justify-end gap-3 border-t border-primary-soft/10 pt-5">
            <button
              type="button"
              onClick={closeForm}
              className="rounded-2xl border border-primary-soft/30 bg-white px-5 py-3 text-[10px] font-black uppercase tracking-wider text-text-secondary transition-all hover:bg-[#FFFAF4]"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={isCreating || isUpdating}
              className="rounded-2xl bg-primary px-7 py-3 text-[10px] font-black uppercase tracking-wider text-white shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] disabled:opacity-60"
            >
              {isCreating || isUpdating ? "Đang lưu..." : "Lưu bàn"}
            </button>
          </div>
        </Form>
      </Modal>

      <Modal
        title={
          <span className="text-xl font-black tracking-tight text-red-600 italic">
            Xóa bàn
          </span>
        }
        open={!!deletingTable}
        onCancel={() => setDeletingTable(null)}
        footer={null}
        width={420}
        className="[&_.ant-modal-content]:rounded-4xl [&_.ant-modal-content]:border [&_.ant-modal-content]:border-red-100 [&_.ant-modal-content]:bg-white [&_.ant-modal-content]:p-8"
      >
        <p className="mt-4 text-sm font-semibold leading-relaxed text-text-secondary">
          Bạn có chắc muốn xóa{" "}
          <strong className="text-text-primary">
            bàn {deletingTable?.code}
          </strong>{" "}
          khỏi sơ đồ bàn?
        </p>
        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={() => setDeletingTable(null)}
            className="rounded-2xl border border-primary-soft/20 bg-white px-5 py-3 text-[10px] font-black uppercase tracking-wider text-text-secondary"
          >
            Hủy
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={isDeleting}
            className="rounded-2xl bg-red-600 px-6 py-3 text-[10px] font-black uppercase tracking-wider text-white shadow-lg shadow-red-200 disabled:opacity-60"
          >
            {isDeleting ? "Đang xóa..." : "Đồng ý xóa"}
          </button>
        </div>
      </Modal>
    </div>
  );
}

export default function TablesPage() {
  return (
    <ConfigProvider theme={antdTheme}>
      <App>
        <TablesPageInner />
      </App>
    </ConfigProvider>
  );
}

'use client';

import {
  Col,
  DatePicker,
  Form,
  Modal,
  Row,
  Select,
  TimePicker,
  App,
} from "antd";
import { useMemo, useState } from "react";
import {
  Search,
  CircleDot,
  Clock,
  Briefcase,
  AlertCircle,
  UserX,
  Loader2,
} from 'lucide-react';
import dayjs from 'dayjs';
import { GlassCard } from "@/shared/components/GlassCard";
import { cn } from "@/shared/utils/cn";
import { STATUS_CONFIG } from "@/modules/employees/config/status.config";
import { useTimekeeping } from "@/modules/employees/presentation/hooks/useTimekeeping";
import { useEmployees } from "@/modules/employees/presentation/hooks/useEmployees";

const { Option } = Select;

const getEmployeeName = (employee: any) => employee?.user?.username ?? employee?.full_name ?? 'Không rõ';

export default function AttendanceTab() {
  const { timekeepings, isLoading, createTimekeeping, isCreating } = useTimekeeping();
  const { employees, isLoading: isLoadingEmployees } = useEmployees(1, 200);
  const { message } = App.useApp();
  const [isManualModalOpen, setIsManualModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [form] = Form.useForm();

  const records = useMemo(() => {
    return (timekeepings as any[])
      .filter((r) => {
        if (!searchTerm) return true;
        const name = getEmployeeName(r.employee).toLowerCase();
        return name.includes(searchTerm.toLowerCase());
      })
      .sort((a, b) => new Date(b.check_in).getTime() - new Date(a.check_in).getTime());
  }, [timekeepings, searchTerm]);

  const stats = useMemo(() => {
    const all = timekeepings as any[];
    const withStatus = all.filter((r) => r.status);
    const onTimeCount = withStatus.filter((r) => r.status === 'ON_TIME').length;
    const onTimeRate = withStatus.length > 0 ? Math.round((onTimeCount / withStatus.length) * 100) : 0;

    const weekStart = dayjs().startOf('week');
    const weekHours = all
      .filter((r) => dayjs(r.check_in).isAfter(weekStart))
      .reduce((sum, r) => sum + Number(r.total_hours || 0), 0);

    const lateCount = all.filter((r) => r.status === 'LATE').length;
    const absentCount = all.filter((r) => r.status === 'ABSENT').length;

    return [
      { label: 'Tỉ lệ đúng giờ', value: `${onTimeRate}%`, icon: Clock, color: 'text-green-500 bg-green-50' },
      { label: 'Tổng giờ công (Tuần)', value: `${weekHours.toFixed(1)}h`, icon: Briefcase, color: 'text-primary bg-primary/5' },
      { label: 'Số lượt đi muộn', value: String(lateCount), icon: AlertCircle, color: 'text-amber-500 bg-amber-50' },
      { label: 'Vắng không lý do', value: String(absentCount), icon: UserX, color: 'text-red-500 bg-red-50' },
    ];
  }, [timekeepings]);

  const handleManualSubmit = async (values: any) => {
    const date = values.date as dayjs.Dayjs;
    const checkInTime = values.checkIn as dayjs.Dayjs;
    const checkOutTime = values.checkOut as dayjs.Dayjs | undefined;

    const check_in = date.hour(checkInTime.hour()).minute(checkInTime.minute()).second(0).toISOString();
    const check_out = checkOutTime
      ? date.hour(checkOutTime.hour()).minute(checkOutTime.minute()).second(0).toISOString()
      : undefined;

    try {
      await createTimekeeping({
        employee_id: values.employeeId,
        check_in,
        check_out,
        status: values.status,
      });
      message.success('Đã ghi nhận chấm công.');
      setIsManualModalOpen(false);
      form.resetFields();
    } catch (err: any) {
      message.error(err?.response?.data?.message ?? 'Không thể ghi nhận chấm công.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <GlassCard key={idx} className="p-6 flex items-center gap-5" radius="3xl">
            <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center transition-transform hover:rotate-12 duration-500", stat.color)}>
              <stat.icon size={28} />
            </div>
            <div>
              <p className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em]">{stat.label}</p>
              <p className="text-2xl font-black text-text-primary mt-0.5 tracking-tight">{stat.value}</p>
            </div>
          </GlassCard>
        ))}
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="relative w-72">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-primary-soft" size={16} />
          <input
            type="text"
            placeholder="Tìm theo tên nhân viên..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white/60 border border-primary-soft/20 rounded-2xl py-3 pl-11 pr-4 text-xs font-bold focus:outline-none focus:border-primary/40 focus:bg-white transition-all shadow-sm"
          />
        </div>

        <button
          onClick={() => setIsManualModalOpen(true)}
          className="flex items-center gap-2 px-6 py-3 bg-white border border-primary-soft/30 rounded-2xl text-[10px] font-black text-text-secondary uppercase tracking-wider hover:bg-gray-50 transition-all shadow-sm"
        >
          Chấm công thủ công
        </button>
      </div>

      <GlassCard className="overflow-hidden" radius="4xl">
        <table className="w-full">
          <thead>
            <tr className="bg-[#FFFAF4]/40 border-b border-primary-soft/20">
              <th className="py-6 px-8 text-left">
                <span className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em]">Nhân viên</span>
              </th>
              <th className="py-6 px-4 text-center">
                <span className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em]">Check-in</span>
              </th>
              <th className="py-6 px-4 text-center">
                <span className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em]">Check-out</span>
              </th>
              <th className="py-6 px-4 text-center">
                <span className="text-[10px] font-black text-[#968271] uppercase tracking-[0.2em]">Giờ công</span>
              </th>
              <th className="py-6 px-8 text-right">
                <span className="text-[10px] font-black text-[#968271] uppercase tracking-[0.2em]">Trạng thái</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-primary-soft/10">
            {isLoading ? (
              <tr><td colSpan={5} className="py-16 text-center"><Loader2 className="animate-spin mx-auto text-text-muted" size={24} /></td></tr>
            ) : records.length === 0 ? (
              <tr><td colSpan={5} className="py-16 text-center text-sm font-bold text-text-muted">Chưa có dữ liệu chấm công.</td></tr>
            ) : records.map((record) => {
              const isInShift = !record.check_out;
              const statusKey = isInShift ? 'IN_SHIFT' : (record.status as keyof typeof STATUS_CONFIG);
              const statusInfo = STATUS_CONFIG[statusKey] || STATUS_CONFIG.ON_TIME;
              return (
                <tr key={record.id} className="group hover:bg-[#FFFAF4]/20 transition-colors">
                  <td className="py-5 px-8">
                    <div className="flex items-center gap-4">
                      <div className="w-9 h-9 rounded-xl bg-white border border-primary-soft/20 flex items-center justify-center text-primary font-black text-xs">
                        {getEmployeeName(record.employee).split(' ').pop()?.[0]}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-text-primary">{getEmployeeName(record.employee)}</p>
                        <p className="text-[9px] font-black text-primary uppercase tracking-widest mt-0.5">{record.employee?.employee_code || ''}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-5 px-4 text-center">
                    <span className="text-xs font-black text-text-primary">{dayjs(record.check_in).format('HH:mm DD/MM')}</span>
                  </td>
                  <td className="py-5 px-4 text-center">
                    <span className={cn("text-xs font-black", !record.check_out ? "text-primary-soft/50" : "text-text-primary")}>
                      {record.check_out ? dayjs(record.check_out).format('HH:mm DD/MM') : '---'}
                    </span>
                  </td>
                  <td className="py-5 px-4 text-center">
                    <span className="text-xs font-black text-primary">{record.total_hours ? `${Number(record.total_hours)}h` : '---'}</span>
                  </td>
                  <td className="py-5 px-8 text-right">
                    <div className={cn(
                      "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider border",
                      statusInfo.color
                    )}>
                      <CircleDot size={10} />
                      {statusInfo.label}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </GlassCard>

      <Modal
        title={<span className="text-xl font-black text-text-primary tracking-tight italic">Chấm Công Thủ Công</span>}
        open={isManualModalOpen}
        onCancel={() => {
          setIsManualModalOpen(false);
          form.resetFields();
        }}
        footer={null}
        width={600}
        className="employee-modal"
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleManualSubmit}
          initialValues={{ status: 'ON_TIME' }}
          className="mt-6"
          requiredMark={false}
        >
          <Form.Item
            name="employeeId"
            label={<span className="text-[10px] font-black text-[#968271] uppercase tracking-[0.2em]">Nhân viên</span>}
            rules={[{ required: true, message: 'Vui lòng chọn nhân viên' }]}
          >
            <Select placeholder="Chọn nhân viên" className="h-12" loading={isLoadingEmployees} classNames={{ popup: { root: '!rounded-2xl' } }}>
              {employees.map((emp: any) => (
                <Option key={emp.id} value={emp.id}>{emp.name}</Option>
              ))}
            </Select>
          </Form.Item>

          <Row gutter={24}>
            <Col span={12}>
              <Form.Item
                name="date"
                label={<span className="text-[10px] font-black text-[#968271] uppercase tracking-[0.2em]">Ngày làm việc</span>}
                rules={[{ required: true, message: 'Vui lòng chọn ngày' }]}
              >
                <DatePicker format="DD/MM/YYYY" placeholder="Chọn ngày" className="w-full h-12 rounded-xl bg-white/60 border-primary-soft/30 hover:border-primary/50 focus:border-primary/50 shadow-sm" classNames={{ popup: '!rounded-2xl' }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="status"
                label={<span className="text-[10px] font-black text-[#968271] uppercase tracking-[0.2em]">Trạng thái</span>}
                rules={[{ required: true, message: 'Vui lòng chọn trạng thái' }]}
              >
                <Select placeholder="Chọn trạng thái" className="h-12" classNames={{ popup: { root: '!rounded-2xl' } }}>
                  <Option value="ON_TIME">Đúng giờ</Option>
                  <Option value="LATE">Đi muộn</Option>
                  <Option value="EARLY_LEAVE">Về sớm</Option>
                  <Option value="OVERTIME">Tăng ca</Option>
                  <Option value="ABSENT">Vắng mặt</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={24}>
            <Col span={12}>
              <Form.Item
                name="checkIn"
                label={<span className="text-[10px] font-black text-[#968271] uppercase tracking-[0.2em]">Giờ Check-in</span>}
                rules={[{ required: true, message: 'Vui lòng chọn giờ check-in' }]}
              >
                <TimePicker format="HH:mm" placeholder="--:--" className="w-full h-12 rounded-xl bg-white/60 border-primary-soft/30 hover:border-primary/50 focus:border-primary/50 shadow-sm" classNames={{ popup: '!rounded-2xl' }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="checkOut"
                label={<span className="text-[10px] font-black text-[#968271] uppercase tracking-[0.2em]">Giờ Check-out</span>}
              >
                <TimePicker format="HH:mm" placeholder="--:--" className="w-full h-12 rounded-xl bg-white/60 border-primary-soft/30 hover:border-primary/50 focus:border-primary/50 shadow-sm" classNames={{ popup: '!rounded-2xl' }} />
              </Form.Item>
            </Col>
          </Row>

          <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-primary-soft/10">
            <button
              type="button"
              onClick={() => {
                setIsManualModalOpen(false);
                form.resetFields();
              }}
              className="px-6 py-3.5 bg-white border border-primary-soft/30 hover:bg-[#FFFAF4] text-text-primary rounded-2xl text-[10px] font-black uppercase tracking-wider transition-all shadow-sm"
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              disabled={isCreating}
              className="px-8 py-3.5 bg-primary hover:scale-[1.02] active:scale-95 text-white rounded-2xl text-[10px] font-black uppercase tracking-wider transition-all shadow-lg shadow-primary/20 disabled:opacity-60 flex items-center gap-2"
            >
              {isCreating && <Loader2 size={14} className="animate-spin" />}
              Xác nhận chấm công
            </button>
          </div>
        </Form>
      </Modal>
    </div>
  );
}

'use client';

import { GlassCard } from "@/shared/components/GlassCard";
import { cn } from "@/shared/utils/cn";
import { App, Modal, Select } from "antd";
import { ChevronLeft, ChevronRight, Filter, Loader2, Plus, X } from "lucide-react";
import { useMemo, useState } from "react";
import dayjs from "dayjs";
import { useEmployees } from "@/modules/employees/presentation/hooks/useEmployees";
import { useShifts } from "@/modules/employees/presentation/hooks/useShifts";
import { useWorkSchedules } from "@/modules/employees/presentation/hooks/useWorkSchedules";
import { useBranches } from "@/modules/branches/presentation/hooks/useBranches";
import { ShiftItem } from "@/modules/employees/infrastructure/services/shift.service";

const shiftColor = (idx: number) => {
  const palette = [
    "bg-amber-50/50 border-amber-200/50 text-amber-700",
    "bg-blue-50/50 border-blue-200/50 text-blue-700",
    "bg-purple-50/50 border-purple-200/50 text-purple-700",
    "bg-emerald-50/50 border-emerald-200/50 text-emerald-700",
  ];
  return palette[idx % palette.length];
};

export default function SchedulingTab() {
  const [currentWeek, setCurrentWeek] = useState(0);
  const [assigningCell, setAssigningCell] = useState<{ employeeId: string; employeeName: string; date: string } | null>(null);
  const [selectedShiftId, setSelectedShiftId] = useState<string>('');
  const { message } = App.useApp();

  const { employees, isLoading: isLoadingEmployees } = useEmployees(1, 200);
  const { shifts, isLoading: isLoadingShifts } = useShifts();
  const { workSchedules, isLoading: isLoadingSchedules, createWorkSchedule, updateWorkSchedule, deleteWorkSchedule, isCreating, isUpdating, isDeleting } = useWorkSchedules();
  const { branches } = useBranches();

  const isLoading = isLoadingEmployees || isLoadingShifts || isLoadingSchedules;

  const weekStart = useMemo(() => dayjs().startOf('week').add(currentWeek, 'week'), [currentWeek]);
  const days = ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'Chủ Nhật'];
  const weekDates = useMemo(() => Array.from({ length: 7 }, (_, i) => weekStart.add(i, 'day')), [weekStart]);

  const scheduleMap = useMemo(() => {
    const map = new Map<string, any>();
    (workSchedules as any[]).forEach((ws) => {
      const key = `${ws.employee_id}_${dayjs(ws.work_date).format('YYYY-MM-DD')}`;
      map.set(key, ws);
    });
    return map;
  }, [workSchedules]);

  const shiftIndexById = useMemo(() => {
    const map = new Map<string, number>();
    (shifts as ShiftItem[]).forEach((s, idx) => map.set(s.id, idx));
    return map;
  }, [shifts]);

  const openAssignModal = (employeeId: string, employeeName: string, date: dayjs.Dayjs) => {
    const key = `${employeeId}_${date.format('YYYY-MM-DD')}`;
    const existing = scheduleMap.get(key);
    setSelectedShiftId(existing?.shift_id || '');
    setAssigningCell({ employeeId, employeeName, date: date.format('YYYY-MM-DD') });
  };

  const handleSaveAssignment = async () => {
    if (!assigningCell) return;
    const key = `${assigningCell.employeeId}_${assigningCell.date}`;
    const existing = scheduleMap.get(key);

    try {
      if (!selectedShiftId) {
        if (existing) await deleteWorkSchedule(existing.id);
        setAssigningCell(null);
        return;
      }

      const employee = (employees as any[]).find((e) => e.id === assigningCell.employeeId);
      const branchId = employee?.branch_id || branches[0]?.id;
      if (!branchId) {
        message.error('Không tìm thấy chi nhánh cho nhân viên này.');
        return;
      }

      if (existing) {
        await updateWorkSchedule({
          id: existing.id,
          data: {
            employee_id: assigningCell.employeeId,
            branch_id: branchId,
            shift_id: selectedShiftId,
            work_date: assigningCell.date,
          },
        });
      } else {
        await createWorkSchedule({
          employee_id: assigningCell.employeeId,
          branch_id: branchId,
          shift_id: selectedShiftId,
          work_date: assigningCell.date,
        });
      }
      message.success('Đã cập nhật lịch làm việc.');
      setAssigningCell(null);
    } catch (err: any) {
      message.error(err?.response?.data?.message ?? 'Không thể cập nhật lịch làm việc.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="flex bg-white/60 border border-primary-soft/20 rounded-2xl p-1 shadow-sm items-center relative group">
            <button
              onClick={() => setCurrentWeek(w => w - 1)}
              className="p-2 text-text-muted hover:text-primary hover:bg-[#FFFAF4] rounded-xl transition-all z-10"
            >
              <ChevronLeft size={20} />
            </button>
            <div className="relative flex flex-col items-center justify-center min-w-45 h-10 w-full">
              <span className="text-[10px] font-black text-[#968271] uppercase tracking-widest leading-none mb-1">
                Tuần {weekStart.year()}
              </span>
              <span className="text-xs font-black text-text-primary leading-none">
                {weekStart.format('DD/MM')} - {weekStart.add(6, 'day').format('DD/MM')}
              </span>
            </div>
            <button
              onClick={() => setCurrentWeek(w => w + 1)}
              className="p-2 text-text-muted hover:text-primary hover:bg-[#FFFAF4] rounded-xl transition-all z-10"
            >
              <ChevronRight size={20} />
            </button>
          </div>

          <div className="h-10 w-px bg-primary-soft/20 hidden md:block" />

          <div className="flex items-center gap-2">
            <button className="px-4 py-2 bg-white border border-primary-soft/30 rounded-xl text-[10px] font-black text-text-secondary uppercase tracking-wider hover:bg-gray-50 flex items-center gap-2">
              <Filter size={14} /> Bộ lọc
            </button>
          </div>
        </div>

        {currentWeek !== 0 && (
          <button
            onClick={() => setCurrentWeek(0)}
            className="px-6 py-3 bg-white border border-primary-soft/30 rounded-xl text-[10px] font-black text-text-secondary uppercase tracking-wider hover:bg-gray-50"
          >
            Về tuần hiện tại
          </button>
        )}
      </div>

      <GlassCard className="overflow-hidden" radius="4xl">
        {isLoading ? (
          <div className="flex items-center justify-center py-20 text-text-muted">
            <Loader2 size={28} className="animate-spin" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-[#FFFAF4]/40 border-b border-primary-soft/20">
                  <th className="py-6 px-8 text-left min-w-50">
                    <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">Nhân sự</span>
                  </th>
                  {days.map((day, idx) => (
                    <th key={idx} className="py-6 px-4 text-center min-w-30">
                      <div className="flex flex-col">
                        <span className="text-[10px] font-black text-primary-soft uppercase tracking-widest">{day}</span>
                        <span className="text-sm font-black text-text-primary">{weekDates[idx].format('DD/MM')}</span>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-primary-soft/10">
                {(employees as any[]).map((emp) => (
                  <tr key={emp.id} className="group hover:bg-[#FFFAF4]/20 transition-colors">
                    <td className="py-6 px-8">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-2xl bg-white border border-primary-soft/20 flex items-center justify-center text-primary font-black text-sm shadow-sm">
                          {emp.name.split(' ').pop()?.[0]}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-text-primary group-hover:text-primary transition-colors">{emp.name}</p>
                          <p className="text-[9px] font-black text-text-muted uppercase tracking-widest leading-none mt-1">{emp.role}</p>
                        </div>
                      </div>
                    </td>
                    {weekDates.map((date, dayIdx) => {
                      const key = `${emp.id}_${date.format('YYYY-MM-DD')}`;
                      const assignment = scheduleMap.get(key);
                      const shiftIdx = assignment ? shiftIndexById.get(assignment.shift_id) ?? 0 : 0;

                      return (
                        <td key={dayIdx} className="py-2 px-2 text-center align-middle">
                          {assignment ? (
                            <button
                              onClick={() => openAssignModal(emp.id, emp.name, date)}
                              className={cn(
                                "w-full py-4 rounded-3xl border text-[10px] font-black uppercase tracking-wider transition-all hover:scale-[1.04] active:scale-95 shadow-sm flex flex-col items-center gap-1",
                                shiftColor(shiftIdx)
                              )}
                            >
                              <span>{assignment.shift?.shift_name || 'Ca làm'}</span>
                              {assignment.shift && (
                                <span className="text-[8px] opacity-70">
                                  {dayjs(assignment.shift.start_time, 'HH:mm:ss').format('HH:mm')}-{dayjs(assignment.shift.end_time, 'HH:mm:ss').format('HH:mm')}
                                </span>
                              )}
                            </button>
                          ) : (
                            <button
                              onClick={() => openAssignModal(emp.id, emp.name, date)}
                              className="w-full h-full min-h-15 flex items-center justify-center border-2 border-dashed border-primary-soft/30 hover:border-primary/40 rounded-3xl text-primary-soft/60 hover:text-primary hover:bg-primary/5 transition-all"
                            >
                              <Plus size={16} />
                            </button>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
                {employees.length === 0 && (
                  <tr>
                    <td colSpan={8} className="py-16 text-center text-sm font-bold text-text-muted">Chưa có nhân viên nào.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        <div className="p-8 bg-bg-light-200 border-t border-primary-soft/10 flex items-center justify-between text-text-muted">
          <p className="text-[10px] font-bold italic">* Nhấn vào ô để phân ca hoặc điều chỉnh nhân sự.</p>
        </div>
      </GlassCard>

      <Modal
        title={<span className="text-xl font-black text-text-primary tracking-tight italic">Phân ca làm việc</span>}
        open={!!assigningCell}
        onCancel={() => setAssigningCell(null)}
        footer={null}
        width={440}
        className="employee-modal"
      >
        {assigningCell && (
          <div className="mt-6 space-y-6">
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/60 border border-primary-soft/20 shadow-sm">
              <div className="w-12 h-12 rounded-2xl bg-white border border-primary-soft/30 flex items-center justify-center text-primary font-black text-lg shadow-sm">
                {assigningCell.employeeName.split(' ').pop()?.[0]}
              </div>
              <div>
                <p className="text-lg font-black text-text-primary italic">{assigningCell.employeeName}</p>
                <p className="text-[10px] font-black text-primary uppercase tracking-widest mt-0.5">{dayjs(assigningCell.date).format('DD/MM/YYYY')}</p>
              </div>
            </div>

            <div>
              <label className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] block mb-2">Ca làm việc</label>
              <Select
                value={selectedShiftId || undefined}
                onChange={(v) => setSelectedShiftId(v)}
                placeholder="Chọn ca (để trống để bỏ phân ca)"
                allowClear
                className="w-full h-12"
                classNames={{ popup: { root: '!rounded-2xl' } }}
                options={(shifts as ShiftItem[]).map((s) => ({
                  value: s.id,
                  label: `${s.shift_name} (${dayjs(s.start_time, 'HH:mm:ss').format('HH:mm')}-${dayjs(s.end_time, 'HH:mm:ss').format('HH:mm')})`,
                }))}
              />
            </div>

            <div className="flex justify-end gap-3 pt-6 border-t border-primary-soft/10">
              <button
                onClick={() => setAssigningCell(null)}
                className="px-6 py-3.5 bg-white border border-primary-soft/30 hover:bg-[#FFFAF4] text-text-muted rounded-2xl text-[10px] font-black uppercase tracking-wider transition-all shadow-sm"
              >
                Đóng
              </button>
              <button
                onClick={handleSaveAssignment}
                disabled={isCreating || isUpdating || isDeleting}
                className="px-6 py-3.5 bg-primary text-white hover:scale-[1.02] active:scale-95 rounded-2xl text-[10px] font-black uppercase tracking-wider transition-all shadow-lg shadow-primary/20 disabled:opacity-60 flex items-center gap-2"
              >
                {(isCreating || isUpdating || isDeleting) && <Loader2 size={14} className="animate-spin" />}
                Cập nhật
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

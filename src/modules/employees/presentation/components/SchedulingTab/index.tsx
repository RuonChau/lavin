import { employeeScheduling } from "@/modules/employees/mocks/employee-scheduling.mock";
import { GlassCard } from "@/shared/components/GlassCard";
import { cn } from "@/shared/utils/cn";
import { DatePicker, Modal } from "antd";
import { AlertCircle, ChevronLeft, ChevronRight, Filter, Users } from "lucide-react";
import { useState } from "react";


export default function SchedulingTab() {
  const [currentWeek, setCurrentWeek] = useState(0);
  const [selectedLeave, setSelectedLeave] = useState<any>(null);
  
  

  const days = ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'Chủ Nhật'];
  const dates = ['15/05', '16/05', '17/05', '18/05', '19/05', '20/05', '21/05'];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
           <div className="flex bg-white/60 border border-[#D8B894]/20 rounded-2xl p-1 shadow-sm items-center relative group">
              <button 
                onClick={() => setCurrentWeek(w => w - 1)}
                className="p-2 text-[#9A8677] hover:text-primary hover:bg-[#FFFAF4] rounded-xl transition-all z-10"
              >
                <ChevronLeft size={20} />
              </button>
              <div className="relative flex flex-col items-center justify-center min-w-[180px] h-10 w-full overflow-hidden cursor-pointer hover:bg-white/40 transition-colors rounded-xl">
                 <DatePicker 
                   picker="week" 
                   className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-20"
                   onChange={(date) => {
                     // Can update internal date state here
                   }}
                 />
                 <span className="text-[10px] font-black text-[#968271] uppercase tracking-widest leading-none mb-1">Tuần 20, 2026</span>
                 <span className="text-xs font-black text-[#2A1E17] leading-none">15/05 - 21/05</span>
              </div>
              <button 
                onClick={() => setCurrentWeek(w => w + 1)}
                className="p-2 text-[#9A8677] hover:text-primary hover:bg-[#FFFAF4] rounded-xl transition-all z-10"
              >
                <ChevronRight size={20} />
              </button>
           </div>
           
           <div className="h-10 w-px bg-[#D8B894]/20 hidden md:block" />
           
           <div className="flex items-center gap-2">
              <button className="px-4 py-2 bg-white border border-[#D8B894]/30 rounded-xl text-[10px] font-black text-[#6F5A4A] uppercase tracking-wider hover:bg-gray-50 flex items-center gap-2">
                <Filter size={14} /> Bộ lọc
              </button>
           </div>
        </div>

        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-6 py-3 bg-white border border-[#D8B894]/30 rounded-xl text-[10px] font-black text-[#6F5A4A] uppercase tracking-wider hover:bg-gray-50 transition-all active:scale-95 shadow-sm">
            Sao chép tuần trước
          </button>
          <button className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl text-[10px] font-black uppercase tracking-wider shadow-md shadow-primary/10 hover:scale-[1.02] active:scale-95 transition-all">
            Lưu & Xuất lịch
          </button>
        </div>
      </div>

      <GlassCard className="overflow-hidden" radius="4xl">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-[#FFFAF4]/40 border-b border-[#D8B894]/20">
                <th className="py-6 px-8 text-left min-w-[200px]">
                   <span className="text-[10px] font-black text-[#968271] uppercase tracking-[0.2em]">Nhân sự</span>
                </th>
                {days.map((day, idx) => (
                  <th key={idx} className="py-6 px-4 text-center min-w-[120px]">
                     <div className="flex flex-col">
                        <span className="text-[10px] font-black text-[#D8B894] uppercase tracking-widest">{day}</span>
                        <span className="text-sm font-black text-[#2A1E17]">{dates[idx]}</span>
                     </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#D8B894]/10">
              {employeeScheduling.map((emp) => (
                <tr key={emp.id} className="group hover:bg-[#FFFAF4]/20 transition-colors">
                  <td className="py-6 px-8">
                     <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-2xl bg-white border border-[#D8B894]/20 flex items-center justify-center text-primary font-black text-sm shadow-sm">
                           {emp.name.split(' ').pop()?.[0]}
                        </div>
                        <div>
                           <p className="text-sm font-bold text-[#2A1E17] group-hover:text-primary transition-colors">{emp.name}</p>
                           <p className="text-[9px] font-black text-[#9A8677] uppercase tracking-widest leading-none mt-1">{emp.role}</p>
                        </div>
                     </div>
                  </td>
                  {days.map((day, dayIdx) => {
                    const isOff = (emp.id === 'EMP02' && dayIdx === 2) || (emp.id === 'EMP01' && dayIdx === 6);
                    const isMorning = dayIdx % 3 === 0;
                    const isAfternoon = dayIdx % 3 === 1;

                    return (
                      <td key={dayIdx} className="py-2 px-2 text-center align-middle">
                        {isOff ? (
                          <button 
                            onClick={() => setSelectedLeave({
                              empName: emp.name,
                              date: `${day} (${dates[dayIdx]})`,
                              reason: emp.id === 'EMP02' ? 'Việc gia đình đột xuất' : 'Nghỉ phép năm',
                              swapWith: emp.id === 'EMP02' ? 'Lê Minh Chiến (Ca Chiều)' : null
                            })}
                            className="w-full h-full min-h-[60px] flex items-center justify-center border-2 border-dashed border-[#D8B894]/40 hover:border-primary/40 rounded-3xl text-[10px] font-black text-[#968271] hover:text-primary uppercase tracking-widest italic bg-[#FFFAF4]/30 hover:bg-primary/5 transition-all shadow-sm"
                          >
                            NGHỈ
                          </button>
                        ) : (
                          <button className={cn(
                            "w-full py-4 rounded-3xl border text-[10px] font-black uppercase tracking-wider transition-all hover:scale-[1.04] active:scale-95 shadow-sm flex flex-col items-center gap-1",
                            isMorning 
                              ? "bg-amber-50/50 border-amber-200/50 text-amber-700" 
                              : isAfternoon 
                                ? "bg-blue-50/50 border-blue-200/50 text-blue-700"
                                : "bg-purple-50/50 border-purple-200/50 text-purple-700"
                          )}>
                             <span>{isMorning ? 'SÁNG' : isAfternoon ? 'CHIỀU' : 'TỐI'}</span>
                             <span className="text-[8px] opacity-70">
                                {isMorning ? '7:00-15:00' : isAfternoon ? '15:00-23:00' : '18:00-23:00'}
                             </span>
                          </button>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="p-8 bg-[#FFFAF4]/10 border-t border-[#D8B894]/10 flex items-center justify-between text-[#9A8677]">
           <div className="flex gap-8">
              <div className="flex items-center gap-2">
                 <div className="w-3 h-3 rounded-full bg-amber-400" />
                 <span className="text-[10px] font-black uppercase tracking-widest">Ca Sáng</span>
              </div>
              <div className="flex items-center gap-2">
                 <div className="w-3 h-3 rounded-full bg-blue-400" />
                 <span className="text-[10px] font-black uppercase tracking-widest">Ca Chiều</span>
              </div>
              <div className="flex items-center gap-2">
                 <div className="w-3 h-3 rounded-full bg-purple-400" />
                 <span className="text-[10px] font-black uppercase tracking-widest">Ca Tối</span>
              </div>
           </div>
           
           <p className="text-[10px] font-bold italic">* Nhấn vào ca để thay đổi hoặc phân bổ lại nhân sự</p>
        </div>
      </GlassCard>

      <Modal
        title={<span className="text-xl font-black text-[#2A1E17] tracking-tight italic">Chi tiết Nghỉ phép</span>}
        open={!!selectedLeave}
        onCancel={() => setSelectedLeave(null)}
        footer={null}
        width={500}
        className="employee-modal"
      >
        {selectedLeave && (
          <div className="mt-6 space-y-6">
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/60 border border-[#D8B894]/20 shadow-sm">
               <div className="w-12 h-12 rounded-2xl bg-white border border-[#D8B894]/30 flex items-center justify-center text-primary font-black text-lg shadow-sm">
                  {selectedLeave.empName.split(' ').pop()?.[0]}
               </div>
               <div>
                  <p className="text-lg font-black text-[#2A1E17] italic">{selectedLeave.empName}</p>
                  <p className="text-[10px] font-black text-primary uppercase tracking-widest mt-0.5">{selectedLeave.date}</p>
               </div>
            </div>

            <div className="space-y-4">
              <div className="bg-white/60 p-4 rounded-2xl border border-[#D8B894]/20 shadow-sm">
                <p className="text-[10px] font-black text-[#968271] uppercase tracking-[0.2em] mb-2 flex items-center gap-2">
                   <AlertCircle size={14} className="text-amber-500" />
                   Lý do nghỉ
                </p>
                <p className="text-sm font-bold text-[#2A1E17]">{selectedLeave.reason}</p>
              </div>

              {selectedLeave.swapWith && (
                <div className="bg-[#FFFAF4]/60 p-4 rounded-2xl border border-primary/20 shadow-sm">
                  <p className="text-[10px] font-black text-[#968271] uppercase tracking-[0.2em] mb-3 flex items-center gap-2">
                     <Users size={14} className="text-primary" />
                     Nhân sự thay thế (Đổi ca)
                  </p>
                  <div className="flex items-center justify-between">
                     <div className="flex items-center gap-3">
                       <div className="w-8 h-8 rounded-xl bg-white border border-[#D8B894]/20 flex items-center justify-center text-primary font-black text-xs shadow-sm">
                         {selectedLeave.swapWith.split(' ').pop()?.[0]}
                       </div>
                       <span className="text-sm font-bold text-[#2A1E17]">{selectedLeave.swapWith}</span>
                     </div>
                     <span className="px-3 py-1 bg-primary/10 text-primary border border-primary/20 rounded-lg text-[9px] font-black uppercase">Đã xác nhận</span>
                  </div>
                </div>
              )}
            </div>
            
            <div className="flex justify-end gap-3 pt-6 border-t border-[#D8B894]/10">
              <button 
                onClick={() => setSelectedLeave(null)}
                className="px-6 py-3.5 bg-white border border-[#D8B894]/30 hover:bg-[#FFFAF4] text-[#6F5A4A] rounded-2xl text-[10px] font-black uppercase tracking-wider transition-all shadow-sm"
              >
                Đóng
              </button>
              <button 
                className="px-6 py-3.5 bg-primary text-white hover:scale-[1.02] active:scale-95 rounded-2xl text-[10px] font-black uppercase tracking-wider transition-all shadow-lg shadow-primary/20"
              >
                Cập nhật
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
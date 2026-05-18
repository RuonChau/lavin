import { Calendar, ClipboardCheck, Clock, Users } from "lucide-react";
import { TabType } from "../types/tab.type";
import type { LucideIcon } from 'lucide-react';


export type StaffTabConfig = {
  id: TabType;
  label: string;
  icon: LucideIcon;
  description: string;
};

export const staffTabs: StaffTabConfig[] = [
  { id: 'LIST', label: 'Danh sách nhân viên', icon: Users, description: 'Quản lý thông tin và hồ sơ nhân sự' },
  { id: 'SHIFTS', label: 'Ca làm việc', icon: Clock, description: 'Quản lý khung giờ và định nghĩa ca' },
  { id: 'SCHEDULING', label: 'Lịch phân ca', icon: Calendar, description: 'Sắp xếp nhân sự theo tuần/tháng' },
  { id: 'ATTENDANCE', label: 'Chấm công thực tế', icon: ClipboardCheck, description: 'Theo dõi giờ công, đi muộn về sớm' },
];
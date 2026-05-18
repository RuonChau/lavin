// src/modules/staff/mocks/attendance-stats.mock.ts

import {
  AlertCircle,
  Briefcase,
  Clock,
  Trash2,
} from 'lucide-react';
import { AttendanceStatItem } from '../types/attendance-stat-item.type';


export const ATTENDANCE_STATS_MOCK: AttendanceStatItem[] = [
  {
    label: 'Tỉ lệ đúng giờ',
    value: '94%',
    icon: Clock,
    color: 'text-green-500 bg-green-50',
  },
  {
    label: 'Tổng giờ công (Tuần)',
    value: '842h',
    icon: Briefcase,
    color: 'text-primary bg-primary/5',
  },
  {
    label: 'Số phút đi muộn',
    value: '156m',
    icon: AlertCircle,
    color: 'text-amber-500 bg-amber-50',
  },
  {
    label: 'Vắng không lý do',
    value: '02',
    icon: Trash2,
    color: 'text-red-500 bg-red-50',
  },
];
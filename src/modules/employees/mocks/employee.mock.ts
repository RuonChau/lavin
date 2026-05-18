import { Employee } from "../application/interfaces/employee.interfaces";

export const employees: Employee[] = [
  { key: '1', id: 'EMP-001', name: 'Nguyễn Văn An', role: 'Barista', email: 'an.nv@brewglass.vn', phone: '0901 234 567', status: 'ACTIVE', joinDate: '12/01/2024', branch: 'Quận 1', type: 'Toàn thời gian' },
  { key: '2', id: 'EMP-002', name: 'Trần Thị Bình', role: 'Phục vụ', email: 'binh.tt@brewglass.vn', phone: '0902 345 678', status: 'ACTIVE', joinDate: '15/02/2024', branch: 'Quận 3', type: 'Bán thời gian' },
  { key: '3', id: 'EMP-003', name: 'Lê Minh Chiến', role: 'Quản lý', email: 'chien.lm@brewglass.vn', phone: '0903 456 789', status: 'ACTIVE', joinDate: '01/01/2024', branch: 'Quận 1', type: 'Toàn thời gian' },
  { key: '4', id: 'EMP-004', name: 'Phạm Hồng Đào', role: 'Barista', email: 'dao.ph@brewglass.vn', phone: '0904 567 890', status: 'ACTIVE', joinDate: '20/03/2024', branch: 'Tân Bình', type: 'Toàn thời gian' },
  { key: '5', id: 'EMP-005', name: 'Hoàng Quốc Việt', role: 'Thu ngân', email: 'viet.hq@brewglass.vn', phone: '0905 678 901', status: 'INACTIVE', joinDate: '10/05/2024', branch: 'Quận 1', type: 'Bán thời gian' },
];
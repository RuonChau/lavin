import { CheckCircle2, CreditCard, Plus, Truck, XCircle } from "lucide-react";

export const HistorySuppiler = [
  { id: 1, date: '15/05/2026', time: '14:30', type: 'STATUS', orderId: 'PO-2024-001', title: 'Cập nhật trạng thái', desc: 'Đơn hàng đã được chuyển sang trạng thái "Đang giao"', icon: Truck, color: 'text-blue-500 bg-blue-50' },
  { id: 2, date: '14/05/2026', time: '09:15', type: 'CREATE', orderId: 'PO-2024-001', title: 'Tạo đơn mới', desc: 'Admin User đã khởi tạo đơn nhập hàng trị giá ₫12.5M', icon: Plus, color: 'text-primary bg-primary/10' },
  { id: 3, date: '13/05/2026', time: '16:45', type: 'COMPLETED', orderId: 'PO-2024-002', title: 'Hoàn thành đơn hàng', desc: 'Nhập kho thành công 2 mặt hàng tại Chi nhánh Quận 3', icon: CheckCircle2, color: 'text-green-500 bg-green-50' },
  { id: 4, date: '12/05/2026', time: '10:00', type: 'PAYMENT', orderId: 'PO-2024-002', title: 'Thanh toán công nợ', desc: 'Đã xác nhận thanh toán ₫3.2M qua chuyển khoản ngân hàng', icon: CreditCard, color: 'text-amber-500 bg-amber-50' },
  { id: 5, date: '10/05/2026', time: '11:20', type: 'CANCELLED', orderId: 'PO-2024-004', title: 'Đã hủy đơn hàng', desc: 'Lý do: Thay đổi định mức nguyên liệu tuần tới', icon: XCircle, color: 'text-red-500 bg-red-50' },
];
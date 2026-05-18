// Mock data for Purchase Orders
export const MOCK_POS = [
  { 
    id: 'PO-2024-001', 
    supplier: 'Cung cấp Nguyên liệu Toàn Cầu', 
    date: '14/05/2026', 
    expectedDate: '16/05/2026', 
    total: 12500000, 
    status: 'PENDING', 
    itemsCount: 5,
    creator: 'Admin User',
    branch: 'Chi nhánh Quận 1'
  },
  { 
    id: 'PO-2024-002', 
    supplier: 'Sữa Tươi Ba Vì', 
    date: '13/05/2026', 
    expectedDate: '14/05/2026', 
    total: 3200000, 
    status: 'COMPLETED', 
    itemsCount: 2,
    creator: 'Manager A',
    branch: 'Chi nhánh Quận 3'
  },
  { 
    id: 'PO-2024-003', 
    supplier: 'Gia vị Nhà Bếp', 
    date: '12/05/2026', 
    expectedDate: '15/05/2026', 
    total: 8450000, 
    status: 'SHIPPING', 
    itemsCount: 12,
    creator: 'Admin User',
    branch: 'Tổng Kho'
  },
  { 
    id: 'PO-2024-004', 
    supplier: 'Cà phê Cầu Đất', 
    date: '10/05/2026', 
    expectedDate: '11/05/2026', 
    total: 45000000, 
    status: 'CANCELLED', 
    itemsCount: 3,
    creator: 'Manager B',
    branch: 'Chi nhánh Quận 1'
  },
];

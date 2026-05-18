import { Material } from '../../domain/entities/material.entity';

export const inventoryService = {
  getMaterials: (): Promise<Material[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          {
            id: 'm-1',
            name: 'Hạt Arabica Cầu Đất',
            sku: 'MAT-ARA-01',
            category: 'Cà phê hạt',
            currentStock: 25.5,
            minStock: 10,
            unit: 'kg',
            pricePerUnit: 400000,
            lastUpdated: '2024-05-12T08:00:00Z',
            warehouse: 'Kho tổng A',
            status: 'IN_STOCK'
          },
          {
            id: 'm-2',
            name: 'Sữa tươi Dalat Milk',
            sku: 'MAT-MILK-02',
            category: 'Sữa & Kem',
            currentStock: 12,
            minStock: 20,
            unit: 'hộp 1L',
            pricePerUnit: 35000,
            lastUpdated: '2024-05-13T09:30:00Z',
            warehouse: 'Kho lạnh B',
            status: 'LOW_STOCK'
          },
          {
            id: 'm-3',
            name: 'Bột Matcha Uji',
            sku: 'MAT-MA-03',
            category: 'Bột pha chế',
            currentStock: 0.5,
            minStock: 2,
            unit: 'kg',
            pricePerUnit: 1800000,
            lastUpdated: '2024-05-10T15:20:00Z',
            warehouse: 'Kho tổng A',
            status: 'OUT_OF_STOCK'
          },
          {
            id: 'm-4',
            name: 'Đường nước',
            sku: 'MAT-SUG-04',
            category: 'Si rô & Đường',
            currentStock: 45,
            minStock: 10,
            unit: 'lít',
            pricePerUnit: 25000,
            lastUpdated: '2024-05-12T11:00:00Z',
            warehouse: 'Kho tổng A',
            status: 'IN_STOCK'
          },
          {
            id: 'm-5',
            name: 'Ly giấy 12oz',
            sku: 'MAT-CUP-05',
            category: 'Bao bì',
            currentStock: 500,
            minStock: 1000,
            unit: 'cái',
            pricePerUnit: 1200,
            lastUpdated: '2024-05-11T14:45:00Z',
            warehouse: 'Kho vật tư',
            status: 'LOW_STOCK'
          }
        ]);
      }, 500);
    });
  },

  updateStock: (id: string, newStock: number): Promise<Material> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ id, currentStock: newStock } as Material);
      }, 800);
    });
  },

  getStockHistory: (materialId: string): Promise<any[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          {
            id: 'h-1',
            materialId,
            materialName: 'Hạt Arabica Cầu Đất',
            type: 'INCREASE',
            quantity: 50,
            reason: 'Nhập hàng từ NCC',
            timestamp: '2024-05-12T10:30:00Z',
            user: 'Admin'
          },
          {
            id: 'h-2',
            materialId,
            materialName: 'Hạt Arabica Cầu Đất',
            type: 'DECREASE',
            quantity: 15,
            reason: 'Xuất kho nội bộ',
            timestamp: '2024-05-11T14:20:00Z',
            user: 'Staff B'
          },
          {
            id: 'h-3',
            materialId,
            materialName: 'Hạt Arabica Cầu Đất',
            type: 'DECREASE',
            quantity: 5,
            reason: 'Kiểm kê định kỳ - Hao hụt',
            timestamp: '2024-05-10T09:15:00Z',
            user: 'Admin'
          }
        ]);
      }, 400);
    });
  },

  getAllStockHistory: (): Promise<any[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          {
            id: 'h-1',
            materialId: 'm-1',
            materialName: 'Hạt Arabica Cầu Đất',
            type: 'INCREASE',
            quantity: 50,
            unit: 'kg',
            reason: 'Nhập hàng từ NCC',
            timestamp: '2024-05-12T10:30:00Z',
            user: 'Admin'
          },
          {
            id: 'h-2',
            materialId: 'm-2',
            materialName: 'Sữa tươi Dalat Milk',
            type: 'DECREASE',
            quantity: 24,
            unit: 'hộp 1L',
            reason: 'Sản xuất đơn hàng #ORD-123',
            timestamp: '2024-05-12T09:15:00Z',
            user: 'Hệ thống'
          },
          {
            id: 'h-3',
            materialId: 'm-3',
            materialName: 'Matcha Uji',
            type: 'DECREASE',
            quantity: 0.2,
            unit: 'kg',
            reason: 'Kiểm kê định kỳ - Hao hụt',
            timestamp: '2024-05-11T17:00:00Z',
            user: 'Admin'
          },
          {
            id: 'h-4',
            materialId: 'm-4',
            materialName: 'Đường nước',
            type: 'INCREASE',
            quantity: 10,
            unit: 'lít',
            reason: 'Nhập hàng bổ sung',
            timestamp: '2024-05-11T11:45:00Z',
            user: 'Kho tổng'
          },
          {
             id: 'h-5',
             materialId: 'm-5',
             materialName: 'Ly giấy 12oz',
             type: 'DECREASE',
             quantity: 100,
             unit: 'cái',
             reason: 'Xuất kho cho Chi nhánh 1',
             timestamp: '2024-05-10T14:30:00Z',
             user: 'Admin'
          },
          {
            id: 'h-6',
            materialId: 'm-1',
            materialName: 'Hạt Arabica Cầu Đất',
            type: 'DECREASE',
            quantity: 12,
            unit: 'kg',
            reason: 'Sản xuất đơn hàng #ORD-120',
            timestamp: '2024-05-10T08:20:00Z',
            user: 'Hệ thống'
          }
        ]);
      }, 600);
    });
  },

  getWarehouses: (): Promise<any[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          {
            id: 'w-1',
            name: 'Kho tổng A',
            code: 'WH-A',
            type: 'GENERAL',
            location: 'Tầng móng, Khu kỹ thuật',
            manager: 'Nguyễn Văn A',
            capacity: 1000,
            currentUsage: 650,
            status: 'ACTIVE',
            lastAuditDate: '2024-05-01'
          },
          {
            id: 'w-2',
            name: 'Kho lạnh B',
            code: 'WH-B',
            type: 'COLD',
            location: 'Khu vực quầy Bar',
            manager: 'Trần Thị B',
            capacity: 200,
            currentUsage: 180,
            status: 'FULL',
            lastAuditDate: '2024-05-10'
          },
          {
            id: 'w-3',
            name: 'Kho vật tư',
            code: 'WH-C',
            type: 'SUPPLY',
            location: 'Phòng kho 2, Lầu 1',
            manager: 'Lê Văn C',
            capacity: 500,
            currentUsage: 220,
            status: 'ACTIVE',
            lastAuditDate: '2024-04-25'
          }
        ]);
      }, 500);
    });
  }
};

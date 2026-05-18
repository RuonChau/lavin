import { Material } from "@/modules/inventory/domain/entities/material.entity";

// Mock materials for selection
export const MOCK_MATERIALS: Material[] = [
  { id: 'm1', name: 'Hạt Arabica Cầu Đất', sku: 'MAT-001', currentStock: 15.5, minStock: 5, unit: 'kg', category: 'Cà phê hạt', pricePerUnit: 250000, lastUpdated: '2026-05-14', warehouse: 'Kho tổng A', status: 'IN_STOCK' },
  { id: 'm2', name: 'Sữa tươi Barista', sku: 'MAT-002', currentStock: 48, minStock: 12, unit: 'L', category: 'Sữa & Kem', pricePerUnit: 35000, lastUpdated: '2026-05-14', warehouse: 'Kho tổng A', status: 'IN_STOCK' },
  { id: 'm3', name: 'Bột Matcha Uji', sku: 'MAT-003', currentStock: 2.1, minStock: 3, unit: 'kg', category: 'Bột trà', pricePerUnit: 1200000, lastUpdated: '2026-05-14', warehouse: 'Kho tổng A', status: 'LOW_STOCK' },
  { id: 'm4', name: 'Đường nước 10L', sku: 'MAT-004', currentStock: 10, minStock: 2, unit: 'Can', category: 'Gia vị', pricePerUnit: 180000, lastUpdated: '2026-05-14', warehouse: 'Kho tổng A', status: 'IN_STOCK' },
  { id: 'm5', name: 'Syrup Vanilla', sku: 'MAT-005', currentStock: 5, minStock: 3, unit: 'Chai', category: 'Syrup', pricePerUnit: 220000, lastUpdated: '2026-05-14', warehouse: 'Kho tổng A', status: 'IN_STOCK' },
];
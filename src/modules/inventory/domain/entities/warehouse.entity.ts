export interface Warehouse {
  id: string;
  name: string;
  code: string;
  type: 'GENERAL' | 'COLD' | 'SUPPLY';
  location: string;
  manager: string;
  capacity: number;
  currentUsage: number;
  status: 'ACTIVE' | 'FULL' | 'MAINTENANCE';
  lastAuditDate: string;
}

export interface StorageLocation {
  id: string;
  warehouseId: string;
  name: string; // e.g., Aisle 1, Shelf A
  capacity: number;
  currentUsage: number;
}

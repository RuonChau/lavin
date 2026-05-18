export type StockStatus = 'IN_STOCK' | 'LOW_STOCK' | 'OUT_OF_STOCK';

export interface Material {
  id: string;
  name: string;
  sku: string;
  category: string;
  currentStock: number;
  minStock: number;
  unit: string;
  pricePerUnit: number;
  lastUpdated: string;
  warehouse: string;
  status: StockStatus;
}

export interface StockAdjustment {
  id: string;
  materialId: string;
  type: 'INCREASE' | 'DECREASE';
  quantity: number;
  reason: string;
  timestamp: string;
  user: string;
}

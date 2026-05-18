import { Formula } from '../../domain/entities/formula.entity';

export const formulaService = {
  getFormulas: (): Promise<Formula[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          {
            id: 'f-1',
            productId: 'p-1',
            productName: 'Phê La Latte',
            category: 'Cà phê',
            totalCost: 15400,
            updatedAt: '2024-05-12T10:30:00Z',
            ingredients: [
              { id: 'i-1', materialId: 'm-1', materialName: 'Hạt Arabica Cầu Đất', quantity: 18, unit: 'g', cost: 7200 },
              { id: 'i-2', materialId: 'm-2', materialName: 'Sữa tươi Dalat Milk', quantity: 150, unit: 'ml', cost: 4500 },
              { id: 'i-3', materialId: 'm-3', materialName: 'Đường nước', quantity: 20, unit: 'ml', cost: 1200 },
              { id: 'i-4', materialId: 'm-4', materialName: 'Bột béo', quantity: 10, unit: 'g', cost: 2500 },
            ]
          },
          {
            id: 'f-2',
            productId: 'p-2',
            productName: 'Espresso Arabica',
            category: 'Cà phê',
            totalCost: 8500,
            updatedAt: '2024-05-11T14:20:00Z',
            ingredients: [
              { id: 'i-5', materialId: 'm-1', materialName: 'Hạt Arabica Cầu Đất', quantity: 18, unit: 'g', cost: 7200 },
              { id: 'i-6', materialId: 'm-5', materialName: 'Nước lọc RO', quantity: 30, unit: 'ml', cost: 500 },
              { id: 'i-7', materialId: 'm-3', materialName: 'Đường nước', quantity: 10, unit: 'ml', cost: 800 },
            ]
          },
          {
            id: 'f-3',
            productId: 'p-3',
            productName: 'Matcha Latte',
            category: 'Trà & Đá xay',
            totalCost: 18200,
            updatedAt: '2024-05-13T09:15:00Z',
            ingredients: [
              { id: 'i-8', materialId: 'm-6', materialName: 'Bột Matcha Uji', quantity: 5, unit: 'g', cost: 9500 },
              { id: 'i-9', materialId: 'm-2', materialName: 'Sữa tươi Dalat Milk', quantity: 180, unit: 'ml', cost: 5400 },
              { id: 'i-10', materialId: 'm-3', materialName: 'Đường nước', quantity: 30, unit: 'ml', cost: 1800 },
              { id: 'i-11', materialId: 'm-4', materialName: 'Bột béo', quantity: 6, unit: 'g', cost: 1500 },
            ]
          }
        ]);
      }, 500);
    });
  },

  updateFormula: (id: string, data: Partial<Formula>): Promise<Formula> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ id, ...data } as Formula);
      }, 1000);
    });
  },

  createFormula: (data: Partial<Formula>): Promise<Formula> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ id: Math.random().toString(36).substr(2, 9), ...data } as Formula);
      }, 1000);
    });
  }
};

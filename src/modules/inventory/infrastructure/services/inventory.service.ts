import { Material } from '../../domain/entities/material.entity';
import { api } from '@/shared/lib/axios';

export const inventoryService = {
  getMaterials: async (): Promise<Material[]> => {
    const response = await api.get('/ingredients');
    return response.data.data;
  },

  updateStock: async (id: string, newStock: number): Promise<Material> => {
    const response = await api.post('/ingredient/stock', { id, newStock });
    return response.data.data;
  },

  createMaterial: async (data: Omit<Material, 'id' | 'lastUpdated' | 'status'>): Promise<Material> => {
    const response = await api.post('/ingredient', {
      name: data.name,
      sku: data.sku,
      category: data.category,
      unit: data.unit,
      min_stock_level: data.minStock,
      price_per_unit: data.pricePerUnit,
      warehouse: data.warehouse,
      currentStock: data.currentStock,
    });
    return response.data.data;
  },

  getStockHistory: async (materialId: string): Promise<any[]> => {
    const response = await api.get(`/ingredient/history/${materialId}`);
    return response.data.data;
  },

  getAllStockHistory: async (): Promise<any[]> => {
    const response = await api.get('/ingredient/history');
    return response.data.data;
  },

  getWarehouses: async (): Promise<any[]> => {
    const response = await api.get('/ingredient/warehouses');
    return response.data.data;
  },

  createWarehouse: async (data: any): Promise<any> => {
    const response = await api.post('/ingredient/warehouse', {
      name: data.name,
      location: data.location,
    });
    return response.data.data;
  },

  updateWarehouse: async (id: string, data: any): Promise<any> => {
    const response = await api.patch(`/ingredient/warehouse/${id}`, {
      name: data.name,
      location: data.location,
    });
    return response.data.data;
  },

  deleteWarehouse: async (id: string): Promise<any> => {
    const response = await api.delete(`/ingredient/warehouse/${id}`);
    return response.data;
  }
};

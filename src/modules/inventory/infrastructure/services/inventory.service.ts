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
    console.log("🚀 ~ response:", response)
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
  },

  getWarehouseLayout: async (warehouseId: string): Promise<any[]> => {
    const response = await api.get(`/warehouse/${warehouseId}/layout`);
    return response.data.data;
  },

  createShelf: async (data: { warehouse_id: string; name: string; code: string }): Promise<any> => {
    const response = await api.post('/warehouse/shelf', data);
    return response.data.data;
  },

  createLocation: async (data: { shelf_id: string; name: string; code: string; ingredient_id?: string; max_capacity?: number; current_quantity?: number }): Promise<any> => {
    const response = await api.post('/warehouse/location', data);
    return response.data.data;
  },

  assignIngredient: async (data: { location_id: string; ingredient_id: string | null; current_quantity: number }): Promise<any> => {
    const response = await api.post('/warehouse/location/assign', data);
    return response.data.data;
  }
};

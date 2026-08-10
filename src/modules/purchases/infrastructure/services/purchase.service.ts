import { api } from '@/shared/lib/axios';
import { unwrapData, unwrapList } from '@/shared/lib/api-response';

export interface PurchaseOrderItemInput {
  ingredient_id: string;
  quantity: number;
  unit_price: number;
}

export interface PurchaseOrderItemView {
  id: string;
  ingredientId: string;
  name: string;
  sku: string;
  unit: string;
  quantity: number;
  price: number;
}

const mapPurchaseOrderItem = (item: any): PurchaseOrderItemView => ({
  id: item.id,
  ingredientId: item.ingredient_id,
  name: item.ingredient?.name || 'Nguyên liệu',
  sku: item.ingredient?.sku || '',
  unit: item.ingredient?.unit || '',
  quantity: Number(item.quantity || 0),
  price: Number(item.unit_price || 0),
});

export const purchaseService = {
  getPurchaseOrders: async (): Promise<any[]> => {
    const response = await api.get('/purchase-orders?limit=1000');
    const orders = unwrapList<any>(response.data);

    // Map backend response to UI format
    return orders.map((po: any) => {
      const items = Array.isArray(po.items) ? po.items.map(mapPurchaseOrderItem) : [];
      return {
        id: po.po_code || `PO-${po.id.substring(0, 8).toUpperCase()}`,
        dbId: po.id, // Keep actual database ULID for API updates
        date: new Date(po.order_date).toLocaleDateString('vi-VN'),
        orderDate: po.order_date,
        supplier: po.supplier?.name || "Nhà cung cấp",
        supplierId: po.supplier_id,
        branch: po.branch?.name || "Chưa xác định",
        branch_id: po.branch_id,
        status: po.status || "PENDING",
        itemsCount: items.length,
        items,
        total: Number(po.total_value || 0),
        note: po.note || ""
      };
    });
  },

  createPurchaseOrder: async (data: { supplier_id: string; total_value: number; note?: string; branch_id: string; items?: PurchaseOrderItemInput[] }): Promise<any> => {
    if (!data.branch_id) {
      throw new Error('Vui lòng chọn kho/chi nhánh nhập hàng');
    }
    // Backend generates po_code too, but we pass a unique display code from the client.
    const randomCode = `PO-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const response = await api.post('/purchase-order', {
      po_code: randomCode,
      supplier_id: data.supplier_id,
      branch_id: data.branch_id,
      total_value: Number(data.total_value),
      status: "PENDING",
      note: data.note || "Nhập hàng tự động",
      items: data.items,
    });
    return unwrapData(response.data);
  },

  updatePurchaseOrder: async (id: string, data: { status?: string; note?: string; total_value?: number; items?: PurchaseOrderItemInput[] }): Promise<any> => {
    const response = await api.patch(`/purchase-order/${id}`, data);
    return unwrapData(response.data);
  },

  deletePurchaseOrder: async (id: string): Promise<any> => {
    const response = await api.delete(`/purchase-order/${id}`);
    return response.data;
  },

  getSuppliers: async (): Promise<any[]> => {
    const response = await api.get('/suppliers');
    return unwrapList(response.data);
  },

  getTopSuppliers: async (): Promise<any[]> => {
    const response = await api.get('/purchase-orders/top-suppliers');
    return unwrapList(response.data);
  },

  getSystemAlerts: async (): Promise<any[]> => {
    const response = await api.get('/purchase-orders/system-alerts');
    return unwrapList(response.data);
  }
};

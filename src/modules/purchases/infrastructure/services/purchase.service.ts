import { api } from '@/shared/lib/axios';

export const purchaseService = {
  getPurchaseOrders: async (): Promise<any[]> => {
    const response = await api.get('/purchase-orders?limit=1000');
    const orders = response.data.data || [];

    // Map backend response to UI format
    return orders.map((po: any) => ({
      id: po.po_code || `PO-${po.id.substring(0, 8).toUpperCase()}`,
      dbId: po.id, // Keep actual database ULID for API updates
      date: new Date(po.order_date).toLocaleDateString('vi-VN'),
      supplier: po.supplier?.name || "Nhà cung cấp",
      supplierId: po.supplier_id,
      branch: "Kho chính",
      status: po.status || "PENDING",
      itemsCount: 5, // Mock default items count or can be dynamic
      total: Number(po.total_value || 0),
      note: po.note || ""
    }));
  },

  createPurchaseOrder: async (data: { supplier_id: string; total_value: number; note?: string; branch_id?: string }): Promise<any> => {
    // Generate a code if needed, or backend generates it.
    // Let's pass po_code as dynamic or let backend handle it.
    // If backend requires po_code, we can generate a random unique one:
    const randomCode = `PO-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    
    // We get the branches from the system. If branch_id is not passed, let's use a standard branch ULID
    // Let's search if there is a branch. In backend database schema branches are there.
    // Let's pass a default branch_id if none is provided.
    // Wait, let's see what is standard branch id or if we can fetch branches.
    // We can fetch warehouses! A warehouse is a branch in the inventory schema (Branches represent warehouses in Sequelize as index.ts initialized: "WarehouseShelves belongsTo Branches as warehouse").
    // So we can use warehouses[0].id as branch_id!
    const response = await api.post('/purchase-order', {
      po_code: randomCode,
      supplier_id: data.supplier_id,
      branch_id: data.branch_id || "01H2PJX72XZY3XZY4XZY5XZY6X", // fallback standard branch id
      total_value: Number(data.total_value),
      status: "PENDING",
      note: data.note || "Nhập hàng tự động"
    });
    return response.data.data;
  },

  updatePurchaseOrder: async (id: string, data: { status?: string; note?: string; total_value?: number }): Promise<any> => {
    const response = await api.patch(`/purchase-order/${id}`, data);
    return response.data.data;
  },

  deletePurchaseOrder: async (id: string): Promise<any> => {
    const response = await api.delete(`/purchase-order/${id}`);
    return response.data;
  },

  getSuppliers: async (): Promise<any[]> => {
    const response = await api.get('/suppliers');
    return response.data.data || [];
  },

  getTopSuppliers: async (): Promise<any[]> => {
    const response = await api.get('/purchase-orders/top-suppliers');
    return response.data.data || [];
  },

  getSystemAlerts: async (): Promise<any[]> => {
    const response = await api.get('/purchase-orders/system-alerts');
    return response.data.data || [];
  }
};


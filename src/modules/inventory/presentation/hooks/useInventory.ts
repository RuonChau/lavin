import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { inventoryService } from '../../infrastructure/services/inventory.service';
import { Material } from '../../domain/entities/material.entity';

export const useInventory = () => {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['inventory'],
    queryFn: () => inventoryService.getMaterials(),
  });

  const updateStockMutation = useMutation({
    mutationFn: ({ id, newStock }: { id: string; newStock: number }) =>
      inventoryService.updateStock(id, newStock),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
    },
  });

  const createMaterialMutation = useMutation({
    mutationFn: (data: Omit<Material, 'id' | 'lastUpdated' | 'status'>) =>
      inventoryService.createMaterial(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
    },
  });

  return {
    materials: data || [],
    isLoading,
    updateStock: updateStockMutation.mutateAsync,
    isUpdating: updateStockMutation.isPending,
    createMaterial: createMaterialMutation.mutateAsync,
    isCreating: createMaterialMutation.isPending,
  };
};

export const useMaterialHistory = (materialId: string | null) => {
  return useQuery({
    queryKey: ['inventory-history', materialId],
    queryFn: () => materialId ? inventoryService.getStockHistory(materialId) : Promise.resolve([]),
    enabled: !!materialId,
  });
};

export const useAllInventoryHistory = () => {
  return useQuery({
    queryKey: ['inventory-history-all'],
    queryFn: () => inventoryService.getAllStockHistory(),
  });
};

export const useWarehouses = () => {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['warehouses'],
    queryFn: () => inventoryService.getWarehouses(),
  });

  const createWarehouseMutation = useMutation({
    mutationFn: (data: any) => inventoryService.createWarehouse(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['warehouses'] });
    },
  });

  const updateWarehouseMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      inventoryService.updateWarehouse(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['warehouses'] });
    },
  });

  const deleteWarehouseMutation = useMutation({
    mutationFn: (id: string) => inventoryService.deleteWarehouse(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['warehouses'] });
    },
  });

  return {
    warehouses: query.data || [],
    isLoading: query.isLoading,
    createWarehouse: createWarehouseMutation.mutateAsync,
    isCreating: createWarehouseMutation.isPending,
    updateWarehouse: updateWarehouseMutation.mutateAsync,
    isUpdating: updateWarehouseMutation.isPending,
    deleteWarehouse: deleteWarehouseMutation.mutateAsync,
    isDeleting: deleteWarehouseMutation.isPending,
  };
};

export const useWarehouseLayout = (warehouseId: string | null) => {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['warehouse-layout', warehouseId],
    queryFn: () => warehouseId ? inventoryService.getWarehouseLayout(warehouseId) : Promise.resolve([]),
    enabled: !!warehouseId,
  });

  const createShelfMutation = useMutation({
    mutationFn: (data: { warehouse_id: string; name: string; code: string }) =>
      inventoryService.createShelf(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['warehouse-layout', warehouseId] });
    },
  });

  const createLocationMutation = useMutation({
    mutationFn: (data: { shelf_id: string; name: string; code: string; ingredient_id?: string; max_capacity?: number; current_quantity?: number }) =>
      inventoryService.createLocation(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['warehouse-layout', warehouseId] });
    },
  });

  const assignIngredientMutation = useMutation({
    mutationFn: (data: { location_id: string; ingredient_id: string | null; current_quantity: number }) =>
      inventoryService.assignIngredient(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['warehouse-layout', warehouseId] });
    },
  });

  return {
    layout: query.data || [],
    isLoading: query.isLoading,
    createShelf: createShelfMutation.mutateAsync,
    isCreatingShelf: createShelfMutation.isPending,
    createLocation: createLocationMutation.mutateAsync,
    isCreatingLocation: createLocationMutation.isPending,
    assignIngredient: assignIngredientMutation.mutateAsync,
    isAssigning: assignIngredientMutation.isPending,
  };
};

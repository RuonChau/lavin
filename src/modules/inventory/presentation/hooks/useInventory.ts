import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { inventoryService } from '../../infrastructure/services/inventory.service';

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

  return {
    materials: data || [],
    isLoading,
    updateStock: updateStockMutation.mutateAsync,
    isUpdating: updateStockMutation.isPending,
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
  return useQuery({
    queryKey: ['warehouses'],
    queryFn: () => inventoryService.getWarehouses(),
  });
};

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { purchaseService, PurchaseOrderItemInput } from '../../infrastructure/services/purchase.service';

export const usePurchases = () => {
  const queryClient = useQueryClient();

  const { data: purchaseOrders, isLoading, refetch } = useQuery({
    queryKey: ['purchase-orders'],
    queryFn: () => purchaseService.getPurchaseOrders(),
  });

  const { data: suppliers, isLoading: isLoadingSuppliers } = useQuery({
    queryKey: ['suppliers'],
    queryFn: () => purchaseService.getSuppliers(),
  });

  const { data: topSuppliers, isLoading: isLoadingTopSuppliers } = useQuery({
    queryKey: ['top-suppliers'],
    queryFn: () => purchaseService.getTopSuppliers(),
  });

  const { data: systemAlerts, isLoading: isLoadingSystemAlerts } = useQuery({
    queryKey: ['system-alerts'],
    queryFn: () => purchaseService.getSystemAlerts(),
  });

  const createPOMutation = useMutation({
    mutationFn: (data: { supplier_id: string; total_value: number; note?: string; branch_id: string; items?: PurchaseOrderItemInput[] }) =>
      purchaseService.createPurchaseOrder(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['purchase-orders'] });
      queryClient.invalidateQueries({ queryKey: ['top-suppliers'] });
      queryClient.invalidateQueries({ queryKey: ['system-alerts'] });
    },
  });

  const updatePOMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: { status?: string; note?: string; total_value?: number; items?: PurchaseOrderItemInput[] } }) =>
      purchaseService.updatePurchaseOrder(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['purchase-orders'] });
      queryClient.invalidateQueries({ queryKey: ['top-suppliers'] });
      queryClient.invalidateQueries({ queryKey: ['system-alerts'] });
    },
  });

  const deletePOMutation = useMutation({
    mutationFn: (id: string) => purchaseService.deletePurchaseOrder(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['purchase-orders'] });
      queryClient.invalidateQueries({ queryKey: ['top-suppliers'] });
      queryClient.invalidateQueries({ queryKey: ['system-alerts'] });
    },
  });

  return {
    purchaseOrders: purchaseOrders || [],
    isLoading,
    refreshPurchaseOrders: refetch,
    
    suppliers: suppliers || [],
    isLoadingSuppliers,

    topSuppliers: topSuppliers || [],
    isLoadingTopSuppliers,

    systemAlerts: systemAlerts || [],
    isLoadingSystemAlerts,

    createPurchaseOrder: createPOMutation.mutateAsync,
    isCreating: createPOMutation.isPending,

    updatePurchaseOrder: updatePOMutation.mutateAsync,
    isUpdating: updatePOMutation.isPending,

    deletePurchaseOrder: deletePOMutation.mutateAsync,
    isDeleting: deletePOMutation.isPending
  };
};

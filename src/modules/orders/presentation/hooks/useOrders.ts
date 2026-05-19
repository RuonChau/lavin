import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { orderService, OrderStatusInput } from '../../infrastructure/services/order.service';

export function useOrders() {
  const queryClient = useQueryClient();

  const ordersQuery = useQuery({
    queryKey: ['orders'],
    queryFn: () => orderService.getOrders({ page: 1, limit: 100 }),
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: OrderStatusInput }) =>
      orderService.updateOrderStatus(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });

  const cancelOrderMutation = useMutation({
    mutationFn: (id: string) => orderService.cancelOrder(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });

  return {
    orders: ordersQuery.data ?? [],
    isLoading: ordersQuery.isLoading,
    isMutating: updateStatusMutation.isPending || cancelOrderMutation.isPending,
    refreshOrders: ordersQuery.refetch,
    updateOrderStatus: updateStatusMutation.mutateAsync,
    cancelOrder: cancelOrderMutation.mutateAsync,
  };
}

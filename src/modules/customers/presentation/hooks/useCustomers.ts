import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { customerService, CustomerInput } from '@/modules/customers/infrastructure/services/customer.service';

export const useCustomers = (page = 1, limit = 10) => {
  const queryClient = useQueryClient();

  // Fetch paginated customer list
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['customers-list', page, limit],
    queryFn: () => customerService.getCustomers({ page, limit }),
    staleTime: 1000 * 60 * 5, // 5 minutes stale time
  });

  // Mutation for creating a new customer
  const createMutation = useMutation({
    mutationFn: (data: CustomerInput) => customerService.createCustomer(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers-list'] });
    },
  });

  // Mutation for updating an existing customer
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: CustomerInput }) =>
      customerService.updateCustomer(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers-list'] });
    },
  });

  // Mutation for deleting a customer
  const deleteMutation = useMutation({
    mutationFn: (id: string) => customerService.deleteCustomer(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers-list'] });
    },
  });

  const customers = data?.data || [];
  const total = data?.total || 0;

  return {
    customers,
    total,
    isLoading,
    refetch,

    // Mutations
    createCustomer: createMutation.mutateAsync,
    isCreating: createMutation.isPending,

    updateCustomer: updateMutation.mutateAsync,
    isUpdating: updateMutation.isPending,

    deleteCustomer: deleteMutation.mutateAsync,
    isDeleting: deleteMutation.isPending,
  };
};

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { customerTierService, CustomerTierInput } from '@/modules/customers/infrastructure/services/customer-tier.service';

export const useCustomerTiers = () => {
  const queryClient = useQueryClient();

  const { data: tiers, isLoading, refetch } = useQuery({
    queryKey: ['customer-tiers'],
    queryFn: () => customerTierService.getTiers(),
  });

  const createMutation = useMutation({
    mutationFn: (data: CustomerTierInput) => customerTierService.createTier(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customer-tiers'] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CustomerTierInput> }) =>
      customerTierService.updateTier(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customer-tiers'] });
      queryClient.invalidateQueries({ queryKey: ['customers-list'] });
    },
  });

  return {
    tiers: tiers ?? [],
    isLoading,
    refetch,

    createTier: createMutation.mutateAsync,
    isCreating: createMutation.isPending,

    updateTier: updateMutation.mutateAsync,
    isUpdating: updateMutation.isPending,
  };
};

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { timekeepingService, TimekeepingInput } from '@/modules/employees/infrastructure/services/timekeeping.service';

export const useTimekeeping = () => {
  const queryClient = useQueryClient();

  const { data: timekeepings, isLoading, refetch } = useQuery({
    queryKey: ['timekeepings'],
    queryFn: () => timekeepingService.getTimekeepings({ limit: 500 }),
  });

  const createMutation = useMutation({
    mutationFn: (data: TimekeepingInput) => timekeepingService.createTimekeeping(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['timekeepings'] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<TimekeepingInput> }) =>
      timekeepingService.updateTimekeeping(id, data as TimekeepingInput),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['timekeepings'] });
    },
  });

  return {
    timekeepings: timekeepings ?? [],
    isLoading,
    refetch,

    createTimekeeping: createMutation.mutateAsync,
    isCreating: createMutation.isPending,

    updateTimekeeping: updateMutation.mutateAsync,
    isUpdating: updateMutation.isPending,
  };
};

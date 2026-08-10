import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { shiftService, ShiftInput } from '@/modules/employees/infrastructure/services/shift.service';

export const useShifts = () => {
  const queryClient = useQueryClient();

  const { data: shifts, isLoading, refetch } = useQuery({
    queryKey: ['shifts'],
    queryFn: () => shiftService.getShifts(),
  });

  const createMutation = useMutation({
    mutationFn: (data: ShiftInput) => shiftService.createShift(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shifts'] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: ShiftInput }) => shiftService.updateShift(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shifts'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => shiftService.deleteShift(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shifts'] });
    },
  });

  return {
    shifts: shifts ?? [],
    isLoading,
    refetch,

    createShift: createMutation.mutateAsync,
    isCreating: createMutation.isPending,

    updateShift: updateMutation.mutateAsync,
    isUpdating: updateMutation.isPending,

    deleteShift: deleteMutation.mutateAsync,
    isDeleting: deleteMutation.isPending,
  };
};

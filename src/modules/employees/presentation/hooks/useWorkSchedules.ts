import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { workScheduleService, WorkScheduleInput } from '@/modules/employees/infrastructure/services/work-schedule.service';

export const useWorkSchedules = () => {
  const queryClient = useQueryClient();

  const { data: workSchedules, isLoading, refetch } = useQuery({
    queryKey: ['work-schedules'],
    queryFn: () => workScheduleService.getWorkSchedules({ limit: 1000 }),
  });

  const createMutation = useMutation({
    mutationFn: (data: WorkScheduleInput) => workScheduleService.createWorkSchedule(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['work-schedules'] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: WorkScheduleInput }) => workScheduleService.updateWorkSchedule(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['work-schedules'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => workScheduleService.deleteWorkSchedule(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['work-schedules'] });
    },
  });

  return {
    workSchedules: workSchedules ?? [],
    isLoading,
    refetch,

    createWorkSchedule: createMutation.mutateAsync,
    isCreating: createMutation.isPending,

    updateWorkSchedule: updateMutation.mutateAsync,
    isUpdating: updateMutation.isPending,

    deleteWorkSchedule: deleteMutation.mutateAsync,
    isDeleting: deleteMutation.isPending,
  };
};

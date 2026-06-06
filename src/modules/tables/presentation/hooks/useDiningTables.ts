'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { diningTableService } from '@/modules/tables/infrastructure/services/dining-table.service';
import type {
  DiningTablePayload,
  DiningTableStatus,
} from '@/modules/tables/domain/entities/dining-table.entity';

export const diningTableQueryKey = ['pos-dining-tables'];

export function useDiningTables() {
  const queryClient = useQueryClient();

  const tablesQuery = useQuery({
    queryKey: diningTableQueryKey,
    queryFn: () => diningTableService.getTables(),
    refetchInterval: 2000,
    refetchIntervalInBackground: true,
    staleTime: 1000,
    retry: false,
  });

  const createMutation = useMutation({
    mutationFn: (data: DiningTablePayload) => diningTableService.createTable(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: diningTableQueryKey }),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<DiningTablePayload> }) =>
      diningTableService.updateTable(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: diningTableQueryKey }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => diningTableService.deleteTable(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: diningTableQueryKey }),
  });

  const updateStatus = (id: string, status: DiningTableStatus) =>
    updateMutation.mutateAsync({ id, data: { status } });

  return {
    tables: tablesQuery.data ?? [],
    error: tablesQuery.error,
    isLoading: tablesQuery.isLoading,
    isRefetching: tablesQuery.isRefetching,
    refetch: tablesQuery.refetch,
    createTable: createMutation.mutateAsync,
    isCreating: createMutation.isPending,
    updateTable: updateMutation.mutateAsync,
    updateStatus,
    isUpdating: updateMutation.isPending,
    deleteTable: deleteMutation.mutateAsync,
    isDeleting: deleteMutation.isPending,
  };
}

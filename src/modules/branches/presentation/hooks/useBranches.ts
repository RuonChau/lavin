import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { branchService } from '@/modules/branches/infrastructure/services/branch.service';
import { Branch } from '@/modules/branches/domain/entities/branch.entity';

export const useBranches = () => {
  const queryClient = useQueryClient();

  // Danh sách chi nhánh từ API
  const { data: branches = [], isLoading, refetch } = useQuery({
    queryKey: ['branches-list'],
    queryFn: () => branchService.getBranches(),
    staleTime: 1000 * 60 * 5, // 5 minutes stale time
  });

  // Mutation tạo chi nhánh
  const createMutation = useMutation({
    mutationFn: (data: { name: string; address: string; phone: string; is_active: boolean; is_warehouse?: boolean; is_headquarter?: boolean }) =>
      branchService.createBranch(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['branches-list'] });
    },
  });

  // Mutation cập nhật chi nhánh
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: { name: string; address: string; phone: string; is_active: boolean; is_warehouse?: boolean; is_headquarter?: boolean } }) =>
      branchService.updateBranch(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['branches-list'] });
    },
  });

  // Mutation xóa chi nhánh
  const deleteMutation = useMutation({
    mutationFn: (id: string) => branchService.deleteBranch(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['branches-list'] });
    },
  });

  return {
    branches,
    isLoading,
    refetch,

    // Mutations
    createBranch: createMutation.mutateAsync,
    isCreating: createMutation.isPending,

    updateBranch: updateMutation.mutateAsync,
    isUpdating: updateMutation.isPending,

    deleteBranch: deleteMutation.mutateAsync,
    isDeleting: deleteMutation.isPending,
  };
};

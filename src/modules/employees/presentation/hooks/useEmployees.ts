import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { employeeService, EmployeeUpdateInput } from '@/modules/employees/infrastructure/services/employee.service';
import { mapEmployeeToDisplay } from '@/modules/employees/application/interfaces/employee.interfaces';
import { userService, UserItem } from '@/modules/users/infrastructure/services/user.service';
import { branchService } from '@/modules/branches/infrastructure/services/branch.service';

export const useEmployees = (page = 1, limit = 10) => {
  const queryClient = useQueryClient();

  // Danh sách nhân viên từ API
  const { data: employeeResponse, isLoading, refetch } = useQuery({
    queryKey: ['employees', page, limit],
    queryFn: () => employeeService.getAll(page, limit),
  });

  // Danh sách users để dùng cho dropdown chọn khi tạo nhân viên mới
  const { data: usersRaw, isLoading: isLoadingUsers } = useQuery({
    queryKey: ['users-list'],
    queryFn: () => userService.getUsers({ limit: 200 }),
    staleTime: 1000 * 60 * 5,
  });

  // Danh sách chi nhánh để chọn khi tạo nhân viên mới
  const { data: branchesRaw, isLoading: isLoadingBranches } = useQuery({
    queryKey: ['branches-list'],
    queryFn: () => branchService.getBranches({ limit: 200 }),
    staleTime: 1000 * 60 * 5,
  });

  // Map server data → display format
  const employees = (employeeResponse?.data ?? []).map(mapEmployeeToDisplay);
  const total = employeeResponse?.total ?? 0;

  // Mutation tạo nhân viên
  const createMutation = useMutation({
    mutationFn: (data: { user_id?: string; full_name?: string; position: string; base_salary: number; hire_date: string; phone?: string; branch_id?: string }) =>
      employeeService.createEmployee(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
    },
  });

  // Mutation cập nhật nhân viên
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: EmployeeUpdateInput }) =>
      employeeService.updateEmployee(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
    },
  });

  // Mutation xóa nhân viên
  const deleteMutation = useMutation({
    mutationFn: (id: string) => employeeService.deleteEmployee(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
    },
  });

  return {
    employees,
    rawEmployees: employeeResponse?.data ?? [],
    total,
    isLoading,
    refetch,

    // Users for dropdown - đã là UserItem[]
    users: (usersRaw ?? []) as UserItem[],
    isLoadingUsers,

    // Branches for dropdown
    branches: branchesRaw ?? [],
    isLoadingBranches,

    // Mutations
    createEmployee: createMutation.mutateAsync,
    isCreating: createMutation.isPending,

    updateEmployee: updateMutation.mutateAsync,
    isUpdating: updateMutation.isPending,

    deleteEmployee: deleteMutation.mutateAsync,
    isDeleting: deleteMutation.isPending,
  };
};


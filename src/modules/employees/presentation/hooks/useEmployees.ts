import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { employeeService } from '@/modules/employees/infrastructure/services/employee.service';
import { mapEmployeeToDisplay } from '@/modules/employees/application/interfaces/employee.interfaces';
import { userService, UserItem } from '@/modules/users/infrastructure/services/user.service';

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

  // Map server data → display format
  const employees = (employeeResponse?.data ?? []).map(mapEmployeeToDisplay);
  const total = employeeResponse?.total ?? 0;

  // Mutation tạo nhân viên
  const createMutation = useMutation({
    mutationFn: (data: { user_id: string; position: string; base_salary: number; hire_date: string }) =>
      employeeService.createEmployee(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
    },
  });

  // Mutation cập nhật nhân viên
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: { position?: string; base_salary?: number; hire_date?: string } }) =>
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
    total,
    isLoading,
    refetch,

    // Users for dropdown - đã là UserItem[]
    users: (usersRaw ?? []) as UserItem[],
    isLoadingUsers,

    // Mutations
    createEmployee: createMutation.mutateAsync,
    isCreating: createMutation.isPending,

    updateEmployee: updateMutation.mutateAsync,
    isUpdating: updateMutation.isPending,

    deleteEmployee: deleteMutation.mutateAsync,
    isDeleting: deleteMutation.isPending,
  };
};


import { userService } from '@/modules/users/infrastructure/services/user.service';
import { employeeService } from '@/modules/employees/infrastructure/services/employee.service';

/**
 * Tìm các chi nhánh nhân sự đang quản lý khi `/me` không trả về chi nhánh.
 * Tài khoản tạo tự động từ hồ sơ nhân viên thường chỉ gắn chi nhánh ở hồ sơ nhân viên,
 * nên lần lượt thử: tài khoản (`/user/:id`) → hồ sơ nhân viên liên kết với tài khoản.
 */
export const managedBranchService = {
  getManagedBranchIds: async (userId: string): Promise<string[]> => {
    const ids = new Set<string>();
    const add = (...values: Array<string | null | undefined>) => {
      values.forEach((value) => { if (value) ids.add(value); });
    };

    const detail = await userService.getUserDetail(userId);
    add(detail?.branch_id, detail?.branch?.id);
    if (ids.size) return [...ids];

    try {
      const { data: employees } = await employeeService.getAll(1, 500);
      employees
        .filter((employee) => employee.user_id === userId || employee.user?.id === userId)
        .forEach((employee) => add(
          employee.branch_id,
          employee.branch?.id,
          employee.user?.branch_id,
          employee.user?.branch?.id,
        ));
    } catch {
      // Không có quyền xem danh sách nhân viên → coi như chưa xác định được chi nhánh
    }

    return [...ids];
  },
};

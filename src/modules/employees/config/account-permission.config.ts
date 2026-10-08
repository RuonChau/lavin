const STAFF_ROLES = ['BARISTA', 'SERVER', 'CASHIER'];
const STORE_SUBORDINATES = [...STAFF_ROLES, 'SHIFT_LEADER'];
const AREA_SUBORDINATES = [...STORE_SUBORDINATES, 'STORE_MANAGER'];
const ADMIN_SUBORDINATES = [...AREA_SUBORDINATES, 'AREA_MANAGER', 'ACCOUNTANT', 'PURCHASING'];

/** Chức vụ cấp dưới mà mỗi vai trò được tạo tài khoản / reset mật khẩu (khớp với server) */
export const ACCOUNT_MANAGEABLE_ROLES: Record<string, string[]> = {
  SHIFT_LEADER: STAFF_ROLES,
  STORE_MANAGER: STORE_SUBORDINATES,
  AREA_MANAGER: AREA_SUBORDINATES,
  ADMIN: ADMIN_SUBORDINATES,
  OWNER: [...ADMIN_SUBORDINATES, 'ADMIN'],
};

const toRoleKey = (role?: string | null) => String(role ?? '').trim().toUpperCase().replace(/[\s-]+/g, '_');

export const canManageAccountOf = (actorRole?: string | null, targetRole?: string | null) =>
  (ACCOUNT_MANAGEABLE_ROLES[toRoleKey(actorRole)] ?? []).includes(toRoleKey(targetRole));

/** Vai trò có quyền quản lý tài khoản nhân viên (dù chỉ một phần) */
export const canManageEmployeeAccounts = (actorRole?: string | null) =>
  Boolean(ACCOUNT_MANAGEABLE_ROLES[toRoleKey(actorRole)]);

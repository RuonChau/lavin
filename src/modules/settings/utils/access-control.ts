import {
  PermissionActions,
  PermissionKeys,
  type TDataScope,
  type TPermissionAction,
  type TPermissionValues,
} from '@/modules/settings/domain/enum/permission-key.enum';
import type {
  IRolePermission as RolePermission,
  TCrudPermission,
  TRolePermissionMatrix,
} from '@/modules/settings/types/role-permission.type';
import { defaultRolePermissions } from '@/modules/settings/mocks/default-role-permissions.mock';
import { EUserRole } from '@/shared/constants/roles';

export type RoutePermission = TPermissionValues;

export const routePermissionMap: Array<{ prefix: string; permission: RoutePermission }> = [
  { prefix: '/settings', permission: 'settings' },
  { prefix: '/reports', permission: 'reports' },
  { prefix: '/promotions', permission: 'promotions' },
  { prefix: '/employees', permission: 'employees' },
  { prefix: '/users', permission: 'employees' },
  { prefix: '/orders', permission: 'orders' },
  { prefix: '/customers', permission: 'customers' },
  { prefix: '/products', permission: 'products' },
  { prefix: '/formulas', permission: 'formulas' },
  { prefix: '/inventory', permission: 'inventory' },
  { prefix: '/purchases', permission: 'purchases' },
  { prefix: '/branches', permission: 'branches' },
  { prefix: '/tables', permission: 'tables' },
  { prefix: '/', permission: 'dashboard' },
];

/** Thứ tự ưu tiên khi chuyển hướng tới trang đầu tiên được phép */
export const permissionHomePath: Record<RoutePermission, string> = {
  dashboard: '/',
  orders: '/orders',
  products: '/products',
  tables: '/tables',
  employees: '/employees',
  promotions: '/promotions',
  customers: '/customers',
  formulas: '/formulas',
  inventory: '/inventory',
  purchases: '/purchases',
  branches: '/branches',
  reports: '/reports',
  settings: '/settings',
};

const toRoleSlug = (value: string) => value
  .trim()
  .replace(/([a-z])([A-Z])/g, '$1-$2')
  .replace(/[_\s]+/g, '-')
  .toLowerCase();

/** Server có thể trả về key (`SHIFT_LEADER`) hoặc nhãn tiếng Việt (`Quản lý ca`) */
const roleLabelMap: Record<string, string> = Object.fromEntries(
  Object.entries(EUserRole).map(([key, label]) => [toRoleSlug(label), toRoleSlug(key)]),
);

const roleFallbackMap: Record<string, string> = {
  barista: 'staff',
  server: 'staff',
};

const fullPermissions = defaultRolePermissions.find((item) => item.key === 'owner')!.permissions;
const staffRole = defaultRolePermissions.find((item) => item.key === 'staff')!;

export const normalizeRoleKey = (role?: EUserRole | string | null) => {
  const slug = toRoleSlug(String(role ?? ''));
  const roleKey = roleLabelMap[slug] ?? slug;
  return roleFallbackMap[roleKey] ?? roleKey;
};

const emptyCrud = (): TCrudPermission => ({ view: false, create: false, update: false, delete: false });

/** Quyền cũ chỉ là boolean theo nhóm trang — dùng để nhận diện dữ liệu chưa chuyển đổi */
const isCrudMatrix = (permissions: unknown): permissions is Partial<TRolePermissionMatrix> =>
  Boolean(permissions)
  && typeof permissions === 'object'
  && Object.values(permissions as object).every((value) => value && typeof value === 'object');

/** Trang mới tách ra từ nhóm quyền cũ */
const legacyPermissionGroups: Partial<Record<TPermissionValues, string>> = {
  customers: 'orders',
  formulas: 'products',
  inventory: 'products',
  purchases: 'products',
  branches: 'reports',
  tables: 'reports',
};

const normalizeCrud = (value: Partial<TCrudPermission> | undefined): TCrudPermission => {
  const next = emptyCrud();
  PermissionActions.forEach((action) => {
    next[action] = Boolean(value?.[action]);
  });
  // Không xem được trang thì cũng không thao tác được
  if (!next.view) return emptyCrud();
  return next;
};

/**
 * Chuẩn hóa danh sách role từ server về dạng CRUD theo từng trang.
 * - Role mặc định lưu ở định dạng cũ (boolean) → dùng ma trận mặc định mới.
 * - Role tự tạo ở định dạng cũ → true = toàn quyền CRUD trên trang đó.
 */
export const normalizeRolePermissions = (roles?: Array<Partial<RolePermission>> | null): RolePermission[] => {
  if (!roles?.length) return defaultRolePermissions.map(cloneRole);

  return roles.map((role) => {
    const key = String(role.key ?? '');
    const fallback = defaultRolePermissions.find((item) => item.key === key);
    const raw = role.permissions as unknown;

    if (!isCrudMatrix(raw)) {
      if (fallback) return cloneRole(fallback);

      const legacy = (raw ?? {}) as Record<string, boolean>;
      const permissions = PermissionKeys.reduce((acc, page) => {
        const enabled = Boolean(legacy[page] ?? legacy[legacyPermissionGroups[page] ?? '']);
        acc[page] = enabled ? { view: true, create: true, update: true, delete: true } : emptyCrud();
        return acc;
      }, {} as TRolePermissionMatrix);

      return {
        key,
        role: role.role ?? key,
        description: role.description ?? '',
        dataScope: role.dataScope ?? 'all',
        permissions,
      };
    }

    const permissions = PermissionKeys.reduce((acc, page) => {
      acc[page] = normalizeCrud(raw[page] ?? fallback?.permissions[page]);
      return acc;
    }, {} as TRolePermissionMatrix);

    return {
      key,
      role: role.role ?? fallback?.role ?? key,
      description: role.description ?? fallback?.description ?? '',
      dataScope: role.dataScope ?? fallback?.dataScope ?? 'all',
      permissions,
    };
  });
};

export const cloneRole = (role: RolePermission): RolePermission => ({
  ...role,
  permissions: PermissionKeys.reduce((acc, page) => {
    acc[page] = { ...role.permissions[page] };
    return acc;
  }, {} as TRolePermissionMatrix),
});

const findRole = (role: EUserRole | string | null | undefined, roles: RolePermission[]) => {
  const roleKey = normalizeRoleKey(role);

  return roles.find((item) => item.key === roleKey)
    ?? roles.find((item) => toRoleSlug(item.role) === roleKey)
    ?? defaultRolePermissions.find((item) => item.key === roleKey)
    ?? staffRole;
};

export const getPermissionsForRole = (
  role?: EUserRole | string | null,
  roles: RolePermission[] = defaultRolePermissions,
): TRolePermissionMatrix => {
  const roleKey = normalizeRoleKey(role);
  if (roleKey === 'admin' || roleKey === 'owner') return fullPermissions;
  return findRole(role, roles).permissions;
};

export const getDataScopeForRole = (
  role?: EUserRole | string | null,
  roles: RolePermission[] = defaultRolePermissions,
): TDataScope => {
  const roleKey = normalizeRoleKey(role);
  if (roleKey === 'admin' || roleKey === 'owner') return 'all';
  return findRole(role, roles).dataScope;
};

/** Ở mọi chỗ khác trong file này, admin/owner đều được bỏ qua kiểm tra
 * quyền (có toàn quyền) — tái sử dụng chính ranh giới đó để chặn các thao tác
 * nhạy cảm trên từng dòng (xem lương, xóa vĩnh viễn) vốn không được
 * mô hình hóa thành một permission key riêng. */
export const isManagerRole = (role?: EUserRole | string | null) => {
  const roleKey = normalizeRoleKey(role);
  return roleKey === 'admin' || roleKey === 'owner';
};

export const getPermissionForPath = (pathname: string) => {
  const normalizedPath = pathname || '/';
  const match = routePermissionMap.find(({ prefix }) => (
    prefix === '/'
      ? normalizedPath === '/'
      : normalizedPath === prefix || normalizedPath.startsWith(`${prefix}/`)
  ));

  return match?.permission ?? 'dashboard';
};

export const hasPermission = (
  permissions: TRolePermissionMatrix,
  page: RoutePermission,
  action: TPermissionAction = 'view',
) => Boolean(permissions[page]?.view && permissions[page]?.[action]);

export const canAccessPath = (
  pathname: string,
  permissions: TRolePermissionMatrix,
) => hasPermission(permissions, getPermissionForPath(pathname));

export const getFirstAllowedPath = (permissions: TRolePermissionMatrix) => {
  const firstPermission = (Object.keys(permissionHomePath) as RoutePermission[])
    .find((permission) => hasPermission(permissions, permission));
  return firstPermission ? permissionHomePath[firstPermission] : '/login';
};

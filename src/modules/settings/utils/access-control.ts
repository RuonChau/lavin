import type { EUserRole } from '@/modules/auth/domain/types/user.type';
import type { TPermissionValues } from '@/modules/settings/domain/enum/permission-key.enum';
import type { IRolePermission as RolePermission } from '@/modules/settings/types/role-permission.type';
import { defaultRolePermissions } from '@/modules/settings/mocks/default-role-permissions.mock';

export type RoutePermission = TPermissionValues;

export const routePermissionMap: Array<{ prefix: string; permission: RoutePermission }> = [
  { prefix: '/settings', permission: 'settings' },
  { prefix: '/reports', permission: 'reports' },
  { prefix: '/promotions', permission: 'promotions' },
  { prefix: '/employees', permission: 'employees' },
  { prefix: '/users', permission: 'employees' },
  { prefix: '/orders', permission: 'orders' },
  { prefix: '/customers', permission: 'orders' },
  { prefix: '/products', permission: 'products' },
  { prefix: '/formulas', permission: 'products' },
  { prefix: '/inventory', permission: 'products' },
  { prefix: '/purchases', permission: 'products' },
  { prefix: '/branches', permission: 'reports' },
  { prefix: '/', permission: 'dashboard' },
];

export const permissionHomePath: Record<RoutePermission, string> = {
  dashboard: '/',
  products: '/products',
  orders: '/orders',
  promotions: '/promotions',
  reports: '/reports',
  employees: '/employees',
  settings: '/settings',
};

const roleFallbackMap: Record<string, string> = {
  barista: 'staff',
  server: 'staff',
  'shift-leader': 'staff',
  shift_leader: 'staff',
  shiftleader: 'staff',
};

const fullPermissions = defaultRolePermissions.find((item) => item.key === 'owner')!.permissions;

export const normalizeRoleKey = (role?: EUserRole | string | null) => {
  const rawRole = String(role ?? '').trim();
  const normalized = rawRole
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/_/g, '-')
    .replace(/\s+/g, '-')
    .toLowerCase();

  return roleFallbackMap[normalized.replace(/-/g, '_')] ?? roleFallbackMap[normalized] ?? normalized;
};

export const getPermissionsForRole = (
  role?: EUserRole | string | null,
  roles: RolePermission[] = defaultRolePermissions,
) => {
  const roleKey = normalizeRoleKey(role);

  if (roleKey === 'admin' || roleKey === 'owner') {
    return fullPermissions;
  }

  const rolePermission = roles.find((item) => item.key === roleKey)
    ?? roles.find((item) => item.role.toLowerCase().replace(/\s+/g, '-') === roleKey)
    ?? defaultRolePermissions.find((item) => item.key === roleKey)
    ?? defaultRolePermissions.find((item) => item.key === 'staff');

  return rolePermission?.permissions ?? defaultRolePermissions.find((item) => item.key === 'staff')!.permissions;
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

export const canAccessPath = (
  pathname: string,
  permissions: Record<RoutePermission, boolean>,
) => Boolean(permissions[getPermissionForPath(pathname)]);

export const getFirstAllowedPath = (permissions: Record<RoutePermission, boolean>) => {
  const firstPermission = (Object.keys(permissionHomePath) as RoutePermission[]).find((permission) => permissions[permission]);
  return firstPermission ? permissionHomePath[firstPermission] : '/login';
};

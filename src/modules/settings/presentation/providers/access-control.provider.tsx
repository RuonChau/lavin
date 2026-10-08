'use client';

import { createContext, useCallback, useContext, useMemo } from 'react';
import type {
  TDataScope,
  TPermissionAction,
  TPermissionValues,
} from '@/modules/settings/domain/enum/permission-key.enum';
import { PermissionKeys } from '@/modules/settings/domain/enum/permission-key.enum';
import type { TRolePermissionMatrix } from '@/modules/settings/types/role-permission.type';
import { hasPermission } from '@/modules/settings/utils/access-control';

type BranchRef = string | null | undefined;

interface AccessControlValue {
  permissions: TRolePermissionMatrix;
  dataScope: TDataScope;
  /** Chi nhánh nhân sự đang quản lý — chỉ có ý nghĩa khi `dataScope === 'branch'` */
  managedBranchIds: string[];
}

const noPermissions = PermissionKeys.reduce((acc, page) => {
  acc[page] = { view: false, create: false, update: false, delete: false };
  return acc;
}, {} as TRolePermissionMatrix);

const AccessControlContext = createContext<AccessControlValue>({
  permissions: noPermissions,
  dataScope: 'branch',
  managedBranchIds: [],
});

export function AccessControlProvider({
  children,
  ...value
}: AccessControlValue & { children: React.ReactNode }) {
  const { permissions, dataScope, managedBranchIds } = value;
  const memoValue = useMemo(
    () => ({ permissions, dataScope, managedBranchIds }),
    [permissions, dataScope, managedBranchIds],
  );

  return <AccessControlContext.Provider value={memoValue}>{children}</AccessControlContext.Provider>;
}

export const useAccessControl = () => useContext(AccessControlContext);

/**
 * Quyền CRUD của trang hiện tại kèm các helper giới hạn dữ liệu theo chi nhánh.
 * Với role phạm vi `branch`, bản ghi không gắn chi nhánh được coi là dữ liệu dùng chung:
 * chỉ hiển thị khi `includeShared` và không bao giờ được sửa/xóa.
 */
export function usePagePermission(page: TPermissionValues) {
  const { permissions, dataScope, managedBranchIds } = useAccessControl();
  const isBranchScoped = dataScope === 'branch';

  const can = useCallback(
    (action: TPermissionAction) => hasPermission(permissions, page, action),
    [page, permissions],
  );

  /** Bản ghi (gắn 1 hoặc nhiều chi nhánh) có nằm trọn trong phạm vi quản lý không */
  const isInScope = useCallback((branch: BranchRef | BranchRef[]) => {
    if (!isBranchScoped) return true;
    const ids = (Array.isArray(branch) ? branch : [branch]).filter((id): id is string => Boolean(id));
    return ids.length > 0 && ids.every((id) => managedBranchIds.includes(id));
  }, [isBranchScoped, managedBranchIds]);

  /** Bản ghi có liên quan tới ít nhất một chi nhánh trong phạm vi quản lý không */
  const isVisible = useCallback((branch: BranchRef | BranchRef[], includeShared = false) => {
    if (!isBranchScoped) return true;
    const ids = (Array.isArray(branch) ? branch : [branch]).filter((id): id is string => Boolean(id));
    if (ids.length === 0) return includeShared;
    return ids.some((id) => managedBranchIds.includes(id));
  }, [isBranchScoped, managedBranchIds]);

  const filterBranchOptions = useCallback(
    <T extends { id: string }>(branches: T[]) => (
      isBranchScoped ? branches.filter((branch) => managedBranchIds.includes(branch.id)) : branches
    ),
    [isBranchScoped, managedBranchIds],
  );

  return {
    canView: can('view'),
    canCreate: can('create'),
    canUpdate: can('update'),
    canDelete: can('delete'),
    isBranchScoped,
    managedBranchIds,
    isInScope,
    isVisible,
    filterBranchOptions,
  };
}

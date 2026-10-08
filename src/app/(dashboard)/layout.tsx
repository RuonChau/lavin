'use client';

import { useAuth } from '@/modules/auth';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState, useSyncExternalStore } from 'react';
import { usePathname } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { Sidebar } from '@/shared/components/layout/sidebar';
import { Topbar } from '@/shared/components/layout/topbar';
import { settingsService } from '@/modules/settings/infrastructure/services/settings.service';
import {
  canAccessPath,
  getDataScopeForRole,
  getFirstAllowedPath,
  getPermissionsForRole,
  normalizeRolePermissions,
} from '@/modules/settings/utils/access-control';
import { AccessControlProvider } from '@/modules/settings/presentation/providers/access-control.provider';
import { managedBranchService } from '@/modules/settings/infrastructure/services/managed-branch.service';

const subscribeToHydration = () => () => undefined;
const getClientSnapshot = () => true;
const getServerSnapshot = () => false;

const useHasHydrated = () => useSyncExternalStore(
  subscribeToHydration,
  getClientSnapshot,
  getServerSnapshot,
);

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading, logout, user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const hasHydrated = useHasHydrated();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const permissionsQuery = useQuery({
    queryKey: ['settings', 'role-permissions'],
    queryFn: () => settingsService.getSettings(),
    enabled: isAuthenticated,
    retry: false,
  });

  const roles = useMemo(
    () => normalizeRolePermissions(permissionsQuery.data?.roles),
    [permissionsQuery.data?.roles],
  );
  const permissions = useMemo(() => getPermissionsForRole(user?.role, roles), [roles, user?.role]);
  const dataScope = getDataScopeForRole(user?.role, roles);

  // `/me` có thể không trả về chi nhánh → tra từ tài khoản / hồ sơ nhân viên
  const needsBranchLookup = isAuthenticated && dataScope === 'branch' && !user?.branchIds?.length;
  const managedBranchQuery = useQuery({
    queryKey: ['access-control', 'managed-branches', user?.id],
    queryFn: () => managedBranchService.getManagedBranchIds(user!.id),
    enabled: needsBranchLookup && Boolean(user?.id),
    staleTime: 1000 * 60 * 5,
    retry: false,
  });
  const userBranchIds = user?.branchIds;
  const lookedUpBranchIds = managedBranchQuery.data;
  const managedBranchIds = useMemo(() => (
    userBranchIds?.length ? userBranchIds : lookedUpBranchIds ?? []
  ), [lookedUpBranchIds, userBranchIds]);
  const isResolvingAccess = permissionsQuery.isLoading || (needsBranchLookup && managedBranchQuery.isLoading);
  const isMissingBranch = dataScope === 'branch' && !isResolvingAccess && managedBranchIds.length === 0;

  useEffect(() => {
    if (!hasHydrated || isLoading || isAuthenticated) return;

    if (pathname !== '/login') {
      router.push('/login');
    }
  }, [hasHydrated, isAuthenticated, isLoading, pathname, router]);

  useEffect(() => {
    if (!hasHydrated || !isAuthenticated || permissionsQuery.isLoading) return;
    if (canAccessPath(pathname, permissions)) return;

    const targetPath = getFirstAllowedPath(permissions);
    if (targetPath !== pathname) {
      router.replace(targetPath);
    }
  }, [hasHydrated, isAuthenticated, pathname, permissions, permissionsQuery.isLoading, router]);

  if (!hasHydrated || isLoading || (isAuthenticated && isResolvingAccess)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg-base">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-text-secondary font-medium animate-pulse">Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) return null;
  if (!canAccessPath(pathname, permissions)) return null;

  return (
    <div className="min-h-screen">
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        onLogout={logout}
        permissions={permissions}
        user={user}
      />

      <div className="flex flex-col min-h-screen transition-all duration-300 md:pl-70">
        <Topbar onMenuClick={() => setIsSidebarOpen(true)} />

        <main className="flex-1 p-4 mt-19 overflow-x-hidden">
          <AccessControlProvider
            permissions={permissions}
            dataScope={dataScope}
            managedBranchIds={managedBranchIds}
          >
            {isMissingBranch && (
              <div className="mb-4 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-700">
                Tài khoản chưa được gán chi nhánh nên không hiển thị được dữ liệu. Vui lòng liên hệ quản trị viên để gán chi nhánh cho tài khoản hoặc hồ sơ nhân viên.
              </div>
            )}
            {children}
          </AccessControlProvider>
        </main>
      </div>
    </div>
  );
}

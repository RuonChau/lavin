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
  getFirstAllowedPath,
  getPermissionsForRole,
} from '@/modules/settings/utils/access-control';
import { defaultRolePermissions } from '@/modules/settings/mocks/default-role-permissions.mock';

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

  const permissions = useMemo(() => {
    const roles = permissionsQuery.data?.roles?.length
      ? permissionsQuery.data.roles
      : defaultRolePermissions;

    return getPermissionsForRole(user?.role, roles);
  }, [permissionsQuery.data?.roles, user?.role]);

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

  if (!hasHydrated || isLoading || (isAuthenticated && permissionsQuery.isLoading)) {
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

        <main className="flex-1 p-4 md:p-8 mt-19 overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}

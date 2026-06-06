'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { ComponentType } from 'react';
import {
  AnimatePresence,
  motion,
} from 'motion/react';
import {
  BarChart3,
  BookOpenText,
  Boxes,
  ClipboardList,
  Gift,
  Grid3X3,
  LayoutDashboard,
  LogOut,
  Settings,
  ShoppingCart,
  Store,
  Users,
  UtensilsCrossed,
  X,
} from 'lucide-react';
import { usePublicSettings } from '@/modules/settings/presentation/providers/public-settings.provider';
import type { User } from '@/modules/auth/domain/types/user.type';
import type { TPermissionValues } from '@/modules/settings/domain/enum/permission-key.enum';
import { cn } from '@/shared/utils/cn';
import { isActivePath } from '@/shared/utils/isActivePath';

type SidebarMenuItem = {
  id: string;
  label: string;
  icon: ComponentType<{ size?: number; className?: string }>;
  href: string;
  description: string;
  permission: TPermissionValues;
};

const MENU_ITEMS: SidebarMenuItem[] = [
  {
    id: 'dashboard',
    label: 'Tổng quan',
    icon: LayoutDashboard,
    href: '/',
    description: 'Tổng quan tình hình kinh doanh của cửa hàng',
    permission: 'dashboard',
  },
  {
    id: 'orders',
    label: 'Đơn hàng',
    icon: ClipboardList,
    href: '/orders',
    description: 'Theo dõi, xử lý và cập nhật trạng thái đơn hàng',
    permission: 'orders',
  },
  {
    id: 'products',
    label: 'Menu sản phẩm',
    icon: UtensilsCrossed,
    href: '/products',
    description: 'Menu cafe, giá bán và vòng đời sản phẩm',
    permission: 'products',
  },
  {
    id: 'formulas',
    label: 'Công thức / BOM',
    icon: BookOpenText,
    href: '/formulas',
    description: 'Công thức, giá vốn thành phần và định mức mẻ',
    permission: 'products',
  },
  {
    id: 'inventory',
    label: 'Nguyên liệu & Tồn kho',
    icon: Boxes,
    href: '/inventory',
    description: 'Kiểm soát kho, nguyên vật liệu và vị trí kho hàng',
    permission: 'products',
  },
  {
    id: 'purchases',
    label: 'Đơn nhập hàng',
    icon: ShoppingCart,
    href: '/purchases',
    description: 'Quản lý mua hàng, nhập kho và nhà cung cấp',
    permission: 'products',
  },
  {
    id: 'branches',
    label: 'Chi nhánh',
    icon: Store,
    href: '/branches',
    description: 'Quản lý mạng lưới kho và các điểm bán hàng',
    permission: 'reports',
  },
  {
    id: 'tables',
    label: 'Sơ đồ bàn',
    icon: Grid3X3,
    href: '/tables',
    description: 'Quản lý bàn, khu vực và trạng thái phục vụ theo thời gian thực',
    permission: 'reports',
  },
  {
    id: 'employees',
    label: 'Nhân viên',
    icon: Users,
    href: '/employees',
    description: 'Phân quyền, quản lý nhân viên, ca làm việc, chấm công',
    permission: 'employees',
  },
  {
    id: 'customers',
    label: 'Khách hàng',
    icon: Users,
    href: '/customers',
    description: 'Thông tin khách hàng, điểm tích lũy, lịch sử mua hàng',
    permission: 'orders',
  },
  {
    id: 'promotions',
    label: 'Khuyến mãi',
    icon: Gift,
    href: '/promotions',
    description: 'Quản lý chương trình khuyến mãi',
    permission: 'promotions',
  },
  {
    id: 'reports',
    label: 'Báo cáo',
    icon: BarChart3,
    href: '/reports',
    description: 'Xem các báo cáo về tình hình kinh doanh',
    permission: 'reports',
  },
  {
    id: 'settings',
    label: 'Cài đặt',
    icon: Settings,
    href: '/settings',
    description: 'Thay đổi các thiết lập trong ứng dụng',
    permission: 'settings',
  },
];

const ROLE_LABELS: Record<string, string> = {
  BARISTA: 'Pha chế',
  SERVER: 'Phục vụ',
  CASHIER: 'Thu ngân',
  SHIFT_LEADER: 'Quản lý ca',
  STORE_MANAGER: 'Quản lý chi nhánh',
  AREA_MANAGER: 'Quản lý khu vực',
  ACCOUNTANT: 'Kế toán',
  PURCHASING: 'Mua hàng',
  ADMIN: 'Quản trị viên',
  OWNER: 'Chủ cửa hàng',
};

const formatRoleLabel = (role?: string | null) => {
  if (!role) return 'Nhân viên';

  return ROLE_LABELS[role] ?? role
    .toLowerCase()
    .split(/[_\s-]+/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onLogout: () => void | Promise<void>;
  permissions: Record<TPermissionValues, boolean>;
  user: User | null;
}

export function Sidebar({ isOpen, onClose, onLogout, permissions, user }: SidebarProps) {
  const pathname = usePathname();
  const { settings, logoUrl } = usePublicSettings();
  const brandName = settings.brandName || 'LaVin ERP';
  const menuItems = MENU_ITEMS.filter((item) => permissions[item.permission]);
  const displayName = user?.name || user?.email || 'Admin User';
  const displayInitial = displayName.charAt(0).toUpperCase();
  const displayRole = formatRoleLabel(user?.role);

  const sidebarContent = (
    <aside
      className={cn(
        'glass-panel fixed left-0 top-0 z-60 flex h-screen w-70 flex-col border-r border-primary-soft/30 transition-transform duration-300 md:shadow-none',
        !isOpen && '-translate-x-full md:translate-x-0',
      )}
    >
      <div className="flex h-19 items-center justify-between border-b border-primary-soft/20 px-8">
        <div className="flex min-w-0 items-center">
          <div className="mr-3 flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-primary shadow-lg shadow-primary/20">
            {logoUrl ? (
              <img src={logoUrl} alt={brandName} className="h-full w-full object-cover" />
            ) : (
              <div className="h-4 w-4 rotate-45 rounded-sm bg-white" />
            )}
          </div>
          <div className="min-w-0">
            <p className="truncate text-base font-black tracking-tight text-text-primary">{brandName}</p>
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-primary-soft">ERP</p>
          </div>
        </div>
        <button onClick={onClose} className="p-2 text-text-secondary transition-colors hover:text-primary md:hidden">
          <X size={20} />
        </button>
      </div>

      <nav className="custom-scrollbar flex-1 space-y-1 overflow-y-auto px-4 py-6">
        {menuItems.map((item) => {
          const isActive = isActivePath(pathname, item.href);
          const Icon = item.icon;

          return (
            <Link key={item.id} href={item.href} onClick={() => onClose()}>
              <div
                className={cn(
                  'group relative flex cursor-pointer items-center gap-4 rounded-2xl px-4 py-3 transition-all duration-300',
                  isActive ? 'bg-primary/10 text-primary' : 'text-text-secondary hover:bg-white/50',
                )}
              >
                <Icon
                  size={18}
                  className={cn(
                    'shrink-0 transition-transform duration-300 group-hover:scale-110',
                    isActive ? 'text-primary' : 'text-primary-soft',
                  )}
                />
                <div className="flex min-w-0 flex-col">
                  <span className="truncate text-sm font-semibold">{item.label}</span>
                  <span className="mt-0.5 line-clamp-2 text-[10px] font-medium leading-tight text-text-muted transition-colors group-hover:text-text-secondary">
                    {item.description}
                  </span>
                </div>

                {isActive && (
                  <motion.div
                    layoutId="sidebar-active-indicator"
                    className="absolute left-0 h-6 w-1 rounded-r-full bg-primary"
                    transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                  />
                )}
              </div>
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto space-y-1 p-2">
        <div className="glass-card rounded-4xl flex items-center p-3.5">
          <div className="mr-3 flex h-10 w-10 items-center justify-center rounded-2xl border border-primary-soft/50 bg-primary-soft/30 font-bold text-primary">
            {displayInitial}
          </div>
          <div className="overflow-hidden">
            <p className="truncate text-sm font-bold leading-tight text-text-primary">{displayName}</p>
            <p className="truncate text-[10px] font-bold uppercase tracking-wider text-text-muted">{displayRole}</p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => onLogout()}
          className="flex w-full items-center gap-4 rounded-2xl px-4 py-3 font-medium text-text-secondary transition-all duration-300 hover:bg-red-50/50 hover:text-red-500"
        >
          <LogOut size={20} />
          <span className="text-sm">Đăng xuất</span>
        </button>
      </div>
    </aside>
  );

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-55 bg-slate-900/20 backdrop-blur-sm md:hidden"
          />
        )}
      </AnimatePresence>
      {sidebarContent}
    </>
  );
}

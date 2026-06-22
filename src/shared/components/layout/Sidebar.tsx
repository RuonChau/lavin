'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  AnimatePresence,
  motion,
} from 'motion/react';
import {
  LogOut,
  X,
} from 'lucide-react';
import { usePublicSettings } from '@/modules/settings/presentation/providers/public-settings.provider';
import { cn } from '@/shared/utils/cn';
import { isActivePath } from '@/shared/utils/isActivePath';
import { MENU_ITEMS } from './config/sidebar-menu-items.config';
import type { SidebarProps } from './types/sidebar-props.type';
import { formatRoleLabel } from './utils/format-role-label.util';
import Image from 'next/image';

export function Sidebar({ isOpen, onClose, onLogout, permissions, user }: SidebarProps) {
  const pathname = usePathname();
  const { settings, logoUrl } = usePublicSettings();
  console.log('logoUrl: ', logoUrl);
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
          <Image
            alt="logo"
            src="/logo.svg"
            width={96}
            height={96}
            className="mr-3 h-9 w-9 shrink-0 object-contain"
            // priority
          />
          {/* <div className="mr-3 flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-primary shadow-lg shadow-primary/20">
            {logoUrl ? (
              <img src={logoUrl} alt={brandName} className="h-full w-full object-cover" />
            ) : (
              <Image src="/path/to/default-logo.png" alt={brandName} className="h-4 w-4 rotate-45 rounded-sm bg-white" width={16} height={16} />
            )}
          </div> */}
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

'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  UtensilsCrossed,
  BookOpenText,
  Boxes,
  ShoppingCart,
  Store,
  BarChart3,
  LogOut,
  X,
  CreditCard,
  ClipboardList,
  Users,
  Settings,
  Gift,
  RefreshCcw
} from 'lucide-react';
import { cn } from '@/shared/utils/cn';
import { motion, AnimatePresence } from 'motion/react';
import { isActivePath } from '@/shared/utils/isActivePath';

const MENU_ITEMS = [
  { id: 'dashboard', label: 'Tổng quan', icon: LayoutDashboard, href: '/', description: 'Tổng quan tình hình kinh doanh của cửa hàng' },
  { id: 'pos', label: 'POS', icon: CreditCard, href: '/pos', description: 'Bán hàng, nhận order và thanh toán online/offline' },
  { id: 'orders', label: 'Đơn hàng', icon: ClipboardList, href: '/orders', description: 'Theo dõi, xử lý và cập nhật trạng thái đơn hàng thời gian thực' },
  { id: 'products', label: 'Menu sản phẩm', icon: UtensilsCrossed, href: '/products', description: 'Menu cafe, giá bán và vòng đời sản phẩm' },
  { id: 'formulas', label: 'Công thức / BOM', icon: BookOpenText, href: '/formulas', description: 'Công thức, giá vốn thành phần và định mức mẻ' },
  { id: 'inventory', label: 'Nguyên liệu & Tồn kho', icon: Boxes, href: '/inventory', description: 'Kiểm soát kho, nguyên vật liệu và vị trí kho hàng' },
  { id: 'purchases', label: 'Đơn nhập hàng', icon: ShoppingCart, href: '/purchases', description: 'Quản lý mua hàng, nhập kho và nhà cung cấp' },
  { id: 'branches', label: 'Chi nhánh', icon: Store, href: '/branches', description: 'Quản lý mạng lưới kho và các điểm bán hàng' },
  { id: 'employees', label: 'Nhân viên', icon: Users, href: '/employees', description: 'Phân quyền, quản lý nhân viên, ca làm việc, chấm công' },
  { id: 'customers', label: 'Khách hàng', icon: Users, href: '/customers', description: 'Thông tin khách hàng, điểm tích lũy, lịch sử mua hàng' },
  { id: 'promotions', label: 'Khuyến mãi', icon: Gift, href: '/promotions', description: 'Quản lý chương trình khuyến mãi' },
  { id: 'reports', label: 'Báo cáo', icon: BarChart3, href: '/reports', description: 'Xem các báo cáo về tình hình kinh doanh của cửa hàng' },
  { id: 'settings', label: 'Cài đặt', icon: Settings, href: '/settings', description: 'Thay đổi các thiết lập trong ứng dụng' },
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();

  const SidebarContent = (
    <aside className={cn(
      "w-70 h-screen fixed left-0 top-0 z-60 flex flex-col glass-panel border-r border-primary-soft/30 transition-transform duration-300 md:shadow-none",
      !isOpen && "-translate-x-full md:translate-x-0"
    )}>
      <div className="h-19 flex items-center justify-between px-8 border-b border-primary-soft/20">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-primary rounded-lg mr-3 flex items-center justify-center shadow-lg shadow-primary/20">
            <div className="w-4 h-4 bg-white rounded-sm rotate-45"></div>
          </div>
          <span className="text-xl font-bold tracking-tight text-text-primary">BrewGlass<span className="font-light text-primary-soft text-base ml-1">ERP</span></span>
        </div>
        <button onClick={onClose} className="md:hidden p-2 text-text-secondary hover:text-primary transition-colors">
          <X size={20} />
        </button>
      </div>

      <nav className="flex-1 py-6 px-4 space-y-1 overflow-y-auto custom-scrollbar">
        {MENU_ITEMS.map((item) => {
          const isActive = isActivePath(pathname, item.href);
          return (
            <Link key={item.id} href={item.href} onClick={() => onClose()}>
              <div className={cn(
                "group relative flex items-center gap-4 px-4 py-3 rounded-2xl transition-all duration-300 cursor-pointer",
                isActive
                  ? "bg-primary/10 text-primary"
                  : "hover:bg-white/50 text-text-secondary"
              )}>
                <item.icon size={18} className={cn("transition-transform duration-300 group-hover:scale-110 shrink-0", isActive ? "text-primary" : "text-primary-soft")} />
                <div className="flex flex-col min-w-0">
                  <span className="font-semibold text-sm truncate">{item.label}</span>
                  {item.description && (
                    <span className="text-[10px] text-text-muted font-medium leading-tight line-clamp-2 mt-0.5 group-hover:text-text-secondary transition-colors">{item.description}</span>
                  )}
                </div>

                {isActive && (
                  <motion.div
                    layoutId="sidebar-active-indicator"
                    className="absolute left-0 w-1 h-6 bg-primary rounded-r-full"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
              </div>
            </Link>
          );
        })}
      </nav>

      <div className="p-6 mt-auto space-y-4">
        <div className="glass-card p-3.5 flex items-center">
          <div className="w-10 h-10 rounded-2xl bg-primary-soft/30 flex items-center justify-center text-primary font-bold mr-3 border border-primary-soft/50">
            A
          </div>
          <div className="overflow-hidden">
            <p className="text-sm font-bold text-text-primary leading-tight truncate">Admin User</p>
            <p className="text-[10px] uppercase tracking-wider text-text-muted font-bold truncate">CHỦ CỬA HÀNG</p>
          </div>
        </div>

        <button className="w-full flex items-center gap-4 px-4 py-3 rounded-2xl text-text-secondary hover:text-red-500 hover:bg-red-50/50 transition-all duration-300 font-medium">
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
            className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-55 md:hidden"
          />
        )}
      </AnimatePresence>
      {SidebarContent}
    </>
  );
}

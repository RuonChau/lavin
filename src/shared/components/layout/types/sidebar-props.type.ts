import type { User } from '@/modules/auth/domain/types/user.type';
import type { TPermissionValues } from '@/modules/settings/domain/enum/permission-key.enum';

export interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onLogout: () => void | Promise<void>;
  permissions: Record<TPermissionValues, boolean>;
  user: User | null;
}

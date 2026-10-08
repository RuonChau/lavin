import type { User } from '@/modules/auth/domain/types/user.type';
import type { TRolePermissionMatrix } from '@/modules/settings/types/role-permission.type';

export interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onLogout: () => void | Promise<void>;
  permissions: TRolePermissionMatrix;
  user: User | null;
}

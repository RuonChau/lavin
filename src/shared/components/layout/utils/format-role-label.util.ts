import { ROLE_LABELS } from '../config/sidebar-role-labels.config';

export const formatRoleLabel = (role?: string | null) => {
  if (!role) return 'Nhân viên';

  return ROLE_LABELS[role] ?? role
    .toLowerCase()
    .split(/[_\s-]+/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

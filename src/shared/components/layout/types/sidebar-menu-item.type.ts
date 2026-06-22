import type { ComponentType } from 'react';
import type { TPermissionValues } from '@/modules/settings/domain/enum/permission-key.enum';

export type SidebarMenuItem = {
  id: string;
  label: string;
  icon: ComponentType<{ size?: number; className?: string }>;
  href: string;
  description: string;
  permission: TPermissionValues;
};

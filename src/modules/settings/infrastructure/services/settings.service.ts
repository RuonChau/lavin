import { api } from '@/shared/lib/axios';
import { unwrapData } from '@/shared/lib/api-response';
import type {
  ISettingsData as SettingsData,
  ISettingsPayload as SettingsPayload,
} from '@/modules/settings/types/settings-data.type';
import type { IRolePermission as RolePermission } from '@/modules/settings/types/role-permission.type';

export interface SettingsResponseData {
  settings: SettingsData;
  roles: RolePermission[];
}

type SettingsFiles = {
  logo?: File;
  paymentQr?: File;
};

export const settingsService = {
  getSettings: async (): Promise<SettingsResponseData> => {
    const response = await api.get('/settings');
    return unwrapData<SettingsResponseData>(response.data);
  },

  updateSettings: async (
    data: { settings: SettingsPayload; roles: RolePermission[] },
    files?: SettingsFiles,
  ): Promise<SettingsResponseData> => {
    if (!files?.logo && !files?.paymentQr) {
      const response = await api.put('/settings', data);
      return unwrapData<SettingsResponseData>(response.data);
    }

    const formData = new FormData();
    formData.append('settings', JSON.stringify(data.settings));
    formData.append('roles', JSON.stringify(data.roles));
    if (files.logo) formData.append('logo', files.logo, files.logo.name);
    if (files.paymentQr) formData.append('paymentQr', files.paymentQr, files.paymentQr.name);

    const response = await api.put('/settings', formData);
    return unwrapData<SettingsResponseData>(response.data);
  },
};

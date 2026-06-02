'use client';

import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import {
  Button,
  ConfigProvider,
  Form,
  Modal,
  Select,
  Spin,
  Tag,
} from 'antd';
import type { UploadFile } from 'antd';
import {
  CheckCircle2,
  MonitorCog,
  RefreshCcw,
  Save,
} from 'lucide-react';
import dayjs from '@/shared/lib/dayjs';
import { cn } from '@/shared/utils/cn';
import { AppearanceSection } from './section/appearance.section';
import { BusinessSection } from './section/business.section';
import { OperationsSection } from './section/operations.section';
import { SecuritySection } from './section/security-section';
import { PermissionsSection } from './section/permissions.section';
import { PaymentSection } from './section/payment.section';
import { NotificationsSection } from './section/notifications.section';
import { sectionMeta } from '@/modules/settings/mocks/section-meta.mock';
import type { TSectionValues as SectionKey } from '@/modules/settings/domain/enum/section-key.enum';
import type { TPermissionValues as PermissionKey } from '@/modules/settings/domain/enum/permission-key.enum';
import type {
  ISettingsData as SettingsData,
  ISettingsPayload as SettingsPayload,
} from '@/modules/settings/types/settings-data.type';
import type { IRolePermission as RolePermission } from '@/modules/settings/types/role-permission.type';
import { antdThemeSetting } from '@/shared/utils/antdThemeSetting';
import { defaultSettings } from '../../mocks/default-settings.mock';
import { defaultRolePermissions } from '../../mocks/default-role-permissions.mock';
import { settingsService } from '../../infrastructure/services/settings.service';
import { queryClient } from '@/shared/lib/query-client';

type SettingsServerData = Partial<Omit<SettingsData, 'business' | 'operations' | 'payment'>> & {
  business?: Partial<Omit<SettingsData['business'], 'logo'>> & {
    logo?: unknown;
  };
  operations?: Partial<Omit<SettingsData['operations'], 'openTime' | 'closeTime'>> & {
    openTime?: SettingsData['operations']['openTime'] | string;
    closeTime?: SettingsData['operations']['closeTime'] | string;
  };
  payment?: Partial<Omit<SettingsData['payment'], 'paymentQr'>> & {
    paymentQr?: unknown;
  };
};

type SettingsImageField = 'logo' | 'paymentQr';

const toUploadFileArray = (value: unknown): UploadFile[] => {
  const files = Array.isArray(value) ? value : value ? [value] : [];

  return files
    .filter((file): file is Record<string, unknown> => Boolean(file) && typeof file === 'object')
    .map((file, index) => {
      const url = String(file.url ?? file.secure_url ?? file.thumbUrl ?? '');
      const uid = String(file.uid ?? file.public_id ?? (url || undefined) ?? `settings-file-${index}`);
      const name = String(file.name ?? file.public_id ?? `settings-file-${index + 1}`);
      const originFileObj = file.originFileObj as UploadFile['originFileObj'] | undefined;

      return {
        uid,
        name,
        status: (file.status as UploadFile['status'] | undefined) ?? 'done',
        url,
        thumbUrl: String(file.thumbUrl ?? url),
        ...(originFileObj ? { originFileObj } : {}),
        public_id: file.public_id,
        response: file.response,
      } as UploadFile;
    });
};

const getUploadPublicId = (file: UploadFile): string | undefined => {
  const fileWithPublicId = file as UploadFile & { public_id?: unknown };
  const response = file.response as { public_id?: unknown } | undefined;
  const publicId = fileWithPublicId.public_id ?? response?.public_id;

  return typeof publicId === 'string' && publicId.trim() ? publicId : undefined;
};

const refreshPublicSettings = () => {
  window.dispatchEvent(new Event('public-settings:refresh'));
  queryClient.invalidateQueries({ queryKey: ['settings', 'role-permissions'] });
};

const cloneSettings = (settings: SettingsData): SettingsData => {
  return {
    ...settings,
    business: { ...settings.business, logo: toUploadFileArray(settings.business.logo) },
    operations: { ...settings.operations },
    security: { ...settings.security },
    payment: settings.payment
      ? { ...settings.payment, paymentQr: toUploadFileArray(settings.payment.paymentQr) }
      : { ...defaultSettings.payment, paymentQr: [] },
    notifications: { ...settings.notifications },
    appearance: { ...settings.appearance },
  };
};

const cloneRoles = (roles: RolePermission[]) =>
  roles.map((role) => ({ ...role, permissions: { ...role.permissions } }));

const parseTime = (value: SettingsData['operations']['openTime'] | string | undefined, fallback: string) => {
  if (dayjs.isDayjs(value)) return value;

  const parsed = dayjs(value || fallback, 'HH:mm');
  return parsed.isValid() ? parsed : dayjs(fallback, 'HH:mm');
};


const normalizeSettingsForForm = (serverSettings?: SettingsServerData | null): SettingsData => {
  const base = cloneSettings(defaultSettings);
  const source = serverSettings ?? {};

  return {
    business: {
      ...base.business,
      ...(source.business ?? {}),
      logo: toUploadFileArray(source.business?.logo ?? base.business.logo),
    },
    operations: {
      ...base.operations,
      ...(source.operations ?? {}),
      openTime: parseTime(source.operations?.openTime, '07:00'),
      closeTime: parseTime(source.operations?.closeTime, '22:30'),
    },
    security: {
      ...base.security,
      ...(source.security ?? {}),
      currentPassword: '',
      newPassword: '',
    },
    payment: {
      ...base.payment,
      ...(source.payment ?? {}),
      paymentQr: toUploadFileArray(source.payment?.paymentQr ?? base.payment.paymentQr),
    },
    notifications: {
      ...base.notifications,
      ...(source.notifications ?? {}),
    },
    appearance: {
      ...base.appearance,
      ...(source.appearance ?? {}),
    },
  };
};

const mergeSettingsValues = (base: SettingsData, values: Partial<SettingsData>): SettingsData => ({
  business: {
    ...base.business,
    ...(values.business ?? {}),
    logo: toUploadFileArray(values.business?.logo ?? base.business.logo),
  },
  operations: {
    ...base.operations,
    ...(values.operations ?? {}),
  },
  security: {
    ...base.security,
    ...(values.security ?? {}),
  },
  payment: {
    ...base.payment,
    ...(values.payment ?? {}),
    paymentQr: toUploadFileArray(values.payment?.paymentQr ?? base.payment.paymentQr),
  },
  notifications: {
    ...base.notifications,
    ...(values.notifications ?? {}),
  },
  appearance: {
    ...base.appearance,
    ...(values.appearance ?? {}),
  },
});

const toPersistedUploadFiles = (files: UploadFile[] = []): UploadFile[] =>
  files
    .filter((file) => !file.originFileObj)
    .map((file) => ({
      uid: file.uid,
      name: file.name,
      status: file.status ?? 'done',
      url: file.url,
      thumbUrl: file.thumbUrl ?? file.url,
      response: file.response,
    }));

type SettingsPayloadResult = {
  settings: SettingsPayload;
};

const buildSettingsPayload = (values: Partial<SettingsData>, baseSettings = defaultSettings): SettingsPayloadResult => {
  const mergedValues = mergeSettingsValues(baseSettings, values);

  const settings = {
    ...mergedValues,
    business: {
      ...mergedValues.business,
      logo: toPersistedUploadFiles(mergedValues.business.logo),
    },
    operations: {
      ...mergedValues.operations,
      openTime: dayjs.isDayjs(mergedValues.operations.openTime)
        ? mergedValues.operations.openTime.format('HH:mm')
        : String(mergedValues.operations.openTime || '07:00'),
      closeTime: dayjs.isDayjs(mergedValues.operations.closeTime)
        ? mergedValues.operations.closeTime.format('HH:mm')
        : String(mergedValues.operations.closeTime || '22:30'),
    },
    security: {
      ...mergedValues.security,
      currentPassword: '',
      newPassword: '',
    },
    payment: {
      ...mergedValues.payment,
      paymentQr: toPersistedUploadFiles(mergedValues.payment.paymentQr),
    },
  };

  return {
    settings,
  };
};

export default function SettingsPage() {
  const [form] = Form.useForm<SettingsData>();
  const [activeSection, setActiveSection] = useState<SectionKey>('business');
  const [savedSettings, setSavedSettings] = useState<SettingsData>(() => cloneSettings(defaultSettings));
  const [roles, setRoles] = useState<RolePermission[]>(() => cloneRoles(defaultRolePermissions));
  const [savedRoles, setSavedRoles] = useState<RolePermission[]>(() => cloneRoles(defaultRolePermissions));
  const [pendingLogoFile, setPendingLogoFile] = useState<File>();
  const [pendingPaymentQrFile, setPendingPaymentQrFile] = useState<File>();
  const [dirtySections, setDirtySections] = useState<Set<SectionKey>>(new Set());
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [hasStoredSettings, setHasStoredSettings] = useState(true);

  const hasUnsavedChanges = dirtySections.size > 0;

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const data = await settingsService.getSettings();
        const formattedSettings = normalizeSettingsForForm(data?.settings as SettingsServerData | undefined);
        const nextRoles = data?.roles?.length ? cloneRoles(data.roles) : cloneRoles(defaultRolePermissions);

        setSavedSettings(formattedSettings);
        setRoles(nextRoles);
        setSavedRoles(nextRoles);
        setHasStoredSettings(data?.exists ?? true);
        form.setFieldsValue(formattedSettings);
      } catch (error) {
        console.error('Lỗi khi tải cấu hình cài đặt:', error);
        toast.error('Không thể tải cài đặt từ máy chủ.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchSettings();
  }, [form]);

  useEffect(() => {
    if (!isLoading) {
      form.setFieldsValue(savedSettings);
    }
  }, [form, savedSettings, isLoading]);

  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (!hasUnsavedChanges) return;
      event.preventDefault();
      event.returnValue = '';
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasUnsavedChanges]);

  useEffect(() => {
    const handleDocumentClick = (event: MouseEvent) => {
      if (!hasUnsavedChanges) return;
      const anchor = (event.target as HTMLElement).closest('a[href]') as HTMLAnchorElement | null;
      if (!anchor || anchor.target || anchor.href === window.location.href) return;

      event.preventDefault();
      Modal.confirm({
        title: 'Bạn có thay đổi chưa lưu',
        content: 'Rời khỏi trang lúc này sẽ mất các thay đổi cấu hình vừa chỉnh.',
        okText: 'Rời trang',
        cancelText: 'Ở lại',
        okButtonProps: { danger: true },
        onOk: () => {
          window.location.href = anchor.href;
        },
      });
    };

    document.addEventListener('click', handleDocumentClick, true);
    return () => document.removeEventListener('click', handleDocumentClick, true);
  }, [hasUnsavedChanges]);

  const markDirty = (section: SectionKey) => {
    setDirtySections((current) => {
      const next = new Set(current);
      next.add(section);
      return next;
    });
  };

  const clearDirty = (section?: SectionKey) => {
    setDirtySections((current) => {
      if (!section) return new Set();
      const next = new Set(current);
      next.delete(section);
      return next;
    });
  };

  const handleValuesChange = (changedValues: Partial<SettingsData>) => {
    const section = Object.keys(changedValues)[0] as SectionKey | undefined;
    if (section) markDirty(section);
  };

  const handleSave = async () => {
    await form.validateFields();
    const values = form.getFieldsValue(true) as Partial<SettingsData>;
    setIsSaving(true);
    try {
      const { settings: settingsPayload } = buildSettingsPayload(values, savedSettings);
      const saveSettings = hasStoredSettings ? settingsService.updateSettings : settingsService.createSettings;
      const saved = await saveSettings(
        {
          settings: settingsPayload,
          roles,
        },
        { logo: pendingLogoFile, paymentQr: pendingPaymentQrFile },
      );

      const nextSettings = normalizeSettingsForForm((saved?.settings as SettingsServerData | undefined) ?? settingsPayload);
      const nextRoles = saved?.roles?.length ? cloneRoles(saved.roles) : cloneRoles(roles);

      setSavedSettings(nextSettings);
      setRoles(nextRoles);
      setSavedRoles(nextRoles);
      setPendingLogoFile(undefined);
      setPendingPaymentQrFile(undefined);
      setHasStoredSettings(true);
      form.setFieldsValue(nextSettings);
      clearDirty();
      refreshPublicSettings();
      toast.success('Đã lưu thay đổi cài đặt hệ thống.');
    } catch (error) {
      console.error('ỗi khi lưu cài đặt hệ thống:', error);
      toast.error('Không thể lưu cài đặt hệ thống.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleRestoreDefaults = () => {
    Modal.confirm({
      title: 'Khôi phục mặc định?',
      content: 'Toàn bộ cấu hình sẽ quay về mặc định và được lưu lên máy chủ.',
      okText: 'Khôi phục',
      cancelText: 'Hủy',
      onOk: async () => {
        const nextSettings = cloneSettings(defaultSettings);
        const nextRoles = cloneRoles(defaultRolePermissions);
        setIsSaving(true);

        try {
          const { settings: payload } = buildSettingsPayload(nextSettings);
          const saveSettings = hasStoredSettings ? settingsService.updateSettings : settingsService.createSettings;
          await saveSettings(
            { settings: payload, roles: nextRoles },
            undefined,
          );

          setSavedSettings(nextSettings);
          setRoles(nextRoles);
          setSavedRoles(nextRoles);
          setPendingLogoFile(undefined);
          setPendingPaymentQrFile(undefined);
          setHasStoredSettings(true);
          form.setFieldsValue(nextSettings);
          clearDirty();
          refreshPublicSettings();
          toast.info('Đã khôi phục cấu hình mặc định.');
        } catch (error) {
          console.error('ỗi khi khôi phục cài đặt mặc định:', error);
          toast.error('Không thể khôi phục cài đặt mặc định.');
        } finally {
          setIsSaving(false);
        }
      },
    });
  };

  const resetSection = (section: SectionKey) => {
    if (section === 'permissions') {
      setRoles(cloneRoles(savedRoles));
      clearDirty('permissions');
      return;
    }

    if (section === 'business') setPendingLogoFile(undefined);
    if (section === 'payment') setPendingPaymentQrFile(undefined);

    form.setFieldValue(section, savedSettings[section as keyof SettingsData]);
    clearDirty(section);
  };

  const handleRemoveSettingsImage = async (field: SettingsImageField, file: UploadFile) => {
    if (file.originFileObj) {
      if (field === 'logo') setPendingLogoFile(undefined);
      if (field === 'paymentQr') setPendingPaymentQrFile(undefined);
      return true;
    }

    try {
      const saved = await settingsService.deleteSettingsImage(field, getUploadPublicId(file));
      const nextSettings = normalizeSettingsForForm((saved?.settings as SettingsServerData | undefined) ?? savedSettings);
      const nextRoles = saved?.roles?.length ? cloneRoles(saved.roles) : cloneRoles(roles);

      setSavedSettings(nextSettings);
      setRoles(nextRoles);
      setSavedRoles(nextRoles);
      setHasStoredSettings(true);
      if (field === 'logo') setPendingLogoFile(undefined);
      if (field === 'paymentQr') setPendingPaymentQrFile(undefined);
      form.setFieldsValue(nextSettings);
      refreshPublicSettings();
      toast.success('Đã xóa hình khỏi cài đặt.');
      return true;
    } catch (error) {
      console.error('Lỗi khi xóa hình cài đặt:', error);
      toast.error('Không thể xóa hình cài đặt.');
      return false;
    }
  };

  const togglePermission = (roleKey: string, permission: PermissionKey, checked: boolean) => {
    setRoles((current) =>
      current.map((role) =>
        role.key === roleKey ? { ...role, permissions: { ...role.permissions, [permission]: checked } } : role,
      ),
    );
    markDirty('permissions');
  };

  const sectionContent: Record<SectionKey, React.ReactNode> = {
    business: (
      <BusinessSection
        dirty={dirtySections.has('business')}
        onReset={() => resetSection('business')}
        onLogoFileChange={setPendingLogoFile}
        onLogoRemove={(file) => handleRemoveSettingsImage('logo', file)}
      />
    ),
    operations: <OperationsSection dirty={dirtySections.has('operations')} onReset={() => resetSection('operations')} />,
    security: <SecuritySection dirty={dirtySections.has('security')} onReset={() => resetSection('security')} />,
    permissions: (
      <PermissionsSection
        dirty={dirtySections.has('permissions')}
        roles={roles}
        onReset={() => resetSection('permissions')}
        onToggle={togglePermission}
      />
    ),
    payment: (
      <PaymentSection
        dirty={dirtySections.has('payment')}
        onReset={() => resetSection('payment')}
        onPaymentQrFileChange={setPendingPaymentQrFile}
        onPaymentQrRemove={(file) => handleRemoveSettingsImage('paymentQr', file)}
      />
    ),
    notifications: <NotificationsSection dirty={dirtySections.has('notifications')} onReset={() => resetSection('notifications')} />,
    appearance: <AppearanceSection form={form} dirty={dirtySections.has('appearance')} onReset={() => resetSection('appearance')} />,
  };



  return (
    <ConfigProvider theme={antdThemeSetting}>
      <div className="space-y-8 pb-16">
        <header className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex items-start gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10 text-primary">
              <MonitorCog size={22} />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-[28px] font-black tracking-tight text-text-primary md:text-3xl">Cài đặt hệ thống</h1>
                {hasUnsavedChanges && <Tag color="orange" className="m-0 rounded-full px-3 py-1 text-[10px] font-black uppercase">Chưa lưu</Tag>}
              </div>
              <p className="mt-1 max-w-3xl text-sm font-medium text-text-secondary">
                Quản lý thông tin doanh nghiệp, bảo mật, phân quyền và cấu hình vận hành.
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button icon={<RefreshCcw size={17} />} onClick={handleRestoreDefaults} className="h-11! border-primary-soft/40! bg-white/75! font-black! text-text-secondary!">
              Khôi phục mặc định
            </Button>
            <Button type="primary" icon={<Save size={17} />} disabled={!hasUnsavedChanges} loading={isSaving} onClick={handleSave} className="h-11! font-black! shadow-lg! shadow-primary/20!">
              Lưu thay đổi
            </Button>
          </div>
        </header>

        <div className="grid grid-cols-1 gap-5 xl:grid-cols-[280px_1fr]">
          <aside className="rounded-[28px] border border-white/60 bg-[#FFFAF4]/70 p-4 shadow-[0_18px_48px_rgba(91,58,41,0.1)] backdrop-blur-xl">
            <div className="mb-4 rounded-3xl border border-primary-soft/25 bg-white/60 p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary text-white">
                  <CheckCircle2 size={19} />
                </div>
                <div>
                  <p className="font-black text-text-primary">{savedSettings.business.brandName}</p>
                  <p className="text-xs font-semibold text-text-muted">{hasUnsavedChanges ? `${dirtySections.size} phần chưa lưu` : 'Cấu hình đã đồng bộ'}</p>
                </div>
              </div>
            </div>

            <Select
              value={activeSection}
              onChange={(value) => setActiveSection(value as SectionKey)}
              options={sectionMeta.map((section) => ({ value: section.key, label: section.label }))}
              className="mb-4 w-full xl:hidden"
            />

            <div className="hidden xl:block">
              <p className="mb-3 px-2 text-[10px] font-black uppercase tracking-[0.18em] text-text-muted">Nhóm cài đặt</p>
              <div className="space-y-1">
                {sectionMeta.map((section) => {
                  const Icon = section.icon;
                  const active = activeSection === section.key;
                  const dirty = dirtySections.has(section.key);

                  return (
                    <button
                      key={section.key}
                      type="button"
                      onClick={() => setActiveSection(section.key)}
                      className={cn(
                        'flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left transition-all',
                        active ? 'bg-primary/10 text-primary' : 'text-text-secondary hover:bg-white/60',
                      )}
                    >
                      <Icon size={18} className={active ? 'text-primary' : 'text-text-muted'} />
                      <span className="flex-1 text-sm font-black">{section.label}</span>
                      {dirty && <span className="h-2 w-2 rounded-full bg-orange-500" />}
                    </button>
                  );
                })}
              </div>
            </div>
          </aside>

          <main className="min-w-0">
            <Form form={form} layout="vertical" requiredMark={false} initialValues={defaultSettings} onValuesChange={handleValuesChange}
              className="[&_.ant-form-item-label>label]:text-[#8a7666]! [&_.ant-form-item-label>label]:text-[11px]! [&_.ant-form-item-label>label]:font-black! [&_.ant-form-item-label>label]:tracking-[0.12em]! [&_.ant-form-item-label>label]:uppercase!">
              {isLoading ? (
                <div className="flex h-96 items-center justify-center rounded-[28px] border border-white/60 bg-[#FFFAF4]/70 shadow-[0_18px_48px_rgba(91,58,41,0.1)] backdrop-blur-xl">
                  <Spin size="large" description="Đang tải cấu hình cài đặt..." className="text-primary! [&_.ant-spin-dot-item]:bg-primary!" />
                </div>
              ) : (
                sectionContent[activeSection]
              )}
            </Form>
          </main>
        </div>


      </div>
    </ConfigProvider>
  );
}

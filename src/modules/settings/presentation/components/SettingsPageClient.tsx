'use client';

import { useEffect, useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import {
  Button,
  ConfigProvider,
  Form,
  Modal,
  Select,
  Tag,
} from 'antd';
import {
  CheckCircle2,
  MonitorCog,
  RefreshCcw,
  Save,
} from 'lucide-react';
import { cn } from '@/shared/utils/cn';
import { AppearanceSection } from './section/AppearanceSection';
import { BusinessSection } from './section/BusinessSection';
import { OperationsSection } from './section/OperationsSection';
import { SecuritySection } from './section/SecuritySection';
import { PermissionsSection } from './section/PermissionsSection';
import { PaymentSection } from './section/PaymentSection';
import { NotificationsSection } from './section/NotificationsSection';
import { sectionMeta } from '@/modules/settings/mocks/section-meta.mock';
import type { TSectionValues as SectionKey } from '@/modules/settings/domain/enum/section-key.enum';
import type { TPermissionValues as PermissionKey } from '@/modules/settings/domain/enum/permission-key.enum';
import type { ISettingsData as SettingsData } from '@/modules/settings/types/settings-data.type';
import type { IRolePermission as RolePermission } from '@/modules/settings/types/role-permission.type';
import { antdThemeSetting } from '@/shared/utils/antdThemeSetting';
import { defaultSettings } from '../../mocks/default-settings.mock';
import { defaultRolePermissions } from '../../mocks/default-role-permissions.mock';

const cloneSettings = (settings: SettingsData): SettingsData => ({
  ...settings,
  business: { ...settings.business, logo: [...settings.business.logo] },
  operations: { ...settings.operations },
  security: { ...settings.security },
  payment: { ...settings.payment, paymentQr: [...settings.payment.paymentQr] },
  notifications: { ...settings.notifications },
  appearance: { ...settings.appearance },
});

const cloneRoles = (roles: RolePermission[]) =>
  roles.map((role) => ({ ...role, permissions: { ...role.permissions } }));

export default function SettingsPage() {
  const [form] = Form.useForm<SettingsData>();
  const [activeSection, setActiveSection] = useState<SectionKey>('business');
  const [savedSettings, setSavedSettings] = useState<SettingsData>(() => cloneSettings(defaultSettings));
  const [roles, setRoles] = useState<RolePermission[]>(() => cloneRoles(defaultRolePermissions));
  const [savedRoles, setSavedRoles] = useState<RolePermission[]>(() => cloneRoles(defaultRolePermissions));
  const [dirtySections, setDirtySections] = useState<Set<SectionKey>>(new Set());
  const [isSaving, setIsSaving] = useState(false);

  const hasUnsavedChanges = dirtySections.size > 0;

  useEffect(() => {
    form.setFieldsValue(savedSettings);
  }, [form, savedSettings]);

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
    const values = await form.validateFields();
    setIsSaving(true);
    await new Promise((resolve) => window.setTimeout(resolve, 700));
    setSavedSettings(cloneSettings(values));
    setSavedRoles(cloneRoles(roles));
    clearDirty();
    setIsSaving(false);
    toast.success('Đã lưu thay đổi cài đặt hệ thống.');
  };

  const handleRestoreDefaults = () => {
    Modal.confirm({
      title: 'Khôi phục mặc định?',
      content: 'Toàn bộ cấu hình sẽ quay về mock mặc định của hệ thống LaVin.',
      okText: 'Khôi phục',
      cancelText: 'Hủy',
      onOk: () => {
        const nextSettings = cloneSettings(defaultSettings);
        const nextRoles = cloneRoles(defaultRolePermissions);
        setSavedSettings(nextSettings);
        setRoles(nextRoles);
        setSavedRoles(nextRoles);
        form.setFieldsValue(nextSettings);
        clearDirty();
        toast.info('Đã khôi phục cấu hình mặc định.');
      },
    });
  };

  const resetSection = (section: SectionKey) => {
    if (section === 'permissions') {
      setRoles(cloneRoles(savedRoles));
      clearDirty('permissions');
      return;
    }

    form.setFieldValue(section, savedSettings[section as keyof SettingsData]);
    clearDirty(section);
  };

  const togglePermission = (roleKey: string, permission: PermissionKey, checked: boolean) => {
    setRoles((current) =>
      current.map((role) =>
        role.key === roleKey ? { ...role, permissions: { ...role.permissions, [permission]: checked } } : role,
      ),
    );
    markDirty('permissions');
  };

  const sectionContent = useMemo<Record<SectionKey, React.ReactNode>>(
    () => ({
      business: <BusinessSection dirty={dirtySections.has('business')} onReset={() => resetSection('business')} />,
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
      payment: <PaymentSection dirty={dirtySections.has('payment')} onReset={() => resetSection('payment')} />,
      notifications: <NotificationsSection dirty={dirtySections.has('notifications')} onReset={() => resetSection('notifications')} />,
      appearance: <AppearanceSection form={form} dirty={dirtySections.has('appearance')} onReset={() => resetSection('appearance')} />,
    }),
    [dirtySections, roles, savedRoles, savedSettings],
  );



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
                <h1 className="text-[28px] font-black tracking-tight text-[#2A1E17] md:text-3xl">Cài đặt hệ thống</h1>
                {hasUnsavedChanges && <Tag color="orange" className="m-0 rounded-full px-3 py-1 text-[10px] font-black uppercase">Chưa lưu</Tag>}
              </div>
              <p className="mt-1 max-w-3xl text-sm font-medium text-[#6F5A4A]">
                Quản lý thông tin doanh nghiệp, bảo mật, phân quyền và tuỳ chỉnh vận hành.
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button icon={<RefreshCcw size={17} />} onClick={handleRestoreDefaults} className="!h-11 !border-[#D8B894]/40 !bg-white/75 !font-black !text-[#6F5A4A]">
              Khôi phục mặc định
            </Button>
            <Button type="primary" icon={<Save size={17} />} disabled={!hasUnsavedChanges} loading={isSaving} onClick={handleSave} className="!h-11 !font-black !shadow-lg !shadow-primary/20">
              Lưu thay đổi
            </Button>
          </div>
        </header>

        <div className="grid grid-cols-1 gap-5 xl:grid-cols-[280px_1fr]">
          <aside className="rounded-[28px] border border-white/60 bg-[#FFFAF4]/70 p-4 shadow-[0_18px_48px_rgba(91,58,41,0.1)] backdrop-blur-[24px]">
            <div className="mb-4 rounded-3xl border border-[#D8B894]/25 bg-white/60 p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary text-white">
                  <CheckCircle2 size={19} />
                </div>
                <div>
                  <p className="font-black text-[#2A1E17]">LaVin ERP</p>
                  <p className="text-xs font-semibold text-[#9A8677]">{hasUnsavedChanges ? `${dirtySections.size} phần chưa lưu` : 'Cấu hình đã đồng bộ'}</p>
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
              <p className="mb-3 px-2 text-[10px] font-black uppercase tracking-[0.18em] text-[#9A8677]">Nhóm cài đặt</p>
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
                        active ? 'bg-primary/10 text-primary' : 'text-[#6F5A4A] hover:bg-white/60',
                      )}
                    >
                      <Icon size={18} className={active ? 'text-primary' : 'text-[#D8B894]'} />
                      <span className="flex-1 text-sm font-black">{section.label}</span>
                      {dirty && <span className="h-2 w-2 rounded-full bg-orange-500" />}
                    </button>
                  );
                })}
              </div>
            </div>
          </aside>

          <main className="min-w-0">
            <Form form={form} layout="vertical" requiredMark={false} initialValues={defaultSettings} onValuesChange={handleValuesChange} className="[&_.ant-form-item-label>label]:!text-[#8a7666] [&_.ant-form-item-label>label]:!text-[11px] [&_.ant-form-item-label>label]:!font-black [&_.ant-form-item-label>label]:!tracking-[0.12em] [&_.ant-form-item-label>label]:!uppercase">
              {sectionContent[activeSection]}
            </Form>
          </main>
        </div>


      </div>
    </ConfigProvider>
  );
}

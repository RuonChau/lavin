import { Switch, Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import { ShieldCheck } from "lucide-react";
import { PremiumPanel } from "./PremiumPanel";
import { SectionTitle } from "./SectionTitle";
import type { IRolePermission as RolePermission } from "@/modules/settings/types/role-permission.type";
import { TPermissionValues } from "@/modules/settings/domain/enum/permission-key.enum";

const permissionMeta: Array<{ key: TPermissionValues; label: string }> = [
  { key: 'dashboard', label: 'Xem dashboard' },
  { key: 'products', label: 'Quản lý sản phẩm' },
  { key: 'orders', label: 'Quản lý đơn hàng' },
  { key: 'promotions', label: 'Quản lý khuyến mãi' },
  { key: 'reports', label: 'Xem báo cáo' },
  { key: 'employees', label: 'Quản lý nhân sự' },
  { key: 'settings', label: 'Cài đặt hệ thống' },
];

export function PermissionsSection({
  dirty,
  roles,
  onReset,
  onToggle,
}: {
  dirty: boolean;
  roles: RolePermission[];
  onReset: () => void;
  onToggle: (roleKey: string, permission: TPermissionValues, checked: boolean) => void;
}) {
  const columns: ColumnsType<RolePermission> = [
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
      fixed: 'left',
      width: 210,
      render: (_, record) => (
        <div>
          <p className="font-black text-[#2A1E17]">{record.role}</p>
          <p className="mt-1 text-[11px] font-semibold text-[#9A8677]">{record.description}</p>
        </div>
      ),
    },
    ...permissionMeta.map((permission) => ({
      title: permission.label,
      key: permission.key,
      align: 'center' as const,
      width: 150,
      render: (_: unknown, record: RolePermission) => (
        <Switch
          checked={record.permissions[permission.key]}
          disabled={record.key === 'owner'}
          onChange={(checked) => onToggle(record.key, permission.key, checked)}
        />
      ),
    })),
  ];

  return (
    <PremiumPanel>
      <SectionTitle icon={ShieldCheck} title="Phân quyền" description="Ma trận quyền truy cập theo vai trò trong hệ thống ERP." dirty={dirty} onReset={onReset} />
      <div className="rounded-[24px] border border-[#D8B894]/25 bg-white/60 p-3">
        <Table rowKey="key" columns={columns} dataSource={roles} pagination={false} scroll={{ x: 1260 }} className="settings-permission-table [&_.ant-table]:bg-transparent [&_.ant-table-thead>tr>th]:text-[10px] [&_.ant-table-thead>tr>th]:font-black [&_.ant-table-thead>tr>th]:tracking-[0.14em] [&_.ant-table-thead>tr>th]:uppercase [&_.ant-table-tbody>tr>td]:border-b-[#D8B894]/[0.14]" />
      </div>
    </PremiumPanel>
  );
}

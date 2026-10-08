import { useState } from "react";
import { Checkbox, Segmented, Select, Table, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";
import { ShieldCheck } from "lucide-react";
import { PremiumPanel } from "./premium-panel";
import { SectionTitle } from "./section-title";
import type { IRolePermission as RolePermission } from "@/modules/settings/types/role-permission.type";
import type {
  TDataScope,
  TPermissionAction,
  TPermissionValues,
} from "@/modules/settings/domain/enum/permission-key.enum";

const pageMeta: Array<{ key: TPermissionValues; label: string; description: string }> = [
  { key: 'dashboard', label: 'Tổng quan', description: 'Dashboard kinh doanh' },
  { key: 'orders', label: 'Đơn hàng', description: 'Xử lý, cập nhật, hủy đơn' },
  { key: 'customers', label: 'Khách hàng', description: 'Thông tin, điểm tích lũy' },
  { key: 'products', label: 'Menu sản phẩm', description: 'Sản phẩm, giá bán, tồn' },
  { key: 'formulas', label: 'Công thức / BOM', description: 'Định mức nguyên liệu' },
  { key: 'inventory', label: 'Nguyên liệu & Tồn kho', description: 'Kho, nguyên vật liệu' },
  { key: 'purchases', label: 'Đơn nhập hàng', description: 'Mua hàng, nhà cung cấp' },
  { key: 'branches', label: 'Chi nhánh', description: 'Mạng lưới cửa hàng' },
  { key: 'tables', label: 'Sơ đồ bàn', description: 'Bàn, khu vực phục vụ' },
  { key: 'employees', label: 'Nhân viên', description: 'Hồ sơ, ca làm, chấm công' },
  { key: 'promotions', label: 'Khuyến mãi', description: 'Chương trình, voucher' },
  { key: 'reports', label: 'Báo cáo', description: 'Báo cáo kinh doanh' },
  { key: 'settings', label: 'Cài đặt', description: 'Thiết lập hệ thống' },
];

const actionMeta: Array<{ key: TPermissionAction; label: string }> = [
  { key: 'view', label: 'Xem' },
  { key: 'create', label: 'Thêm' },
  { key: 'update', label: 'Sửa' },
  { key: 'delete', label: 'Xóa' },
];

const scopeOptions: Array<{ value: TDataScope; label: string }> = [
  { value: 'all', label: 'Toàn hệ thống' },
  { value: 'branch', label: 'Chi nhánh đang quản lý' },
];

const isLockedRole = (role?: RolePermission) => role?.key === 'owner' || role?.key === 'admin';

export function PermissionsSection({
  dirty,
  roles,
  onReset,
  onToggle,
  onScopeChange,
}: {
  dirty: boolean;
  roles: RolePermission[];
  onReset: () => void;
  onToggle: (roleKey: string, page: TPermissionValues, action: TPermissionAction | 'all', checked: boolean) => void;
  onScopeChange: (roleKey: string, scope: TDataScope) => void;
}) {
  const [selectedRoleKey, setSelectedRoleKey] = useState<string>();
  const selectedRole = roles.find((role) => role.key === selectedRoleKey) ?? roles[0];
  const locked = isLockedRole(selectedRole);

  const columns: ColumnsType<(typeof pageMeta)[number]> = [
    {
      title: 'Trang',
      key: 'page',
      fixed: 'left',
      width: 230,
      render: (_, page) => (
        <div>
          <p className="font-black text-text-primary">{page.label}</p>
          <p className="mt-1 text-[11px] font-semibold text-text-muted">{page.description}</p>
        </div>
      ),
    },
    ...actionMeta.map((action) => ({
      title: action.label,
      key: action.key,
      align: 'center' as const,
      width: 90,
      render: (_: unknown, page: (typeof pageMeta)[number]) => (
        <Checkbox
          checked={selectedRole?.permissions[page.key]?.[action.key]}
          disabled={locked}
          onChange={(event) => onToggle(selectedRole.key, page.key, action.key, event.target.checked)}
        />
      ),
    })),
    {
      title: 'Tất cả',
      key: 'all',
      align: 'center' as const,
      width: 90,
      render: (_: unknown, page: (typeof pageMeta)[number]) => {
        const crud = selectedRole?.permissions[page.key];
        const checkedCount = actionMeta.filter((action) => crud?.[action.key]).length;
        return (
          <Checkbox
            checked={checkedCount === actionMeta.length}
            indeterminate={checkedCount > 0 && checkedCount < actionMeta.length}
            disabled={locked}
            onChange={(event) => onToggle(selectedRole.key, page.key, 'all', event.target.checked)}
          />
        );
      },
    },
  ];

  if (!selectedRole) return null;

  return (
    <PremiumPanel>
      <SectionTitle icon={ShieldCheck} title="Phân quyền" description="Quyền Xem / Thêm / Sửa / Xóa trên từng trang theo vai trò." dirty={dirty} onReset={onReset} />

      <div className="mb-4 grid gap-4 rounded-3xl border border-primary-soft/25 bg-white/60 p-4 md:grid-cols-2">
        <div>
          <p className="mb-2 text-[10px] font-black uppercase tracking-[0.14em] text-text-muted">Vai trò</p>
          <Select
            className="w-full"
            value={selectedRole.key}
            onChange={setSelectedRoleKey}
            options={roles.map((role) => ({
              value: role.key,
              label: `${role.role} — ${role.description}`,
            }))}
          />
        </div>
        <div>
          <p className="mb-2 text-[10px] font-black uppercase tracking-[0.14em] text-text-muted">Phạm vi dữ liệu</p>
          <Segmented<TDataScope>
            block
            value={selectedRole.dataScope}
            disabled={locked}
            options={scopeOptions}
            onChange={(scope) => onScopeChange(selectedRole.key, scope)}
          />
          {selectedRole.dataScope === 'branch' && (
            <p className="mt-2 text-[11px] font-semibold text-text-muted">
              Chỉ thấy và thao tác dữ liệu (đơn hàng, bàn, nhân viên, khuyến mãi…) của chi nhánh nhân sự đang quản lý.
            </p>
          )}
        </div>
        {locked && (
          <Tag color="gold" className="w-fit md:col-span-2">Vai trò này luôn có toàn quyền và không thể chỉnh sửa</Tag>
        )}
      </div>

      <div className="rounded-3xl border border-primary-soft/25 bg-white/60 p-3">
        <Table rowKey="key" columns={columns} dataSource={pageMeta} pagination={false} scroll={{ x: 680 }} className="settings-permission-table [&_.ant-table]:bg-transparent [&_.ant-table-thead>tr>th]:text-[10px] [&_.ant-table-thead>tr>th]:font-black [&_.ant-table-thead>tr>th]:tracking-[0.14em] [&_.ant-table-thead>tr>th]:uppercase [&_.ant-table-tbody>tr>td]:border-b-primary-soft/[0.14]" />
      </div>
    </PremiumPanel>
  );
}

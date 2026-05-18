import { Col, Form, Input, Row, Select, Tag } from "antd";
import { LockKeyhole, Smartphone } from "lucide-react";
import { PremiumPanel } from "./PremiumPanel";
import { SectionTitle } from "./SectionTitle";
import { SwitchCard } from "../card/SwitchCard";

const recentDevices = [
  { id: 'd1', device: 'MacBook Pro 14"', browser: 'Chrome 125', location: 'TP. Hồ Chí Minh', lastActive: 'Hôm nay, 14:12', trusted: true },
  { id: 'd2', device: 'iPhone 15 Pro', browser: 'Safari Mobile', location: 'TP. Hồ Chí Minh', lastActive: 'Hôm qua, 21:48', trusted: true },
  { id: 'd3', device: 'Windows Workstation', browser: 'Edge 124', location: 'LaVin Nguyễn Huệ', lastActive: '15/05/2026, 09:04', trusted: false },
];

export function SecuritySection({ dirty, onReset }: { dirty: boolean; onReset: () => void }) {
  return (
    <PremiumPanel>
      <SectionTitle icon={LockKeyhole} title="Tài khoản & bảo mật" description="Quản lý tài khoản quản trị, xác thực hai lớp và thiết bị đăng nhập." dirty={dirty} onReset={onReset} />
      <Row gutter={[18, 0]}>
        <Col xs={24} lg={12}>
          <Form.Item name={['security', 'adminName']} label="Tên người quản trị">
            <Input placeholder="Nguyễn Minh Anh" />
          </Form.Item>
        </Col>
        <Col xs={24} lg={12}>
          <Form.Item name={['security', 'adminEmail']} label="Email quản trị" rules={[{ type: 'email', message: 'Email không hợp lệ' }]}>
            <Input placeholder="owner@lavin.coffee" />
          </Form.Item>
        </Col>
        <Col xs={24} lg={12}>
          <Form.Item name={['security', 'currentPassword']} label="Mật khẩu hiện tại">
            <Input.Password placeholder="Nhập mật khẩu hiện tại" />
          </Form.Item>
        </Col>
        <Col xs={24} lg={12}>
          <Form.Item name={['security', 'newPassword']} label="Đổi mật khẩu">
            <Input.Password placeholder="Mật khẩu mới" />
          </Form.Item>
        </Col>
        <Col xs={24} lg={12}>
          <Form.Item name={['security', 'sessionTimeout']} label="Thời gian hết phiên đăng nhập">
            <Select options={[{ value: 30, label: '30 phút' }, { value: 60, label: '60 phút' }, { value: 120, label: '120 phút' }, { value: 480, label: '8 giờ' }]} />
          </Form.Item>
        </Col>
        <Col xs={24} lg={12}>
          <SwitchCard name={['security', 'twoFactorEnabled']} title="Bật/tắt 2FA" description="Yêu cầu mã xác thực khi đăng nhập thiết bị mới." compact />
        </Col>
      </Row>
      <div className="mt-4 rounded-3xl border border-[#D8B894]/25 bg-white/58 p-4">
        <div className="mb-4 flex items-center gap-2">
          <Smartphone size={18} className="text-primary" />
          <h3 className="font-black text-[#2A1E17]">Thiết bị đăng nhập gần đây</h3>
        </div>
        <div className="space-y-3">
          {recentDevices.map((device) => (
            <div key={device.id} className="flex flex-col gap-3 rounded-2xl border border-[#D8B894]/15 bg-[#FFFAF4]/75 p-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="font-black text-[#2A1E17]">{device.device}</p>
                <p className="mt-1 text-xs font-semibold text-[#9A8677]">{device.browser} · {device.location} · {device.lastActive}</p>
              </div>
              <Tag color={device.trusted ? 'green' : 'orange'} className="m-0 w-fit rounded-full px-3 py-1 text-xs font-black">
                {device.trusted ? 'Tin cậy' : 'Cần rà soát'}
              </Tag>
            </div>
          ))}
        </div>
      </div>
    </PremiumPanel>
  );
}

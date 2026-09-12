import { Button, Col, Empty, Form, Input, Popconfirm, Row, Select, Spin, Tag } from "antd";
import { LockKeyhole, Smartphone } from "lucide-react";
import { toast } from "react-toastify";
import { useLoginDevices } from "@/modules/auth";
import dayjs from "@/shared/lib/dayjs";
import { PremiumPanel } from "./premium-panel";
import { SectionTitle } from "./section-title";
import { SwitchCard } from "../card/switch.card";

export function SecuritySection({ dirty, onReset }: { dirty: boolean; onReset: () => void }) {
  const { devices, isLoadingDevices, isErrorDevices, revokeDevice, isRevokingDevice, revokingDeviceId } =
    useLoginDevices();

  const handleRevoke = async (sessionId: string) => {
    try {
      await revokeDevice(sessionId);
      toast.success("Đã thu hồi thiết bị đăng nhập");
    } catch {
      toast.error("Không thể thu hồi thiết bị đăng nhập");
    }
  };

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
      <div className="mt-4 rounded-3xl border border-primary-soft/25 bg-white/58 p-4">
        <div className="mb-4 flex items-center gap-2">
          <Smartphone size={18} className="text-primary" />
          <h3 className="font-black text-text-primary">Thiết bị đăng nhập gần đây</h3>
        </div>

        {isLoadingDevices ? (
          <div className="flex justify-center py-8">
            <Spin size="small" />
          </div>
        ) : isErrorDevices ? (
          <p className="rounded-2xl bg-white/45 p-4 text-sm font-semibold text-text-muted">
            Không thể tải danh sách thiết bị đăng nhập.
          </p>
        ) : devices.length === 0 ? (
          <Empty description="Chưa có thiết bị đăng nhập nào." image={Empty.PRESENTED_IMAGE_SIMPLE} />
        ) : (
          <div className="space-y-3">
            {devices.map((device) => (
              <div key={device.id} className="flex flex-col gap-3 rounded-2xl border border-primary-soft/15 bg-[#FFFAF4]/75 p-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="font-black text-text-primary">{device.device}</p>
                  <p className="mt-1 text-xs font-semibold text-text-secondary">
                    {device.browser} · {device.ip || 'Không rõ IP'} · {dayjs(device.lastActiveAt).format('HH:mm DD/MM/YYYY')}
                  </p>
                </div>
                {device.isCurrent ? (
                  <Tag color="green" className="m-0 w-fit rounded-full px-3 py-1 text-xs font-black">
                    Phiên hiện tại
                  </Tag>
                ) : (
                  <Popconfirm
                    title="Thu hồi thiết bị này?"
                    description="Thiết bị sẽ bị đăng xuất và cần đăng nhập lại."
                    okText="Thu hồi"
                    cancelText="Hủy"
                    onConfirm={() => handleRevoke(device.id)}
                  >
                    <Button size="small" danger loading={isRevokingDevice && revokingDeviceId === device.id}>
                      Thu hồi
                    </Button>
                  </Popconfirm>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </PremiumPanel>
  );
}

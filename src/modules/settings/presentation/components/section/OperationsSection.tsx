import { Col, Form, Row, Select, TimePicker } from "antd";
import { Store } from "lucide-react";
import { PremiumPanel } from "./PremiumPanel";
import { SectionTitle } from "./SectionTitle";
import { SwitchCard } from "../card/SwitchCard";

const branchOptions = [
  { value: 'nguyen-hue', label: 'LaVin Nguyễn Huệ' },
  { value: 'thao-dien', label: 'LaVin Thảo Điền' },
  { value: 'landmark', label: 'LaVin Landmark' },
  { value: 'tan-binh', label: 'LaVin Tân Bình' },
  { value: 'thu-duc', label: 'LaVin Thủ Đức' },
];

export function OperationsSection({ dirty, onReset }: { dirty: boolean; onReset: () => void }) {
  return (
    <PremiumPanel>
      <SectionTitle icon={Store} title="Chi nhánh & vận hành" description="Thiết lập mặc định cho vận hành chi nhánh, đơn online và múi giờ hệ thống." dirty={dirty} onReset={onReset} />
      <Row gutter={[18, 0]}>
        <Col xs={24} lg={12}>
          <Form.Item name={['operations', 'defaultBranch']} label="Chi nhánh mặc định">
            <Select options={branchOptions} />
          </Form.Item>
        </Col>
        <Col xs={12} lg={6}>
          <Form.Item name={['operations', 'openTime']} label="Giờ mở cửa">
            <TimePicker format="HH:mm" className="w-full" />
          </Form.Item>
        </Col>
        <Col xs={12} lg={6}>
          <Form.Item name={['operations', 'closeTime']} label="Giờ đóng cửa">
            <TimePicker format="HH:mm" className="w-full" />
          </Form.Item>
        </Col>
        <Col xs={24} lg={12}>
          <Form.Item name={['operations', 'timezone']} label="Múi giờ">
            <Select options={[{ value: 'Asia/Ho_Chi_Minh', label: 'Asia/Ho_Chi_Minh (GMT+7)' }, { value: 'Asia/Bangkok', label: 'Asia/Bangkok (GMT+7)' }]} />
          </Form.Item>
        </Col>
        <Col xs={24} lg={12}>
          <Form.Item name={['operations', 'currency']} label="Đơn vị tiền tệ">
            <Select options={[{ value: 'VND', label: 'VND - Việt Nam Đồng' }, { value: 'USD', label: 'USD - US Dollar' }]} />
          </Form.Item>
        </Col>
      </Row>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <SwitchCard name={['operations', 'onlineOrdering']} title="Cho phép đặt hàng online" description="Nhận đơn từ app/web khách hàng." />
        <SwitchCard name={['operations', 'deliveryEnabled']} title="Cho phép giao hàng" description="Bật luồng delivery và phí ship." />
        <SwitchCard name={['operations', 'autoConfirmOrder']} title="Tự động xác nhận đơn" description="Bỏ bước duyệt thủ công cho đơn hợp lệ." />
      </div>
    </PremiumPanel>
  );
}

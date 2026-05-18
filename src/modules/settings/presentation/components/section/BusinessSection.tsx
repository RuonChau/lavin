import { Col, Form, Input, Row, Upload } from "antd";
import { SectionTitle } from "./SectionTitle";
import { PremiumPanel } from "./PremiumPanel";
import { Building2, UploadCloud } from "lucide-react";
import { normFile } from "@/modules/settings/utils/normFile";


export function BusinessSection({ dirty, onReset }: { dirty: boolean; onReset: () => void }) {
  return (
    <PremiumPanel>
      <SectionTitle icon={Building2} title="Thông tin doanh nghiệp" description="Cấu hình nhận diện, pháp lý và thông tin liên hệ chính của LaVin." dirty={dirty} onReset={onReset} />
      <Row gutter={[18, 0]}>
        <Col xs={24} lg={12}>
          <Form.Item name={['business', 'brandName']} label="Tên thương hiệu" rules={[{ required: true, message: 'Vui lòng nhập tên thương hiệu' }]}>
            <Input placeholder="LaVin Coffee Group" />
          </Form.Item>
        </Col>
        <Col xs={24} lg={12}>
          <Form.Item name={['business', 'taxCode']} label="Mã số thuế">
            <Input placeholder="0318 452 991" />
          </Form.Item>
        </Col>
        <Col xs={24} lg={12}>
          <Form.Item name={['business', 'contactEmail']} label="Email liên hệ" rules={[{ type: 'email', message: 'Email không hợp lệ' }]}>
            <Input placeholder="admin@lavin.coffee" />
          </Form.Item>
        </Col>
        <Col xs={24} lg={12}>
          <Form.Item name={['business', 'phone']} label="Số điện thoại">
            <Input placeholder="028 3812 6688" />
          </Form.Item>
        </Col>
        <Col xs={24}>
          <Form.Item name={['business', 'headOfficeAddress']} label="Địa chỉ trụ sở">
            <Input placeholder="72 Nguyễn Huệ, Quận 1, TP. Hồ Chí Minh" />
          </Form.Item>
        </Col>
        <Col xs={24} lg={12}>
          <Form.Item name={['business', 'website']} label="Website/Facebook">
            <Input placeholder="https://lavin.coffee" />
          </Form.Item>
        </Col>
        <Col xs={24} lg={12}>
          <Form.Item name={['business', 'logo']} label="Logo" valuePropName="fileList" getValueFromEvent={normFile}>
            <Upload listType="picture-card" maxCount={1} beforeUpload={() => false} accept="image/*">
              <div className="flex flex-col items-center gap-2 text-[#6F5A4A]">
                <UploadCloud size={22} />
                <span className="text-xs font-bold">Tải logo</span>
              </div>
            </Upload>
          </Form.Item>
        </Col>
        <Col xs={24}>
          <Form.Item name={['business', 'description']} label="Mô tả thương hiệu">
            <Input.TextArea rows={4} placeholder="Mô tả ngắn về chuỗi cafe, phong cách phục vụ và định vị thương hiệu." className="rounded-2xl" />
          </Form.Item>
        </Col>
      </Row>
    </PremiumPanel>
  );
}
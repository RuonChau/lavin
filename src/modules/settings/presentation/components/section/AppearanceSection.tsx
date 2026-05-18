import { Col, Form, Input, Row, Select } from "antd";
import type { FormInstance } from "antd";
import { SectionTitle } from "./SectionTitle";
import { PremiumPanel } from "./PremiumPanel";
import { Paintbrush } from "lucide-react";
import { SwitchCard } from "../card/SwitchCard";
import type { ISettingsData as SettingsData } from "@/modules/settings/types/settings-data.type";

export function AppearanceSection({ dirty, onReset, form }: { dirty: boolean; onReset: () => void, form: FormInstance<SettingsData> }) {
  return (
    <PremiumPanel>
      <SectionTitle icon={Paintbrush} title="Giao diện" description="Tuỳ chỉnh cảm giác sử dụng dashboard cho đội vận hành." dirty={dirty} onReset={onReset} />
      <Row gutter={[18, 0]}>
        <Col xs={24} lg={12}>
          <Form.Item name={['appearance', 'themeMode']} label="Chế độ sáng/tối">
            <Select options={[{ value: 'light', label: 'Sáng' }, { value: 'dark', label: 'Tối' }, { value: 'system', label: 'Theo hệ thống' }]} />
          </Form.Item>
        </Col>
        <Col xs={24} lg={12}>
          <Form.Item name={['appearance', 'density']} label="Mật độ hiển thị">
            <Select options={[{ value: 'compact', label: 'Compact' }, { value: 'comfortable', label: 'Comfortable' }, { value: 'spacious', label: 'Spacious' }]} />
          </Form.Item>
        </Col>
        <Col xs={24} lg={12}>
          <Form.Item name={['appearance', 'primaryColor']} label="Màu chủ đạo">
            <Input type="color" className="!h-12 !p-1.5" />
          </Form.Item>
        </Col>
        <Col xs={24} lg={12}>
          <Form.Item name={['appearance', 'borderRadius']} label="Bo góc giao diện">
            <Select options={[{ value: 8, label: '8px - Gọn' }, { value: 16, label: '16px - Cân bằng' }, { value: 24, label: '24px - Mềm' }]} />
          </Form.Item>
        </Col>
        <Col xs={24}>
          <SwitchCard name={['appearance', 'animationEnabled']} title="Bật/tắt animation" description="Hiệu ứng chuyển trạng thái nhẹ trên dashboard và modal." compact />
        </Col>
      </Row>
      <div className="mt-3 rounded-3xl border border-[#D8B894]/25 bg-white/55 p-4">
        <p className="mb-3 text-[11px] font-black uppercase tracking-[0.16em] text-[#9A8677]">Xem trước</p>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          {['Doanh thu', 'Đơn hàng', 'Khuyến mãi'].map((item, index) => (
            <div key={item} className="rounded-2xl border border-[#D8B894]/25 bg-[#FFFAF4] p-4 shadow-sm">
              <p className="text-xs font-black uppercase tracking-wider text-[#9A8677]">{item}</p>
              <p className="mt-2 text-2xl font-black text-[#2A1E17]">{index === 0 ? '42.8tr' : index === 1 ? '486' : '12'}</p>
            </div>
          ))}
        </div>
      </div>
    </PremiumPanel>
  );
}
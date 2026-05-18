import { Col, Form, Input, Row, Upload } from "antd";
import { CreditCard, UploadCloud } from "lucide-react";
import { PremiumPanel } from "./PremiumPanel";
import { SectionTitle } from "./SectionTitle";
import { SwitchCard } from "../card/SwitchCard";
import { normFile } from "@/modules/settings/utils/normFile";

export function PaymentSection({ dirty, onReset }: { dirty: boolean; onReset: () => void }) {
  return (
    <PremiumPanel>
      <SectionTitle icon={CreditCard} title="Thanh toán" description="Cấu hình phương thức thanh toán, tài khoản ngân hàng và xác nhận tự động." dirty={dirty} onReset={onReset} />
      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <SwitchCard name={['payment', 'cashEnabled']} title="Bật thanh toán tiền mặt" description="Cho phép thu tiền tại quầy." />
        <SwitchCard name={['payment', 'qrBankingEnabled']} title="Bật QR Banking" description="Hiển thị QR chuyển khoản." />
        <SwitchCard name={['payment', 'eWalletEnabled']} title="Bật ví điện tử" description="Momo, ZaloPay, ShopeePay." />
        <SwitchCard name={['payment', 'cardEnabled']} title="Bật thẻ ngân hàng" description="POS/online card payment." />
      </div>
      <Row gutter={[18, 0]}>
        <Col xs={24} lg={8}>
          <Form.Item name={['payment', 'bankName']} label="Ngân hàng">
            <Input placeholder="Vietcombank" />
          </Form.Item>
        </Col>
        <Col xs={24} lg={8}>
          <Form.Item name={['payment', 'bankAccountName']} label="Tên tài khoản ngân hàng">
            <Input placeholder="CONG TY TNHH LAVIN COFFEE" />
          </Form.Item>
        </Col>
        <Col xs={24} lg={8}>
          <Form.Item name={['payment', 'bankAccountNumber']} label="Số tài khoản">
            <Input placeholder="1028 8899 6688" />
          </Form.Item>
        </Col>
        <Col xs={24} lg={12}>
          <Form.Item name={['payment', 'paymentQr']} label="Mã QR thanh toán" valuePropName="fileList" getValueFromEvent={normFile}>
            <Upload listType="picture-card" maxCount={1} beforeUpload={() => false} accept="image/*">
               <div className="flex flex-col items-center gap-2 text-[#6F5A4A]">
                <UploadCloud size={22} />
                <span className="text-xs font-bold">Tải QR</span>
              </div>
            </Upload>
          </Form.Item>
        </Col>
        <Col xs={24} lg={12}>
          <SwitchCard name={['payment', 'autoConfirmPayment']} title="Tự động xác nhận thanh toán" description="Đối soát tự động khi nhận webhook từ cổng thanh toán." compact />
        </Col>
      </Row>
    </PremiumPanel>
  );
}

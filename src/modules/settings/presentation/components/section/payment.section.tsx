import { Col, Form, Input, Row, Upload } from "antd";
import type { UploadFile } from "antd";
import { CreditCard, UploadCloud } from "lucide-react";
import { PremiumPanel } from "./premium-panel";
import { SectionTitle } from "./section-title";
import { SwitchCard } from "../card/switch.card";
import { normFile } from "@/modules/settings/utils/normFile";

const getPendingFile = (fileList: UploadFile[]): File | undefined => {
  const uploadFile = fileList.find((file) => file.originFileObj);
  return uploadFile?.originFileObj;
};

export function PaymentSection({
  dirty,
  onReset,
  onPaymentQrFileChange,
}: {
  dirty: boolean;
  onReset: () => void;
  onPaymentQrFileChange?: (file?: File) => void;
}) {
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
            <Upload
              listType="picture-card"
              maxCount={1}
              beforeUpload={() => false}
              accept="image/*"
              onChange={({ fileList }) => onPaymentQrFileChange?.(getPendingFile(fileList))}
            >
              <div className="flex flex-col items-center gap-2 text-text-secondary">
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

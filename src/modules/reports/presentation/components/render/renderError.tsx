import { Button, Card } from "antd";
import { AlertTriangle, RefreshCcw } from "lucide-react";
export const renderError = (handleRefresh: () => void) => (
  <Card className="!rounded-[28px] !border-red-200 !bg-red-50/80">
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <AlertTriangle size={42} className="mb-4 text-red-500" />
      <h3 className="text-lg font-black text-[#2A1E17]">Không thể tải dữ liệu báo cáo</h3>
      <p className="mt-2 max-w-md text-sm font-medium text-[#6F5A4A]">Kết nối tới nguồn dữ liệu bị gián đoạn. Hãy thử tải lại báo cáo.</p>
      <Button type="primary" icon={<RefreshCcw size={16} />} onClick={handleRefresh} className="mt-6">
        Thử lại
      </Button>
    </div>
  </Card>
);
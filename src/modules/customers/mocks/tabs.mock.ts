import { Star, Users, History} from "lucide-react";
import { TabType } from "../types/tab.type";

export const tabs: { id: TabType; label: string; icon: any; description: string }[] = [
  { id: 'LIST', label: 'Danh sách khách hàng', icon: Users, description: 'Quản lý thông tin và hồ sơ khách hàng' },
  { id: 'TIERS', label: 'Hạng thành viên', icon: Star, description: 'Cấu hình điểm thưởng và cấp bậc' },
  { id: 'HISTORY', label: 'Lịch sử mua hàng', icon: History, description: 'Theo dõi chi tiêu và tần suất' },
];
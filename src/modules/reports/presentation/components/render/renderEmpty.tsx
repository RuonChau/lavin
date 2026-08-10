import { Button, Card, Empty } from "antd";
import { RefreshCcw } from "lucide-react";

import type { Dispatch, SetStateAction } from 'react';

export const renderEmpty = (
  setCategoryFilter: Dispatch<SetStateAction<string>>
) => (
  <Card className="rounded-[28px]! border-primary-soft/25! bg-white/70!">
    <Empty
      className="py-16"
      image={Empty.PRESENTED_IMAGE_SIMPLE}
      description={
        <span className="font-semibold text-text-secondary">
          Không có dữ liệu phù hợp với bộ lọc hiện tại.
        </span>
      }
    >
      <Button
        onClick={() => setCategoryFilter('ALL')}
        icon={<RefreshCcw size={16} />}
      >
        Reset danh mục
      </Button>
    </Empty>
  </Card>
);
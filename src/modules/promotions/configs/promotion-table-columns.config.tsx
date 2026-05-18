// src/modules/promotions/configs/promotion-table-columns.config.tsx

import type { MenuProps } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { Button, Dropdown, Progress, Tag } from 'antd';
import dayjs from 'dayjs';
import { MoreVertical } from 'lucide-react';

import type {
  IPromotion,
  TPromotionStatus,
  TPromotionType,
} from '@/modules/promotions/types/promotion.type';

import {
  getDiscountDisplay,
  getScopeLabel,
  getTypeLabel,
} from '@/modules/promotions/utils/promotion-display.util';

import { getPromotionStatus } from '../utils/promotion-status.util';



type GetPromotionTableColumnsParams = {
  openDetailDrawer: (promotion: IPromotion) => void;
  actionItems: (promotion: IPromotion) => MenuProps['items'];
};



export function getPromotionTableColumns({
  openDetailDrawer,
  actionItems,
}: GetPromotionTableColumnsParams): ColumnsType<IPromotion> {
  return [
    {
      title: 'Tên khuyến mãi',
      dataIndex: 'name',
      key: 'name',
      width: 260,
      render: (_, promotion) => (
        <button
          type="button"
          onClick={() => openDetailDrawer(promotion)}
          className="group text-left"
        >
          <p className="text-sm font-black text-[#2A1E17] transition-colors group-hover:text-primary">
            {promotion.name}
          </p>
          <p className="mt-1 line-clamp-1 text-xs font-medium text-[#9A8677]">
            {promotion.description}
          </p>
        </button>
      ),
    },
    {
      title: 'Mã khuyến mãi',
      dataIndex: 'code',
      key: 'code',
      render: (code: string) => (
        <span className="rounded-xl border border-[#D8B894]/30 bg-white/70 px-3 py-1.5 font-mono text-xs font-black text-primary">
          {code}
        </span>
      ),
    },
    {
      title: 'Loại',
      dataIndex: 'type',
      key: 'type',
      render: (type: TPromotionType) => (
        <span className="text-xs font-bold text-[#6F5A4A]">
          {getTypeLabel(type)}
        </span>
      ),
    },
    {
      title: 'Giá trị giảm',
      key: 'discountValue',
      align: 'right',
      render: (_, promotion) => (
        <span className="text-sm font-black text-[#2A1E17]">
          {getDiscountDisplay(promotion)}
        </span>
      ),
    },
    {
      title: 'Phạm vi áp dụng',
      key: 'scope',
      render: (_, promotion) => (
        <div>
          <p className="text-xs font-black text-[#2A1E17]">
            {getScopeLabel(promotion.scope)}
          </p>
          <p className="mt-1 line-clamp-1 text-[11px] font-medium text-[#9A8677]">
            {promotion.appliedTargets.join(', ')}
          </p>
        </div>
      ),
    },
    {
      title: 'Thời gian',
      key: 'time',
      render: (_, promotion) => (
        <div className="text-xs font-bold text-[#6F5A4A]">
          <p>{dayjs(promotion.startDate).format('DD/MM/YYYY')}</p>
          <p className="mt-0.5 text-[#9A8677]">
            đến {dayjs(promotion.endDate).format('DD/MM/YYYY')}
          </p>
        </div>
      ),
    },
    {
      title: 'Giới hạn sử dụng',
      dataIndex: 'maxUsage',
      key: 'maxUsage',
      align: 'right',
      render: (maxUsage: number) => (
        <span className="text-xs font-bold text-[#6F5A4A]">
          {maxUsage.toLocaleString('vi-VN')}
        </span>
      ),
    },
    {
      title: 'Đã dùng',
      key: 'used',
      width: 170,
      render: (_, promotion) => {
        const percent =
          promotion.maxUsage > 0
            ? Math.min(
                Math.round((promotion.usedCount / promotion.maxUsage) * 100),
                100,
              )
            : 0;

        return (
          <div>
            <div className="mb-1 flex items-center justify-between gap-2">
              <span className="text-xs font-black text-[#2A1E17]">
                {promotion.usedCount.toLocaleString('vi-VN')}
              </span>
              <span className="text-[10px] font-bold text-[#9A8677]">
                {percent}%
              </span>
            </div>

            <Progress
              percent={percent}
              showInfo={false}
              size="small"
              strokeColor={percent >= 90 ? '#D95F76' : '#21B57D'}
              railColor="rgba(216, 184, 148, 0.25)"
            />
          </div>
        );
      },
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status: TPromotionStatus) => {
        const config = getPromotionStatus(status);

        return (
          <Tag
            color={config.color}
            className="m-0 rounded-full px-3 py-1 text-[11px] font-black uppercase"
          >
            {config.label}
          </Tag>
        );
      },
    },
    {
      title: '',
      key: 'action',
      width: 64,
      align: 'right',
      render: (_, promotion) => (
        <Dropdown
          menu={{ items: actionItems(promotion) }}
          trigger={['click']}
          placement="bottomRight"
        >
          <Button
            type="text"
            icon={<MoreVertical size={18} />}
            className="!text-[#9A8677] hover:!text-primary"
          />
        </Dropdown>
      ),
    },
  ];
}

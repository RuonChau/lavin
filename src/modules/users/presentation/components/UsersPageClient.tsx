'use client';

import { Card, Empty } from 'antd';
import { UsersRound } from 'lucide-react';

export default function UsersPageClient() {
  return (
    <div className="space-y-6 pb-12">
      <div className="flex items-start gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10 text-primary">
          <UsersRound size={22} />
        </div>
        <div>
          <h1 className="text-[28px] font-black tracking-tight text-text-primary md:text-3xl">Người dùng</h1>
          <p className="mt-1 text-sm font-medium text-text-secondary">Quản lý tài khoản đăng nhập và quyền truy cập nội bộ.</p>
        </div>
      </div>

      <Card className="rounded-[28px]! border-primary-soft/25! bg-white/70!">
        <Empty description="Module người dùng đã sẵn sàng để nối API và thiết kế chi tiết." />
      </Card>
    </div>
  );
}

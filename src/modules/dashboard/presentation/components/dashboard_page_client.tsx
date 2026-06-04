'use client';

import { useAuth } from '@/modules/auth/presentation/hooks/use-auth';
import { useDashboardOverview } from '@/modules/dashboard/presentation/hooks/useDashboardOverview';
import { DashboardSkeleton } from './dashboard_skeleton';
import { DashboardErrorState } from './dashboard_error_state';
import { DashboardHeader } from './dashboard_header';
import { DashboardKpiGrid } from './dashboard_kpi_grid';
import { OperationTipCard } from './operation_tip_card';
import { RecentOrdersTable } from './recent_orders_table';
import { TopProductsList } from './top_products_list';

export default function DashboardPage() {
  const { user } = useAuth();
  const { data, isLoading, isError, isFetching, refetch } = useDashboardOverview();
  const stats = data?.stats;

  return (
    <div className="space-y-8 pb-12">
      <DashboardHeader userName={user?.name} isFetching={isFetching} onRefresh={() => refetch()} />

      {isLoading ? (
        <DashboardSkeleton />
      ) : isError || !data || !stats ? (
        <DashboardErrorState onRetry={() => refetch()} />
      ) : (
        <>
          <DashboardKpiGrid stats={stats} />

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <RecentOrdersTable orders={data.recentOrders} generatedAt={data.generatedAt} />
            </div>

            <div className="space-y-6">
              <TopProductsList products={data.topProducts} />
              <OperationTipCard tip={data.operationTip} />
            </div>
          </div>
        </>
      )}
    </div>
  );
}

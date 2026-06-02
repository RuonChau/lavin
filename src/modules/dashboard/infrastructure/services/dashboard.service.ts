import { api } from '@/shared/lib/axios';
import { unwrapData } from '@/shared/lib/api-response';
import { DashboardOverview } from '../../domain/entities/dashboard-overview.entity';

export const dashboardService = {
  getOverview: async (): Promise<DashboardOverview> => {
    const response = await api.get('/dashboard/overview');
    return unwrapData<DashboardOverview>(response.data);
  },
};

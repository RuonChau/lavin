import { useQuery } from '@tanstack/react-query';
import { dashboardService } from '../../infrastructure/services/dashboard.service';

export const useDashboardOverview = () => {
  return useQuery({
    queryKey: ['dashboard-overview'],
    queryFn: dashboardService.getOverview,
    staleTime: 1000 * 60,
  });
};

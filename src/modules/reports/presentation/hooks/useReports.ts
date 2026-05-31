import { useQuery } from '@tanstack/react-query';
import { reportService, ReportParams } from '../../infrastructure/services/report.service';
import { Dayjs } from 'dayjs';

export const useReports = (params: {
  rangeFilter: string;
  branchFilter: string;
  categoryFilter: string;
  dateRange: [Dayjs | null, Dayjs | null] | null;
}) => {
  const { rangeFilter, branchFilter, categoryFilter, dateRange } = params;

  // Build query params
  const queryParams: ReportParams = {
    range: rangeFilter,
    branchId: branchFilter,
    categoryId: categoryFilter,
  };

  if (rangeFilter === 'CUSTOM' && dateRange && dateRange[0] && dateRange[1]) {
    queryParams.from_date = dateRange[0].format('YYYY-MM-DD');
    queryParams.to_date = dateRange[1].format('YYYY-MM-DD');
  }

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['reports-dashboard', queryParams],
    queryFn: () => reportService.getReportData(queryParams),
    staleTime: 1000 * 60 * 2, // 2 minutes cache stale
  });

  return {
    data,
    isLoading,
    isError,
    refetch,
  };
};

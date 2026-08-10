import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { voucherService, VoucherInput } from '@/modules/promotions/infrastructure/services/voucher.service';
import { IPromotion, TPromotionStatus, TPromotionScope, TPromotionType } from '@/modules/promotions/types/promotion.type';
import dayjs from 'dayjs';

// Mappers
export const mapBackendToFrontend = (item: any): IPromotion => {
  const now = dayjs();
  let status: TPromotionStatus = 'ACTIVE';

  if (!item.is_active) {
    status = 'PAUSED';
  } else {
    const start = item.start_at ? dayjs(item.start_at) : null;
    const end = item.end_at ? dayjs(item.end_at) : null;
    if (start && start.isAfter(now)) {
      status = 'UPCOMING';
    } else if (end && end.isBefore(now)) {
      status = 'EXPIRED';
    } else {
      status = 'ACTIVE';
    }
  }

  let scope: TPromotionScope = 'ALL_ORDER';
  if (item.promotion_scope === 'ORDER') scope = 'ALL_ORDER';
  else if (item.promotion_scope === 'CATEGORY') scope = 'CATEGORY';
  else if (item.promotion_scope === 'PRODUCT') scope = 'PRODUCT';
  else if (item.promotion_scope === 'VARIANT') scope = 'PRODUCT';
  else if (item.promotion_scope === 'BRANCH') scope = 'BRANCH';

  let appliedTargets: string[] = [];
  if (item.promotion_scope === 'ORDER') {
    appliedTargets = ['Toàn đơn hàng'];
  } else if (item.promotion_scope === 'PRODUCT' && item.products) {
    appliedTargets = item.products.map((p: any) => p.name || p.id);
  } else if (item.promotion_scope === 'CATEGORY' && item.categories) {
    appliedTargets = item.categories.map((c: any) => c.name || c.id);
  } else if (item.promotion_scope === 'VARIANT' && item.variants) {
    appliedTargets = item.variants.map((v: any) => v.variant_name || v.id);
  } else if (item.promotion_scope === 'BRANCH' && item.branches) {
    appliedTargets = item.branches.map((b: any) => b.name || b.id);
  } else {
    appliedTargets = ['Tất cả'];
  }

  const branchIds: string[] = item.promotion_scope === 'BRANCH' && item.branches
    ? item.branches.map((b: any) => b.id)
    : [];

  return {
    id: item.id,
    name: item.name,
    code: item.code || '',
    type: item.discount_type as TPromotionType,
    discountValue: Number(item.discount_value),
    minimumOrderValue: Number(item.min_order_value || 0),
    maxUsage: Number(item.usage_limit || 0),
    usedCount: Number(item.used_count || 0),
    scope,
    appliedTargets: appliedTargets.length > 0 ? appliedTargets : ['Tất cả'],
    branchIds,
    startDate: item.start_at ? dayjs(item.start_at).format('YYYY-MM-DD') : '',
    endDate: item.end_at ? dayjs(item.end_at).format('YYYY-MM-DD') : '',
    status,
    description: item.description || '',
    isActive: !!item.is_active,
    impactedRevenue: Number(item.impacted_revenue || 0),
    conversionRate: Number(item.conversion_rate || 0),
    usageHistory: item.usage_history || [],
  };
};

export const mapFrontendToBackend = (values: any): VoucherInput => {
  let promotion_scope: 'ORDER' | 'PRODUCT' | 'VARIANT' | 'CATEGORY' | 'BRANCH' = 'ORDER';
  if (values.scope === 'ALL_ORDER') promotion_scope = 'ORDER';
  else if (values.scope === 'CATEGORY') promotion_scope = 'CATEGORY';
  else if (values.scope === 'PRODUCT') promotion_scope = 'PRODUCT';
  else if (values.scope === 'BRANCH') promotion_scope = 'BRANCH';

  let discount_type: 'PERCENTAGE' | 'FIXED_AMOUNT' | 'BUY_X_GET_Y' = 'PERCENTAGE';
  if (values.type === 'PERCENTAGE' || values.type === 'FIXED_AMOUNT' || values.type === 'BUY_X_GET_Y') {
    discount_type = values.type;
  }

  return {
    name: values.name,
    code: values.code ? values.code.toUpperCase() : undefined,
    discount_type,
    discount_value: Number(values.discountValue),
    promotion_scope,
    min_order_value: Number(values.minimumOrderValue || 0),
    usage_limit: Number(values.maxUsage) || undefined,
    start_at: values.startDate ? dayjs(values.startDate).toISOString() : undefined,
    end_at: values.endDate ? dayjs(values.endDate).toISOString() : undefined,
    is_active: values.isActive ?? true,
    description: values.description || '',
    ...(promotion_scope === 'BRANCH'
      ? { targets: { branch_ids: values.branchIds || [] } }
      : {}),
  };
};

export const usePromotions = (page = 1, limit = 100) => {
  const queryClient = useQueryClient();

  // Fetch paginated promotion list
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['promotions-list', page, limit],
    queryFn: () => voucherService.getVouchers({ page, limit }),
    staleTime: 1000 * 60 * 5, // 5 minutes stale time
  });

  // Mutation for creating a new promotion
  const createMutation = useMutation({
    mutationFn: (data: any) => {
      const payload = mapFrontendToBackend(data);
      return voucherService.createVoucher(payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['promotions-list'] });
    },
  });

  // Mutation for updating an existing promotion
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => {
      const payload = mapFrontendToBackend(data);
      return voucherService.updateVoucher(id, payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['promotions-list'] });
    },
  });

  // Mutation for toggling active status
  const toggleActiveMutation = useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) => {
      return voucherService.updateVoucher(id, { is_active: isActive });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['promotions-list'] });
    },
  });

  // Mutation for deleting a promotion
  const deleteMutation = useMutation({
    mutationFn: (id: string) => voucherService.deleteVoucher(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['promotions-list'] });
    },
  });

  const rawData = Array.isArray(data) ? data : [];
  const promotions: IPromotion[] = rawData.map(mapBackendToFrontend);

  return {
    promotions,
    total: rawData.length,
    isLoading,
    refetch,

    // Mutations
    createPromotion: createMutation.mutateAsync,
    isCreating: createMutation.isPending,

    updatePromotion: updateMutation.mutateAsync,
    isUpdating: updateMutation.isPending,

    toggleActivePromotion: toggleActiveMutation.mutateAsync,
    isTogglingActive: toggleActiveMutation.isPending,

    deletePromotion: deleteMutation.mutateAsync,
    isDeleting: deleteMutation.isPending,
  };
};

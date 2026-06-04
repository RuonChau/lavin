import type { TopProductsListProps } from '../../types/dashboard-component-props.type';
import { GlassCard } from '@/shared/components/GlassCard';
import { formatCurrency } from '@/shared/utils/format-currency';

export function TopProductsList({ products }: TopProductsListProps) {
  return (
    <GlassCard className="p-6">
      <h3 className="mb-6 text-lg font-bold text-text-primary">Top món bán chạy</h3>
      <div className="space-y-5">
        {products.length > 0 ? (
          products.map((item, index) => (
            <div key={item.id || item.name} className="group flex cursor-pointer items-center gap-4">
              <div
                className="relative flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-primary/10 bg-cover bg-center text-sm font-black text-primary shadow-sm transition-transform group-hover:scale-105"
                style={item.image ? { backgroundImage: `url(${item.image})` } : undefined}
                aria-label={item.name}
              >
                {item.image ? (
                  <span className="sr-only">{item.name}</span>
                ) : (
                  <span>{index + 1}</span>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="truncate text-sm font-bold text-text-primary">{item.name}</h4>
                <p className="text-xs text-text-muted">{item.sold.toLocaleString('vi-VN')} đơn</p>
              </div>
              <div className="text-sm font-bold text-primary">{formatCurrency(item.price || item.revenue)}</div>
            </div>
          ))
        ) : (
          <p className="rounded-2xl bg-white/45 p-4 text-sm font-semibold text-text-muted">
            Chưa có dữ liệu sản phẩm bán chạy.
          </p>
        )}
      </div>
    </GlassCard>
  );
}

import type { ColumnsType } from 'antd/es/table';
import { CheckCircle2, Coffee, Edit2, Eye, Loader2, Trash2, XCircle } from 'lucide-react';

import type { Category, Product, ProductVariant } from '@/modules/products/domain/entities/product.entity';
import { cn } from '@/shared/utils/cn';

const SIZE_ORDER = ['S', 'M', 'L'];

type GetProductTableColumnsParams = {
  categories: Category[];
  /** Bấm vào size để chuyển Còn hàng ⇄ Hết hàng */
  onToggleVariantStock?: (variant: ProductVariant, product: Product) => void;
  /** ID biến thể đang được cập nhật trạng thái kho */
  updatingVariantId?: string | null;
  onViewProduct: (product: Product) => void;
  onEditProduct: (product: Product) => void;
  onPrefetchEditProduct?: (product: Product) => void;
  onDeleteProduct: (product: Product) => void;
};

export function getProductTableColumns({
  categories,
  onToggleVariantStock,
  updatingVariantId,
  onViewProduct,
  onEditProduct,
  onPrefetchEditProduct,
  onDeleteProduct,
}: GetProductTableColumnsParams): ColumnsType<Product> {
  return [
    {
      title: 'Sản phẩm',
      dataIndex: 'name',
      key: 'name',
      width: 320,
      render: (_, product) => (
        <div className="flex items-center gap-4">
          <div className="relative h-12 w-12 overflow-hidden rounded-2xl border border-white/60 shadow-sm">
            {product.image ? (
              <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-primary-soft/20 text-primary">
                <Coffee size={20} />
              </div>
            )}
          </div>
          <div>
            <p className="font-bold text-text-primary transition-colors group-hover:text-primary">{product.name}</p>
            <p className="font-mono text-[11px] uppercase text-text-muted">SKU: {product.sku}</p>
          </div>
        </div>
      ),
    },
    {
      title: 'Danh mục',
      dataIndex: 'category_id',
      key: 'category_id',
      render: (categoryId: string) => (
        <span className="rounded-lg border border-primary-soft/20 bg-white/60 px-2.5 py-1 text-xs font-semibold">
          {categories.find((category) => category.id === categoryId)?.name || 'Chưa phân loại'}
        </span>
      ),
    },
    {
      title: 'Giá cơ bản',
      dataIndex: 'base_price',
      key: 'base_price',
      render: (price: number, product) => (
        <span className="font-bold text-text-primary">
          {price.toLocaleString(product.currency?.locale || 'vi-VN', {
            style: 'currency',
            currency: product.currency?.currency || 'VND',
          })}
        </span>
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'is_active',
      key: 'is_active',
      render: (isActive: boolean) => (
        <div
          className={cn(
            'inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-bold',
            isActive ? 'bg-mint/10 text-mint' : 'bg-[#F56B7A]/10 text-[#F56B7A]',
          )}
        >
          {isActive ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
          {isActive ? 'Đang bán' : 'Ngưng bán'}
        </div>
      ),
    },
    {
      title: 'Tình trạng kho',
      key: 'stock',
      render: (_, product) => {
        const variants = [...(product.variants ?? [])].sort(
          (a, b) => SIZE_ORDER.indexOf(a.size) - SIZE_ORDER.indexOf(b.size),
        );
        if (variants.length === 0) return <span className="text-xs text-text-muted">—</span>;

        return (
          <div className="flex flex-wrap items-center gap-1.5">
            {variants.map((variant) => {
              const isOut = variant.stock_status === 'OUT_OF_STOCK';
              const isUpdating = updatingVariantId === variant.id;
              return (
                <button
                  key={variant.id}
                  type="button"
                  disabled={!onToggleVariantStock || isUpdating}
                  onClick={() => onToggleVariantStock?.(variant, product)}
                  title={isOut ? `Size ${variant.size}: Hết hàng — bấm để mở bán lại` : `Size ${variant.size}: Còn hàng — bấm để đánh dấu hết hàng`}
                  className={cn(
                    'inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[11px] font-bold transition-all hover:opacity-80 disabled:cursor-wait disabled:opacity-60',
                    isOut
                      ? 'border-[#F56B7A]/30 bg-[#F56B7A]/10 text-[#F56B7A] line-through'
                      : 'border-mint/30 bg-mint/10 text-mint',
                  )}
                >
                  {isUpdating ? <Loader2 size={11} className="animate-spin" /> : null}
                  {variant.size}
                </button>
              );
            })}
          </div>
        );
      },
    },
    {
      title: 'Cập nhật',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (createdAt: Date) => (
        <span className="text-xs text-text-muted">
          {new Date(createdAt).toLocaleDateString('vi-VN')}
        </span>
      ),
    },
    {
      title: 'Thao tác',
      key: 'actions',
      align: 'right',
      width: 100,
      render: (_, product) => (
        <div className="flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={() => onViewProduct(product)}
            className="rounded-xl p-2 text-text-muted transition-all hover:bg-aqua/10 hover:text-aqua"
            title="Xem chi tiết"
          >
            <Eye size={18} />
          </button>
          <button
            type="button"
            onFocus={() => onPrefetchEditProduct?.(product)}
            onMouseEnter={() => onPrefetchEditProduct?.(product)}
            onClick={() => onEditProduct(product)}
            className="rounded-xl p-2 text-text-muted transition-all hover:bg-primary/10 hover:text-primary"
            title="Chỉnh sửa"
          >
            <Edit2 size={18} />
          </button>
          <button
            type="button"
            onClick={() => onDeleteProduct(product)}
            className="rounded-xl p-2 text-text-muted transition-all hover:bg-danger/10 hover:text-danger"
            title="Xóa"
          >
            <Trash2 size={18} />
          </button>
        </div>
      ),
    },
  ];
}

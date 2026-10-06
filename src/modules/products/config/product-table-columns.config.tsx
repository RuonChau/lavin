import type { ColumnsType } from 'antd/es/table';
import { CheckCircle2, Coffee, Edit2, Eye, Loader2, Trash2, XCircle } from 'lucide-react';

import type { Category, Product } from '@/modules/products/domain/entities/product.entity';
import { cn } from '@/shared/utils/cn';

/** Hết hàng tính theo cả sản phẩm: chỉ cần 1 size hết là coi như sản phẩm hết */
export const isProductOutOfStock = (product: Product) =>
  (product.variants ?? []).some((variant) => variant.stock_status === 'OUT_OF_STOCK');

type GetProductTableColumnsParams = {
  categories: Category[];
  /** Bấm vào trạng thái để chuyển Đang bán ⇄ Hết hàng (áp dụng cho cả sản phẩm) */
  onToggleProductStock?: (product: Product) => void;
  /** ID sản phẩm đang được cập nhật trạng thái kho */
  updatingProductId?: string | null;
  onViewProduct: (product: Product) => void;
  onEditProduct: (product: Product) => void;
  onPrefetchEditProduct?: (product: Product) => void;
  onDeleteProduct: (product: Product) => void;
};

export function getProductTableColumns({
  categories,
  onToggleProductStock,
  updatingProductId,
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
      render: (isActive: boolean, product) => {
        if (!isActive) {
          return (
            <div className="inline-flex items-center gap-1.5 rounded-full bg-[#F56B7A]/10 px-3 py-1 text-[11px] font-bold text-[#F56B7A]">
              <XCircle size={12} />
              Ngưng bán
            </div>
          );
        }

        const isOut = isProductOutOfStock(product);
        const isUpdating = updatingProductId === product.id;
        return (
          <button
            type="button"
            disabled={!onToggleProductStock || isUpdating}
            onClick={() => onToggleProductStock?.(product)}
            title={isOut ? 'Hết hàng — bấm để mở bán lại' : 'Đang bán — bấm để đánh dấu hết hàng'}
            className={cn(
              'inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-bold transition-all hover:opacity-80 disabled:cursor-wait disabled:opacity-60',
              isOut ? 'bg-[#F56B7A]/10 text-[#F56B7A]' : 'bg-mint/10 text-mint',
            )}
          >
            {isUpdating ? (
              <Loader2 size={12} className="animate-spin" />
            ) : isOut ? (
              <XCircle size={12} />
            ) : (
              <CheckCircle2 size={12} />
            )}
            {isOut ? 'Hết hàng' : 'Đang bán'}
          </button>
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

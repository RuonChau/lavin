'use client';

import { GlassCard } from '@/shared/components/GlassCard';
import { useProducts } from '@/modules/products/presentation/hooks/use-products';
import { 
  Plus, 
  Search, 
  Filter,
  FileDown,
  FolderEdit,
} from 'lucide-react';
import { Table } from 'antd';
import { useState } from 'react';
import { AddProductModal } from '@/modules/products/presentation/components/modal/AddProductModal';
import { ProductDetailsModal } from '@/modules/products/presentation/components/modal/ProductDetailsModal';
import { EditProductModal } from '@/modules/products/presentation/components/modal/EditProductModal';
import { DeleteProductModal } from '@/modules/products/presentation/components/modal/DeleteProductModal';
import { CategoryManagementModal } from '@/modules/products/presentation/components/modal/CategoryManagementModal';
import { useCategories } from '@/modules/products/presentation/hooks/use-categories';
import { toast } from 'react-toastify';
import { Product } from '@/modules/products/domain/entities/product.entity';
import type { ProductFormData } from '@/modules/products/validations/add-product.schema';
import type { EditProductFormData } from '@/modules/products/validations/edit-product.schema';
import { productVariantService } from '@/modules/products/infrastructure/services/product-variant.service';
import type { AddProductSubmitOptions } from '@/modules/products/types/product-modal-props.type';
import { getProductTableColumns } from '@/modules/products/config/product-table-columns.config';
import { styleTable } from '../../utils/style-table';

export default function ProductsPage() {
  const {
    products,
    isLoadingProducts,
    refreshProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    getProductDetail,
    prefetchProductDetail,
    isMutatingProduct,
  } = useProducts();

  const { 
    categories, 
    createCategory, 
    updateCategory, 
    deleteCategory, 
    reorderCategories,
    isMutating: isCategoryMutating 
  } = useCategories();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 8;
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingEditDetail, setIsLoadingEditDetail] = useState(false);
  const submitting = isSubmitting || isMutatingProduct;

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category_id === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const paginationCurrent = Math.min(
    currentPage,
    Math.max(1, Math.ceil(filteredProducts.length / ITEMS_PER_PAGE)),
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCategory(e.target.value);
    setCurrentPage(1);
  };

  const getVariantPrice = (data: ProductFormData) => {
    const firstConfiguredPrice = data.sizes
      .map((size) => data.sizeConfigs?.[size]?.price)
      .find((price): price is number => typeof price === 'number' && Number.isFinite(price) && price > 0);

    return firstConfiguredPrice ?? data.base_price;
  };


  // dạng File để gửi lên server. Nếu backend yêu cầu file dạng multipart/form-data thì vẫn phải gửi file gốc, không thể gửi base64. Trong trường hợp này, có thể giữ cả 2: một trường để lưu file gốc (để gửi lên server) và một trường để lưu base64 (để hiển thị preview).
  const getVariantImagesBySize = (
    sizes: string[],
    options: AddProductSubmitOptions
  ): Record<string, File[]> => {
    return sizes.reduce<Record<string, File[]>>((acc, size) => {
      acc[size] = (options.size_images[size] ?? [])
        .map((image) => image.file)
        .filter((file): file is File => file instanceof File);

      return acc;
    }, {});
  };

  const handleAddProduct = async (data: ProductFormData, options: AddProductSubmitOptions) => {
    setIsSubmitting(true);
    const createdProduct = await createProduct({
      name: data.name,
      categoryId: data.categoryId,
      description: data.description,
      base_price: data.base_price,
      currency: data.currency,
      is_active: data.is_active,
      is_featured: false,
      is_draft: options.is_draft,
    }).catch((error: unknown) => {
      const message = error instanceof Error ? error.message : 'Không thể tạo sản phẩm';
      toast.error(message);
      return null;
    });
    if (!createdProduct) {
      setIsSubmitting(false);
      return;
    }
    if (!createdProduct.id) {
      toast.error('Thông tin sản phẩm đang có vân đề!');
      setIsSubmitting(false);
      return;
    }

    if (data.sizes.length > 0) {
      const imagesBySize = getVariantImagesBySize(data.sizes, options);

      if (!imagesBySize || Object.keys(imagesBySize).length === 0) {
        setIsSubmitting(false);
        return;
      }

      const createdVariant = await productVariantService.createVariant({
        product_id: createdProduct.id,
        variant_name: data.name,
        size: data.sizes,
        imagesBySize,
        price: getVariantPrice(data),
        discounted_price: 0,
        quantity: 0,
        stock_status: 'IN_STOCK',
        is_active: data.is_active,
      }).catch((error: unknown) => {
        const message = error instanceof Error ? error.message : 'Không thể tạo biến thể sản phẩm';
        toast.error(message);
        return null;
      });

      if (!createdVariant) {
        setIsSubmitting(false);
        return;
      }
    }

    toast.success('Thêm sản phẩm thành công!');
    setIsSubmitting(false);
    setIsAddModalOpen(false);
    refreshProducts();
  };

  const handleViewProduct = (product: Product) => {
    setSelectedProduct(product);
    setIsDetailsModalOpen(true);
  };

  const handlePrefetchEditProduct = (product: Product) => {
    void prefetchProductDetail(product.id);
  };

  const handleCloseEditProduct = () => {
    setIsLoadingEditDetail(false);
    setIsEditModalOpen(false);
  };

  const handleEditProduct = async (product: Product) => {
    setSelectedProduct(product);
    setIsEditModalOpen(true);
    setIsLoadingEditDetail(true);
    const productDetail = await getProductDetail(product.id).catch((error: unknown) => {
      const message = error instanceof Error ? error.message : 'Không thể lấy chi tiết sản phẩm';
      toast.error(message);
      return null;
    });

    setIsLoadingEditDetail(false);
    if (!productDetail) return;

    setSelectedProduct((currentProduct) =>
      currentProduct?.id === product.id ? productDetail : currentProduct
    );
  };

  const handleUpdateProduct = async (data: EditProductFormData) => {
    if (!selectedProduct) return;
    setIsSubmitting(true);
    const updatedProduct = await updateProduct({
      id: selectedProduct.id,
      data: {
        name: data.name,
        categoryId: data.categoryId,
        description: data.description,
        base_price: data.base_price,
        currency: data.currency,
        is_active: data.is_active,
      },
    }).catch((error: unknown) => {
      const message = error instanceof Error ? error.message : 'Không thể cập nhật sản phẩm';
      toast.error(message);
      return null;
    });
    if (!updatedProduct) {
      setIsSubmitting(false);
      return;
    }
    toast.success('Cập nhật sản phẩm thành công!');
    setIsSubmitting(false);
    setIsEditModalOpen(false);
    refreshProducts();
  };

  const handleDeleteProduct = (product: Product) => {
    setSelectedProduct(product);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedProduct) return;
    setIsSubmitting(true);
    const deletedProduct = await deleteProduct(selectedProduct.id)
      .then(() => true)
      .catch((error: unknown) => {
        const message = error instanceof Error ? error.message : 'Không thể xóa sản phẩm';
        toast.error(message);
        return false;
      });
    if (!deletedProduct) {
      setIsSubmitting(false);
      return;
    }
    toast.success('Đã xóa sản phẩm thành công!');
    setIsSubmitting(false);
    setIsDeleteModalOpen(false);
    refreshProducts();
  };

  const columns = getProductTableColumns({
    categories,
    onViewProduct: handleViewProduct,
    onEditProduct: handleEditProduct,
    onPrefetchEditProduct: handlePrefetchEditProduct,
    onDeleteProduct: handleDeleteProduct,
  });

  return (
    <div className="space-y-8 pb-12">
      {/* Header Section */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-[28px] font-bold text-text-primary tracking-tight">Menu sản phẩm</h1>
          <p className="text-text-secondary">Quản lý danh sách thức uống, bánh ngọt và định giá toàn hệ thống.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsCategoryModalOpen(true)}
            className="flex items-center gap-2 rounded-xl bg-white/60 border border-primary-soft/30 px-4 py-2.5 text-sm font-semibold text-primary transition hover:bg-white/80"
          >
            <FolderEdit size={18} />
            Danh mục
          </button>
          <button className="flex items-center gap-2 rounded-xl bg-white/60 border border-primary-soft/30 px-4 py-2.5 text-sm font-semibold text-text-secondary transition hover:bg-white/80">
            <FileDown size={18} />
            Xuất Excel
          </button>
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-[0_12px_28px_rgba(139,94,60,0.28)] transition hover:bg-primary-deep active:scale-[0.98]"
          >
            <Plus size={18} />
            Thêm sản phẩm
          </button>
        </div>
      </header>

      {/* MODAL */}
      <AddProductModal 
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        categories={categories}
        onSubmit={handleAddProduct}
        isSubmitting={submitting}
      />

      <ProductDetailsModal 
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        product={selectedProduct}
        categories={categories}
      />

      <EditProductModal
        isOpen={isEditModalOpen}
        onClose={handleCloseEditProduct}
        product={selectedProduct}
        categories={categories}
        onSubmit={handleUpdateProduct}
        isSubmitting={submitting || isLoadingEditDetail}
        isLoadingProductDetail={isLoadingEditDetail}
      />

      <DeleteProductModal 
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        product={selectedProduct}
        onConfirm={handleConfirmDelete}
        isDeleting={submitting}
      />

      <CategoryManagementModal 
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        categories={categories}
        onReorder={reorderCategories}
        onCreate={createCategory}
        onUpdate={(id, data) => updateCategory({ id, data })}
        onDelete={deleteCategory}
        isMutating={isCategoryMutating}
      />

      {/* Filter & Search Bar */}
      <GlassCard className="p-4" radius="2xl">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-primary-soft" size={18} />
            <input 
              type="text" 
              placeholder="Tìm tên sản phẩm, SKU..." 
              value={searchTerm}
              onChange={handleSearchChange}
              className="w-full glass-control rounded-xl py-2.5 px-11 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-text-primary placeholder:text-text-muted/60"
            />
          </div>
          
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-text-muted uppercase tracking-widest whitespace-nowrap">Danh mục:</span>
              <select 
                value={selectedCategory}
                onChange={handleCategoryChange}
                className="glass-control rounded-xl py-2.5 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-text-primary bg-white/40"
              >
                <option value="all">Tất cả</option>
                {categories
                  .sort((a, b) => (a.display_order || 0) - (b.display_order || 0))
                  .map(cat => {
                    let currentDepth = 0;
                    let parent = categories.find(c => c.id === cat.parent_id);
                    while (parent) {
                      currentDepth++;
                      const nextParentId = parent.parent_id;
                      parent = nextParentId ? categories.find(c => c.id === nextParentId) : undefined;
                    }
                    return (
                      <option key={cat.id} value={cat.id}>
                        {'\u00A0'.repeat(currentDepth * 3)}{cat.name}
                      </option>
                    );
                  })
                }
              </select>
            </div>
            
            <button className="flex items-center gap-2 glass-control rounded-xl py-2.5 px-4 text-sm font-semibold text-text-secondary hover:bg-white/60 transition-all">
              <Filter size={18} />
              Bộ lọc khác
            </button>
          </div>
        </div>
      </GlassCard>

      {/* Product List Table */}
      <div className="table-glass-wrapper overflow-hidden bg-[#FFFAF4]/70 backdrop-blur-xl rounded-3xl border border-primary-soft/20 shadow-[0_12px_32px_rgba(91,58,41,0.08)]">
        <Table
          rowKey="id"
          columns={columns}
          dataSource={filteredProducts}
          loading={{ spinning: isLoadingProducts, description: 'Đang tải menu...' }}
          locale={{ emptyText: 'Không tìm thấy sản phẩm nào phù hợp.' }}
          pagination={{
            current: paginationCurrent,
            pageSize: ITEMS_PER_PAGE,
            total: filteredProducts.length,
            showSizeChanger: false,
            onChange: (page) => setCurrentPage(page),
            showTotal: (total, range) => `Hiển thị ${range[0]}-${range[1]} trên ${total} sản phẩm`,
            className: '!m-0 !border-t !border-primary-soft/20 !bg-[#FFFAF4]/40 !px-6 !py-4',
          }}
          rowClassName="group"
          scroll={{ x: 980 }}
          className={styleTable}
        />
      </div>
    </div>
  );
}

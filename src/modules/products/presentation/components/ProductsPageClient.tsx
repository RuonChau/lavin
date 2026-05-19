'use client';

import { GlassCard } from '@/shared/components/GlassCard';
import { useProducts } from '@/modules/products/presentation/hooks/use-products';
import { 
  Plus, 
  Search, 
  Filter,
  Edit2,
  Trash2,
  Eye,
  Coffee,
  CheckCircle2,
  XCircle,
  FileDown,
  FolderEdit,
} from 'lucide-react';
import { cn } from '@/shared/utils/cn';
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

export default function ProductsPage() {
  const {
    products,
    isLoadingProducts,
    refreshProducts,
    createProduct,
    updateProduct,
    deleteProduct,
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
  const submitting = isSubmitting || isMutatingProduct;

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category_id === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
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
      console.log('variantImages: ', imagesBySize );

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

  const handleEditProduct = (product: Product) => {
    setSelectedProduct(product);
    setIsEditModalOpen(true);
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
        onClose={() => setIsEditModalOpen(false)}
        product={selectedProduct}
        categories={categories}
        onSubmit={handleUpdateProduct}
        isSubmitting={submitting}
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
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-[#FFFAF4]/90 border-b border-primary-soft/20 text-text-muted text-xs font-bold uppercase tracking-widest">
                <th className="py-5 px-6">Sản phẩm</th>
                <th className="py-5 px-6">Danh mục</th>
                <th className="py-5 px-6">Giá cơ bản</th>
                <th className="py-5 px-6">Trạng thái</th>
                <th className="py-5 px-6">Cập nhật</th>
                <th className="py-5 px-6 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="text-text-primary text-sm">
              {isLoadingProducts ? (
                <tr>
                  <td colSpan={6} className="py-20 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin"></div>
                      <p className="text-text-muted font-medium animate-pulse">Đang tải menu...</p>
                    </div>
                  </td>
                </tr>
              ) : paginatedProducts.length > 0 ? (
                paginatedProducts.map((product) => (
                  <tr key={product.id} className="border-b border-primary-soft/10 hover:bg-white/40 transition-colors group">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-4">
                        <div className="relative w-12 h-12 rounded-2xl overflow-hidden shadow-sm border border-white/60">
                          {product.image ? (
                            <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full bg-[#primary-soft]/20 flex items-center justify-center text-primary">
                              <Coffee size={20} />
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="font-bold text-text-primary group-hover:text-primary transition-colors">{product.name}</p>
                          <p className="text-[11px] font-mono text-text-muted uppercase">SKU: {product.sku}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-white/60 border border-primary-soft/20">
                        {categories.find(c => c.id === product.category_id)?.name || 'Chưa phân loại'}
                      </span>
                    </td>
                    <td className="py-4 px-6 font-bold text-text-primary">
                      {product.base_price.toLocaleString(product.currency?.locale || 'vi-VN', { style: 'currency', currency: product.currency?.currency || 'VND' })}
                    </td>
                    <td className="py-4 px-6">
                      <div className={cn(
                        "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold",
                        product.is_active 
                          ? "bg-mint/10 text-mint" 
                          : "bg-[#F56B7A]/10 text-[#F56B7A]"
                      )}>
                        {product.is_active ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
                        {product.is_active ? 'Đang bán' : 'Ngưng bán'}
                      </div>
                    </td>
                    <td className="py-4 px-6 text-xs text-text-muted">
                      {new Date(product.created_at).toLocaleDateString('vi-VN')}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => handleViewProduct(product)}
                          className="p-2 text-text-muted hover:text-aqua hover:bg-aqua/10 rounded-xl transition-all" 
                          title="Xem chi tiáº¿t"
                        >
                          <Eye size={18} />
                        </button>
                        <button 
                          onClick={() => handleEditProduct(product)}
                          className="p-2 text-text-muted hover:text-primary hover:bg-primary/10 rounded-xl transition-all" 
                          title="Chá»‰nh sá»­a"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button 
                          onClick={() => handleDeleteProduct(product)}
                          className="p-2 text-text-muted hover:text-danger hover:bg-danger/10 rounded-xl transition-all" 
                          title="Xóa"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-20 text-center text-text-muted">
                    Không tìm thấy sản phẩm nào phù hợp.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination Footer */}
        <div className="px-6 py-4 flex items-center justify-between border-t border-primary-soft/20 bg-[#FFFAF4]/40">
          <p className="text-xs text-text-secondary font-medium">
            Hiển thị <span className="font-bold">{filteredProducts.length > 0 ? (currentPage - 1) * ITEMS_PER_PAGE + 1 : 0}-{Math.min(filteredProducts.length, currentPage * ITEMS_PER_PAGE)}
              </span> trên <span className="font-bold">{filteredProducts.length}</span> sản phẩm
          </p>
          <div className="flex items-center gap-2">
            <button 
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              className="px-3 py-1.5 rounded-xl border border-primary-soft/20 text-text-secondary text-xs font-bold disabled:opacity-40 hover:bg-white/60 transition-all"
            >
              Trước
            </button>
            
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button 
                key={page}
                onClick={() => setCurrentPage(page)}
                className={cn(
                  "w-8 h-8 rounded-xl text-xs font-bold transition-all",
                  currentPage === page 
                    ? "bg-primary text-white shadow-sm" 
                    : "border border-primary-soft/20 text-text-secondary hover:bg-white/60"
                )}
              >
                {page}
              </button>
            ))}

            <button 
              disabled={currentPage === totalPages || totalPages === 0}
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              className="px-3 py-1.5 rounded-xl border border-primary-soft/20 text-text-secondary text-xs font-bold disabled:opacity-40 hover:bg-white/60 transition-all"
            >
              Sau
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

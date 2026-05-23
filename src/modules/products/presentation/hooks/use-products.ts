import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { productService } from '../../infrastructure/services/product.service';
import { categoryService } from '../../infrastructure/services/category.service';
import type { ProductFormInput } from '../../infrastructure/services/product.service';

export const useProducts = () => {
  const queryClient = useQueryClient();

  const productsQuery = useQuery({
    queryKey: ['products'],
    queryFn: () => productService.getProducts(),
  });

  const categoriesQuery = useQuery({
    queryKey: ['categories'],
    queryFn: () => categoryService.getCategories(),
  });

  const createProductMutation = useMutation({
    mutationFn: (data: ProductFormInput) =>
      productService.createProduct(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });

  const updateProductMutation = useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: ProductFormInput;
    }) => productService.updateProduct(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });

  const deleteProductMutation = useMutation({
    mutationFn: (id: string) => productService.deleteProduct(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });

  const productDetailQueryOptions = (id: string) => ({
    queryKey: ['products', id],
    queryFn: () => productService.getProductDetail(id),
  });

  const getProductDetail = (id: string) =>
    queryClient.fetchQuery(productDetailQueryOptions(id));

  const prefetchProductDetail = (id: string) =>
    queryClient.prefetchQuery(productDetailQueryOptions(id));

  return {
    products: productsQuery.data || [],
    isLoadingProducts: productsQuery.isLoading,
    categories: categoriesQuery.data || [],
    isLoadingCategories: categoriesQuery.isLoading,
    refreshProducts: productsQuery.refetch,
    createProduct: createProductMutation.mutateAsync,
    updateProduct: updateProductMutation.mutateAsync,
    deleteProduct: deleteProductMutation.mutateAsync,
    getProductDetail,
    prefetchProductDetail,
    isMutatingProduct:
      createProductMutation.isPending ||
      updateProductMutation.isPending ||
      deleteProductMutation.isPending,
  };
};

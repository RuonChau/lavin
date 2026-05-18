import { useQuery } from '@tanstack/react-query';
import { productService } from '../../infrastructure/services/product.service';
import { categoryService } from '../../infrastructure/services/category.service';

export const useProducts = () => {
  const productsQuery = useQuery({
    queryKey: ['products'],
    queryFn: () => productService.getProducts(),
  });

  const categoriesQuery = useQuery({
    queryKey: ['categories'],
    queryFn: () => categoryService.getCategories(),
  });

  return {
    products: productsQuery.data || [],
    isLoadingProducts: productsQuery.isLoading,
    categories: categoriesQuery.data || [],
    isLoadingCategories: categoriesQuery.isLoading,
    refreshProducts: productsQuery.refetch
  };
};

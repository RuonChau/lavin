import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { categoryService } from '../../infrastructure/services/category.service';
import { Category } from '../../domain/entities/product.entity';

export const useCategories = () => {
  const queryClient = useQueryClient();

  const categoriesQuery = useQuery({
    queryKey: ['categories'],
    queryFn: () => categoryService.getCategories(),
  });

  const updateCategoryMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Category> }) => 
      categoryService.updateCategory(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
  });

  const createCategoryMutation = useMutation({
    mutationFn: (data: Partial<Category>) => categoryService.createCategory(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
  });

  const deleteCategoryMutation = useMutation({
    mutationFn: (id: string) => categoryService.deleteCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
  });

  const reorderCategoriesMutation = useMutation({
    mutationFn: async (updatedCategories: Category[]) => {
      // In a real app, you might have a bulk update endpoint
      for (const cat of updatedCategories) {
        await categoryService.updateCategory(cat.id, { 
          displayOrder: cat.displayOrder,
          parentId: cat.parentId 
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
  });

  return {
    categories: categoriesQuery.data || [],
    isLoading: categoriesQuery.isLoading,
    updateCategory: updateCategoryMutation.mutateAsync,
    createCategory: createCategoryMutation.mutateAsync,
    deleteCategory: deleteCategoryMutation.mutateAsync,
    reorderCategories: reorderCategoriesMutation.mutateAsync,
    isMutating: 
      updateCategoryMutation.isPending || 
      createCategoryMutation.isPending || 
      deleteCategoryMutation.isPending || 
      reorderCategoriesMutation.isPending
  };
};

import { api } from '@/shared/lib/axios';
import { Category } from '../../domain/entities/product.entity';
import { unwrapList, unwrapData } from '@/shared/lib/api-response';

type CategoryInput = Partial<Category> & {
  is_active?: boolean;
};

function mapServerCategory(c: Record<string, unknown>): Category {
  return {
    id: (c.id ?? c._id ?? '') as string,
    name: (c.name ?? '') as string,
    description: c.description as string | undefined,
    parent_id: (c.parent_id ?? c.parentId) as string | undefined,
    display_order: (c.display_order ?? c.displayOrder ?? 0) as number,
    icon: (c.icon ?? undefined) as string | undefined,
    is_active: (c.is_active ?? c.isActive ?? true) as boolean,
  };
}

function toCategoryPayload(data: CategoryInput) {
  return {
    name: data.name,
    description: data.description,
    icon: data.icon,
    parent_id: data.parent_id,
    display_order: data.display_order,
    is_active: data.is_active,
  };
}

export const categoryService = {
  getCategories: async (params?: { page?: number; limit?: number }): Promise<Category[]> => {
    const response = await api.get('/categories', { params });
    const items = unwrapList<Record<string, unknown>>(response.data);
    return items.map(mapServerCategory);
  },

  getCategoryDetail: async (id: string): Promise<Category> => {
    const response = await api.get(`/category/${id}`);
    const data = unwrapData<Record<string, unknown>>(response.data);
    return mapServerCategory(data ?? {});
  },

  createCategory: async (data: CategoryInput): Promise<Category> => {
    const response = await api.post('/category', toCategoryPayload(data));
    const result = unwrapData<Record<string, unknown>>(response.data);
    return mapServerCategory(result ?? {});
  },

  updateCategory: async (id: string, data: CategoryInput): Promise<Category> => {
    const response = await api.patch(`/category/${id}`, toCategoryPayload(data));
    const result = unwrapData<Record<string, unknown>>(response.data);
    return mapServerCategory(result ?? {});
  },

  deleteCategory: async (id: string): Promise<void> => {
    await api.delete(`/category/${id}`);
  },

  deleteAllCategories: async (): Promise<void> => {
    await api.delete('/categories');
  },
};

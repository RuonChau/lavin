import { api } from '@/shared/lib/axios';
import { unwrapData, unwrapList } from '@/shared/lib/api-response';
import type {
  DiningTable,
  DiningTablePayload,
  DiningTableStatus,
} from '@/modules/tables/domain/entities/dining-table.entity';

export interface DiningTableQueryParams {
  branch_id?: string;
  status?: DiningTableStatus;
}

export const diningTableService = {
  getTables: async (params?: DiningTableQueryParams): Promise<DiningTable[]> => {
    const response = await api.get<{ success: boolean; data: DiningTable[] }>('/pos/tables', {
      params,
    });
    return unwrapList<DiningTable>(response.data);
  },

  createTable: async (data: DiningTablePayload): Promise<DiningTable> => {
    const response = await api.post<{ success: boolean; data: DiningTable }>('/pos/tables', data);
    return unwrapData<DiningTable>(response.data);
  },

  updateTable: async (
    id: string,
    data: Partial<DiningTablePayload>,
  ): Promise<DiningTable> => {
    const response = await api.patch<{ success: boolean; data: DiningTable }>(
      `/pos/tables/${id}`,
      data,
    );
    return unwrapData<DiningTable>(response.data);
  },

  deleteTable: async (id: string): Promise<void> => {
    await api.delete(`/pos/tables/${id}`);
  },
};

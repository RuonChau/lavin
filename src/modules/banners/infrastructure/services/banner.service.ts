import { api } from '@/shared/lib/axios';
import { unwrapData, unwrapList } from '@/shared/lib/api-response';

export interface BannerInput {
  title: string;
  content: string;
  type: string;
  banners: string[]; // max 5
}

export const bannerService = {
  getBanners: async (): Promise<any[]> => {
    const response = await api.get('/banners');
    return unwrapList(response.data);
  },
  
  getBannerDetail: async (id: string): Promise<any> => {
    const response = await api.get(`/banner/${id}`);
    return unwrapData(response.data);
  },
  
  createBanner: async (data: BannerInput): Promise<any> => {
    const response = await api.post('/banner', data);
    return unwrapData(response.data);
  },
  
  updateBanner: async (id: string, data: BannerInput): Promise<any> => {
    const response = await api.patch(`/banner/${id}`, data);
    return unwrapData(response.data);
  },
  
  deleteBanners: async (): Promise<void> => {
    await api.delete('/banners');
  },
  
  deleteBanner: async (id: string): Promise<void> => {
    await api.delete(`/banner/${id}`);
  }
};

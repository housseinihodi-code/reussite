import { api } from './api';
import type { ApiResponse } from '@/types/api.types';
import type { VehicleImage } from '@/types/vehicle.types';

export const imageService = {
  async add(vehicleId: string, url: string, altText?: string) {
    const { data } = await api.post<ApiResponse<VehicleImage>>('/images', { vehicleId, url, altText });
    return data.data;
  },

  async remove(id: string) {
    await api.delete(`/images/${id}`);
  },

  async setPrimary(id: string) {
    const { data } = await api.patch<ApiResponse<VehicleImage>>(`/images/${id}/primary`);
    return data.data;
  },
};

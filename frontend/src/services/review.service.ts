import { api } from './api';
import type { ApiResponse } from '@/types/api.types';
import type { Review } from '@/types/order.types';

export const reviewService = {
  async findByVehicle(vehicleId: string) {
    const { data } = await api.get<ApiResponse<Review[]>>(`/reviews/vehicle/${vehicleId}`);
    return data.data;
  },

  async create(vehicleId: string, rating: number, comment?: string) {
    const { data } = await api.post<ApiResponse<Review>>('/reviews', { vehicleId, rating, comment });
    return data.data;
  },

  async remove(id: string) {
    await api.delete(`/reviews/${id}`);
  },
};

import { api } from './api';
import type { ApiResponse } from '@/types/api.types';
import type { Vehicle } from '@/types/vehicle.types';

export interface Favorite {
  id: string;
  vehicleId: string;
  vehicle: Vehicle;
  createdAt: string;
}

export const favoriteService = {
  async findAll() {
    const { data } = await api.get<ApiResponse<Favorite[]>>('/favorites');
    return data.data;
  },

  async add(vehicleId: string) {
    const { data } = await api.post<ApiResponse<Favorite>>(`/favorites/${vehicleId}`);
    return data.data;
  },

  async remove(vehicleId: string) {
    await api.delete(`/favorites/${vehicleId}`);
  },
};

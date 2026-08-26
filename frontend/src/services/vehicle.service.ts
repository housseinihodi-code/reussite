import { api } from './api';
import type { ApiResponse, PaginatedResponse } from '@/types/api.types';
import type { Vehicle, VehicleQueryParams } from '@/types/vehicle.types';

export const vehicleService = {
  async findAll(params: VehicleQueryParams = {}) {
    const { data } = await api.get<ApiResponse<PaginatedResponse<Vehicle>>>('/vehicles', { params });
    return data.data;
  },

  async findBySlug(slug: string) {
    const { data } = await api.get<ApiResponse<Vehicle>>(`/vehicles/${slug}`);
    return data.data;
  },

  async findMine() {
    const { data } = await api.get<ApiResponse<Vehicle[]>>('/vehicles/mine/listings');
    return data.data;
  },

  async create(payload: Partial<Vehicle> & Record<string, unknown>) {
    const { data } = await api.post<ApiResponse<Vehicle>>('/vehicles', payload);
    return data.data;
  },

  async update(id: string, payload: Partial<Vehicle> & Record<string, unknown>) {
    const { data } = await api.patch<ApiResponse<Vehicle>>(`/vehicles/${id}`, payload);
    return data.data;
  },

  async remove(id: string) {
    await api.delete(`/vehicles/${id}`);
  },
};

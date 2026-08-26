import { api } from './api';
import type { ApiResponse } from '@/types/api.types';
import type { Brand, Category, VehicleModel } from '@/types/vehicle.types';

export const categoryService = {
  async findAllCategories() {
    const { data } = await api.get<ApiResponse<Category[]>>('/categories');
    return data.data;
  },

  async findAllBrands() {
    const { data } = await api.get<ApiResponse<Brand[]>>('/brands');
    return data.data;
  },

  async findModelsByBrand(brandId: string) {
    const { data } = await api.get<ApiResponse<VehicleModel[]>>('/models', { params: { brandId } });
    return data.data;
  },
};

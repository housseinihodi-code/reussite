import { api } from './api';
import type { ApiResponse } from '@/types/api.types';
import type { Order, OrderStatus } from '@/types/order.types';

export interface CreateOrderPayload {
  items: { vehicleId: string }[];
  billingAddressId?: string;
  shippingAddressId?: string;
  notes?: string;
}

export const orderService = {
  async create(payload: CreateOrderPayload) {
    const { data } = await api.post<ApiResponse<Order>>('/orders', payload);
    return data.data;
  },

  async findMine() {
    const { data } = await api.get<ApiResponse<Order[]>>('/orders');
    return data.data;
  },

  async findOne(id: string) {
    const { data } = await api.get<ApiResponse<Order>>(`/orders/${id}`);
    return data.data;
  },

  async updateStatus(id: string, status: OrderStatus) {
    const { data } = await api.patch<ApiResponse<Order>>(`/orders/${id}/status`, { status });
    return data.data;
  },
};

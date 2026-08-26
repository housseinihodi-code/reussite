import { api } from './api';
import type { ApiResponse } from '@/types/api.types';

export const paymentService = {
  async createIntent(orderId: string, provider: 'STRIPE' | 'PAYPAL' | 'BANK_TRANSFER' = 'STRIPE') {
    const { data } = await api.post<ApiResponse<{ clientSecret: string | null }>>('/payments/intent', {
      orderId,
      provider,
    });
    return data.data;
  },
};

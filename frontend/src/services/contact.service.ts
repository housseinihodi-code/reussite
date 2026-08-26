import { api } from './api';
import type { ApiResponse } from '@/types/api.types';

export interface ContactPayload {
  name: string;
  email: string;
  message: string;
}

export const contactService = {
  async send(payload: ContactPayload) {
    const { data } = await api.post<ApiResponse<{ message: string }>>('/contact', payload);
    return data.data;
  },
};

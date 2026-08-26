import { api } from './api';
import type { ApiResponse } from '@/types/api.types';
import type { AuthResponse, User } from '@/types/user.types';

export interface RegisterPayload {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone?: string;
  country?: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export const authService = {
  async register(payload: RegisterPayload) {
    const { data } = await api.post<ApiResponse<AuthResponse>>('/auth/register', payload);
    return data.data;
  },

  async login(payload: LoginPayload) {
    const { data } = await api.post<ApiResponse<AuthResponse>>('/auth/login', payload);
    return data.data;
  },

  async logout() {
    await api.post('/auth/logout');
  },

  async becomeSeller() {
    const { data } = await api.post<ApiResponse<AuthResponse>>('/auth/become-seller');
    return data.data;
  },

  async getProfile() {
    const { data } = await api.get<ApiResponse<User>>('/users/me');
    return data.data;
  },

  async forgotPassword(email: string) {
    const { data } = await api.post<ApiResponse<{ message: string }>>('/auth/forgot-password', { email });
    return data.data;
  },

  async resetPassword(userId: string, token: string, newPassword: string) {
    const { data } = await api.post<ApiResponse<{ message: string }>>('/auth/reset-password', {
      userId,
      token,
      newPassword,
    });
    return data.data;
  },
};

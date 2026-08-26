export type Role = 'SUPER_ADMIN' | 'ADMIN' | 'SELLER' | 'BUYER';

export interface RoleEntity {
  id: string;
  name: Role;
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  avatarUrl?: string;
  country?: string;
  locale: string;
  currency: string;
  roles: RoleEntity[];
  createdAt: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

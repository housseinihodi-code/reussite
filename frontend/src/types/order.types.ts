import type { Vehicle } from './vehicle.types';

export type OrderStatus =
  | 'PENDING'
  | 'CONFIRMED'
  | 'PAID'
  | 'PROCESSING'
  | 'SHIPPED'
  | 'DELIVERED'
  | 'CANCELLED'
  | 'REFUNDED';

export interface OrderItem {
  id: string;
  vehicleId: string;
  vehicle: Vehicle;
  unitPrice: number;
  quantity: number;
  totalPrice: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  subtotal: number;
  taxAmount: number;
  shippingAmount: number;
  totalAmount: number;
  currency: string;
  items: OrderItem[];
  createdAt: string;
}

export interface Review {
  id: string;
  vehicleId: string;
  rating: number;
  comment?: string;
  author: { id: string; firstName: string; lastName: string; avatarUrl?: string };
  createdAt: string;
}

export type FuelType = 'PETROL' | 'DIESEL' | 'ELECTRIC' | 'HYBRID' | 'PLUGIN_HYBRID' | 'LPG' | 'CNG';
export type TransmissionType = 'MANUAL' | 'AUTOMATIC' | 'SEMI_AUTOMATIC' | 'CVT';
export type VehicleCondition = 'NEW' | 'USED' | 'CERTIFIED_PRE_OWNED' | 'SALVAGE';
export type VehicleStatus = 'DRAFT' | 'PENDING_REVIEW' | 'PUBLISHED' | 'SOLD' | 'ARCHIVED' | 'REJECTED';

export interface VehicleImage {
  id: string;
  url: string;
  altText?: string;
  position: number;
  isPrimary: boolean;
}

export interface Brand {
  id: string;
  name: string;
  slug: string;
  logoUrl?: string;
  country?: string;
}

export interface VehicleModel {
  id: string;
  name: string;
  slug: string;
  brandId: string;
  bodyType?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  iconUrl?: string;
  parentId?: string | null;
  children?: Category[];
}

export interface Vehicle {
  id: string;
  title: string;
  slug: string;
  description: string;
  year: number;
  price: number;
  currency: string;
  mileage: number;
  mileageUnit: string;
  fuelType: FuelType;
  transmission: TransmissionType;
  condition: VehicleCondition;
  status: VehicleStatus;
  color?: string;
  doors?: number;
  seats?: number;
  enginePower?: number;
  country: string;
  city: string;
  isFeatured: boolean;
  viewsCount: number;
  averageRating: number;
  reviewsCount: number;
  images: VehicleImage[];
  brand: Brand;
  model: VehicleModel;
  category: Category;
  sellerId: string;
  seller?: { id: string; firstName: string; lastName: string; avatarUrl?: string; country?: string };
  createdAt: string;
}

export interface VehicleQueryParams {
  page?: number;
  limit?: number;
  q?: string;
  brandId?: string;
  modelId?: string;
  categoryId?: string;
  country?: string;
  minPrice?: number;
  maxPrice?: number;
  minYear?: number;
  maxYear?: number;
  maxMileage?: number;
  fuelType?: FuelType;
  transmission?: TransmissionType;
  condition?: VehicleCondition;
  sortBy?: string;
  order?: 'asc' | 'desc';
}

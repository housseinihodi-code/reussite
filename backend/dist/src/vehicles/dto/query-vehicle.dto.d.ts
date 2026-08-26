import { FuelType, TransmissionType, VehicleCondition } from '@prisma/client';
import { PaginationDto } from '@/common/dto/pagination.dto';
export declare class QueryVehicleDto extends PaginationDto {
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
}

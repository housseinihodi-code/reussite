import { FuelType, TransmissionType, VehicleCondition } from '@prisma/client';
export declare class CreateVehicleDto {
    title: string;
    description: string;
    vin?: string;
    year: number;
    price: number;
    currency?: string;
    mileage: number;
    fuelType: FuelType;
    transmission: TransmissionType;
    condition: VehicleCondition;
    color?: string;
    doors?: number;
    seats?: number;
    enginePower?: number;
    engineSizeCc?: number;
    country: string;
    city: string;
    brandId: string;
    modelId: string;
    categoryId: string;
    imageUrls?: string[];
}

import { Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsInt,
  IsMongoId,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
  MinLength,
} from 'class-validator';
import { FuelType, TransmissionType, VehicleCondition } from '@prisma/client';

export class CreateVehicleDto {
  @IsString()
  @MinLength(5)
  title: string;

  @IsString()
  @MinLength(20)
  description: string;

  @IsOptional()
  @IsString()
  vin?: string;

  @Type(() => Number)
  @IsInt()
  @Min(1900)
  year: number;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @Max(10000)
  price: number;

  @IsOptional()
  @IsString()
  currency?: string;

  @Type(() => Number)
  @IsInt()
  @Min(0)
  mileage: number;

  @IsEnum(FuelType)
  fuelType: FuelType;

  @IsEnum(TransmissionType)
  transmission: TransmissionType;

  @IsEnum(VehicleCondition)
  condition: VehicleCondition;

  @IsOptional()
  @IsString()
  color?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  doors?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  seats?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  enginePower?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  engineSizeCc?: number;

  @IsString()
  country: string;

  @IsString()
  city: string;

  @IsMongoId()
  brandId: string;

  @IsMongoId()
  modelId: string;

  @IsMongoId()
  categoryId: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  imageUrls?: string[];
}

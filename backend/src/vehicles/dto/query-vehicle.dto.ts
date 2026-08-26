import { Type } from 'class-transformer';
import { IsEnum, IsMongoId, IsNumber, IsOptional, IsString } from 'class-validator';
import { FuelType, TransmissionType, VehicleCondition } from '@prisma/client';
import { PaginationDto } from '@/common/dto/pagination.dto';

export class QueryVehicleDto extends PaginationDto {
  @IsOptional()
  @IsString()
  q?: string;

  @IsOptional()
  @IsMongoId()
  brandId?: string;

  @IsOptional()
  @IsMongoId()
  modelId?: string;

  @IsOptional()
  @IsMongoId()
  categoryId?: string;

  @IsOptional()
  @IsString()
  country?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  minPrice?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  maxPrice?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  minYear?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  maxYear?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  maxMileage?: number;

  @IsOptional()
  @IsEnum(FuelType)
  fuelType?: FuelType;

  @IsOptional()
  @IsEnum(TransmissionType)
  transmission?: TransmissionType;

  @IsOptional()
  @IsEnum(VehicleCondition)
  condition?: VehicleCondition;
}

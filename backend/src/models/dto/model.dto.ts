import { Type } from 'class-transformer';
import { IsInt, IsMongoId, IsOptional, IsString, MinLength } from 'class-validator';

export class CreateModelDto {
  @IsString()
  @MinLength(1)
  name: string;

  @IsMongoId()
  brandId: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  startYear?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  endYear?: number;

  @IsOptional()
  @IsString()
  bodyType?: string;
}

export class UpdateModelDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  startYear?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  endYear?: number;

  @IsOptional()
  @IsString()
  bodyType?: string;
}

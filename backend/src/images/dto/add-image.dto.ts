import { IsMongoId, IsOptional, IsString } from 'class-validator';

export class AddImageDto {
  @IsMongoId()
  vehicleId: string;

  @IsString()
  url: string;

  @IsOptional()
  @IsString()
  altText?: string;
}

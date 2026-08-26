import { Type } from 'class-transformer';
import { ArrayMinSize, IsMongoId, IsOptional, IsString, ValidateNested } from 'class-validator';

class OrderItemInput {
  @IsMongoId()
  vehicleId: string;
}

export class CreateOrderDto {
  @ValidateNested({ each: true })
  @Type(() => OrderItemInput)
  @ArrayMinSize(1)
  items: OrderItemInput[];

  @IsOptional()
  @IsMongoId()
  billingAddressId?: string;

  @IsOptional()
  @IsMongoId()
  shippingAddressId?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}

import { IsEnum, IsMongoId } from 'class-validator';
import { PaymentProvider } from '@prisma/client';

export class CreatePaymentIntentDto {
  @IsMongoId()
  orderId: string;

  @IsEnum(PaymentProvider)
  provider: PaymentProvider;
}

import { PaymentProvider } from '@prisma/client';
export declare class CreatePaymentIntentDto {
    orderId: string;
    provider: PaymentProvider;
}

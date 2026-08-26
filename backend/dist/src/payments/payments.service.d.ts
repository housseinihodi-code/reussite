import { ConfigService } from '@nestjs/config';
import { PrismaService } from '@/prisma/prisma.service';
import { CreatePaymentIntentDto } from './dto/create-payment-intent.dto';
export declare class PaymentsService {
    private readonly prisma;
    private readonly config;
    private readonly stripe;
    constructor(prisma: PrismaService, config: ConfigService);
    createIntent(buyerId: string, dto: CreatePaymentIntentDto): Promise<{
        clientSecret: string | null;
    }>;
    private markOrderPaid;
    handleStripeWebhook(rawBody: Buffer, signature: string): Promise<{
        received: boolean;
    }>;
    findByOrder(orderId: string): import(".prisma/client").Prisma.PrismaPromise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        currency: string;
        status: import(".prisma/client").$Enums.PaymentStatus;
        orderId: string;
        provider: import(".prisma/client").$Enums.PaymentProvider;
        amount: number;
        transactionRef: string | null;
        paidAt: Date | null;
        failureReason: string | null;
    }[]>;
}

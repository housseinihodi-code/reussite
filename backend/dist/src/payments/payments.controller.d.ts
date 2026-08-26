import { RawBodyRequest } from '@nestjs/common';
import { Request } from 'express';
import { PaymentsService } from './payments.service';
import { CreatePaymentIntentDto } from './dto/create-payment-intent.dto';
import { AuthenticatedUser } from '@/auth/types/authenticated-user.type';
export declare class PaymentsController {
    private readonly paymentsService;
    constructor(paymentsService: PaymentsService);
    createIntent(user: AuthenticatedUser, dto: CreatePaymentIntentDto): Promise<{
        clientSecret: string | null;
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
    handleWebhook(req: RawBodyRequest<Request>, signature: string): Promise<{
        received: boolean;
    }>;
}
